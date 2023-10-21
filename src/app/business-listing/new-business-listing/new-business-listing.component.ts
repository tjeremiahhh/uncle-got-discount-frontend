import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AuthenticationService } from 'src/app/authentication/authenticate/authentication.service';
import { AuthenticationRequest } from 'src/app/authentication/authenticate/model/authenticate.model';
import { RegisterRequest } from 'src/app/register/model/register.model';
import { RegisterService } from 'src/app/register/register.service';
import { BusinessListingService } from '../business-listing.service';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Atmospheres, BusinessListing, BusinessListingDescription, BusinessListingSpecialConditions, Cuisines, Days, Discounts, PaymentOptions, Timings } from '../model/business-listing.model';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-new-business-listing',
  templateUrl: './new-business-listing.component.html',
  styleUrls: ['./new-business-listing.component.less']
})
export class NewBusinessListingComponent implements OnInit {
  currentUser: any;

  currentStep: number = 0;

  registerForm: UntypedFormGroup;
  authenticateForm: UntypedFormGroup;
  businessListingForm: UntypedFormGroup;
  additionalInfoForm: UntypedFormGroup;
  specialConditionsForm: UntypedFormGroup;
  discountsArrayForm: UntypedFormGroup;
  discountsForm: UntypedFormGroup;

  alreadyRegistered: boolean = false;

  businessListing!: BusinessListing;

  atmospheres: Atmospheres[] = [];
  cuisines: Cuisines[] = [];
  days: Days[] = [];
  discounts: Discounts[] = [];
  paymentOptions: PaymentOptions[] = [];
  timings: Timings[] = [];

  file!: File;

  constructor(
    private authenticationService: AuthenticationService,
    private registerService: RegisterService,
    private businessListingService: BusinessListingService,
    private fb: FormBuilder,
    private msg: NzMessageService,
  ) {
    this.registerForm = this.fb.group({
      name: [null, [Validators.required]],
      emailAddress: [null, [Validators.required]],
      password: [null, [Validators.required]],
      rePassword: [null, [Validators.required]],
      phoneNumber: [null, [Validators.required]],
      isBusinessOwner: [false]
    })

    this.authenticateForm = this.fb.group({
      emailAddress: [null, [Validators.required]],
      password: [null, [Validators.required]]
    })

    this.businessListingForm = this.fb.group({
      outletName: [null, [Validators.required]],
      emailAddress: [null],
      phoneNumber: [null],
      address: [null, [Validators.required]],
      imageFile: [null],
      websiteUrl: [null],
      allowPublicHoliday: [null, [Validators.required]],
      menuUrl: [null],
      halalCertified: [null, [Validators.required]]
    })

    this.additionalInfoForm = this.fb.group({
      about: [null, [Validators.required]],
      cuisines: [null, [Validators.required]],
      atmospheres: [null, [Validators.required]],
      languages: [null, [Validators.required]],
      paymentOptions: [null, [Validators.required]]
    })

    this.specialConditionsForm = this.fb.group({
      condition: [null]
    })

    this.discountsForm = this.fb.group({
      dayId: [null, [Validators.required]],
      timingsId: [null, [Validators.required]],
      discountsId: [null, [Validators.required]],
      maxHeadCount: [null, [Validators.required]],
    })

    this.discountsArrayForm = this.fb.group({
      discountsAdded: this.fb.array([this.discountsForm])
    })
  }

  ngOnInit() {
    this.currentUser = this.authenticationService.currentUser;

    if (this.currentUser) {
      this.currentStep = 1;
    } else {
      this.currentStep = 0;
    }
  }


