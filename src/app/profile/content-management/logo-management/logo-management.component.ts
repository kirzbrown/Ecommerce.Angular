import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Guid } from 'guid-typescript';
import { AzureBlobStorageService, CONTENT } from 'src/app/services/azureblob.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { CustomSpaSettingsService } from '../services/custom-spa-settings.service';

@Component({
  selector: 'app-logo-management',
  templateUrl: './logo-management.component.html',
  styleUrls: ['./logo-management.component.scss']
})
export class LogoManagementComponent implements OnInit {
  defaultHeaderLogo: string = "https://ecommercephstorageaccount.blob.core.windows.net/ecommercefilestorage/ecommerce/logos/ecommerce-landing-logo.png"
  defaultCheckoutLogo: string = "https://ecommercephstorageaccount.blob.core.windows.net/ecommercefilestorage/ecommerce/logos/ecommerce-checkout-logo.png"
  file: any;

  @Input() headerLogo: string;
  @Input() checkoutLogo: string;

  constructor(
    private azureBlobService: AzureBlobStorageService,
    private customSpaSettingsService: CustomSpaSettingsService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
  }
  
  triggerLogoUpload(logoId) {
    let element = document.getElementById(logoId) as HTMLInputElement;
    element.click();
  }

  onLogoUpload(event, type: string) {
    var reader = new FileReader();
    var validFileExtensions = ["image/png", "image/jpg", "image/jpeg", "image/gif"];
    var fileType = event.target.files[0].type;

    reader.readAsDataURL(event.target.files[0]);
    reader.onload = function (e) {

      var image = new Image();
      image.src = e.target.result as string;
      console.log('TYPE', event.target.files[0].type);

      image.onload = function () {
        var height = image.height;
        var width = image.width;
        if (height != 50 || width != 195) {
          Swal.fire('Invalid File!', 'Image File Dimension must be 195x50px', 'error')
          return false;
        }
      };

      if (!validFileExtensions.includes(fileType)) {
        Swal.fire('Invalid File Type!', 'Only JPG, JPEG, PNG and GIF files are allowed', 'error')
        return false;
      }
    };

    if (event.target.files && event.target.files[0])
      this.uploadDialog(event, type);
  }

  uploadDialog(event: any, type: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: type == 'header' ? 'This will replace the Header Logo' : 'This will replace the Checkout Logo',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, save it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.file = event.target.files[0];
        var fileName: any;

        fileName = Guid.create().toString() + this.file['name'];
        let fileUri = this.azureBlobService.tempFileStorageUri + fileName;

        let data: CONTENT = {
          containerName: environment.azurestorage.tempBlobContainer, // desired container name
          file: this.file,  // file to upload
          filename: fileName // filename as desired with path
        }

        this.azureBlobService.uploadFile(data).then((res: string) => {
          if (type == 'header') {
            this.customSpaSettingsService.updateHomePageLogo(fileUri).subscribe(result => {
              this.headerLogo = fileUri;
              this.customSpaSettingsService.triggerHeaderSettings.next(true);
              Swal.fire('Updated!', 'The Header Logo has been updated.', 'success')
              this.cdr.detectChanges();
            }, (err) => {
              Swal.fire('Unable to Upload', 'Your header logo is not updated. Please try again..', 'error')
            })
          } else {
            this.customSpaSettingsService.updateCheckoutPageLogo(fileUri).subscribe(result => {
              this.checkoutLogo = fileUri;
              this.cdr.detectChanges();
              Swal.fire('Updated!', 'The Checkout Logo has been updated.', 'success')
            }, (err) => {
              Swal.fire('Unable to Upload', 'Your logo is not yet updated. Please try again..', 'error')
            })
          }
        }, err => {
          console.error(err);
        })
      }
    })
  }

  removeLogo(type: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: type == 'header' ? 'Header Logo will be set to default.' : 'Checkout Logo will be set to default.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it!'
    }).then((result) => {
      if (result.isConfirmed) {
        if (type == 'header') {
          this.customSpaSettingsService.updateHomePageLogo(this.defaultHeaderLogo).subscribe(result => {
            this.customSpaSettingsService.triggerHeaderSettings.next(true);
            this.headerLogo = this.defaultHeaderLogo;
            Swal.fire('Removed!', 'Header Logo has been set to default.', 'success')
            this.cdr.detectChanges();
          }, (err) => {
            Swal.fire('Unable to Remove', 'Your header logo is not removed. Please try again..', 'error')
          })
        } else {
          this.customSpaSettingsService.updateCheckoutPageLogo(this.defaultCheckoutLogo).subscribe(result => {
            this.checkoutLogo = this.defaultCheckoutLogo;
            Swal.fire('Removed!', 'Checkout Logo has been set to default.', 'success')
            this.cdr.detectChanges();
          }, (err) => {
            Swal.fire('Unable to Remove', 'Your checkout logo is not removed. Please try again..', 'error')
          })
        }
      }
    })
  }

}
