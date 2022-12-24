import {
  Component,
  Renderer2,
  ElementRef,
  OnInit,
  Inject,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Book } from 'src/app/shared/models/book';
import { Item } from 'src/app/shared/models/item.model';
import { ShoppingCartService } from 'src/app/shared/services/shopping-cart.service';

@Component({
  selector: 'app-book-quick-view-modal',
  templateUrl: './book-quick-view-modal.component.html',
  styleUrls: ['./book-quick-view-modal.component.scss'],
})
export class BookQuickViewModalComponent implements OnInit, AfterViewInit {
  @ViewChild('wornCondition') wornCondition?: ElementRef;
  @ViewChild('newCondition') newCondition?: ElementRef;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    @Inject(MAT_DIALOG_DATA) public book: Book,
    private shoppingCartService: ShoppingCartService
  ) {}

  ngAfterViewInit(): void {
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

  ngOnInit(): void {}

  toggleClass(event: any, className: string) {
    const hasClass = event.target.classList.contains(className);

    if (hasClass) {
      this.renderer.removeClass(event.target, className);
    } else {
      this.renderer.addClass(event.target, className);
    }
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
}
