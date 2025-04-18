import { TestBed } from '@angular/core/testing';

import { PatternValidatorService } from './pattern-validator.service';

describe('PatternValidatorService', () => {
  let service: PatternValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatternValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
