import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AreaSelectorService } from './services/area-selector.service';

@Component({
  selector: 'app-area-selector',
  templateUrl: './area-selector.component.html',
  styleUrls: ['./area-selector.component.scss']
})
export class AreaSelectorComponent implements OnInit {

  regions = [];
  provinces = [];
  cities = [];
  barangays = [];
  stores = [];
  areaSelectorFormGroup;


  constructor(
    private areaSelectorService: AreaSelectorService,
    public dialogRef: MatDialogRef<AreaSelectorComponent>,
    private cdr: ChangeDetectorRef
  ) { }

  get province() { return this.areaSelectorFormGroup.controls.province; }
  get city() { return this.areaSelectorFormGroup.controls.city; }

  ngOnInit(): void {
    this.areaSelectorFormGroup = new FormGroup({
      province: new FormControl(null),
      city: new FormControl(null),
    })

    this.setDefaultValue();
    this.setProvincesData();
  }

  get deliveryArea() {
    return JSON.parse(localStorage.getItem('deliveryArea')) ?? null;
  }

  setDefaultValue() {
    if(this.deliveryArea) {
      // console.log(this.deliveryArea);
    }
  }

  setProvincesData() {
    this.getProvinces();
  }


  getProvinces() {
    this.areaSelectorService.getProvinces().subscribe(res => {
      if(res) {
        this.provinces = res;
        this.cities = [];
      }
    });
  }  

  getCities($event, province) {
    if($event.isUserInput) {
      this.areaSelectorService.getCities(province).subscribe(res => {
        if(res) {
          this.cities = res;
        }
      });
    }
  }

  proceed() {
    if(!this.province.value || !this.city.value) return;

    let deliveryArea = {
      province: this.province.value,
      city: this.city.value,
    };
    
    this.dialogRef.close(deliveryArea);
  }

  close() {
    this.dialogRef.close();
  }
}
