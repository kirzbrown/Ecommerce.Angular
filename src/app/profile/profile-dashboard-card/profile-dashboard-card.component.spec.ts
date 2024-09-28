import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileDashboardCardComponent } from './profile-dashboard-card.component';

describe('ProfileDashboardCardComponent', () => {
  let component: ProfileDashboardCardComponent;
  let fixture: ComponentFixture<ProfileDashboardCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileDashboardCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileDashboardCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
