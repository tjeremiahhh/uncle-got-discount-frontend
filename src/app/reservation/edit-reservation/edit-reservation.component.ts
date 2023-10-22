import { Component, Input, OnInit } from '@angular/core';
import { BusinessListingService } from '../../business-listing/business-listing.service';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { BusinessListing, BusinessListingDescription, BusinessListingDiscounts, BusinessListingSpecialConditions, Reservation } from '../../business-listing/model/business-listing.model';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NzModalComponent, NzModalService } from 'ng-zorro-antd/modal';
import { AuthenticationService } from 'src/app/authentication/authenticate/authentication.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DatePipe } from '@angular/common';
import { ReservationService } from '../reservation.service';
import { ViewBuinessListingComponent } from 'src/app/business-listing/view-business-listing/view-business-listing.component';

@Component({
  selector: 'app-reservation',
  templateUrl: './edit-reservation.component.html',
  styleUrls: ['./edit-reservation.component.less']
})
export class EditReservationComponent implements OnInit {
  @Input() businessId: string | null = '1';
  @Input() reservationId: string = '7';

  reservationGroup!: UntypedFormGroup;

  showReservationModal: boolean = false;

  businessListing: BusinessListing = new BusinessListing();
  businessListingDescription: BusinessListingDescription = new BusinessListingDescription();
  businessListingSpecialConditions: BusinessListingSpecialConditions = new BusinessListingSpecialConditions();
  businessListingDiscounts: BusinessListingDiscounts[] = [];
  businessListingDescriptionMaster: any;

  discountsDisplayed: BusinessListingDiscounts[] = [];
  selectedDiscount: BusinessListingDiscounts = new BusinessListingDiscounts();

  reservation!: Reservation;

  constructor(
    private authenticationService: AuthenticationService,
    private businessListingService: BusinessListingService,
    private reservationService: ReservationService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private notificationService: NzNotificationService,
    private datepipe: DatePipe,
    private modalService: NzModalService,
  ) {
    this.reservationGroup = this.fb.group({
      date: [new Date(), [Validators.required]],
      noOfDiners: [null, [Validators.required]],
      businessListingDiscountsId: [null, [Validators.required]],
      specialRequests: [null],
    })
  }

  ngOnInit() {
    let params = new HttpParams;
    params = params.set('id', this.reservationId);
    this.reservationService.getReservation(params).subscribe({
      next: (res: any) => {
        this.reservation = res;
        if (this.reservation.date != null) {
          this.reservation.date = new Date(this.reservation.date);
        }
      }
    })

    // Setting routes id into variable

  

    // On load, call api to get details 
    if (this.businessId) {
      // Getting master list of metadata
      this.businessListingService.getBusinessListingDescriptionDetails().subscribe({
        next: (res: any) => {
          this.businessListingDescriptionMaster = res;
          this.getBusinessListing();
        }
      })
    }
  }

  populateForm() {
    this.reservationGroup.patchValue({
      date: this.reservation.date,
      noOfDiners: this.reservation.noOfDiners,
      businessListingDiscountsId: this.reservation.businessListingDiscountsId,
      specialRequests: this.reservation.specialRequests
    })
  }

  getBusinessListing() {
    if (this.businessId) {
      let params = new HttpParams;
      params = params.set('id', this.businessId);
      this.businessListingService.getBusinessListing(params).subscribe({
        next: (res: any) => {
          this.businessListing = res.businessListing;
          this.businessListingDescription = this.processBusinessListingDescription(res.businessListingDescription);
          this.businessListingSpecialConditions = res.businessListingSpecialConditions;
          this.businessListingDiscounts = this.processBusinessListingDiscounts(res.businessListingDiscounts);
          this.populateForm();

        }
      })
    }
  }

  // Mapping the data with master list: businessListingDescription
  processBusinessListingDescription(businessListingDescription: BusinessListingDescription) {
    const cuisineIdMap = businessListingDescription.cuisines?.split("|");
    const cuisineList = this.businessListingDescriptionMaster.cuisines.filter((a: any) =>
      cuisineIdMap?.includes(a.id.toString())
    );

    const atmospheresIdMap = businessListingDescription.atmospheres?.split("|");
    const atmospheresList = this.businessListingDescriptionMaster.atmospheres.filter((a: any) =>
      atmospheresIdMap?.includes(a.id.toString())
    );

    const paymentOptionsIdMap = businessListingDescription.paymentOptions?.split("|");
    const paymentOptionsList = this.businessListingDescriptionMaster.paymentOptions.filter((a: any) =>
      paymentOptionsIdMap?.includes(a.id.toString())
    );

    businessListingDescription.cuisines = cuisineList.map((val: any) => val.cuisine);
    businessListingDescription.atmospheres = atmospheresList.map((val: any) => val.atmosphere);
    businessListingDescription.paymentOptions = paymentOptionsList.map((val: any) => val.paymentOption);

    return businessListingDescription;
  }


  // Mapping the data with master list: businessListingDescription
  processBusinessListingDiscounts(businessListingDiscounts: []) {
    businessListingDiscounts.map((discount: any) => {
      discount.day = this.businessListingDescriptionMaster.days.find((val: any) => val.id === discount.dayId);
      discount.time = this.businessListingDescriptionMaster.timings.find((val: any) => val.id === discount.timingsId).time;
      discount.discountInPercent = this.businessListingDescriptionMaster.discounts.find((val: any) => val.id === discount.discountsId).discount;
      return discount;
    })

    businessListingDiscounts.sort((a: any, b: any) => a.timingsId - b.timingsId)

    return businessListingDiscounts;
  }

  onTimeSelect(val?: number) {
    this.reservationGroup.patchValue({
      businessListingDiscountsId: val
    })
  }

  onReserve() {
    this.businessListingService.createNewReservation(this.reservation).subscribe({
      next: (res: any) => {
        this.notificationService.success('', "Reservation created!");
        this.showReservationModal = false;
        this.reservationGroup.reset(({ date: new Date() }));
      }
    })
  }

  filterDiscount(event: any) {
    let day = event.getDay();
    if (day == 0) {
      day = 7;
    }

    this.discountsDisplayed = this.businessListingDiscounts.filter((obj) => {
      return (obj.dayId == day);
    })
    console.log(this.discountsDisplayed)
  }

  handleReviewReservation() {
    if (this.reservationGroup.valid) {
      this.reservation = new Reservation();
      this.reservation.date = this.datepipe.transform(this.reservationGroup.get('date')?.value, 'yyyy-MM-dd HH:mm');
      this.reservation.businessListingDiscountsId = this.reservationGroup.get('businessListingDiscountsId')?.value;
      this.reservation.noOfDiners = this.reservationGroup.get('noOfDiners')?.value;
      this.reservation.createdBy = this.authenticationService.currentUser.id;

      this.selectedDiscount = this.businessListingDiscounts.find((x: any) => x.id === this.reservation.businessListingDiscountsId) as BusinessListingDiscounts;

      this.showReservationModal = true;
    } else {
      Object.values(this.reservationGroup.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ 'onlySelf': true });
        }
      });
    }
  }

  handleCloseModal() {
    this.showReservationModal = false;
  }
}
