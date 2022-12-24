import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BookQuickViewModalComponent } from '../book-quick-view-modal/book-quick-view-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Book } from 'src/app/shared/models/book';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.scss'],
})
export class BookCardComponent implements OnInit {
  @Input() book?: Book;
  generalReviewsInfo: any = { avgRating: 0, numReviews: 0 };
  @Output('onSelectedBook') onSelectedBook: EventEmitter<any> =
    new EventEmitter();

  constructor(public dialog: MatDialog, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.calcAvgRatingStars();
  }

  calcAvgRatingStars() {
    let totalStars = 0;
    let avgRating = 0;
    if (this.book?.reviews) {
      for (let review of this.book.reviews) {
        totalStars += review.stars || 0;
        avgRating = totalStars / this.book.reviews.length;
      }
      this.generalReviewsInfo.avgRating = isNaN(avgRating)
        ? 0
        : Math.round(avgRating);
      this.generalReviewsInfo.numReviews = this.book.reviews.length;
    }
  }

  openBookQuickView() {
    if (this.book?.new! + this.book?.worn! == 0) {
      this.toastr.warning(
        'You cannot add books that are not in stock',
        'Shopping Cart'
      );
      return;
    }

    this.onSelectedBook.emit();
    const dialogRef = this.dialog.open(BookQuickViewModalComponent, {
      data: this.book,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
