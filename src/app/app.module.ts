import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzInputModule} from 'ng-zorro-antd/input'
import { NzDividerModule} from 'ng-zorro-antd/divider'
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { FooterComponent } from './layout/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    NzButtonModule,
    AppRoutingModule, 
    NzCarouselModule,
    NzInputModule,
    NzCardModule,
    NzDividerModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
