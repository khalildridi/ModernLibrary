import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Item } from 'src/app/shared/models/item.model';
import { ShoppingCartService } from 'src/app/shared/services/shopping-cart.service';
import { takeUntil } from 'rxjs/operators';
import { Purchase } from 'src/app/shared/models/purchase.model';
import { ObjectID } from 'bson';
import { CheckOutRestService } from 'src/app/shared/services/check-out-rest.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdersService } from './services/orders.service';
import { environment } from 'src/environments/environment';
import { UserRestService } from 'src/app/shared/services/user-rest.service';
import { LoyaltySystem } from '../models/loyalty-system.model';
import { LoyaltySystemService } from 'src/app/shared/services/loyalty-system.service';
import { User } from '../models/user.model';
import { NgxSpinnerService } from 'ngx-spinner';

declare global {
  interface Window {
    Stripe?: any;
  }
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit, OnDestroy {
  private readonly STRIPE!: any;
  private elementStripe!: any;
  cardNumber: any;
  cardCvv: any;
  cardExp: any;
  form: FormGroup = new FormGroup({});
  orderData!: any;
  user!: User;
  conditions: LoyaltySystem = new LoyaltySystem();
  discount: number = 0;

  componentDestroyed$: Subject<boolean> = new Subject();

  items: Item[] = [];

  constructor(
    private shoppingCartService: ShoppingCartService,
    public rest: CheckOutRestService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private ordersService: OrdersService,
    private userService: UserRestService,
    private route: ActivatedRoute,
    private loyaltyService: LoyaltySystemService,
    private spinner: NgxSpinnerService
  ) {
    this.STRIPE = window.Stripe(environment.stripe_pk);
  }

  ngOnInit(): void {
    this.shoppingCartService.items$
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((value) => {
        this.items = value;
      });

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      amount: [
        '',
        [Validators.required, Validators.min(1), Validators.max(100000)],
      ],
      cardNumber: [false, [Validators.required, Validators.requiredTrue]],
      cardCvv: [false, [Validators.required, Validators.requiredTrue]],
      cardExp: [false, [Validators.required, Validators.requiredTrue]],
    });

    this.loadDetail();
    this.createStripeElement();

    this.loyaltyService.getLoyaltyConditions().subscribe((res: any) => {
      if (res) {
        this.conditions.percentages = res[0].percentages;
        this.conditions.ages = res[0].ages;
        this.conditions.numAquisitions = res[0].numAcquisitions;
        this.conditions.numSoldBooks = res[0].numSoldBooks;
      }
    });
  }

  get formControl() {
    return this.form.controls;
  }

  loadDetail(): void {
    this.userService.getId().subscribe((res: any) => {
      if (res) {
        this.user = res.user;
        this.form.patchValue({
          email: res.user.email,
        });
      }
    });
  }

  private createStripeElement = () => {
    const style = {
      base: {
        color: '#000000',
        fontWeight: 400,
        fontFamily: "'Poppins', sans-serif",
        fontSize: '20px',
        '::placeholder': {
          color: '#E3E2EC',
        },
      },
      invalid: {
        color: '#dc3545',
      },
    };

    this.elementStripe = this.STRIPE.elements({
      fonts: [
        {
          cssSrc:
            'https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400&display=swap',
        },
      ],
    });

    const cardNumber = this.elementStripe.create('cardNumber', {
      placeholder: '5555 5555 5555 4444',
      style,
      classes: {
        base: 'input-stripe-custom',
      },
    });
    const cardExp = this.elementStripe.create('cardExpiry', {
      placeholder: 'MM/AA',
      style,
      classes: {
        base: 'input-stripe-custom',
      },
    });
    const cardCvc = this.elementStripe.create('cardCvc', {
      placeholder: '123',
      style,
      classes: {
        base: 'input-stripe-custom',
      },
    });

    cardNumber.mount('#card');
    cardExp.mount('#exp');
    cardCvc.mount('#cvc');

    this.cardNumber = cardNumber;
    this.cardExp = cardExp;
    this.cardCvv = cardCvc;

    this.cardNumber.addEventListener('change', this.onChangeCard.bind(this));
    this.cardExp.addEventListener('change', this.onChangeExp.bind(this));
    this.cardCvv.addEventListener('change', this.onChangeCvv.bind(this));
  };

  async initPay(): Promise<any> {
    try {
      this.spinner.show();
      this.form.disable();

      const { token } = await this.STRIPE.createToken(this.cardNumber);

      const { data } = await this.ordersService.sendPayment(
        token.id,
        this.form.value.email,
        this.form.value.amount
      );

      this.STRIPE.handleCardPayment(data.client_secret)
        .then(async () => {
          this.registerOrder();
          this.spinner.hide();
          this.router.navigate(['/']);
          this.toastr.success(
            'Your order was completed successfully',
            'Payment'
          );
        })
        .catch(() => {
          this.toastr.error('Error when making payment', 'Payment');
        });
    } catch (e) {
      this.toastr.error(
        'Something happend while processing the payment',
        'Payment'
      );
    }
  }

  onChangeCard({ error }: any) {
    this.form.patchValue({ cardNumber: !error });
  }

  onChangeCvv({ error }: any) {
    this.form.patchValue({ cardCvv: !error });
  }

  onChangeExp({ error }: any) {
    this.form.patchValue({ cardExp: !error });
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }

  calcTotalPrice(): string {
    const totalValue = (
      Number(this.shoppingCartService.getTotalPrice()) - this.discount
    ).toFixed(2);

    this.form.patchValue({
      amount: totalValue,
    });

    return String(totalValue);
  }

  calcItemPrice(item: Item): string {
    return this.shoppingCartService.getItemTotalPrice(item);
  }

  calcDiscount(event: any) {
    if (event.target.checked && this.user.points && this.user.points >= 25) {
      const numPurchasedBooks = this.checkPurchasedBooks();

      if (numPurchasedBooks > -1) {
        const ageCondition = this.checkAge();
        if (ageCondition !== -1) {
          const discountPercent =
            this.conditions.percentages[ageCondition] +
            this.conditions.percentages[numPurchasedBooks];
          this.discount = this.form.value.amount * (discountPercent / 100);
        }
      }
    } else {
      this.discount = 0;
    }
    this.calcTotalPrice();
  }

  private checkPurchasedBooks(): number {
    if (this.user.purchases) {
      const nPurchases = this.user.purchases.length;

      switch (true) {
        case nPurchases >= this.conditions.numAquisitions[3]:
          return 3;
        case nPurchases >= this.conditions.numAquisitions[2]:
          return 2;
        case nPurchases >= this.conditions.numAquisitions[1]:
          return 1;
        case nPurchases >= this.conditions.numAquisitions[0]:
          return 0;
      }
    }

    return -1;
  }

  private checkAge(): number {
    if (this.user.date_of_birth) {
      const timeDiff = Math.abs(
        Date.now() - new Date(this.user.date_of_birth).getTime()
      );
      const age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365);

      switch (true) {
        case age >= 62:
          return 3;
        case age >= 18:
          return 2;
        case age >= 12:
          return 1;
        default:
          return 0;
      }
    }

    return -1;
  }

  registerOrder() {
    let purchase: Purchase = {
      _id: new ObjectID(),
      date: new Date(),
      totalPrice: Number(this.calcTotalPrice()),
      discount: Number(this.discount.toFixed(2)),
      books: this.items,
    };

    this.rest
      .registerPurchase(this.form.value.email, purchase)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((data: any) => {
        console.log(data);
      });

    this.shoppingCartService.cleanItems();
  }
}
