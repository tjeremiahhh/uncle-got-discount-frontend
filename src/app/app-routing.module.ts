import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NewBusinessListingComponent } from './business-listing/new-business-listing/new-business-listing.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'join-us', component: NewBusinessListingComponent},

  { path: '**', redirectTo: '' },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
