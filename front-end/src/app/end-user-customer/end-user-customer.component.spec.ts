import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndUserCustomerComponent } from './end-user-customer.component';

describe('EndUserCustomerComponent', () => {
  let component: EndUserCustomerComponent;
  let fixture: ComponentFixture<EndUserCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EndUserCustomerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EndUserCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
