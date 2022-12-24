import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private _reviews: Review[] = [];
  reviews$: BehaviorSubject<Review[]> = new BehaviorSubject<Review[]>([]);

  constructor() {}

  addReview(review: Review) {
    this._reviews.push(review);
    this.reviews$.next(this._reviews);
  }

  getReviewsCount() {
    return this._reviews.length;
  }

  resetReviews() {
    this._reviews = [];
    this.reviews$.next(this._reviews);
  }
}
