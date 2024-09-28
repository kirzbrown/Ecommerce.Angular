import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxGalleryAnimation, NgxGalleryComponent, NgxGalleryImage, NgxGalleryImageSize, NgxGalleryOptions } from 'ngx-gallery-9';

@Component({
  selector: 'app-gallery-viewer',
  templateUrl: './gallery-viewer.component.html',
  styleUrls: ['./gallery-viewer.component.scss']
})
export class GalleryViewerComponent implements OnInit {

  @ViewChild(NgxGalleryComponent) ngxGalleryComponent;
  previewIndex: number = 0;
  galleryOptionsViewer: NgxGalleryOptions[];
  galleryImagesViewer: NgxGalleryImage[];
  defaultImageStreamer = [
    {model: 'MC30YVM7', imageUrl:  'assets/media/products/add-on/add_on_mc30y.jpg'},
    {model: 'MCK55TVM6', imageUrl:  'assets/media/products/add-on/add_on_mck55.jpg'},
    {model: 'MC55UVM6', imageUrl:  'assets/media/products/add-on/add_on_mc55.jpg'},
    {model: 'MC40UVM6', imageUrl:  'assets/media/products/add-on/add_on_mc40.jpg'},
    {model: 'MC30VVM-H', imageUrl:  'assets/media/products/add-on/add_on_mc30v.jpg'},
  ]
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, 
  private dialogRef: MatDialogRef<GalleryViewerComponent>,) { }

  ngOnInit(): void {

    this.setGallery()
  }

  changePreview(index){
    this.previewIndex = index;
    this.ngxGalleryComponent.show(index)
  } 

  clickGallery(){
     this.previewIndex = this.ngxGalleryComponent.selectedIndex;
  }

  setGallery(){
    this.previewIndex = this.data.currentIndex;
    this.galleryOptionsViewer = [
        {
            height: '600px',
            width: '600px',
            imageAnimation: NgxGalleryAnimation.Slide,
            imageSize: NgxGalleryImageSize.Contain,
            preview: false,
            startIndex: this.data.currentIndex,
            thumbnails: false,
            imageArrowsAutoHide: true,
            imageArrows: false
        },
        // max-width 800
        {
            breakpoint: 800,
            width: '100%',
            height: '600px',
            imagePercent: 80,
            thumbnailsPercent: 20,
            thumbnailsMargin: 20,
            thumbnailMargin: 20,
        },
        // max-width 400
        {
            breakpoint: 400,
            preview: false
        }
    ];

    this.galleryImagesViewer = this.data.galleryImages


    // let foundInDefaultThumbnail = this.defaultImageStreamer.find(d => d.model == this.data.productModel)
    // let foundInGallery = this.galleryImagesViewer.find(d => d.small == foundInDefaultThumbnail.imageUrl)
    // if(foundInDefaultThumbnail && !foundInGallery){
    //   this.galleryImagesViewer.push( {
    //     small: foundInDefaultThumbnail.imageUrl,
    //     medium: foundInDefaultThumbnail.imageUrl,
    //     big: foundInDefaultThumbnail.imageUrl
    //   })
    // }
  }

  goTo(isBack: boolean){
    if(isBack){
      this.ngxGalleryComponent.showPrev()
    } else {
      this.ngxGalleryComponent.showNext()
    }
  }

}
