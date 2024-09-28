//#region -------TREE NAVIGATION

/** Flat node with expandable and level information */


export interface MyFlatNode {
  expandable: boolean;
  name: string;
  level: number;
  icon: string;
  hasChild: boolean;
  iconSize: any
  routerLink: string;
}

export interface Navs {
  name: string;
  icon: string;
  hasChild: boolean;
  childs: Navs[];
  iconSize: any
  routerLink: string;
}
  //#endregion