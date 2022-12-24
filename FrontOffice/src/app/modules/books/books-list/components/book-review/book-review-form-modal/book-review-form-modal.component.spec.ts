import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookReviewFormModalComponent } from './book-review-form-modal.component';

describe('BookReviewFormModalComponent', () => {
  let component: BookReviewFormModalComponent;
  let fixture: ComponentFixture<BookReviewFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookReviewFormModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookReviewFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
