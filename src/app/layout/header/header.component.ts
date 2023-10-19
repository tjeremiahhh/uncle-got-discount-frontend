import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AuthenticateComponent } from 'src/app/authentication/authenticate/authenticate.component';
import { RegisterComponent } from 'src/app/register/register.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {

  constructor(
    private modalService: NzModalService,
  ) { }

  ngOnInit() {
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

}
