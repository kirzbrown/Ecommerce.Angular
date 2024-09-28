import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductItemThumbnailComponent } from './product-item-thumbnail.component';

describe('ProductItemThumbnailComponent', () => {
  let component: ProductItemThumbnailComponent;
  let fixture: ComponentFixture<ProductItemThumbnailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductItemThumbnailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductItemThumbnailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
