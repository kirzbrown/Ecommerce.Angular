import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable, of } from "rxjs";


//model from Dialog
export class DeliveryArea {
    id:                number;
    rowVersion:        string;
    province:          string;
    city:              string;
    isActive:          boolean;
    assignedWarehouse: string;
    isEnabled:boolean;
    isVisible:boolean;
    sort:number;

    constructor() {
      this.isVisible = true;
      this.isActive = true;
      this.isEnabled = false;
    
    }


    static asFormGroup(da: DeliveryArea): FormGroup {   
      
     
      const fg = new FormGroup({
  
        //id: number; this is a dummy id dont use in db
       // id: new FormControl(x.id),
        province : new FormControl(da.province,{ validators: [Validators.required]}),
        //city: new FormControl({value: da.city, disabled: true},{ validators: [Validators.required]}),  
        city: new FormControl(da.city,{ validators: [Validators.required]}),        
        isActive: new FormControl(da.isActive,{ validators: [Validators.required]}),
        isEnabled: new FormControl(false),
        isVisible: new FormControl(da.isVisible),
        id: new FormControl(0),
        sort: new FormControl(0)
      })

      return fg;

      }    
}


export class DeliveryAreaVM {
  
  
  //public  dto: Array<DeliveryArea>;  
  //dto$: Observable<DeliveryArea[]>;  


 
  public  selected:DeliveryAreaListItem;

  formDialog: FormGroup;  
  public  formHeader:FormGroup;
  public  formDto:FormArray;


  //cityFormArray: FormArray;

  constructor() {
    this.selected = new DeliveryAreaListItem();
    let cities: Array<DeliveryArea> = [];
    //this.dto = cities;
  }
 
  

}

//model for api 
export class DeliveryAreaDto {
  province: string;
  isActive: boolean;
  cities: Array<string>  
 
}
//model from item list of main page
export class DeliveryAreaListItem {
  name: string;
  isActive: boolean;
  cityCount: number  
 
}

