import { TestBed } from '@angular/core/testing';

import { CheckOutRestService } from './check-out-rest.service';

describe('CheckOutRestService', () => {
  let service: CheckOutRestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckOutRestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
