import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentLandingPageComponent } from './payment-landing-page.component';

describe('PaymentLandingPageComponent', () => {
  let component: PaymentLandingPageComponent;
  let fixture: ComponentFixture<PaymentLandingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentLandingPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
