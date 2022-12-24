import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookQuickViewModalComponent } from './book-quick-view-modal.component';

describe('BookQuickViewModalComponent', () => {
  let component: BookQuickViewModalComponent;
  let fixture: ComponentFixture<BookQuickViewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookQuickViewModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookQuickViewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
