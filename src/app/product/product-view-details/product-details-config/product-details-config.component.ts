import { Component, OnInit } from '@angular/core';
import { AngularEditorConfig } from "@kolkov/angular-editor";

@Component({
  selector: 'app-product-details-config',
  templateUrl: './product-details-config.component.html',
  styleUrls: ['./product-details-config.component.scss']
})
export class ProductDetailsConfigComponent implements OnInit {
  htmlContent ='';

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: "15rem",
    minHeight: "5rem",
    placeholder: "Enter text here...",
    translate: "no",
    defaultParagraphSeparator: "p",
    defaultFontName: "Arial",
    toolbarHiddenButtons: [],
    sanitize: false, //display => CSS
    customClasses: [
      {
        name: "quote",
        class: "quote"
      },
      {
        name: "redText",
        class: "redText"
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1"
      }
    ]
  };

  constructor() { }

  ngOnInit(): void {
  }

}
