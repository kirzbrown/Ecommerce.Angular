import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddedToCartSnackbarComponent } from './added-to-cart-snackbar.component';

describe('CustomSnackbarComponent', () => {
  let component: AddedToCartSnackbarComponent;
  let fixture: ComponentFixture<AddedToCartSnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddedToCartSnackbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddedToCartSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
