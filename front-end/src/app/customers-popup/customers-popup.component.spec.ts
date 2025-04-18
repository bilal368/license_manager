import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomersPopupComponent } from './customers-popup.component';

describe('CustomersPopupComponent', () => {
  let component: CustomersPopupComponent;
  let fixture: ComponentFixture<CustomersPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomersPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomersPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
