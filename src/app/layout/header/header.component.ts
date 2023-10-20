import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AuthenticateComponent } from 'src/app/authentication/authenticate/authenticate.component';
import { AuthenticationService } from 'src/app/authentication/authenticate/authentication.service';
import { RegisterComponent } from 'src/app/register/register.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
  currentUser: any;

  constructor(
    private modalService: NzModalService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.authenticationService.currentUser$.subscribe({
      next: (user) => {
        this.currentUser = user;
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

  onLogOut(){
    this.authenticationService.logOut();
  }

}
