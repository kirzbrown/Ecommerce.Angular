import * as internal from "stream";

export interface PeriodicElement {
    name: string;
    position: number;
    weight: number;
    symbol: string;
    id:number;
  }

  export interface WareHouseDto {
    name: string;
    position: number;
    weight: number;
    symbol: string;
    id:number;
  }

 export const ELEMENT_DATA: PeriodicElement[] = [
    {position: 1, name: 'Bacolod', weight:3, symbol: 'H',id:11},
    {position: 2, name: 'CDO', weight: 4, symbol: 'He',id:12},
    {position: 3, name: 'Cebu', weight: 6, symbol: 'Li',id:13},
    {position: 4, name: 'Davao', weight: 9, symbol: 'Be',id:14},
    {position: 5, name: 'Boron', weight: 10, symbol: 'B',id:15},
    {position: 6, name: 'Iloilo', weight: 12, symbol: 'C',id:16},
    {position: 7, name: 'Isabela', weight: 14, symbol: 'N',id:17},
    {position: 8, name: 'Laguan', weight: 15, symbol: 'O',id:18},
    {position: 9, name: 'NCR', weight: 18, symbol: 'F',id:19},
    {position: 10, name: 'Quezon', weight: 20, symbol: 'Ne',id:20},
  ];
