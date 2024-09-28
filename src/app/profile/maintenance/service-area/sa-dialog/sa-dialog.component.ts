import { DeliveryArea, DeliveryAreaDto, DeliveryAreaVM } from './../../_model/maintenance-model';
import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Guid } from 'guid-typescript';
import { WarehouseService } from 'src/app/profile/warehouse-management/services/warehouse.service';
import { AzureBlobStorageService, CONTENT } from 'src/app/services/azureblob.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

import { ServiceAreaService } from '../../_services/service-area.service';
import { BaseComponent } from 'src/app/shared/base-component';
import { T } from '@angular/cdk/keycodes';
import { fromEvent, of } from 'rxjs';
import { MatTable } from '@angular/material/table';
import Utils from 'src/app/shared/Utils';
import { takeUntil, debounce, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatInput } from '@angular/material/input';
//import { WarehouseService } from 'src/app/profile/warehouse-management/services/warehouse.service';



@Component({
  selector: 'app-sa-dialog',
  templateUrl: './sa-dialog.component.html',
  styleUrls: ['./sa-dialog.component.scss']
})
export class SaDialogComponent extends BaseComponent implements OnInit {


  @ViewChild(MatTable) table: MatTable<any>;

  displayedColumns: string[] = ['city'];
  modelVM: DeliveryAreaVM;



  get cityList(): FormArray {
    //return this.modelVM.formDialog.controls["cityList"] as FormArray;
    return this.modelVM.formDto;
  }

  constructor(

    @Inject(MAT_DIALOG_DATA) public fromDialog: any,
    private dialogRef: MatDialogRef<SaDialogComponent>,
    private _service: ServiceAreaService,
    //private _sanitizer: DomSanitizer,
    //private azureBlobService: AzureBlobStorageService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef) {
    super();
  }


  ngOnInit(): void {
    this.modelVM = new DeliveryAreaVM();

    //#TIP #1 init local FormGroup
    let header = this.fb.group({
      province: ['', Validators.required],
      city: [''],
      searchControl: this.searchControl,
      isActive: [true],
      isEnabled: [false]
    });

    this.modelVM.formDialog = this.fb.group(
      {
        header: header,
        cityList: this.fb.array([])
      }
    );

    //#Tip #2 assign to MODEL
    this.modelVM.formHeader = this.modelVM.formDialog.get('header') as FormGroup;
    this.modelVM.formDto = this.modelVM.formDialog.get('cityList') as FormArray;


    ///SUBSCRIPTIONS----------------------------------------------------
    //badge
    this.modelVM.formDto.valueChanges     
      .pipe(distinctUntilChanged())
      .pipe(takeUntil(this.stop$)).pipe(debounceTime(1000))
      .subscribe(value => {

        if(value.length!==this.badgeCnt)
        {
          console.info(value);
          //let jsonArray = this.modelVM.formDto.controls.map(f => Object.assign(new DeliveryAreaDto(), f.value));
          this.badgeCnt = value.length; //jsonArray.length;
          //set ids  
          let icnt = 0;           
          this.modelVM.formDto.controls.forEach(f => {
            icnt += 1;
            f.patchValue({ id: icnt });           
          });

        }    
         
      });



    /////MODE ---------------------------------------------------

    if (this.fromDialog.isAdd) {

    }
    else {//edit

      let selected = this.modelVM.selected = this.fromDialog.selected;
      //update modelvm
      this.modelVM.formHeader.patchValue({ isActive: this.modelVM.selected.isActive });
      this._isActiveEntry = this.modelVM.selected.isActive;
      
      this.modelVM.formHeader.patchValue({ province: this.modelVM.selected.name });

      //get arry of city
      this._service.getCityByProvince(this.modelVM.selected.name)
        .pipe(takeUntil(this.stop$)).subscribe(list => {
          let cities = list as Array<string>;

          cities.forEach((i) => {

            let newCity = new DeliveryArea();
            newCity.city = i;
            newCity.province = selected.name;
            newCity.isActive = selected.isActive;

            this.modelVM.formDto.push(DeliveryArea.asFormGroup(newCity));
            this.modelVM.formDto = this.modelVM.formDto;

          });


        });
      this.cdr.detectChanges();
    }
  }//end Init

