import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-footer',
  templateUrl: './main-footer.component.html',
  styleUrls: ['./main-footer.component.scss']
})
export class MainFooterComponent implements OnInit {
    @Input() footerColor: string;

    constructor(private router: Router) { }

    ngOnInit(): void {}

    browse() {
        this.router.navigate(['/catalog']);
    }

    goTo(route) {
        this.router.navigate([route]);
    }


    openFile(type) {
        const fileName = type == 'terms' ? 'terms_of_use_09_29_21.pdf' : 'Privacy+Policy.pdf';
        window.open("assets/media/homepage-assets/" + fileName);
    }
}
