import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSuccessDialogComponent } from './product-success-dialog.component';

describe('ProductSuccessDialogComponent', () => {
  let component: ProductSuccessDialogComponent;
  let fixture: ComponentFixture<ProductSuccessDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductSuccessDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSuccessDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