  save() {


    //get all cities form formArray
    let jsonArray = this.modelVM.formDto.controls.map<DeliveryArea>(f => Object.assign(new DeliveryArea(), f.value));
    //console.log(jsonArray);
    //fixed header values
    jsonArray.forEach(
      (da) => {
        da.province = this.modelVM.formHeader.get('province').value;
        da.isActive = this.modelVM.formHeader.get('isActive').value;
      }
    )


    //transform into DeliveryAreaDto
    let dto = new DeliveryAreaDto();

    //transform to array of string 
    let cities = Utils.genericTypeArrayToStringOfIds('city', jsonArray);
    dto.cities = cities;

    let header = jsonArray[0];
    dto.province = header.province;
    dto.isActive = header.isActive;

    // console.log(dto);

    if (this.fromDialog.isAdd) {


      //api call
      this._service.createDeliveryArea(dto)
        .pipe(takeUntil(this.stop$))
        .subscribe(r => {
          Swal.fire('Created new service area!', 'Your service area has been added.', 'success')
          this.dialogRef.close(this.modelVM.formHeader.value);
        }, (err) => {
           if(err)
           {
            Swal.fire('Unable to add service area', err.error.errorMessage , 'error')
           }
           else
           Swal.fire('Unable to add service area', 'Your service area is not added. Please try again..', 'error')
        })
    } else {
      //mapping on update


      //api call
      this._service.updateDeliveryArea(this.fromDialog.selected.name, dto)
        .pipe(takeUntil(this.stop$))
        .subscribe(r => {

          Swal.fire('Updated service area!', 'Your service area has been updated.', 'success')
          this.dialogRef.close(this.modelVM.formHeader.value);
        }, (err) => {
          Swal.fire('Unable to update service area', 'Your service area is not updated. Please try again..', 'error')
        })
    }
  }





  deleteCity(index: number) {
    this.cityList.removeAt(index);

  }

  toggleRow(i: any, index: number) {
    //console.log(i);   
    let toggle = !i.get('isEnabled').value;
    let city = i.get('city').value;   
    i.patchValue({ isEnabled: toggle });    
    this.cdr.detectChanges();

  }

  setNo(index: number): string {

    return (index + 1).toString();
  }



  setValue(data) {


  }


  closeDialog() {
    this.dialogRef.close();
  }

  addCity() {

    let daForm = this.modelVM.formDialog.get('header') as FormGroup;
    let city = daForm.value;

    let newCity = new DeliveryArea();
    newCity.city = city.city;
    newCity.province = city.province;
    newCity.isActive = city.isActive;
   
    // this.modelVM.formDialog.get('cityList').value.push(DeliveryArea.asFormGroup(newCity));
    this.modelVM.formDto.push(DeliveryArea.asFormGroup(newCity));

    this.modelVM.formDto = this.modelVM.formDto;
    this.cdr.detectChanges();
    // console.log(this.modelVM.formDto);
  }

  isAddCityInValid(): boolean {

    if (
      this.modelVM.formHeader.get('city').value !== null &&
      this.modelVM.formHeader.get('city').touched &&
      this.modelVM.formHeader.get('city').value !== '') {
      //FormControl is not null or empty
      return false;
    }
    else
      return true;
  }



  //#region Toogle CITY
  private _isActiveEntry = true;
  toggleLabel = "Active";

  public set IsActiveEntry(isChecked: boolean) {
    this._isActiveEntry = isChecked;
    if (this._isActiveEntry)
      this.toggleLabel = "Active";
    else
      this.toggleLabel = "In-active";


    this.modelVM.formHeader.get('isActive').setValue(isChecked);

  }

  public get IsActiveEntry() {
    return this._isActiveEntry;
  }



  //#endregion


  updateCity(city: DeliveryArea) {

  }

  //#region SEARCH

  searchKey: string = "";
  badgeCnt: number = 0;
  //searchControl = new FormControl();
  @ViewChild('searchControl') searchControl: ElementRef;

  searhCity(search:string)
  {
    this.searchKey = search;
    //console.log(event);

    let value = this.searchKey;

      if (!value) {
        // str is either null, empty, or undefined
         //make invisble all
         this.modelVM.formDto.controls.forEach(f => {
          f.get('isVisible').patchValue( true);
        });

        return;

      }

      else {
        let jsonArray = this.modelVM.formDto.controls.map(f => Object.assign(new DeliveryArea(), f.value));
        const keyword:string = value;

        const filteredCities = jsonArray
          .filter(f => f.city.toString().toLowerCase().includes(keyword.toLowerCase()))
          .sort((a, b) => a.city.localeCompare(b.city));
        //console.log(filteredCities);

        //make invisble all
        this.modelVM.formDto.controls.forEach(f => {
          f.get('isVisible').patchValue(false);
        });


        let icnt2 = 0;
        filteredCities.forEach(f => {
          // change the value of the second item in the form array
          icnt2 += 1;
          let da = f as DeliveryArea;
          let city = this.modelVM.formDto.controls.find(g => g.get('id').value == da.id);//.at(1).setValue({ name: 'item2', value: 4 });
          if (city) {
            city.patchValue({ isVisible: true, sort: icnt2 });

          }
        });//endforeach

      }



  }
 


  //#endregion




}