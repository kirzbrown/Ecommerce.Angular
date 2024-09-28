import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailsConfigComponent } from './product-details-config.component';

describe('ProductDetailsConfigComponent', () => {
  let component: ProductDetailsConfigComponent;
  let fixture: ComponentFixture<ProductDetailsConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductDetailsConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailsConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
