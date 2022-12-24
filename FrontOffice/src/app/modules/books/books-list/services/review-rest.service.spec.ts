import { TestBed } from '@angular/core/testing';

import { ReviewRestService } from './review-rest.service';

describe('ReviewRestService', () => {
  let service: ReviewRestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReviewRestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
