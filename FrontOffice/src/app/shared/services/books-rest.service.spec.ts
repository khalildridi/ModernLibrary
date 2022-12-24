import { TestBed } from '@angular/core/testing';

import { BooksRestService } from './books-rest.service';

describe('BooksRestService', () => {
  let service: BooksRestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BooksRestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
