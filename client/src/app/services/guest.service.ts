import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class GuestService {

  options;
  domain = this.authService.domain;

  constructor(
    private authService: AuthService,
    private http: Http
  ) { }

  // Function to create headers, add token, to be used in HTTP requests
  createAuthenticationHeaders() {
    this.authService.loadToken();

    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json',
        'authorization': this.authService.authToken
      })
    });
    console.log(this.options);
  }

  // Function to create a new guest post
  newGuest(guest) {
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'guests/newGuest', guest, this.options).map(res => res.json());
  }

  // Function to get all guest from the database
  getAllGuests() {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'guests/allGuests', this.options).map(res => res.json());
  }

  // Function to get the guest using the id
  getSingleGuest(id) {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'guests/singleGuest/' + id, this.options).map(res => res.json());
  }

  // Function to edit/update guest post
  editGuest(guest) {
    this.createAuthenticationHeaders();
    return this.http.put(this.domain + 'guests/updateGuest/', guest, this.options).map(res => res.json());
  }

  // Function to delete a guest
  deleteGuest(id) {
    this.createAuthenticationHeaders();
    return this.http.delete(this.domain + 'guests/deleteGuest/' + id, this.options).map(res => res.json());
  }

  // Function to update out time of guest
  updateOutTime(data){
    this.createAuthenticationHeaders();
    return this.http.put(this.domain + 'guests/updateOutTime/' + data.id+'?token='+this.authService.authToken, this.options).map(res => res.json());

  }


}
