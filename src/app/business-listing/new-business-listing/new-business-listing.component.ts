import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AuthenticationService } from 'src/app/authentication/authenticate/authentication.service';
import { AuthenticationRequest } from 'src/app/authentication/authenticate/model/authenticate.model';
import { RegisterRequest } from 'src/app/register/model/register.model';
import { RegisterService } from 'src/app/register/register.service';

@Component({
  selector: 'app-new-business-listing',
  templateUrl: './new-business-listing.component.html',
  styleUrls: ['./new-business-listing.component.less']
})
export class NewBusinessListingComponent implements OnInit {
  currentUser: any;

  currentStep: number = 0;

  registerForm: UntypedFormGroup;
  authenticateForm : UntypedFormGroup;


  alreadyRegistered: boolean = false;
  
  constructor(
    private authenticationService: AuthenticationService,
    private fb: FormBuilder,
    private notificationService: NzNotificationService,
    private registerService: RegisterService,
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
   }

  ngOnInit() {
    this.currentUser = this.authenticationService.currentUser;

    if(this.currentUser) {
      this.currentStep = 1;
    } else {
      this.currentStep = 0;
    }
  }


  onRegister() {
    this.currentStep += 1;
    if(this.registerForm.valid) {
      let registerRequest = new RegisterRequest;
      registerRequest.name = this.registerForm.get('name')?.value;
      registerRequest.emailAddress = this.registerForm.get('emailAddress')?.value;
      registerRequest.password = this.registerForm.get('password')?.value;
      registerRequest.phoneNumber = this.registerForm.get('phoneNumber')?.value;
      registerRequest.isBusinessOwner = false;

      this.registerService.register(registerRequest).subscribe({
        next: (res : any) => {
          this.currentStep += 1;
        }
      })

    } else {
      Object.values(this.registerForm.controls).forEach(control => {
        if(control.invalid) {
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
    if(this.authenticateForm.valid) {
      let authenticationRequest = new AuthenticationRequest;
      authenticationRequest.emailAddress = this.authenticateForm.get('emailAddress')?.value;
      authenticationRequest.password = this.authenticateForm.get('password')?.value;

      this.authenticationService.authenticate(authenticationRequest).subscribe({
        next: (res : any) => {
          this.currentStep += 1;
        }
      })
    } else {
      Object.values(this.authenticateForm.controls).forEach(control => {
        if(control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ 'onlySelf': true });
        }
      });
      this.authenticateForm.markAllAsTouched();
    }
  }

}
