import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCategoryNavComponent } from './product-category-nav.component';

describe('ProductCategoryNavComponent', () => {
  let component: ProductCategoryNavComponent;
  let fixture: ComponentFixture<ProductCategoryNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductCategoryNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCategoryNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
