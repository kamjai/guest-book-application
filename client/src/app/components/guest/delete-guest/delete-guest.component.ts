import { Component, OnInit } from '@angular/core';
import { GuestService } from '../../../services/guest.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-delete-guest',
  templateUrl: './delete-guest.component.html',
  styleUrls: ['./delete-guest.component.css']
})
export class DeleteGuestComponent implements OnInit {
  message;
  messageClass;
  foundGuest = false;
  processing = false;
  guest;
  currentUrl;

  constructor(
    private guestService: GuestService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  // Function to delete guests
  deleteGuest() {
    this.processing = true;
    this.currentUrl = this.activatedRoute.snapshot.params;
    this.guestService.deleteGuest(this.currentUrl.id).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        setTimeout(() => {
          this.router.navigate(['/guest']);
        }, 2000);
      }
    });
  }



  ngOnInit() {
    this.currentUrl = this.activatedRoute.snapshot.params;
    this.guestService.getSingleGuest(this.currentUrl.id).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
      } else {
        this.guest = {
          name: data.guest.name,
          email: data.guest.email,
          phone: data.guest.phone,
          createdBy: data.guest.createdBy,
          in_time: data.guest.in_time
        }
        this.foundGuest = true;
      }
    });
  }

}
