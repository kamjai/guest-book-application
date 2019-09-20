import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { GuestService } from '../../../services/guest.service';

@Component({
  selector: 'app-edit-guest',
  templateUrl: './edit-guest.component.html',
  styleUrls: ['./edit-guest.component.css']
})
export class EditGuestComponent implements OnInit {

  message;
  messageClass;
  guest;
  form;
  newPost = false;
  processing = false;
  currentUrl;
  loading = true;

  constructor(
    private location: Location,
    private formBuilder: FormBuilder,

    private activatedRoute: ActivatedRoute,
    private guestService: GuestService,
    private router: Router
  ) {this.updateGuestSubmit();}


  updateGuestSubmit() {
    this.form = this.formBuilder.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
        this.validateEmail
      ])],
      name: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
        this.validateName
      ])],
      phone:['', Validators.compose([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        this.validatePhone

      ])]
    })
  }

  // Enable new guest form
  enableFormNewGuestForm() {
    this.form.get('name').enable();
    this.form.get('email').enable();
    this.form.get('phone').enable();

  }

  // Disable new guest form
  disableFormNewGuestForm() {
    this.form.get('name').disable();
    this.form.get('email').disable();
    this.form.get('phone').disable();

  }


  validateEmail(controls) {
    // Create a regular expression
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validateEmail': true }
    }
  }


  validateName(controls) {
    // Create a regular expression
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validateUsername': true }
    }
  }

  validatePhone(controls) {
    // Create a regular expression
    const regExp = new RegExp(/^[0-9]+$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validateUsername': true }
    }
  }


  // Function to Submit Update
  onGuestSubmitUpdate() {
    this.processing = true;
    this.disableFormNewGuestForm();


    this.guestService.editGuest(this.guest).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
        this.enableFormNewGuestForm();
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        setTimeout(() => {
          this.router.navigate(['/guest']);
        }, 100);
      }
    });
  }

  // Function to go back to previous page
  goBack() {
    this.location.back();
  }

  ngOnInit() {
    this.currentUrl = this.activatedRoute.snapshot.params;
    this.guestService.getSingleGuest(this.currentUrl.id).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
      } else {
        this.guest = data.guest;
        this.loading = false;
      }
    });

  }

}
