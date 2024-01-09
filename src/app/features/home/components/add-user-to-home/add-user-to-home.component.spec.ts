import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserToHomeComponent } from './add-user-to-home.component';

describe('AddUserToHomeComponent', () => {
  let component: AddUserToHomeComponent;
  let fixture: ComponentFixture<AddUserToHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddUserToHomeComponent]
    });
    fixture = TestBed.createComponent(AddUserToHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
