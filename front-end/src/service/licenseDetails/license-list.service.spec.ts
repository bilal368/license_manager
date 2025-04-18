import { TestBed } from '@angular/core/testing';

import { LicenseListService } from './license-list.service';

describe('LicenseListService', () => {
  let service: LicenseListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LicenseListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
