import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { ShoppingCartService } from './shopping-cart.service';

@Injectable({
  providedIn: 'root',
})
export class CheckoutGuardService implements CanActivate {
  constructor(
    private router: Router,
    private shoppingCartService: ShoppingCartService,
    private toastr: ToastrService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    if (this.shoppingCartService.getItemsSize() > 0) {
      return true;
    }
    this.toastr.warning(
      'You need to add items to your shopping cart in order to proceed to checkout',
      'Checkout'
    );
    this.router.navigate(['/']);
    return false;
  }
}
