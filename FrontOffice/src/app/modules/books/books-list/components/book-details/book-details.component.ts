import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { Book } from 'src/app/shared/models/book';
import { Item } from 'src/app/shared/models/item.model';
import { BooksRestService } from 'src/app/shared/services/books-rest.service';
import { ShoppingCartService } from 'src/app/shared/services/shopping-cart.service';
import SwiperCore, { Autoplay, Pagination, SwiperOptions } from 'swiper';
import { Review } from '../../models/review.model';
import { BookService } from '../../services/book.service';
import { ReviewService } from '../../services/review.service';
import { BookReviewFormModalComponent } from '../book-review/book-review-form-modal/book-review-form-modal.component';
import { map, tap, takeUntil } from 'rxjs/operators';

// install Swiper modules
SwiperCore.use([Autoplay, Pagination]);

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BookDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('wornCondition') wornCondition?: ElementRef;
  @ViewChild('newCondition') newCondition?: ElementRef;

  componentDestroyed$: Subject<boolean> = new Subject();

  book: Book = new Book();

  reviews?: Review[];

  @Input() generalReviewsInfo: any = { avgRating: 0, numReviews: 0 };

  config: SwiperOptions = {
    pagination: {
      clickable: true,
      dynamicBullets: true,
    },
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    slidesPerView: 'auto' /* Set me! */,
  };

  constructor(
    public rest: BooksRestService,
    private route: ActivatedRoute,
    private shoppingCartService: ShoppingCartService,
    private bookService: BookService,
    public dialog: MatDialog,
    private reviewService: ReviewService
  ) {}

  ngOnDestroy(): void {
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
    this.reviewService.resetReviews();
  }

  ngOnInit(): void {
    this.reviewService.reviews$
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((value) => {
        this.reviews = value;
        this.calcAvgRatingStars();
      });

    this.getBook();
  }

  isBookInShoppingCart() {
    let item = this.shoppingCartService.getItem(this.book?._id!);

    if (item != null) {
      if (item.new! > 0) {
        this.newCondition?.nativeElement.classList.add('activeSelection');
      }
      if (item.worn! > 0) {
        this.wornCondition?.nativeElement.classList.add('activeSelection');
      }
    }
  }

  getBook() {
    this.rest
      .getBook(this.route.snapshot.params['id'])
      .subscribe((data: {}) => {
        this.book = data;
        this.book.reviews?.forEach((value) => {
          this.reviewService.addReview(value);
        });

        this.isBookInShoppingCart();

        this.bookService.setSelectedBook(this.book);

        this.calcAvgRatingStars();
      });
  }

  onSlideChange() {
    console.log('slide change');
  }

  addItem() {
    let item: Item = {};
    item._id = this.book._id;
    item.cover = this.book.cover;
    item.title = this.book.title;
    item.price = this.book.price;
    item.maxQtNew = this.book.new;
    item.maxQtWorn = this.book.worn;
    item.new = 0;
    item.worn = 0;
    if (
      this.wornCondition?.nativeElement.classList.contains('activeSelection')
    ) {
      item.worn = 1;
    }

    if (
      this.newCondition?.nativeElement.classList.contains('activeSelection')
    ) {
      item.new = 1;
    }

    this.shoppingCartService.addItem(item);
  }

  calcAvgRatingStars() {
    let totalStars = 0;
    let avgRating = 0;
    if (this.reviews) {
      for (let review of this.reviews) {
        totalStars += review.stars || 0;
        avgRating = totalStars / this.reviews.length;
      }
      this.generalReviewsInfo.avgRating = isNaN(avgRating)
        ? 0
        : Math.round(avgRating);
      this.generalReviewsInfo.numReviews = this.reviews.length;
    }
  }

  openReviewForm() {
    this.dialog.open(BookReviewFormModalComponent);
  }
}
