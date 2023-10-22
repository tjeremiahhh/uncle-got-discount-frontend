import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AuthenticationService } from '../../authentication/authenticate/authentication.service';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Reservation } from 'src/app/business-listing/model/business-listing.model';
import { ReservationsService } from './reservations.service';
import { HttpParams } from '@angular/common/http';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-my-reservations',
  templateUrl: './my-reservations.component.html',
  styleUrls: ['./my-reservations.component.less']
})
export class MyReservationComponent implements OnInit {
  currentUser: any;

  profileForm!: UntypedFormGroup;

  selectedTab: number = 0;

  type: string = 'upcoming';
  // reservations: Reservation[] = [];

  reservations: Reservation[] = [
    {
      id: 1,
      businessListingId: 1,
      businessListingDiscountsId: 1,
      noOfDiners: 1,
      date: '2023-10-03 11:00PM',
      specialRequests: "string",
    },
    {
      id: 2,
      businessListingId: 2,
      businessListingDiscountsId: 1,
      noOfDiners: 1,
      date: '2023-10-03 11:00PM',
      specialRequests: "string",
    },
    {
      id: 3,
      businessListingId: 3,
      businessListingDiscountsId: 1,
      noOfDiners: 1,
      date: '2023-10-03 11:00PM',
      specialRequests: "string",
    },
    {
      id: 4,
      businessListingId: 4,
      businessListingDiscountsId: 1,
      noOfDiners: 1,
      date: '2023-10-03 11:00PM',
      specialRequests: "string",
    }
  ];

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private reservationService: ReservationsService,
    private fb: FormBuilder,
    private modalService: NzModalService,
  ) {
    this.type = router.url.includes('upcoming') ? 'upcoming' : 'history'
  }

  ngOnInit() {
    this.currentUser = this.authenticationService.currentUser;

    this.profileForm = this.fb.group({
      name: [this.currentUser.name, [Validators.required]],
      emailAddress: [this.currentUser.emailAddress, [Validators.required]],
      password: [this.currentUser.password, [Validators.required]],
      phoneNumber: [this.currentUser.phoneNumber, [Validators.required]]
    })

    let params = new HttpParams;
    params = params.set('id', this.currentUser.id);

    if (this.type === 'history') {
      this.reservationService.getAllHistoricalReservations(params).subscribe({
        next: (res: any) => {
          this.reservations = res;
        }
      });
    }
    else {
      this.reservationService.getAllUpcomingReservations(params).subscribe({
        next: (res: any) => {
          this.reservations = res;
        }
      });
    }
  }

}
