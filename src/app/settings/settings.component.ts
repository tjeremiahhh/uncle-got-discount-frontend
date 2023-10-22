import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../authentication/authenticate/authentication.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less']
})

export class SettingsComponent implements OnInit {
  currentUser: any;

  profileForm!: UntypedFormGroup;

  selectedTab: number = 0;

  isProfile: boolean = false;
  isUpcoming: boolean = false;
  isHistorical: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private fb: FormBuilder,
    private router: Router,
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

    console.log(this.router.url);

    if(this.router.url.includes('upcoming')){
      this.isUpcoming = true;
    } else if (this.router.url.includes('profile')) {
      this.isProfile = true;
    } else if (this.router.url.includes('historical')) {
      this.isHistorical = true;
    }
  }

}
