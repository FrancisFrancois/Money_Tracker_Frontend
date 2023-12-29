import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadHomeComponent } from './read-home.component';

describe('ReadHomeComponent', () => {
  let component: ReadHomeComponent;
  let fixture: ComponentFixture<ReadHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReadHomeComponent]
    });
    fixture = TestBed.createComponent(ReadHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
