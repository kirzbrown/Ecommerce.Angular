import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import * as internal from "stream";
import { whDeliveryArea } from "./_wh-common";

  export interface WareHouseDto {
    name: string;
    position: number;
    weight: number;
    symbol: string;
    id:number;
  }

  export class whMainListItem {
      name: string;
      address: string;
      contactNumber: string;      
      adminUserId: string;    
      "deliveryAreas": Array<whDeliveryArea>;      
      id: number;    
   
  }


  

export class whUser{
   id:string;
   userName:string;
}
export class whEditSA{
  province: string;
  warehouse: string;
}
  export class whAddSA extends whMainListItem{  
    province:string
  userName:string
  isChecked:boolean
  position:number


  constructor ()
  {
    super();
    this.userName = "Unassigned"
  }

//  static formGroupToSA(form: FormGroup): whAddSA {
//     const da = new whAddSA();
//     da.province = form.get('province').value;   
//     return da;
//   }

//   asFormGroup(da:whAddSA):FormGroup
//   {
//     const fg = new FormGroup({
  
//       //id: number; this is a dummy id dont use in db
//      // id: new FormControl(x.id),
//       province : new FormControl(da.province,{ validators: [Validators.required]}),
//       //city: new FormControl({value: da.city, disabled: true},{ validators: [Validators.required]}),  
//       // city: new FormControl(da.city,{ validators: [Validators.required]}),        
//       // isActive: new FormControl(da.isActive,{ validators: [Validators.required]}),
//       isChecked: new FormControl(false),
//       //isVisible: new FormControl(da.isVisible),
//       id: new FormControl(0),
//       sort: new FormControl(0)
//     })

//     return fg;
//   } 

}

  export class whDialogVM {
    selected:whMainListItem;
    formDialog:FormGroup;
    saList: Array<whAddSA>;
    saListEdit: Array<whEditSA>;
    adminList:Array<whUser>;

    
    constructor(){
       this.initForm();
       this.saList = new Array<whAddSA>();
       this.adminList = new Array<whUser>();


    }

    initForm(){

      
       this.formDialog = new FormGroup(
        {          
          headerForm:  new FormControl('', [Validators.required]),
          headerUser:  new FormControl('')
          
        }
      );

      // this.saListForm = new FormArray([]);
      // this.formDialog.addControl('saListForm', this.saListForm);

    } 

    // addNewForm(da:whAddSA) {
    //   (this.formDialog.get('saListForm') as FormArray).push(
    //     da.asFormGroup(da)
    //   );
    // }
    
  }