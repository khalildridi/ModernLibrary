import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Review } from '../../models/review.model';

@Component({
  selector: 'app-book-review',
  templateUrl: './book-review.component.html',
  styleUrls: ['./book-review.component.scss'],
})
export class BookReviewComponent implements OnInit {
  @Input() review: Review = { stars: 0 };

  constructor() {}

  ngOnInit(): void {}
}
