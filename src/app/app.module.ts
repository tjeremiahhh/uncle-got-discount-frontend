import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';

import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzLayoutModule } from 'ng-zorro-antd/layout';

import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { FooterComponent } from './layout/footer/footer.component';
import { RegisterComponent } from './register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HttpClientModule } from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { DatePipe } from '@angular/common'

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'

import { UserOutline, TagOutline } from '@ant-design/icons-angular/icons';
import { AuthenticateComponent } from './authentication/authenticate/authenticate.component';
import { NewBusinessListingComponent } from './business-listing/new-business-listing/new-business-listing.component';
import { EditBusinessListingComponent } from './business-listing/edit-business-listing/edit-business-listing.component';
import { MyProfileComponent } from './settings/my-profile/my-profile.component';
import en from '@angular/common/locales/en'
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import { ViewBuinessListingComponent } from './business-listing/view-business-listing/view-business-listing.component';
import { SettingsComponent } from './settings/settings.component';
import { MyReservationComponent } from './settings/my-reservations/my-reservations.component';
import { EditReservationComponent } from './reservation/edit-reservation/edit-reservation.component';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    RegisterComponent,
    AuthenticateComponent,
    NewBusinessListingComponent,
    EditBusinessListingComponent,
    ViewBuinessListingComponent,
    SettingsComponent,
    MyProfileComponent,
    MyReservationComponent,
    EditReservationComponent,
  ],
  imports: [
    BrowserModule,
    NzButtonModule,
    AppRoutingModule,
    NzCarouselModule,
    NzInputModule,
    NzCardModule,
    NzDividerModule,
    NzModalModule,
    NzFormModule,
    NzIconModule,
    NzNotificationModule,
    NzDropDownModule,
    NzMenuModule,
    NzStepsModule,
    NzUploadModule,
    NzMessageModule,
    NzCheckboxModule,
    NzSelectModule,
    NzAvatarModule,
    NzTimePickerModule,
    NzLayoutModule,
    NzDatePickerModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NzIconModule.forChild([UserOutline, TagOutline]),
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US,  }, DatePipe],
  bootstrap: [AppComponent]
})

export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, far);
  }
}
