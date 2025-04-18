import { TestBed } from '@angular/core/testing';

import { UserslisitingService } from './userslisiting.service';

describe('UserslisitingService', () => {
  let service: UserslisitingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserslisitingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
