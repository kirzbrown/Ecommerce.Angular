import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';


@Component({
  selector: 'app-added-to-cart-snackbar',
  templateUrl: './added-to-cart-snackbar.component.html',
  styleUrls: ['./added-to-cart-snackbar.component.scss']
})
export class AddedToCartSnackbarComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }

  ngOnInit(): void {
  }

}
