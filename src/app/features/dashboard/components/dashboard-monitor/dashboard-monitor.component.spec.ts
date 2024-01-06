import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMonitorComponent } from './dashboard-monitor.component';

describe('DashboardMonitorComponent', () => {
  let component: DashboardMonitorComponent;
  let fixture: ComponentFixture<DashboardMonitorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardMonitorComponent]
    });
    fixture = TestBed.createComponent(DashboardMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
