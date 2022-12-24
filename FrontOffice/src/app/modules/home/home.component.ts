import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { Book } from 'src/app/shared/models/book';
import { BooksRestService } from 'src/app/shared/services/books-rest.service';
import SwiperCore, { Autoplay, Pagination, SwiperOptions } from 'swiper';
import { map, tap, takeUntil } from 'rxjs/operators';
// install Swiper modules
SwiperCore.use([Autoplay, Pagination]);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit, OnDestroy {
  books: Book[] = [];

  componentDestroyed$: Subject<boolean> = new Subject();

  config: SwiperOptions = {
    pagination: {
      clickable: true,
    },
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    breakpoints: {
      '640': {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      '768': {
        slidesPerView: 2,
        spaceBetween: 40,
      },
      '1024': {
        slidesPerView: 4,
        spaceBetween: 50,
      },
    },
  };

  constructor(private rest: BooksRestService) {}
  ngOnDestroy(): void {
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }

  ngOnInit(): void {
    this.rest
      .getBooks({ page: 1, searchContent: '' })
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((data: any) => {
        this.books = data.books;
      });
  }
}
