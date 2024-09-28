import { DkCarousel } from './../models/dk-carousel';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Swal from 'sweetalert2';
import { CarouselService } from '../services/carousel.service';

@Component({
  selector: 'app-carousel-details',
  templateUrl: './carousel-details.component.html',
  styleUrls: ['./carousel-details.component.scss']
})
export class CarouselDetailsComponent implements OnInit {
  @Input() carousel;
  @Output() triggerGetCarouselList = new EventEmitter();

  _selectedMp4:any;

  get selectedMp4():string{
    let file = this.carousel as DkCarousel;

    const xfile = file.bannerUrlImage;   
    const fileExtension = xfile.split('.').pop();
    
    if(fileExtension === "mp4")
    {     
      this._selectedMp4 = file.bannerUrlImage;
    }
    else
     this._selectedMp4 = null;

     return this._selectedMp4; 
  }

  constructor(
    private carouselService: CarouselService
  ) { }

  ngOnInit(): void {
  }

  removeLogo(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Carousel will be deleted',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.carouselService.deleteCarousel(id).subscribe(res => {
          Swal.hideLoading()
          this.triggerGetCarouselList.emit();
          Swal.fire('Deleted!','Your carousel has been deleted.','success')
        }, (err) => {
          Swal.fire('Unable to Delete','Your carousel is not deleted. Please try again..','success')
        })
      }
      Swal.showLoading();
    })
  }

}
