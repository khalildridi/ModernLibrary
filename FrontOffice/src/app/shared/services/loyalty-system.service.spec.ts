import { TestBed } from '@angular/core/testing';

import { LoyaltySystemService } from './loyalty-system.service';

describe('LoyaltySystemService', () => {
  let service: LoyaltySystemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoyaltySystemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
