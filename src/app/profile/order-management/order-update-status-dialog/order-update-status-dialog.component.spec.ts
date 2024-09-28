import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderUpdateStatusDialogComponent } from './order-update-status-dialog.component';

describe('OrderUpdateStatusDialogComponent', () => {
  let component: OrderUpdateStatusDialogComponent;
  let fixture: ComponentFixture<OrderUpdateStatusDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderUpdateStatusDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderUpdateStatusDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
