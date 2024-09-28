import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPageManagementComponent } from './landing-page-management.component';

describe('LandingPageManagementComponent', () => {
  let component: LandingPageManagementComponent;
  let fixture: ComponentFixture<LandingPageManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandingPageManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingPageManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
