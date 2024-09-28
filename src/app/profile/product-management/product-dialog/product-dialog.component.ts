import { Y } from '@angular/cdk/keycodes';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { ProductManagementService } from '../services/product-management-service.component';
import { NgxImageCompressService } from 'ngx-image-compress';
import { HostListener } from "@angular/core";
import { AzureBlobStorageService, CONTENT } from 'src/app/services/azureblob.service';
import { environment } from "src/environments/environment";
import { Guid } from "guid-typescript";

@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.scss']
})

export class ProductDialogComponent implements OnInit {
  productFormGroup: FormGroup;
  selectedProduct;
  reader: FileReader;
  file: any;

  categories;

  // Declare height and width variables
  scrHeight: any;
  scrWidth: any;
  isMobileView: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ProductDialogComponent>,
    private managementService: ProductManagementService,
    private _sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private imageCompress: NgxImageCompressService,
    private azureBlobService: AzureBlobStorageService) {
    this.getScreenSize();
  }

  ngOnInit(): void {
    this.initalization()
    this.isMobileView = this.scrWidth < 515 ? true : false;
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.scrHeight = window.innerHeight;
    this.scrWidth = window.innerWidth;
  }

  initalization() {
    this.selectedProduct = this.data.product
    this.loadDropDownData()
    this.loadFormControl()
    this.formValueChanges()
  }

  formValueChanges(){
    this.productFormGroup.get('productImages').valueChanges.subscribe(() => {
      this.productFormGroup.markAsDirty();
    });

    this.productFormGroup.get('productFeatures').valueChanges.subscribe(() => {
      this.productFormGroup.markAsDirty();
    });

    (this.productFormGroup.get('productFeatures') as FormArray).controls.forEach(x  => {
      x.valueChanges.subscribe(() => {
        this.productFormGroup.markAsDirty();
      });
    });
  }

  loadDropDownData() {
    this.managementService.getCategories().subscribe((result: any) => {
      this.categories = result;

      if (this.data.isAdd) return;

      //set value after loading categories
      this.productFormGroup.controls.category.setValue(this.data.selectedProduct.category)
    });
  }

  loadFormControl() {
    this.productFormGroup = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      subTitle: new FormControl(null, [Validators.required]),
      model: new FormControl(null, [Validators.required]),
      capacity: new FormControl(null, [Validators.required]),
      price: new FormControl(null, [Validators.required]),
      stockKeepingUnit: new FormControl(null),
      discount: new FormControl(null),
      category: new FormControl(null, [Validators.required]),
      isLatest: new FormControl(false, [Validators.required]),
      origin: new FormControl(null, [Validators.required]),
      yearsWarranty: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),

      isPromoActive: new FormControl(false),
      isMiniBannerActive: new FormControl(false),
      isWarrantyActive: new FormControl(false),
      isFeatureActive: new FormControl(false),

      promoStickerImageUrl: new FormControl(null),
      miniBannerStickerImageUrl: new FormControl(null),
      warrantyStickerImageUrl: new FormControl(null),

      promoStickerName: new FormControl(null),
      miniBannerName: new FormControl(null),
      warrantyName: new FormControl(null),

      technologyHtmlContent: new FormControl(null),
      featureHtmlContent: new FormControl(null),
      specificationHtmlContent: new FormControl(null),

      productFeatures: new FormArray([]),
      productImages: new FormArray([])
    })

    if (!this.data.isAdd) {
      this.setValue(this.data.selectedProduct)
    }
  }

  setValue(productData) {
    this.productFormGroup.controls.title.setValue(productData.title)
    this.productFormGroup.controls.subTitle.setValue(productData.subTitle)
    this.productFormGroup.controls.model.setValue(productData.model)
    this.productFormGroup.controls.capacity.setValue(productData.capacity)
    this.productFormGroup.controls.price.setValue(productData.price)
    this.productFormGroup.controls.stockKeepingUnit.setValue(productData.stockKeepingUnit)
    this.productFormGroup.controls.discount.setValue(productData.discount)
    this.productFormGroup.controls.category.setValue(productData.category)
    this.productFormGroup.controls.isLatest.setValue(productData.isLatestModel)
    this.productFormGroup.controls.origin.setValue(productData.origin)
    this.productFormGroup.controls.yearsWarranty.setValue(productData.yearsWarranty)
    this.productFormGroup.controls.description.setValue(productData.description)

    this.productFormGroup.controls.isPromoActive.setValue(productData.isPromoActive)
    this.productFormGroup.controls.isMiniBannerActive.setValue(productData.isMiniBannerActive)
    this.productFormGroup.controls.isWarrantyActive.setValue(productData.isWarrantyActive)
    this.productFormGroup.controls.isFeatureActive.setValue(productData.isFeatureActive)

    this.productFormGroup.controls.promoStickerImageUrl.setValue(productData.promoStickerImageUrl)
    this.productFormGroup.controls.miniBannerStickerImageUrl.setValue(productData.miniBannerStickerImageUrl)
    this.productFormGroup.controls.warrantyStickerImageUrl.setValue(productData.warrantyStickerImageUrl)

    this.productFormGroup.controls.promoStickerName.setValue(productData.promoStickerName)
    this.productFormGroup.controls.miniBannerName.setValue(productData.miniBannerName)
    this.productFormGroup.controls.warrantyName.setValue(productData.warrantyName)

    this.productFormGroup.controls.technologyHtmlContent.setValue(productData.technologyHtmlContent)
    this.productFormGroup.controls.featureHtmlContent.setValue(productData.featureHtmlContent)
    this.productFormGroup.controls.specificationHtmlContent.setValue(productData.specificationHtmlContent)

    let productImages = (this.productFormGroup.get('productImages') as FormArray).controls
    productData.productImages.forEach(productImage => {
      let productImageFormGroup = new FormGroup({
        catalogId: new FormControl(productImage.catalogId),
        id: new FormControl(productImage.id),
        imageUrl: new FormControl(productImage.imageUrl),
        rowVersion: new FormControl(productImage.rowVersion),
      });

      productImages.push(productImageFormGroup)
    });

    let productFeatures = (this.productFormGroup.get('productFeatures') as FormArray).controls
    productData.productFeatures.forEach(productFeature => {
      let productFeatureFormGroup = new FormGroup({
        catalogId: new FormControl(productFeature.catalogId),
        id: new FormControl(productFeature.id),
        name: new FormControl(productFeature.name),
        imageUrl: new FormControl(productFeature.imageUrl),
        rowVersion: new FormControl(productFeature.rowVersion),
      });
      
      productFeatures.push(productFeatureFormGroup)
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  onClickSave() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Product details will be saved.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, save it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.save();
      }
      Swal.showLoading();
    })
  }

  save() {
    if (this.data.isAdd) {

      let createObj = {
        title: this.productFormGroup.value.title,
        subTitle: this.productFormGroup.value.subTitle,
        model: this.productFormGroup.value.model,
        capacity: this.productFormGroup.value.capacity,
        price: this.productFormGroup.value.price,
        stockKeepingUnit: this.productFormGroup.value.stockKeepingUnit,
        discount: this.productFormGroup.value.discount,
        category: this.productFormGroup.value.category,
        isLatest: this.productFormGroup.value.isLatest,
        origin: this.productFormGroup.value.origin,
        yearsWarranty: this.productFormGroup.value.yearsWarranty,
        description: this.productFormGroup.value.description,

        isPromoActive: this.productFormGroup.value.isPromoActive,
        isMiniBannerActive: this.productFormGroup.value.isMiniBannerActive,
        isWarrantyActive: this.productFormGroup.value.isWarrantyActive,
        isFeatureActive: this.productFormGroup.value.isFeatureActive,

        promoStickerImageUrl: this.productFormGroup.value.promoStickerImageUrl,
        miniBannerStickerImageUrl: this.productFormGroup.value.miniBannerStickerImageUrl,
        warrantyStickerImageUrl: this.productFormGroup.value.warrantyStickerImageUrl,

        promoStickerName: this.productFormGroup.value.promoStickerName,
        miniBannerName: this.productFormGroup.value.miniBannerName,
        warrantyName: this.productFormGroup.value.warrantyName,

        technologyHtmlContent: this.productFormGroup.value.technologyHtmlContent,
        featureHtmlContent: this.productFormGroup.value.featureHtmlContent,
        specificationHtmlContent: this.productFormGroup.value.specificationHtmlContent,

        productImages: [],
        productFeatures: []
      }
      
      let productImages = (this.productFormGroup.get('productImages') as FormArray).controls
      productImages.forEach(productImage => {
        createObj.productImages.push(productImage.value)
      });

      let productFeatures = (this.productFormGroup.get('productFeatures') as FormArray).controls
      productFeatures.forEach(productFeature => {
        createObj.productFeatures.push(productFeature.value)
      });

      Swal.fire('Creating product')
      Swal.showLoading()
      // api call
      this.managementService.createCatalogItem(createObj).subscribe(r => {
        Swal.hideLoading()
        Swal.fire('Created new product!', 'Your product has been added.', 'success')
        this.dialogRef.close(this.productFormGroup.value);
      }, (err) => {
        Swal.fire('Unable to add product', 'Your product is not added. Please try again..', 'error')
      })
    } else {
      //mapping on update
      let obj = this.data.selectedProduct;
      obj.title = this.productFormGroup.value.title;
      obj.subTitle = this.productFormGroup.value.subTitle;
      obj.model = this.productFormGroup.value.model;
      obj.capacity = this.productFormGroup.value.capacity;
      obj.price = this.productFormGroup.value.price;
      obj.stockKeepingUnit = this.productFormGroup.value.stockKeepingUnit;
      obj.discount = this.productFormGroup.value.discount;
      obj.category = this.productFormGroup.value.category;
      obj.isLatest = this.productFormGroup.value.isLatest;
      obj.origin = this.productFormGroup.value.origin;
      obj.yearsWarranty = this.productFormGroup.value.yearsWarranty;
      obj.description = this.productFormGroup.value.description;

      obj.isPromoActive = this.productFormGroup.value.isPromoActive;
      obj.isMiniBannerActive = this.productFormGroup.value.isMiniBannerActive;
      obj.isWarrantyActive = this.productFormGroup.value.isWarrantyActive;
      obj.isFeatureActive = this.productFormGroup.value.isFeatureActive,

      obj.promoStickerImageUrl = this.productFormGroup.value.promoStickerImageUrl;
      obj.miniBannerStickerImageUrl = this.productFormGroup.value.miniBannerStickerImageUrl;
      obj.warrantyStickerImageUrl = this.productFormGroup.value.warrantyStickerImageUrl;

      obj.promoStickerName = this.productFormGroup.value.promoStickerName;
      obj.miniBannerName = this.productFormGroup.value.miniBannerName;
      obj.warrantyName = this.productFormGroup.value.warrantyName;

      obj.technologyHtmlContent = this.productFormGroup.value.technologyHtmlContent;
      obj.featureHtmlContent = this.productFormGroup.value.featureHtmlContent;
      obj.specificationHtmlContent = this.productFormGroup.value.specificationHtmlContent;

      obj.productFeatures = [];
      obj.productImages = [];

      let productImages = (this.productFormGroup.get('productImages') as FormArray).controls
      productImages.forEach(productImage => {
        obj.productImages.push(productImage.value)
      });

      let productFeatures = (this.productFormGroup.get('productFeatures') as FormArray).controls
      productFeatures.forEach(productFeature => {
        obj.productFeatures.push(productFeature.value)
      });

      Swal.fire('Updating product')
      Swal.showLoading()
      // api call
      this.managementService.updateCatalogItem(obj.id, obj).subscribe(r => {
        Swal.hideLoading()
        Swal.fire('Updated product!', 'Your product has been updated.', 'success')
        this.dialogRef.close(this.productFormGroup.value);
      }, (err) => {
        Swal.fire('Unable to update product', 'Your product is not updated. Please try again..', 'error')
      })
    }
  }

  triggerUpload(fileId) {
    let element = document.getElementById(fileId) as HTMLInputElement;
    element.click();
  }

  onStickerUpload(event, type) {
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);

    var validFileExtensions = ["image/png", "image/jpg", "image/jpeg", "image/gif"];
    var fileType = event.target.files[0].type;
    
    if (!validFileExtensions.includes(fileType)) {
      Swal.fire('Invalid File Type!', 'Only JPG, JPEG, PNG and GIF files are allowed', 'error')
      return false;
    }

    reader.onload = (e: any) => {
      var image = new Image();
      image.src = e.target.result as string;

      image.onload = (x: any) => {
        if (type == 'promo' && (image.width != 262 || image.height != 68)) {
          Swal.fire('Invalid Promo Sticker!', 'Image File Dimension must be 262x68px', 'error')
        } else if (type == 'mini_banner' && (image.width != 228 || image.height != 58)) {
          Swal.fire('Invalid Mini Banner Sticker!', 'Image File Dimension must be 228x58px', 'error')
        } else if (type == 'warranty' && (image.width != 110 || image.height != 110)) {
          Swal.fire('Invalid Warranty Sticker!', 'Image File Dimension must be 110x110px', 'error')
        } else if (type == 'feature' && (image.height < 90)) {
          Swal.fire('Invalid Warranty Sticker!', 'Image File Dimension must be atleast 90px', 'error')
        } else {
          this.uploadSticker(event, type);
        }
      };
    };
  }

  uploadSticker(event, type) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Image will be uploaded.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, upload it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.file = event.target.files[0];
        var fileName: any;
        fileName = Guid.create().toString() + this.file['name'];
        let fileUri = this.azureBlobService.tempFileStorageUri + fileName;

        if (type == 'promo') {
          let promoStickerData = {
            containerName: environment.azurestorage.tempBlobContainer,
            file: this.file,
            filename: fileName
          }

          this.azureBlobService.uploadFile(promoStickerData).then((res: string) => {
            this.productFormGroup.controls.promoStickerImageUrl.setValue(fileUri);

          }, err => {
            console.error(err);
          })
        }
        else if (type == 'mini_banner') {
          let miniBannerStickerData = {
            containerName: environment.azurestorage.tempBlobContainer,
            file: this.file,
            filename: fileName
          }

          this.azureBlobService.uploadFile(miniBannerStickerData).then((res: string) => {
            this.productFormGroup.controls.miniBannerStickerImageUrl.setValue(fileUri);

          }, err => {
            console.error(err);
          })
        }
        else if (type == 'warranty') {
          let warrantyStickerData = {
            containerName: environment.azurestorage.tempBlobContainer,
            file: this.file,
            filename: fileName
          }

          this.azureBlobService.uploadFile(warrantyStickerData).then((res: string) => {
            this.productFormGroup.controls.warrantyStickerImageUrl.setValue(fileUri);

          }, err => {
            console.error(err);
          })

        } else if (type == 'thumbnail') {
          let thumbnailData: CONTENT = {
            containerName: environment.azurestorage.tempBlobContainer,
            file: this.file,
            filename: fileName
          }

          this.azureBlobService.uploadFile(thumbnailData).then((res: string) => {
            let productImageFormGroup = new FormGroup({
              imageUrl: new FormControl(fileUri)
            });
            (this.productFormGroup.get('productImages') as FormArray).push(productImageFormGroup);

          }, err => {
            console.error(err);
          })

        } else if (type == 'feature') {

          let featureStickerData: CONTENT = {
            containerName: environment.azurestorage.tempBlobContainer,
            file: this.file,
            filename: fileName
          }

          this.azureBlobService.uploadFile(featureStickerData).then((res: string) => {
            let productFeatureFormGroup = new FormGroup({
              imageUrl: new FormControl(fileUri),
              name: new FormControl(null)
            });
            (this.productFormGroup.get('productFeatures') as FormArray).push(productFeatureFormGroup);

          }, err => {
            console.error(err);
          })

        }

        this.productFormGroup.markAsDirty();
        this.cdr.detectChanges();
        Swal.fire('Uploaded!', 'The Image has been uploaded.', 'success')
      }
    })
  }

  removeSticker(type: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This sticker will be deleted',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        if (type == 'promo') {
          this.productFormGroup.controls.promoStickerImageUrl.setValue(null);
          this.productFormGroup.controls.isPromoActive.setValue(false);
        } else if (type == 'mini_banner') {
          this.productFormGroup.controls.miniBannerStickerImageUrl.setValue(null);
          this.productFormGroup.controls.isMiniBannerActive.setValue(false);
        } else if (type == 'warranty') {
          this.productFormGroup.controls.warrantyStickerImageUrl.setValue(null);
          this.productFormGroup.controls.isWarrantyActive.setValue(false);
        }

      }
    })
  }

  removeProductImages(index: any, imageUrl: string, type: any) {

    if (type == 'product-features' && this.productFormGroup.get('isFeatureActive').value)
      Swal.fire('Unable to delete feature sticker', 'disable the feature sticker first', 'error')
    else {

      Swal.fire({
        title: 'Are you sure?',
        text: type == 'product-images' ? 'This product image will be deleted' : 'This sticker will be deleted',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {

          // let fileName = imageUrl.slice(imageUrl.lastIndexOf("/") + 1, imageUrl.length);
          // let fileData: CONTENT = {
          //   containerName: environment.azurestorage.tempBlobContainer,
          //   file: null,
          //   filename: imageUrl
          // };

          if (type == 'product-images') {
            // this.azureBlobService.deleteBlob(fileData).then((res: string) => {

            // }, err => {
            //   console.error(err);
            // });

            (this.productFormGroup.get('productImages') as FormArray).removeAt(index);
          } else {
            (this.productFormGroup.get('productFeatures') as FormArray).removeAt(index);
            if (this.productFormGroup.controls['productFeatures']['controls'].length <= 0) {
              this.productFormGroup.controls.isPromoActive.setValue(false);
            }
          }

        }
      })

    }

  }

  onSwitchToggle(event, type) {
    if(type == 'promo'){
      this.productFormGroup.controls.isPromoActive.setValue(event.checked);
    } else if (type == 'mini_banner') {
      this.productFormGroup.controls.isMiniBannerActive.setValue(event.checked);
    } else if (type == 'warranty') {
      this.productFormGroup.controls.isWarrantyActive.setValue(event.checked);
    } else if (type == 'feature') {
      this.productFormGroup.controls.isFeatureActive.setValue(event.checked);
    }

    this.productFormGroup.markAsDirty();
  }

  scroll(el: HTMLElement) {
      el.scrollIntoView({ behavior: 'smooth' });
  }
}