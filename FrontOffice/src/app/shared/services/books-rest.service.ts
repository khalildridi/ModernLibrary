import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/book';
import { SearchBookOptions } from 'src/app/modules/books/books-list/models/searchBooksOptions';

const endpoint = 'http://localhost:3000/api/v1/';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class BooksRestService {
  constructor(private http: HttpClient) {}

  getBooks(options: SearchBookOptions): Observable<any[]> {
    console.table(options);

    return this.http.get<any[]>(
      endpoint +
        `books/search?page=${options.page || 1}&perPage=10&searchContent=${
          options.searchContent || ''
        }&minPrice=${options.minPrice || 0}&maxPrice=${
          options.maxPrice || 300
        }&priceSort=${options.priceSort || 'asc'}`
    );
  }

  getBook(id: string): Observable<Book> {
    return this.http.get<Book>(endpoint + 'books/show/' + id);
  }

  /*
  addProduct(product: Product): Observable<Product> {
    console.log(product);
    return this.http.post<Product>(
      endpoint + 'products',
      JSON.stringify(product),
      httpOptions
    );
  }

  updateProduct(id: string, product: Product): Observable<Product> {
    return this.http.put<Product>(
      endpoint + 'product/' + id,
      JSON.stringify(product),
      httpOptions
    );
  }

  deleteProduct(id: string): Observable<Product> {
    return this.http.delete<Product>(endpoint + 'product/' + id, httpOptions);
  } */
}
