import { TestBed } from '@angular/core/testing';

import { EndUserLisitingService } from './end-user-lisiting.service';

describe('EndUserLisitingService', () => {
  let service: EndUserLisitingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EndUserLisitingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
