import { DeliveryArea } from './../../maintenance/_model/maintenance-model';
import { whSearchItem } from './_wh-common';
// export class whSearchItem{
//     name: string;
//     address: string;
//     contactNumber: string
//     email: string
//     adminUserId: string
//     //"warehouseCatalogs": null,
//     deliveryAreas: Array<DeliveryArea>;
//     paybizzAccountId: string;
//     id: 1;
//     rowVersion: string;
//     index:number;

//     constructor(){
//       this.name=null;      
//     }      
//   }

  export class whDialogData{
      data:whSearchItem;
      isEdit:boolean;

      constructor(){
       this.data = new whSearchItem();
       this.isEdit = false;
      }
  }

  export class whSearchVM
  {
    searchKey: string;
    whList: Array<whSearchItem>;   

  }