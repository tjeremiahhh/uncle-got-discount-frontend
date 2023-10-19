import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { RegisterComponent } from 'src/app/register/register.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {

  constructor(
    private modalSevice: NzModalService,
  ) { }

  ngOnInit() {
  }

  onRegister() {
    this.modalSevice.create({
      nzContent: RegisterComponent,
      nzWidth: 800,
      nzFooter: null,
      nzBodyStyle: {
        'height': '500px',
        'padding': '0'
      }
    })
  }

}
