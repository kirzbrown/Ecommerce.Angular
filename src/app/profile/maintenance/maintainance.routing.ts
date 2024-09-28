import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WarehouseManagementComponent } from '../warehouse-management/warehouse-management.component';

import { ServiceAreaComponent } from './service-area/service-area.component';

export const routes: Routes = [
  // { path: 'maintenance', component: MaintenanceComponent },
  { path: 'service', component: ServiceAreaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintainanceRoutesModule {
  static routes = routes;
}

