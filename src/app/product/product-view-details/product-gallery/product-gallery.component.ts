import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxGalleryAnimation, NgxGalleryComponent, NgxGalleryImage, NgxGalleryImageSize, NgxGalleryOptions, NgxGalleryPreviewComponent } from 'ngx-gallery-9';
import { GalleryViewerComponent } from './gallery-viewer/gallery-viewer.component';

@Component({
  selector: 'app-product-gallery',
  templateUrl: './product-gallery.component.html',
  styleUrls: ['./product-gallery.component.scss']
})
export class ProductGalleryComponent implements OnInit {
  @Input() imageUrls;
  @Input() description;
  @Input() productModel;
  @ViewChild(NgxGalleryComponent) ngxGalleryComponent;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  isEnlargeImage: boolean = false;
  
  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    this.setGallery(false, 400)
  }

  clickGallery(event){

      const dialogRef = this.dialog.open(GalleryViewerComponent, {
        data: {
          currentImage: this.galleryImages[this.ngxGalleryComponent.selectedIndex],
          currentIndex: this.ngxGalleryComponent.selectedIndex,
          galleryImages: this.galleryImages,
          description: this.description,
          productModel: this.productModel
        },
        width: '1051px',
        height: '665px',
        minWidth: '100px',
        autoFocus: false,
        hasBackdrop: true,
      });

      dialogRef.afterClosed().subscribe(result => {
      });
  }

  zoom(){
    this.isEnlargeImage = !this.isEnlargeImage
    this.setGallery(this.isEnlargeImage, this.isEnlargeImage ? 100 : 400)
  }

  setGallery(isEnlarge, height){
    this.galleryOptions = [
        {
            imageArrowsAutoHide: true,
            thumbnailsArrowsAutoHide: true,
            thumbnailsArrows: true,
            image: !isEnlarge, 
            height: height + 'px',
            width: '600px',
            thumbnailsColumns: 4,
            imageAnimation: NgxGalleryAnimation.Slide,
            imageSize: NgxGalleryImageSize.Contain,
            thumbnailSize: NgxGalleryImageSize.Contain
        },
        { "breakpoint": 500, "width": "400px", "height": "400px", "thumbnailsColumns": 3 },
        { "breakpoint": 300, "width": "100%", "height": "200px", "thumbnailsColumns": 2 },
        { "breakpoint": 200, "width": "100%", "height": "200px", "thumbnailsColumns": 2 }
    ];

    this.galleryImages = []
    this.imageUrls.forEach(element => {
      this.galleryImages.push( {
        small: element.imageUrl,
        medium: element.imageUrl,
        big: element.imageUrl
      })
    });
  }

}
