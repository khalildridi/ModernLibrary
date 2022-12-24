import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BooksListComponent } from './books-list.component';
import { BooksListFiltersComponent } from './components/books-list-filters/books-list-filters.component';
import { BookCardComponent } from './components/book-card/book-card.component';
import { BookQuickViewModalComponent } from './components/book-quick-view-modal/book-quick-view-modal.component';
import { MaterialModule } from 'src/app/material/material.module';
import { RouterModule } from '@angular/router';
import { SwiperModule } from 'swiper/angular';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { FormsModule } from '@angular/forms';
import { BookReviewComponent } from './components/book-review/book-review.component';
import { BookReviewFormModalComponent } from './components/book-review/book-review-form-modal/book-review-form-modal.component';
import { BookDetailsComponent } from './components/book-details/book-details.component';

@NgModule({
  declarations: [
    BooksListComponent,
    BooksListFiltersComponent,
    BookCardComponent,
    BookQuickViewModalComponent,
    BooksListComponent,
    BookDetailsComponent,
    BookReviewComponent,
    BookReviewFormModalComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    SwiperModule,
    InfiniteScrollModule,
    NgxSliderModule,
    FormsModule,
  ],
  exports: [BooksListComponent, BookCardComponent],
})
export class BooksListModule {}
