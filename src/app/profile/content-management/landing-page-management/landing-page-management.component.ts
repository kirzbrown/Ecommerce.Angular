import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { CustomSpaSettingsService } from '../services/custom-spa-settings.service';

@Component({
  selector: 'app-landing-page-management',
  templateUrl: './landing-page-management.component.html',
  styleUrls: ['./landing-page-management.component.scss']
})
export class LandingPageManagementComponent implements OnInit {
  isEdit: boolean = false;
  defaultHeaderColor: string = "#0099CC"
  defaultFooterColor: string = "#30353A"
  @Input() headerColor: string;
  @Input() footerColor: string;

  constructor(
    private customSpaSettingsService: CustomSpaSettingsService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  }

  onClickReset() {
    Swal.fire({
      title: 'Are you sure?',
      text: "Landing Page Colors will be set to default.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, reset it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.customSpaSettingsService.updateLandingHeaderAndFooterColor(this.defaultHeaderColor, this.defaultFooterColor).subscribe(result => {
          this.headerColor = this.defaultHeaderColor;
          this.footerColor = this.defaultFooterColor;
          this.customSpaSettingsService.triggerHeaderSettings.next(true);
          this.cdr.detectChanges();
          Swal.fire('Reset!', 'Landing Page has been reset.', 'success')
        }, (err) => {
          Swal.fire('Unable to Update', 'Your header and footer color is not updated. Please try again..', 'error')
        })
      }
    })
  }

  onClickSave() {
    Swal.fire({
      title: 'Are you sure?',
      text: "Changes will be saved.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, save it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.customSpaSettingsService.updateLandingHeaderAndFooterColor(this.headerColor, this.footerColor).subscribe(result => {
          this.isEdit = !this.isEdit;
          this.customSpaSettingsService.triggerHeaderSettings.next(true);
          this.cdr.detectChanges();
          Swal.fire('Saved!', 'Changes has been saved.', 'success')
        }, (err) => {
          Swal.fire('Unable to Update', 'Your header and footer color is not updated. Please try again..', 'error')
        })
      }
    })
  }

  onClickCancel() {
    Swal.fire({
      title: 'Are you sure?',
      text: "Changes will be cancelled.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isEdit = !this.isEdit;
        this.cdr.detectChanges();
        Swal.fire('Cancelled!', 'Changes has been cancelled.', 'success')
      }
    })
  }

}
