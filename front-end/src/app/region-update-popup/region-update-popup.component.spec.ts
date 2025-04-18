import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionUpdatePopupComponent } from './region-update-popup.component';

describe('RegionUpdatePopupComponent', () => {
  let component: RegionUpdatePopupComponent;
  let fixture: ComponentFixture<RegionUpdatePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegionUpdatePopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegionUpdatePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
