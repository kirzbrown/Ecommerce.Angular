import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsidePageManagementComponent } from './inside-page-management.component';

describe('InsidePageManagementComponent', () => {
  let component: InsidePageManagementComponent;
  let fixture: ComponentFixture<InsidePageManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsidePageManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsidePageManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
