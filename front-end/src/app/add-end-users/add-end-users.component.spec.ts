import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEndUsersComponent } from './add-end-users.component';

describe('AddEndUsersComponent', () => {
  let component: AddEndUsersComponent;
  let fixture: ComponentFixture<AddEndUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEndUsersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEndUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
