import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Subject } from 'rxjs';
import { pulse } from 'src/app/animations';
import { Book } from 'src/app/shared/models/book';
import { BooksRestService } from 'src/app/shared/services/books-rest.service';
import { SearchBookOptions } from './models/searchBooksOptions';
import { BookService } from './services/book.service';
import { map, tap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-books-list',
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.scss'],
  animations: [pulse],
})
export class BooksListComponent implements OnInit, AfterViewInit, OnDestroy {
  isSortOpen: boolean = false;

  componentDestroyed$: Subject<boolean> = new Subject();

  selectedBook: Book = new Book();

  books: Book[] = [];

  searchBookOptions: SearchBookOptions = { page: 1, searchContent: '' };

  /* =====================Infinite Scroll Variables ============================= */

  @ViewChildren('lastBook', { read: ElementRef })
  lastBook?: QueryList<ElementRef>;

  observer: any;
  /* ========================================================================= */

  constructor(
    public rest: BooksRestService,
    private bookService: BookService
  ) {}

  ngOnInit() {
    this.getBooks(this.searchBookOptions);

    this.bookService.selectedBook$
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((value) => {
        this.selectedBook = value;
      });

    this.bookService.books$
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((value) => {
        this.books = value;
      });

    this.bookService.searchBookOptions$
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((value) => {
        this.searchBookOptions = value;
      });

    this.intersectionObserver();
  }

  ngAfterViewInit(): void {
    this.lastBook?.changes
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((d) => {
        if (d.last) this.observer.observe(d.last.nativeElement);
      });
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
    this.cleanBooks();
    this.searchBookOptions.priceSort = '';
  }

  onSelectedBook(book: Book) {
    this.bookService.setSelectedBook(book);
  }

  handleSorting(sort: string = 'asc') {
    this.searchBookOptions.priceSort = sort;
    this.cleanBooks();
    this.bookService.setSearchBookOptions(this.searchBookOptions);
    this.getBooks(this.searchBookOptions);
  }

  getBooks(options: SearchBookOptions) {
    this.rest
      .getBooks(options)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((data: any) => {
        data.books.forEach((book: Book) => {
          this.bookService.addBook(book);
        });

        this.searchBookOptions.hasNextPage = data.hasNextPage;
      });
  }

  cleanBooks() {
    this.bookService.resetBooks();
    this.searchBookOptions.page = 1;
  }

  intersectionObserver(): void {
    let options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (this.searchBookOptions.hasNextPage) {
          this.searchBookOptions.page++;

          this.getBooks(this.searchBookOptions);
        }
      }
    }, options);
  }
}
