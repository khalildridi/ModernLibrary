import { Component, Inject, Input, OnInit } from '@angular/core';
import { Item } from 'src/app/shared/models/item.model';
import { ShoppingCartService } from 'src/app/shared/services/shopping-cart.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-shopping-cart-modal',
  templateUrl: './shopping-cart-modal.component.html',
  styleUrls: ['./shopping-cart-modal.component.scss'],
})
export class ShoppingCartModalComponent implements OnInit {
  @Input() newItems: Item[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public items: Item[],
    private shoppingCartService: ShoppingCartService
  ) {
    this.newItems = items;
  }

  ngOnInit(): void {
    console.log(this.newItems);
  }

  calcItemPrice(item: Item): string {
    return this.shoppingCartService.getItemTotalPrice(item);
  }

  calcTotalPrice(): string {
    return this.shoppingCartService.getTotalPrice();
  }

  removeItem(index: number) {
    this.shoppingCartService.deleteItem(index);
  }

  updateItem(item: Item) {
    this.shoppingCartService.updateItem(item);
  }
}
