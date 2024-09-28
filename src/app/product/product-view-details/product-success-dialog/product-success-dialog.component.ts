import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-success-dialog',
  templateUrl: './product-success-dialog.component.html',
  styleUrls: ['./product-success-dialog.component.scss']
})
export class ProductSuccessDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ProductSuccessDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
              public router: Router) { }

  ngOnInit(): void {
  }

  goToProfile() {
    this.dialogRef.close();
    this.router.navigateByUrl('/profile');
  }
}
