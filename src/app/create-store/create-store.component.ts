import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatChipList } from '@angular/material/chips';
import { Form, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CreateStoreService } from './create-store.service';
import { Router } from '@angular/router';
import { AuthorizeService } from '../../api-authorization/authorize.service';

@Component({
  selector: 'app-create-store',
  templateUrl: './create-store.component.html',
  styleUrls: ['./create-store.component.css']
})
export class CreateStoreComponent implements OnInit {
  @ViewChild('chipList') chipList: MatChipList;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  storeTags: any[] = [{ name: 'Example - just delete and replace with your own'} ]
  imageUrl: string;
  storeForm: FormGroup;

  get title(){ return this.storeForm.get('title'); }
  get subTitle(){ return this.storeForm.get('subTitle'); }
  get tag(){ return this.storeForm.get('tags'); }
  get imgUrl(){ return this.storeForm.get('imageUrl'); }
  get description(){ return this.storeForm.get('description'); }
  get storeTagsData() { return <FormArray>this.storeForm.get('storeTags'); }

  constructor(private fb: FormBuilder, private createStoreService: CreateStoreService, private router: Router,
             private authorizeService: AuthorizeService) { 
    this.storeForm = this.fb.group({
      userId: [this.authorizeService.getClaims().sub],
      title: ['', [Validators.required, Validators.minLength(3)]],
      subTitle: ['', [Validators.required, Validators.minLength(3)]],
      storeTags: this.fb.array(this.storeTags, this.validateArrayNotEmpty),
      imageUrl: [null, Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.storeForm.get('storeTags').statusChanges.subscribe(
      status => this.chipList.errorState = status === 'INVALID'
    );
  }

  validateArrayNotEmpty(c: FormControl) {
    if (c.value && c.value.length === 0) {
      return {
        validateArrayNotEmpty: { valid: false }
      };
    }
    return null;
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      const storeTags = <FormArray>this.storeForm.get('storeTags');
      storeTags.push(this.fb.control({ name: value.trim() }));
    }

    if (input){
      input.value = '';
    }
  }

  remove(form, index): void {
    form.get('storeTags').removeAt(index);
  }

  selectImageFile(event: any){
    const files = event.target.files;
    if (files.length === 0)
      return;

    const reader = new FileReader();
    
    reader.onload = (_event) => {
      this.imageUrl = reader.result as string;
      this.storeForm.patchValue({
        imageUrl: this.imageUrl
      });
      this.storeForm.get('imageUrl').updateValueAndValidity();
    }

    reader.readAsDataURL(files[0]);
  }

  onSubmit(){
    if(!this.storeForm.valid){
      this.showValidationMsg(this.storeForm);
      return;
    }

    this.createStoreService.createStore(this.storeForm.value).subscribe(result => { this.router.navigateByUrl("/profile") });
  }

  showValidationMsg(formGroup: FormGroup){
    for (const key in formGroup.controls) {
      if (formGroup.controls.hasOwnProperty(key)) {
        const control: FormControl = <FormControl>formGroup.controls[key];

        if (Object.keys(control).includes('controls')) {
          const formGroupChild: FormGroup = <FormGroup>formGroup.controls[key];
          this.showValidationMsg(formGroupChild);
        }

        control.markAsTouched();
      }
    }
  }
}
