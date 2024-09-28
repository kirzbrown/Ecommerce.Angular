import { renderFlagCheckIfStmt } from '@angular/compiler/src/render3/view/template';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Guid } from 'guid-typescript';
import { AzureBlobStorageService, CONTENT } from 'src/app/services/azureblob.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { ProductManagementService } from '../../product-management/services/product-management-service.component';
import { CarouselService } from '../services/carousel.service';

@Component({
  selector: 'app-carousel-dialog',
  templateUrl: './carousel-dialog.component.html',
  styleUrls: ['./carousel-dialog.component.scss']
})
export class CarouselDialogComponent implements OnInit {
  urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
  categoryFormGroup: FormGroup;
  bannerImage: string;
  reader: FileReader;
  imageData: CONTENT = null;
  categories;
  file: any;
  selectedMp4: File;



  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CarouselDialogComponent>,
    private azureBlobService: AzureBlobStorageService,
    private managementService: ProductManagementService,
    private carouselService: CarouselService,
  ) { }

  ngOnInit(): void {
    this.initalization();
  }

  initalization() {
    this.loadDropDownData();
    this.loadFormControl();
  }

  loadFormControl() {
    this.categoryFormGroup = new FormGroup({
      category: new FormControl(null, [Validators.required]),
      bannerLinkUrl: new FormControl(null, [Validators.pattern(this.urlRegex)]),
      bannerUrlImage: new FormControl(null,[Validators.required])
    })
  }

  loadDropDownData() {
    this.managementService.getCategories().subscribe((result: any) => {
      this.categories = result;
    });
  }

  triggerLogoUpload(logoId) {
    let element = document.getElementById(logoId) as HTMLInputElement;
    element.click();
  }

  onBannerUpload(event) {

    this.bannerImage = null;
    this.selectedMp4 = null;

    const xfile = event.target.files[0];
    const fileName = xfile.name;
    const fileExtension = fileName.split('.').pop();

    var validFileExtensions = ["image/png", "image/jpg", "image/jpeg", "image/gif", "video/mp4"];
    var fileType = event.target.files[0].type;


    if (!validFileExtensions.includes(fileType)) {
      Swal.fire('Invalid File Type!', 'Only JPG, JPEG, PNG and GIF or MP4 files are allowed', 'error')
      return false;
    }

    var reader = new FileReader();
    reader.readAsDataURL(xfile);

    reader.onload = (e: any) => {

      if (fileExtension === 'mp4') {
        this.selectedMp4 = e.target.result;

        this.file = event.target.files[0];
        var fileName: any;
        fileName = Guid.create().toString() + this.file['name'];
        let fileUri = this.azureBlobService.tempFileStorageUri + fileName;

        this.imageData = {
          containerName: environment.azurestorage.tempBlobContainer,
          file: this.file,
          filename: fileName
        }

        this.categoryFormGroup.controls.bannerUrlImage.setValue(fileUri);



      }//-------------end MP4-------------------------------
      else {

        var image = new Image();
        image.src = e.target.result as string;

        image.onload = (x: any) => {
          if (image.height > 2160 || image.width > 4096) {
            Swal.fire('Invalid File!', 'Image Dimension must be less than 4096x2160px', 'error')
          } else {
            this.bannerImage = e.target.result;

            this.file = event.target.files[0];
            var fileName: any;
            fileName = Guid.create().toString() + this.file['name'];
            let fileUri = this.azureBlobService.tempFileStorageUri + fileName;

            this.imageData = {
              containerName: environment.azurestorage.tempBlobContainer,
              file: this.file,
              filename: fileName
            }

            this.categoryFormGroup.controls.bannerUrlImage.setValue(fileUri);
          }
        };//end IMAGE


      }
    };
  }



  closeDialog() {
    this.dialogRef.close();
  }

  save() {
    var mappedCarouselObject = this.categoryFormGroup.value;
    Swal.showLoading()

    this.azureBlobService.uploadFile(this.imageData).then((res: string) => {
      this.carouselService.createCarouselItem(mappedCarouselObject).subscribe(res => {
        Swal.hideLoading()
        Swal.fire('Created new banner!', 'Your banner has been added.', 'success')
        this.dialogRef.close(this.categoryFormGroup.value);
      }, (err) => {
        Swal.fire('Unable to add banner', 'Your banner is not added. Please try again..', 'error')
      })
    }, err => {
      console.error(err);
    })
  }

}
