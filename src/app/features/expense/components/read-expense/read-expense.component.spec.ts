import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadExpenseComponent } from './read-expense.component';

describe('ReadExpenseComponent', () => {
  let component: ReadExpenseComponent;
  let fixture: ComponentFixture<ReadExpenseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReadExpenseComponent]
    });
    fixture = TestBed.createComponent(ReadExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
