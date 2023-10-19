import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { AuthenticateComponent } from '../authentication/authenticate/authenticate.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less']
})
export class RegisterComponent implements OnInit {

  constructor(
    private modalService : NzModalService,
    private modalRef : NzModalRef,
  ) { }

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

}
