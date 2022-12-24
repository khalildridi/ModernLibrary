import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksListFiltersComponent } from './books-list-filters.component';

describe('BooksListFiltersComponent', () => {
  let component: BooksListFiltersComponent;
  let fixture: ComponentFixture<BooksListFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BooksListFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BooksListFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
