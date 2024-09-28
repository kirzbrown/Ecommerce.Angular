import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SpaSettings } from 'src/app/models/spa-settings.model';
import { CustomSpaSettingsService } from './services/custom-spa-settings.service';

@Component({
  selector: 'app-content-management',
  templateUrl: './content-management.component.html',
  styleUrls: ['./content-management.component.scss']
})
export class ContentManagementComponent implements OnInit {

  spaSettings: SpaSettings;

  constructor(
    private customSpaSettingsService: CustomSpaSettingsService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getSpaSettings();
  }

  getSpaSettings() {
    this.customSpaSettingsService.getCustomSPASettingAsync().subscribe(result => {
      let data = result as any;
      this.spaSettings = data.data;
      this.cdr.detectChanges();
    }, (err) => {
      console.error(err);
    })
  }

}

