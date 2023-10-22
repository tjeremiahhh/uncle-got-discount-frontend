import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthenticationService } from '../authentication/authenticate/authentication.service';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.less']
})
export class MyProfileComponent implements OnInit {
  currentUser: any;

  profileForm!: UntypedFormGroup;

  selectedTab: number = 0;

  constructor(
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private fb: FormBuilder,
  ) {
    
  }

  ngOnInit() {
    this.currentUser = this.authenticationService.currentUser;

    this.profileForm = this.fb.group({
      name: [this.currentUser.name, [Validators.required]],
      emailAddress: [this.currentUser.emailAddress, [Validators.required]],
      password: [this.currentUser.password, [Validators.required]],
      phoneNumber: [this.currentUser.phoneNumber, [Validators.required]]
    })
  }

}
