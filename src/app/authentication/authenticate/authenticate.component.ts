import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { RegisterComponent } from 'src/app/register/register.component';
import { AuthenticationRequest } from './model/authenticate.model';
import { AuthenticationService } from './authentication.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authenticate',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.less']
})
export class AuthenticateComponent implements OnInit {
  authenticateForm: UntypedFormGroup;

  constructor(
    private modalService: NzModalService,
    private modalRef: NzModalRef,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private notificationService: NzNotificationService,
    private router: Router

  ) {
    this.authenticateForm = this.fb.group({
      emailAddress: [null, [Validators.required]],
      password: [null, [Validators.required]]
    })
  }

  ngOnInit() {
    console.log(this.authenticationService.currentUser)
  }

  onRegister() {
    this.modalService.create({
      nzContent: RegisterComponent,
      nzWidth: 800,
      nzFooter: null,
      nzBodyStyle: {
        'height': '500px',
        'padding': '0'
      }
    })

    this.modalRef.close();
  }

  onLogIn() {
    if (this.authenticateForm.valid) {
      let authenticationRequest = new AuthenticationRequest;
      authenticationRequest.emailAddress = this.authenticateForm.get('emailAddress')?.value;
      authenticationRequest.password = this.authenticateForm.get('password')?.value;

      this.authenticationService.authenticate(authenticationRequest).subscribe({
        next: (res: any) => {
          this.notificationService.success('', "Successfully logged in!");
          this.modalRef.close();
          this.router.navigate(['/home']);

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

}
