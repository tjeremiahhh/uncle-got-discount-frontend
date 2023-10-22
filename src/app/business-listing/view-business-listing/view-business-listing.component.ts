import { Component, OnInit } from '@angular/core';
import { BusinessListingService } from '../business-listing.service';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { BusinessListing, BusinessListingDescription, BusinessListingDiscounts, BusinessListingSpecialConditions, Reservation } from '../model/business-listing.model';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NzModalComponent } from 'ng-zorro-antd/modal';
import { AuthenticationService } from 'src/app/authentication/authenticate/authentication.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-reservation',
    templateUrl: './view-business-listing.component.html',
    styleUrls: ['./view-business-listing.component.less']
})
export class ViewBuinessListingComponent implements OnInit {
    reservationGroup: UntypedFormGroup;
    businessId: string | null = '';
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
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private notificationService: NzNotificationService,
        private datepipe: DatePipe
    ) {
        this.reservationGroup = this.fb.group({
            date: [new Date(), [Validators.required]],
            noOfDiners: [null, [Validators.required]],
            businessListingDiscountsId: [null, [Validators.required]],
            specialRequest: [null],
        })
    }

    ngOnInit() {
        const form = document.getElementById('reservation-form');


        if (form) {
            if (document.body.clientWidth <= 767)
                form.style.marginTop = '16px';

            window.addEventListener('resize', () => {
                if (document.body.clientWidth > 767) {
                    window.removeEventListener('scroll', this.onWindowScroll)
                    window.addEventListener('scroll', this.onWindowScroll)
                } else {
                    window.removeEventListener('scroll', this.onWindowScroll)
                    form.style.marginTop = '16px';
                }
            });
        }

        // Setting routes id into variable
        this.route.paramMap.subscribe((params: ParamMap) => {
            this.businessId = params.get('id');
        })


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

    onWindowScroll() {
        const container = document.getElementById('reservation-container');
        const form = document.getElementById('reservation-form');

        if (form && container) {
            if (window.scrollY <= container.getBoundingClientRect().height - form.getBoundingClientRect().height - 48)
                form.style.marginTop = window.scrollY + 'px';
        }
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
