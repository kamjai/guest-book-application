import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { GuestService } from '../../services/guest.service';



@Component({
  selector: 'app-guest',
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.css']
})
export class GuestComponent implements OnInit {

  messageClass;
  message;
  newPost = false;
  loadingGuests = false;
  form;
  guest;
  currentUrl;
  processing = false;
  username;
  guestPosts;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,

    private guestService: GuestService
  ) {
    this.createNewGuestForm();
  }

  // Function to create new guest form
  createNewGuestForm() {
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




  // Function to display new guest form
  newGuestForm() {
    this.newPost = true;
  }

  // Reload guests on current page
  reloadGuests() {
    this.loadingGuests = true;
   this.getAllGuests();
    setTimeout(() => {
      this.loadingGuests = false;
    }, 100);
  }



  // Function to submit a new guest post
  onGuestSubmit() {
    this.processing = true;
    this.disableFormNewGuestForm();

    // Create guest object from form fields
    const guest = {
      name: this.form.get('name').value,
      email: this.form.get('email').value,
      phone: this.form.get('phone').value,
    }

    // Function to save guest into database
    this.guestService.newGuest(guest).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
        this.enableFormNewGuestForm();
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        this.getAllGuests();
        setTimeout(() => {
          this.newPost = false;
          this.processing = false;
          this.message = false;
          this.form.reset();
          this.enableFormNewGuestForm();
        }, 100);
      }
    });

  }

  //Set out time of guest
  updateGuestTimeSubmit(id) {
    let input = {
      id: id
    };
    this.processing = true;

    this.guestService.updateOutTime(input).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        window.location.reload();
      }
    });
  }

  // Function to go back to previous page
  goBack() {
    window.location.reload();
  }

  // Function to get all guests from the database
  getAllGuests() {
    this.currentUrl = this.activatedRoute.snapshot.params;
    this.guestService.getAllGuests().subscribe(data => {
      this.guestPosts = data.guests;
    });
  }



  ngOnInit() {
    this.getAllGuests();
  }

}
