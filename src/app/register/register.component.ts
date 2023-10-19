import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { AuthenticateComponent } from '../authentication/authenticate/authenticate.component';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { RegisterRequest } from './model/register.model';
import { RegisterService } from './register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less']
})
export class RegisterComponent implements OnInit {
  registerForm : UntypedFormGroup;

  constructor(
    private modalService: NzModalService,
    private modalRef: NzModalRef,
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
  }

  ngOnInit() {
    
  }

  onLogIn() {
    this.modalService.create({
      nzContent: AuthenticateComponent,
      nzWidth: 800,
      nzFooter: null,
      nzBodyStyle: {
        'height': '500px',
        'padding': '0'
      }
    })

    this.modalRef.close();
  }

  onRegister() {
    if(this.registerForm.valid) {
      let registerRequest = new RegisterRequest;
      registerRequest.name = this.registerForm.get('name')?.value;
      registerRequest.emailAddress = this.registerForm.get('emailAddress')?.value;
      registerRequest.password = this.registerForm.get('password')?.value;
      registerRequest.phoneNumber = this.registerForm.get('phoneNumber')?.value;
      registerRequest.isBusinessOwner = false;

      this.registerService.register(registerRequest).subscribe({
        next: (res : any) => {
          console.log(res);
          this.notificationService.success('', "Account successfully created!");
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

}
