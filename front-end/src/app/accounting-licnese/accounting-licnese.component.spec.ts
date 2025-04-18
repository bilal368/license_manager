import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingLicneseComponent } from './accounting-licnese.component';

describe('AccountingLicneseComponent', () => {
  let component: AccountingLicneseComponent;
  let fixture: ComponentFixture<AccountingLicneseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountingLicneseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccountingLicneseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
