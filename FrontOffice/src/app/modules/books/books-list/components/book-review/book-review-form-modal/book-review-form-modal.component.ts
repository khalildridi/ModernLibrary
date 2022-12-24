import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { Subject } from 'rxjs';
import { User } from 'src/app/modules/models/user.model';
import { UserRestService } from 'src/app/shared/services/user-rest.service';
import { Review } from '../../../models/review.model';
import { BookService } from '../../../services/book.service';
import { ReviewRestService } from '../../../services/review-rest.service';
import { map, tap, takeUntil } from 'rxjs/operators';
import { ReviewService } from '../../../services/review.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-book-review-form-modal',
  templateUrl: './book-review-form-modal.component.html',
  styleUrls: ['./book-review-form-modal.component.scss'],
})
export class BookReviewFormModalComponent implements OnInit, OnDestroy {
  @Input() review: Review = { date: new Date(), description: '', stars: 0 };
  user!: User;
  componentDestroyed$: Subject<boolean> = new Subject();

  constructor(
    private userService: UserRestService,
    private reviewRest: ReviewRestService,
    private bookService: BookService,
    private reviewService: ReviewService,
    private toastr: ToastrService
  ) {}

  ngOnDestroy(): void {
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.userService.getId().subscribe((res: any) => {
      if (res) {
        this.user = res.user;
      }
    });
  }

  submitReview() {
    this.review.user_id = this.user._id;
    this.review.user_name = this.user.name;

    this.reviewRest
      .registerReview(this.bookService.getSelectedBook()._id!, this.review)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((_data: any) => {
        this.review.stars = Number(this.review.stars);
        this.reviewService.addReview(this.review);
        this.toastr.success('Review registered successfully.', 'Review');
      });
  }
}
