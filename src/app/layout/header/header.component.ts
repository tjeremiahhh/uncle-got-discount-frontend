import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AuthenticateComponent } from 'src/app/authentication/authenticate/authenticate.component';
import { AuthenticationService } from 'src/app/authentication/authenticate/authentication.service';
import { BusinessListingService } from 'src/app/business-listing/business-listing.service';
import { RegisterComponent } from 'src/app/register/register.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
  currentUser: any;
  businessListingId: any;

  constructor(
    private modalService: NzModalService,
    private authenticationService: AuthenticationService,
    private businessListingService: BusinessListingService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.authenticationService.currentUser$.subscribe({
      next: (user) => {
        this.currentUser = user;
        this.getBusinessListingId();
      }
    })
  }

  getBusinessListingId() {
     let params = new HttpParams();
    params = params.set('userId', this.currentUser.id);
    this.businessListingService.getBusinessListingIdByUserId(params).subscribe({
      next: (res: any) => {
        this.businessListingId = res;
      }
    })
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
  }

  onLogOut() {
    this.authenticationService.logOut();
    this.router.navigate(['/home']);
  }

}
