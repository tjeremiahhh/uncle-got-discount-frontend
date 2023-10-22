import { Component, OnInit } from '@angular/core';
import { BusinessListingService } from '../business-listing.service';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { BusinessListing, BusinessListingDescription, BusinessListingDiscounts, BusinessListingSpecialConditions } from '../model/business-listing.model';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NzModalComponent } from 'ng-zorro-antd/modal';

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


    listOfDiscouts: BusinessListingDiscounts[] = [
        {
            id: 1,
            businessListingId: 1,
            dayId: 1,
            timingsId: 3,
            discountsId: 20,
            maxHeadCount: 3
        },
        {
            id: 2,
            businessListingId: 1,
            dayId: 1,
            timingsId: 3,
            discountsId: 25,
            maxHeadCount: 3
        },
        {
            id: 3,
            businessListingId: 1,
            dayId: 1,
            timingsId: 3,
            discountsId: 20,
            maxHeadCount: 3
        },
        {
            id: 4,
            businessListingId: 1,
            dayId: 1,
            timingsId: 3,
            discountsId: 15,
            maxHeadCount: 3
        }
    ]

    constructor(
        private businessListingService: BusinessListingService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
    ) {
        this.reservationGroup = this.fb.group({
            date: [null, [Validators.required]],
            noOfDiners: [null, [Validators.required]],
            businessListingDiscountsId: [null, [Validators.required]],
            specialRequest: [null],
        })
    }

    ngOnInit() {
        // Setting routes id into variable
        this.route.paramMap.subscribe((params: ParamMap) => {
            this.businessId = params.get('id');
        })


        // On load, call api to get details 
        if (this.businessId) {
            // Getting master list of metadata
            this.businessListingService.getBusinessListingDescriptionDetails().subscribe({
                next: (res: any) => {
                    this.businessListingDescriptionMaster = res
                }
            })

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

    }

    handleReviewReservation() {
        if (this.reservationGroup.valid) {
            this.showReservationModal = true;
        } else {
            Object.values(this.reservationGroup.controls).forEach(control => {
                if (control.invalid) {
                    console.log(control)

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
