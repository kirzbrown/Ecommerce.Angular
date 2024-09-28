import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileDashboardSideNavComponent } from './profile-dashboard-side-nav.component';

describe('ProfileDashboardSideNavComponent', () => {
  let component: ProfileDashboardSideNavComponent;
  let fixture: ComponentFixture<ProfileDashboardSideNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileDashboardSideNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileDashboardSideNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
