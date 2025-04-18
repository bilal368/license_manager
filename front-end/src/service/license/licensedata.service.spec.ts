import { TestBed } from '@angular/core/testing';

import { LicensedataService } from './licensedata.service';

describe('LicensedataService', () => {
  let service: LicensedataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LicensedataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
