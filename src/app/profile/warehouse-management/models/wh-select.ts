import { CurrencyMaskConfig } from 'ng2-currency-mask';
import { NgbPaginationNumber } from "@ng-bootstrap/ng-bootstrap";
import { CurrencyPipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { whDeliveryArea, whSearchItem } from './_wh-common';
import { DeliveryArea } from '../../maintenance/_model/maintenance-model';


  export class whSelectVM
  {
    selectedWh: whSearchItem; 

    selectedP:string;


    private _provinces:Array<string>;
    private _daList:Array<whDeliveryArea>;
    private _cityList : Array<whDeliveryArea>;
    // daClone:Array<whDeliveryArea>


    clearCityList()
    {
      this._cityList =[];
    }


    get cityList():Array<whDeliveryArea>
    {
       if(!this.selectedWh.deliveryAreas)
         return  []


         if(this._cityList.length>0)
         {
           let city = this._cityList[0];
           if( city.province === this.selectedP)
              return this._cityList;
         }
       //initialize...
       this._cityList = this.daList.filter((city) => city.province === this.selectedP);
       
       this._cityList.sort((a, b) => {
        if (a.city < b.city) return -1;
        if (a.city > b.city) return 1;
        return 0;
      });

      //TIP ADD INDEX
     //this._cityList.map((item, i) => ({...item, id: i}));
 
      return this._cityList;
    }

    set cityList(value:Array<whDeliveryArea>){

        const updatedList = this.selectedWh.deliveryAreas.map(item => {

        const updatedItem = value.find(subsetItem => subsetItem.id === item.id);
        return updatedItem ? { ...item, ...updatedItem } : item;

      });

      this.selectedWh.deliveryAreas = updatedList as any;
      this._cityList = value;

    }

   

    cityListSubject = new BehaviorSubject<whDeliveryArea[]>([]);
    


    get daList():Array<whDeliveryArea>
    {
       if(!this.selectedWh.deliveryAreas)
         return  []
       this._daList= this.selectedWh.deliveryAreas as Array<whDeliveryArea>;

      return this._daList;
    }

    
    get provinces():Array<string>
    {
      //this._provinces = this.daList.map(x=>x.province).sort();

      if(this.daList &&  this.daList.length===0)
      {
        this._provinces =[""];
        return this._provinces;
      }

      this._provinces = this.daList.map(p => p.province)
      .filter((province, index, self) => self.indexOf(province) === index).sort();

      return this._provinces;
    }

    constructor()
    {
      this._daList =[];
      this._provinces = [];
      this.selectedWh = new whSearchItem();
      this._cityList =[];
    }


  }