  onRegister() {
    if (this.registerForm.valid) {
      let registerRequest = new RegisterRequest;
      registerRequest.name = this.registerForm.get('name')?.value;
      registerRequest.emailAddress = this.registerForm.get('emailAddress')?.value;
      registerRequest.password = this.registerForm.get('password')?.value;
      registerRequest.phoneNumber = this.registerForm.get('phoneNumber')?.value;
      registerRequest.isBusinessOwner = true;

      this.registerService.register(registerRequest).subscribe({
        next: (res: any) => {
          let authenticationRequest = new AuthenticationRequest;
          authenticationRequest.emailAddress = this.registerForm.get('emailAddress')?.value;
          authenticationRequest.password = this.registerForm.get('password')?.value;

          this.authenticationService.authenticate(authenticationRequest).subscribe({
            next: (res: any) => {
              this.currentStep += 1;
            }
          });
        }
      })

    } else {
      Object.values(this.registerForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ 'onlySelf': true });
        }
      });
      this.registerForm.markAllAsTouched();
    }
  }

  toggleRegistered() {
    this.alreadyRegistered = true;
  }

  onLogIn() {
    if (this.authenticateForm.valid) {
      let authenticationRequest = new AuthenticationRequest;
      authenticationRequest.emailAddress = this.authenticateForm.get('emailAddress')?.value;
      authenticationRequest.password = this.authenticateForm.get('password')?.value;

      this.authenticationService.authenticate(authenticationRequest).subscribe({
        next: (res: any) => {
          this.currentStep += 1;
        }
      })
    } else {
      Object.values(this.authenticateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ 'onlySelf': true });
        }
      });
      this.authenticateForm.markAllAsTouched();
    }
  }

  onUploadFile(event: any) {
    this.file = event.target.files[0];
  }

  createBusinessListing() {
    if (this.businessListingForm.valid) {
      let businessListing = new BusinessListing;
      businessListing.outletName = this.businessListingForm.get('outletName')?.value;
      businessListing.emailAddress = this.businessListingForm.get('emailAddress')?.value;
      businessListing.phoneNumber = this.businessListingForm.get('phoneNumber')?.value;
      businessListing.address = this.businessListingForm.get('address')?.value;
      businessListing.imageFile = this.businessListingForm.get('imageFile')?.value;
      businessListing.websiteUrl = this.businessListingForm.get('websiteUrl')?.value;
      businessListing.allowPublicHoliday = this.businessListingForm.get('allowPublicHoliday')?.value;
      businessListing.menuUrl = this.businessListingForm.get('menuUrl')?.value;
      businessListing.halalCertified = this.businessListingForm.get('halalCertified')?.value;

      const formData: FormData = new FormData();
      formData.append("logoFile", this.file);
      formData.append('businessListing', new Blob([JSON
        .stringify(businessListing)], {
        type: 'application/json'
      }));

      this.businessListingService.createBusinessListing(formData).subscribe({
        next: (res: any) => {
          this.businessListing = res;
          this.currentStep += 1;
          this.getBusinessListingDescriptionDetails();
        }
      })
    } else {
      Object.values(this.businessListingForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ 'onlySelf': true });
        }
      });
      this.businessListingForm.markAllAsTouched();
    }
  }

  getBusinessListingDescriptionDetails() {
    this.businessListingService.getBusinessListingDescriptionDetails().subscribe({
      next: (res: any) => {
        this.atmospheres = res.atmospheres;
        this.cuisines = res.cuisines;
        this.days = res.days;
        this.discounts = res.discounts;
        this.paymentOptions = res.paymentOptions;
        this.timings = res.timings;
      }
    })
  }

  createBusinessListingDescription() {
    if (this.additionalInfoForm.valid) {
      let businessListingDescription = new BusinessListingDescription();
      businessListingDescription.businessListingId = 1;
      businessListingDescription.about = this.additionalInfoForm.get('about')?.value;
      businessListingDescription.cuisines = this.additionalInfoForm.get('cuisines')?.value.toString().replace(',', '|');
      businessListingDescription.atmospheres = this.additionalInfoForm.get('atmospheres')?.value.toString().replace(',', '|');
      businessListingDescription.languages = this.additionalInfoForm.get('languages')?.value.toString().replace(',', '|');
      businessListingDescription.paymentOptions = this.additionalInfoForm.get('paymentOptions')?.value.toString().replace(',', '|');

      this.businessListingService.createBusinessListingDescription(businessListingDescription).subscribe({
        next: (res: any) => {
          this.currentStep += 1;
        }
      })
    } else {
      Object.values(this.additionalInfoForm.controls).forEach(control => {
        if (control.invalid) {
          console.log(control)
          control.markAsDirty();
          control.updateValueAndValidity({ 'onlySelf': true });
        }
      });
      this.additionalInfoForm.markAllAsTouched();
    }
  }

  createBusinessListingSpecialConditions() {
    if (this.specialConditionsForm.get('condition')?.value != null && this.specialConditionsForm.get('condition')?.value != '') {
      let businessListingSpecialConditions = new BusinessListingSpecialConditions();

      businessListingSpecialConditions.businessListingId = this.businessListing.id;
      businessListingSpecialConditions.condition = this.specialConditionsForm.get('condition')?.value;

      this.businessListingService.createBusinessListingSpecialConditions(businessListingSpecialConditions).subscribe({
        next: (res: any) => {
          this.currentStep += 1;
        }
      })
    } else {
      this.currentStep += 1;
    }
  }

  get discountsAdded() {
    return this.discountsArrayForm.controls["discountsAdded"] as FormArray;
  }

  addDiscount() {
    let newDiscountForm = this.fb.group({
      dayId: [null, [Validators.required]],
      timingsId: [null, [Validators.required]],
      discountsId: [null, [Validators.required]],
      maxHeadCount: [null, [Validators.required]],
    })

    this.discountsAdded.push(newDiscountForm);
  }

  deleteDiscount(discountIndex: number) {
    this.discountsAdded.removeAt(discountIndex);
  }

  createDiscounts() {
    let params = new HttpParams();
    params = params.set('businessListingId', this.businessListing.id != null ?  this.businessListing.id : 0);

    this.businessListingService.createBusinessListingDiscounts(this.discountsArrayForm.get('discountsAdded')?.value, params).subscribe({
      next: (res: any) => {
        this.currentStep += 1;
      }
    });
  }
}
