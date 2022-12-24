import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { Item } from '../models/item.model';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  private _items: Item[];
  items$: BehaviorSubject<Item[]>;

  constructor(private toastr: ToastrService) {
    this._items = JSON.parse(localStorage.getItem('items') || '[]');
    this._items = this._items == null ? [] : this._items;
    this.items$ = new BehaviorSubject<Item[]>(this._items);
  }

  getItem(_id: string) {
    for (const element of this._items) {
      if (element._id === _id) {
        return element;
      }
    }
    return null;
  }

  updateItem(item: Item): boolean {
    let actualItem = this.getItem(item._id || '');

    if (actualItem != null) {
      actualItem.new = item.new;
      actualItem.worn = item.worn;
      return true;
    }
    return false;
  }

  addItem(item: Item) {
    if (item.new! + item.worn! == 0) {
      this.toastr.warning(
        'You cannot add a book without quantity',
        'Shopping Cart'
      );
      return;
    }

    if (this.getItem(item._id || '') == null) {
      this.toastr.success(
        'Item added successfully to shopping cart',
        'Shopping Cart'
      );
      this._items.push(item);
    } else {
      this.updateItem(item);
      this.toastr.info(
        'Item already in shopping cart. Updated its details',
        'Shopping Cart'
      );
    }

    localStorage.setItem('items', JSON.stringify(this._items));
    this.items$.next(this._items);
  }

  deleteItem(index: number) {
    this._items.splice(index, 1);
    localStorage.setItem('items', JSON.stringify(this._items));
    this.items$.next(this._items);
  }

  getItemsSize(): number {
    return this._items.length;
  }

  getItemTotalPrice(item: Item): string {
    return (item.price! * item.new! + item.price! * 0.75 * item.worn!).toFixed(
      2
    );
  }

  getTotalPrice(): string {
    let totalPrice: number = 0;
    this._items.forEach((item: Item) => {
      totalPrice += item.new! * item.price! + item.worn! * (item.price! * 0.75);
    });

    return totalPrice.toFixed(2);
  }

  cleanItems() {
    this._items = [];
    this.items$.next(this._items);
    localStorage.setItem('items', '[]');
  }
}
