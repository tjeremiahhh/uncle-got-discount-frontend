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
import { Atmospheres, BusinessListing, BusinessListingDescription, BusinessListingDiscounts, BusinessListingRequest, BusinessListingSpecialConditions, Cuisines, Days, Discounts, PaymentOptions, Timings } from '../model/business-listing.model';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-business-listing',
  templateUrl: './edit-business-listing.component.html',
  styleUrls: ['./edit-business-listing.component.less']
})
export class EditBusinessListingComponent implements OnInit {
  businessListingId: any;
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

  businessListing: BusinessListing = new BusinessListing();
  businessListingDescription: BusinessListingDescription = new BusinessListingDescription();
  businessListingSpecialConditions: BusinessListingSpecialConditions = new BusinessListingSpecialConditions();
  businessListingDiscounts: BusinessListingDiscounts[] = [];

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
    private route: ActivatedRoute,
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
      allowPublicHoliday: [false],
      menuUrl: [null],
      halalCertified: [false]
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
    this.businessListingId = this.route.snapshot.queryParamMap.get('id');
    this.currentUser = this.authenticationService.currentUser;

    if (this.currentUser) {
      this.currentStep = 1;
    } else {
      this.currentStep = 0;
    }

    let params = new HttpParams();
    params = params.set('id', this.businessListingId);
    this.businessListingService.getBusinessListing(params).subscribe({
      next : (res: any) => {
        this.businessListing = res.businessListing; 
        this.businessListingForm.patchValue({
          outletName: this.businessListing.outletName,
          emailAddress: this.businessListing.emailAddress,
          phoneNumber: this.businessListing.phoneNumber,
          address: this.businessListing.address,
          // imageFile: this.
          websiteUrl: this.businessListing.websiteUrl,
          allowPublicHoliday: this.businessListing.allowPublicHoliday,
          menuUrl: this.businessListing.menuUrl,
          halalCertified: this.businessListing.halalCertified
        })
      }
    })

  }

  onNext() {
    this.currentStep += 1;
  }

  onPrev() {
    if (this.currentStep > 1) {
      this.currentStep -= 1
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
    }
  }

  onUploadFile(event: any) {
    this.file = event.target.files[0];
  }

  createBusinessListing() {
    if (this.businessListingForm.valid) {
      this.businessListing.outletName = this.businessListingForm.get('outletName')?.value;
      this.businessListing.emailAddress = this.businessListingForm.get('emailAddress')?.value;
      this.businessListing.phoneNumber = this.businessListingForm.get('phoneNumber')?.value;
      this.businessListing.address = this.businessListingForm.get('address')?.value;
      this.businessListing.imageFile = this.businessListingForm.get('imageFile')?.value;
      this.businessListing.websiteUrl = this.businessListingForm.get('websiteUrl')?.value;
      this.businessListing.allowPublicHoliday = this.businessListingForm.get('allowPublicHoliday')?.value;
      this.businessListing.menuUrl = this.businessListingForm.get('menuUrl')?.value;
      this.businessListing.halalCertified = this.businessListingForm.get('halalCertified')?.value;

      this.currentStep += 1

      this.getBusinessListingDescriptionDetails();

      // const formData: FormData = new FormData();
      // formData.append('businessListing', new Blob([JSON
      //   .stringify(this.businessListing)], {
      //   type: 'application/json'
      // }));
      // formData.append("logoFile", this.file);
      // console.log(this.file)

      // this.businessListingService.createBusinessListing(formData).subscribe({
      //   next: (res: any) => {
      //     this.businessListing = res;
      //     console.log(res)
      //     // this.currentStep += 1;
      //     // this.getBusinessListingDescriptionDetails();
      //   }
      // })
    } else {
      Object.values(this.businessListingForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ 'onlySelf': true });
        }
      });
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
      // this.businessListingDescription.businessListingId = 1;
      this.businessListingDescription.about = this.additionalInfoForm.get('about')?.value;
      this.businessListingDescription.cuisines = this.additionalInfoForm.get('cuisines')?.value.toString().replace(',', '|');
      this.businessListingDescription.atmospheres = this.additionalInfoForm.get('atmospheres')?.value.toString().replace(',', '|');
      this.businessListingDescription.languages = this.additionalInfoForm.get('languages')?.value.toString().replace(',', '|');
      this.businessListingDescription.paymentOptions = this.additionalInfoForm.get('paymentOptions')?.value.toString().replace(',', '|');

      this.currentStep += 1;
      // this.businessListingService.createBusinessListingDescription(businessListingDescription).subscribe({
      //   next: (res: any) => {
      //     this.currentStep += 1;
      //   }
      // })
    } else {
      Object.values(this.additionalInfoForm.controls).forEach(control => {
        if (control.invalid) {
          console.log(control)
          control.markAsDirty();
          control.updateValueAndValidity({ 'onlySelf': true });
        }
      });
    }
  }

  createBusinessListingSpecialConditions() {
    if (this.specialConditionsForm.get('condition')?.value != null && this.specialConditionsForm.get('condition')?.value != '') {
      // this.businessListingSpecialConditions.businessListingId = this.businessListing.id;
      this.businessListingSpecialConditions.condition = this.specialConditionsForm.get('condition')?.value;

      this.currentStep += 1;

      // this.businessListingService.createBusinessListingSpecialConditions(businessListingSpecialConditions).subscribe({
      //   next: (res: any) => {
      //     this.currentStep += 1;
      //   }
      // })
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
    this.businessListingDiscounts = this.discountsArrayForm.get('discountsAdded')?.value;

    let businessListingRequest = new BusinessListingRequest();
    businessListingRequest.businessListing = this.businessListing;
    businessListingRequest.businessListingDescription = this.businessListingDescription;
    businessListingRequest.businessListingSpecialConditions = this.businessListingSpecialConditions;
    businessListingRequest.businessListingDiscounts = this.businessListingDiscounts;

    const formData: FormData = new FormData();
    formData.append("logoFile", this.file);
    formData.append('businessListing', new Blob([JSON
      .stringify(this.businessListing)], {
      type: 'application/json'
    }));

    // formData.append('businessListingDescription', new Blob([JSON
    //   .stringify(this.businessListingDescription)], {
    //   type: 'application/json'
    // }));
    // formData.append('businessListingSpecialConditions', new Blob([JSON
    //   .stringify(this.businessListingSpecialConditions)], {
    //   type: 'application/json'
    // }));
    // formData.append('businessListingDiscounts', new Blob([JSON
    //   .stringify(this.businessListingDiscounts)], {
    //   type: 'application/json'
    // }));

    // this.businessListingService.createBusinessListing(formData).subscribe({
    //   next: (res: any) => {
    //     console.log('created')
    //   }
    // })
    // let params = new HttpParams();
    // params = params.set('businessListingId', this.businessListing.id != null ?  this.businessListing.id : 0);

    // this.businessListingService.createBusinessListingDiscounts(this.discountsArrayForm.get('discountsAdded')?.value, params).subscribe({
    //   next: (res: any) => {
    //     this.currentStep += 1;
    //   }
    // });
  }
}
