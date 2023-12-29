import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateHomeComponent } from './create-home.component';

describe('CreateHomeComponent', () => {
  let component: CreateHomeComponent;
  let fixture: ComponentFixture<CreateHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateHomeComponent]
    });
    fixture = TestBed.createComponent(CreateHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
