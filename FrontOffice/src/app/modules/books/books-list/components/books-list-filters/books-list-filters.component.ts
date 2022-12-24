import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  AfterViewInit,
  EventEmitter,
  Output,
} from '@angular/core';
import { of } from 'rxjs';
import {
  debounceTime,
  map,
  distinctUntilChanged,
  filter,
  take,
} from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { openClose } from 'src/app/animations';
import { Options } from '@angular-slider/ngx-slider';
import { BookService } from '../../services/book.service';
import { SearchBookOptions } from '../../models/searchBooksOptions';

@Component({
  selector: 'app-books-list-filters',
  templateUrl: './books-list-filters.component.html',
  styleUrls: ['./books-list-filters.component.scss'],
  animations: [openClose],
})
export class BooksListFiltersComponent implements OnInit, AfterViewInit {
  isSizeOpen: boolean = false;

  @ViewChild('searchBooksInput', { static: true })
  searchBooksInput?: ElementRef;

  @Output('getBooks') getBooks: EventEmitter<any> = new EventEmitter();
  @Output('cleanBooks') cleanBooks: EventEmitter<any> = new EventEmitter();

  minValue: number = 0;
  maxValue: number = 50;
  options: Options = {
    floor: 0,
    ceil: 300,
  };

  constructor(private bookService: BookService) {}

  ngAfterViewInit() {
    fromEvent(this.searchBooksInput?.nativeElement, 'keyup')
      .pipe(
        // get value
        map((event: any) => {
          return event.target.value;
        }),

        // Time in milliseconds between key events
        debounceTime(300),

        // If previous query is diffent from current
        distinctUntilChanged()

        // subscription for response
      )
      .subscribe(() => {
        this.reloadBooks();
      });
  }

  reloadBooks() {
    let searchContent: string = this.searchBooksInput?.nativeElement.value;

    let searchBookOptions: SearchBookOptions = { page: 1, searchContent: '' };

    this.bookService.searchBookOptions$
      .pipe(take(1))
      .subscribe((value) => (searchBookOptions = value));

    searchBookOptions.searchContent = searchContent;
    searchBookOptions.minPrice = this.minValue;
    searchBookOptions.maxPrice = this.maxValue;
    this.bookService.setSearchBookOptions(searchBookOptions);

    this.cleanBooks.emit();
    this.getBooks.emit(searchBookOptions);
  }

  ngOnInit(): void {}
}
