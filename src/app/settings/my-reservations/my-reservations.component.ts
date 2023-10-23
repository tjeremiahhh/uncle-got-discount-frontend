import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AuthenticationService } from '../../authentication/authenticate/authentication.service';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { BusinessListingDescription, BusinessListingDiscounts, Reservation } from 'src/app/business-listing/model/business-listing.model';
import { ReservationsService } from './reservations.service';
import { HttpParams } from '@angular/common/http';
import { NzModalService } from 'ng-zorro-antd/modal';
import { EditReservationComponent } from 'src/app/reservation/edit-reservation/edit-reservation.component';
import { BusinessListingService } from 'src/app/business-listing/business-listing.service';

@Component({
  selector: 'app-my-reservations',
  templateUrl: './my-reservations.component.html',
  styleUrls: ['./my-reservations.component.less']
})
export class MyReservationComponent implements OnInit {
  currentUser: any;

  profileForm!: UntypedFormGroup;

  businessListingDescriptionMaster: any;

  selectedTab: number = 0;

  type: string = 'upcoming';
  // reservations: Reservation[] = [];



  reservations: Reservation[] = [
    // {
    //   id: 1,
    //   businessListingId: 1,
    //   businessListingDiscountsId: 1,
    //   noOfDiners: 1,
    //   date: '2023-10-03 11:00PM',
    //   specialRequests: "string",
    // },
    // {
    //   id: 2,
    //   businessListingId: 2,
    //   businessListingDiscountsId: 1,
    //   noOfDiners: 1,
    //   date: '2023-10-03 11:00PM',
    //   specialRequests: "string",
    // },
    // {
    //   id: 3,
    //   businessListingId: 3,
    //   businessListingDiscountsId: 1,
    //   noOfDiners: 1,
    //   date: '2023-10-03 11:00PM',
    //   specialRequests: "string",
    // },
    // {
    //   id: 4,
    //   businessListingId: 4,
    //   businessListingDiscountsId: 1,
    //   noOfDiners: 1,
    //   date: '2023-10-03 11:00PM',
    //   specialRequests: "string",
    // }
  ];

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private reservationService: ReservationsService,
    private businessListingService: BusinessListingService,
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
    params = params.set('userId', this.currentUser.id);

    if (this.type === 'history') {
      this.reservationService.getAllHistoricalReservations(params).subscribe({
        next: (res: any) => {
          this.reservations = res;
          this.getBusinessListingAndDiscounts()
        }
      });
    }
    else {
      this.reservationService.getAllUpcomingReservations(params).subscribe({
        next: (res: any) => {
          this.reservations = res;
          this.getBusinessListingAndDiscounts()
        }
      });
    }

    // On load, call api to get details 
    // Getting master list of metadata
    this.businessListingService.getBusinessListingDescriptionDetails().subscribe({
      next: (res: any) => {
        this.businessListingDescriptionMaster = res;
      }
    })
  }

  getBusinessListingAndDiscounts() {
    for (let reservation of this.reservations) {
      if (reservation.businessListingDiscountsId != null) {
        let params = new HttpParams;
        params = params.set('discountId', reservation.businessListingDiscountsId);

        this.reservationService.getBusinessListingAndDiscount(params).subscribe({
          next: (res: any) => {
            reservation.businessListing = res.businessListing;
            reservation.businessListingId = res.businessListing.id
            reservation.businessListingDiscount = this.processBusinessListingDiscounts(res.businessListingDiscounts);

            // reservation.businessListingDescription = this.processBusinessListingDescription(res.businessListingDescription);
            
          }
        });
      }
    }
  }

  // Mapping the data with master list: businessListingDescription
  processBusinessListingDescription(businessListingDescription: BusinessListingDescription) {
    const cuisineIdMap = businessListingDescription.cuisines?.split("|");
    const cuisineList = this.businessListingDescriptionMaster.cuisines.filter((a: any) =>
      cuisineIdMap?.includes(a.id.toString())
    );

    businessListingDescription.cuisines = cuisineList.map((val: any) => val.cuisine);

    return businessListingDescription;
  }


  // Mapping the data with master list: businessListingDescription
  processBusinessListingDiscounts(businessListingDiscounts: BusinessListingDiscounts) {
    businessListingDiscounts.day = this.businessListingDescriptionMaster.days.find((val: any) => val.id === businessListingDiscounts.dayId);
    businessListingDiscounts.time = this.businessListingDescriptionMaster.timings.find((val: any) => val.id === businessListingDiscounts.timingsId).time;
    businessListingDiscounts.discountInPercent = this.businessListingDescriptionMaster.discounts.find((val: any) => val.id === businessListingDiscounts.discountsId).discount;
   
    return businessListingDiscounts;
  }

  // onEdit(reservationId: number | undefined, businessId: number | undefined) {
  //   const modal = this.modalService.create({
  //     nzTitle: "<b class='text-[20px]'>edit reservation</b>",
  //     nzContent: EditReservationComponent,
  //     nzWidth: "1000px",
  //     nzFooter: null,
  //     nzData: {
  //       businessId: businessId,
  //       reservationId: reservationId
  //     }
  //   })
  // }

}
