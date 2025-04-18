import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecorderLicenseComponent } from './recorder-license.component';

describe('RecorderLicenseComponent', () => {
  let component: RecorderLicenseComponent;
  let fixture: ComponentFixture<RecorderLicenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecorderLicenseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecorderLicenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
