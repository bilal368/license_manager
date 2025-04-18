import { TestBed } from '@angular/core/testing';

import { DealersLisitingService } from './dealers-lisiting.service';

describe('DealersLisitingService', () => {
  let service: DealersLisitingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DealersLisitingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
