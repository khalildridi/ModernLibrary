import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/modules/models/user.model';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { UserRestService } from '../../services/user-rest.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isShoppingCartOpen: boolean = false;
  isProfileOpen: boolean = false;
  user!: User;

  constructor(
    private _eref: ElementRef,
    private router: Router,
    private toastr: ToastrService,
    private shoppingCartService: ShoppingCartService,
    private userService: UserRestService
  ) {}

  ngOnInit(): void {
    this.getUser();
  }

  @HostListener('document:click', ['$event'])
  onClick(event: any) {
    if (!this._eref.nativeElement.contains(event.target))
      this.isShoppingCartOpen = false;
    if (!this._eref.nativeElement.contains(event.target))
      this.isProfileOpen = false;
  }

  getUser() {
    this.userService.getId().subscribe((res: any) => {
      if (res) {
        this.user = res.user;
      }
    });
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/']);
    this.toastr.info('Logged out successfully', 'Logout');
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('currentUser') ? true : false;
  }

  countItems(): number {
    return this.shoppingCartService.getItemsSize();
  }
}
