import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Guid } from 'guid-typescript';
import { AzureBlobStorageService, CONTENT } from 'src/app/services/azureblob.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { ManagementService } from '../../../profile/category-management/services/management-service.component';

@Component({
  selector: 'app-category-dialog',
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.scss']
})
export class CategoryDialogComponent implements OnInit {
  categoryFormGroup: FormGroup;
  selectedCategory;

  //file upload
  fileImageUrl: any;
  fileNameImageUrl: string;
  fileBased64ImageUrl: string;
  
  fileBannerUrl: any;
  fileNameBannerUrl: string;
  fileBased64BannerUrl: string;
  file: any;
  bannerImage;
  junkDocuments: any;
  categoryImage: any;

  
  constructor( @Inject(MAT_DIALOG_DATA) public data: any, 
              private dialogRef: MatDialogRef<CategoryDialogComponent>,
              private managementService: ManagementService,
              private _sanitizer: DomSanitizer,
              private azureBlobService: AzureBlobStorageService,
              private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.initalization()
  }
  
  initalization(){
    this.selectedCategory = this.data.category
    this.loadFormControl()
  }

  loadFormControl(){
    this.categoryFormGroup = new FormGroup({
      // id: new FormControl(Math.floor(Math.random() * 100)),
      name: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      fileBased64ImageUrl: new FormControl(null),
      htmlContent: new FormControl(null),
      catalogFilter: new FormControl("Category"), //hard coded needed to post
      categoryNavigationId: new FormControl(1), //hard coded needed to post
    })

    if(!this.data.isAdd){
      this.setValue(this.data.selectedCategory)
    }
  }

  setValue(categoryData){
    this.categoryFormGroup.controls.name.setValue(categoryData.name)
    this.categoryFormGroup.controls.description.setValue(categoryData.description)
    this.categoryFormGroup.controls.fileBased64ImageUrl.setValue(categoryData.imageUrl)
    this.categoryFormGroup.controls.htmlContent.setValue(categoryData.htmlContent)

    //file upload
    this.categoryImage = { 
      imageUrl : categoryData.imageUrl
    } 
    this.bannerImage = { 
      imageUrl : categoryData.bannerImageUrl
    }
  }


  closeDialog(){
    this.dialogRef.close();
  }

  save(){

    //change value of banner
    this.categoryFormGroup.controls.fileBased64ImageUrl.setValue(this.fileBased64ImageUrl)

    if(this.data.isAdd){
      let createObj = {
        name: this.categoryFormGroup.value.name,
        description: this.categoryFormGroup.value.description,
        base64ImageUrl: this.categoryImage?.imageUrl,
        htmlContent: this.categoryFormGroup.value.htmlContent,
        catalogFilter: this.categoryFormGroup.value.catalogFilter,
        categoryNavigationId: this.categoryFormGroup.value.categoryNavigationId
      }
      
      //api call
      this.managementService.createCategory(createObj).subscribe(r => {
        Swal.fire('Created new category!','Your category has been added.','success')
        this.dialogRef.close(this.categoryFormGroup.value); 
      }, (err) => {
        Swal.fire('Unable to add category','Your category is not added. Please try again..','error')
      })
    } else {
      //mapping on update
      let obj = this.data.selectedCategory;
      obj.name = this.categoryFormGroup.value.name;
      obj.description = this.categoryFormGroup.value.description;
      obj.htmlContent = this.categoryFormGroup.value.htmlContent;
      obj.base64ImageUrl = this.categoryImage?.imageUrl;
      
      //api call
      this.managementService.updateCategory(obj.id, obj).subscribe(r => {
        Swal.fire('Updated category!','Your category has been updated.','success')
        this.dialogRef.close(this.categoryFormGroup.value); 
      }, (err) => {
        Swal.fire('Unable to update category','Your category is not updated. Please try again..','error')
      })
    }
  }

  //file upload
  onFileUpload(event){
    var  fileName : any;
    this.file = event.target.files[0];
    fileName = Guid.create().toString() + this.file['name'];

    if (event.target.files && event.target.files[0]) {
      let fileUri = this.azureBlobService.tempFileStorageUri + fileName;

        let data: CONTENT = {
          containerName: environment.azurestorage.tempBlobContainer, // desired container name
          file: this.file ,  // file to upload
          filename: fileName // filename as desired with path
        }
        this.azureBlobService.uploadFile(data).then((res: string) => {
          this.categoryImage = {
            id: Math.floor(Math.random() * 100),
            name: fileName,
            catalogId: 0, 
            imageUrl: fileUri
          };
        }, err => {
          console.error(err);
        })
     }
    
  }


  removeFile(image){
    if(image.isSave){ 
      let submissionDocument = {
        documentTypeId: image.documentTypeId,
        submissionDocumentId:  image.id,
        base64: image.fileName,
        fileName:  image.fileName,
        description:  image.fileName,
      }
      let junkDocument = this.junkDocuments.find(x => x.submissionDocumentId == submissionDocument.submissionDocumentId)
      if(junkDocument == undefined){
        this.junkDocuments.push(submissionDocument)
      }

      this.categoryImage = null
    } else {
      this.categoryImage = null
    }

    // if(this.multiProductImages.length < 1)
    //   this.productFormGroup.controls.inputProductImages.setValue("")
  }

  convertFileToBased64(file, fileBased64Variable){
    this.managementService.getBased64File(file).subscribe( result => {
      // console.log("convertFileToBased64", result)
      this[fileBased64Variable] = result;
    })
  }

  triggerUpload(fileId) {
    let element = document.getElementById(fileId) as HTMLInputElement;
    element.click();
  }

  getImage(fileBased64Variable){
    if(!this[fileBased64Variable]){return null;}
    return this[fileBased64Variable].includes("http") ? this[fileBased64Variable] : this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + this[fileBased64Variable]);
  }

}