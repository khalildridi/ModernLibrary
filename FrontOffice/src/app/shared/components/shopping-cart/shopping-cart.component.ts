import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import { Observable, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ShoppingCartModalComponent } from './shopping-cart-modal/shopping-cart-modal.component';
import { Item } from '../../models/item.model';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss'],
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
  componentDestroyed$: Subject<boolean> = new Subject();

  items: Item[] = [];

  isExtraSmall: Observable<BreakpointState> = this.breakpointObserver.observe(
    Breakpoints.XSmall
  );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private dialog: MatDialog,
    private shoppingCartService: ShoppingCartService
  ) {}

  ngOnInit(): void {
    this.shoppingCartService.items$
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((value) => {
        this.items = value;
      });
  }

  calcTotalPrice(): string {
    return this.shoppingCartService.getTotalPrice();
  }

  calcItemPrice(item: Item): string {
    return this.shoppingCartService.getItemTotalPrice(item);
  }

  removeItem(index: number) {
    this.shoppingCartService.deleteItem(index);
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }

  openShoppingCartModal() {
    const dialogRef = this.dialog.open(ShoppingCartModalComponent, {
      width: '50%',
      maxWidth: '100vw',
      data: this.items,
    });

    const smallDialogRef = this.isExtraSmall.subscribe((size) => {
      if (size.matches) {
        dialogRef.updateSize('100%');
      } else {
        dialogRef.updateSize('50%');
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      smallDialogRef.unsubscribe();
    });
  }
}
