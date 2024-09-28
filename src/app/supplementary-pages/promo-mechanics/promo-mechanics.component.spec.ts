import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoMechanicsComponent } from './promo-mechanics.component';

describe('PromoMechanicsComponent', () => {
  let component: PromoMechanicsComponent;
  let fixture: ComponentFixture<PromoMechanicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromoMechanicsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PromoMechanicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
