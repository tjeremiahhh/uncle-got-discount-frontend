import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { RegisterComponent } from 'src/app/register/register.component';

@Component({
  selector: 'app-authenticate',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.less']
})
export class AuthenticateComponent implements OnInit {

  constructor(
    private modalService : NzModalService,
    private modalRef : NzModalRef
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

    this.modalRef.close();
  }

}
