import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Book } from 'src/app/shared/models/book';
import { SearchBookOptions } from '../models/searchBooksOptions';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private _books: Book[] = [];
  books$: BehaviorSubject<Book[]> = new BehaviorSubject<Book[]>([]);

  selectedBook$: BehaviorSubject<Book> = new BehaviorSubject<Book>({});

  searchBookOptions$: BehaviorSubject<SearchBookOptions> =
    new BehaviorSubject<SearchBookOptions>({ page: 1, searchContent: '' });

  constructor() {}

  resetBooks() {
    this._books = [];
    this.books$.next(this._books);
  }

  addBook(book: Book) {
    this._books.push(book);
    this.books$.next(this._books);
  }

  setSelectedBook(book: Book) {
    this.selectedBook$.next(book);
  }

  setSearchBookOptions(searchBookOptions: SearchBookOptions) {
    this.searchBookOptions$.next(searchBookOptions);
  }

  getSelectedBook() {
    return this.selectedBook$.value;
  }
}
