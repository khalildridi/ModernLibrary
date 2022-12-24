import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Review } from '../models/review.model';

const endpoint = 'http://localhost:3000/api/v1/';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class ReviewRestService {
  constructor(private http: HttpClient) {}

  registerReview(id: string, review: Review): Observable<Review> {
    return this.http.put<Review>(
      endpoint + 'books/registerReview/' + id,
      JSON.stringify(review),
      httpOptions
    );
  }
}
