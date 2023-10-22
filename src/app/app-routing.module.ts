import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NewBusinessListingComponent } from './business-listing/new-business-listing/new-business-listing.component';
import { EditBusinessListingComponent } from './business-listing/edit-business-listing/edit-business-listing.component';
import { ViewBuinessListingComponent } from './business-listing/view-business-listing/view-business-listing.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'join-us', component: NewBusinessListingComponent },
  { path: 'edit-business-listing', component: EditBusinessListingComponent },
  { path: 'reservation/:id', component: ViewBuinessListingComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
