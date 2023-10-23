import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NewBusinessListingComponent } from './business-listing/new-business-listing/new-business-listing.component';
import { EditBusinessListingComponent } from './business-listing/edit-business-listing/edit-business-listing.component';
import { ViewBuinessListingComponent } from './business-listing/view-business-listing/view-business-listing.component';
import { MyProfileComponent } from './settings/my-profile/my-profile.component';
import { SettingsComponent } from './settings/settings.component';
import { MyReservationComponent } from './settings/my-reservations/my-reservations.component';
import { EditReservationComponent } from './reservation/edit-reservation/edit-reservation.component';
import { SearchFilterListingsComponent } from './search-filter/search-filter-listings/search-filter-listings.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'join-us', component: NewBusinessListingComponent },
  { path: 'edit-business-listing', component: EditBusinessListingComponent },
  { path: 'reservation/:id', component: ViewBuinessListingComponent },
  { path: 'edit-reservation/:id', component: EditReservationComponent },
  { path: 'search-filter-listings', component: SearchFilterListingsComponent},

  {
    path: '', component: SettingsComponent,
    children: [
      {
        path: 'my-profile',
        title: 'My profile',
        component: MyProfileComponent,
      },
      {
        path: 'my-upcoming-reservations',
        title: 'My upcoming reservations',
        component: MyReservationComponent,
      },
      {
        path: 'my-reservations-history',
        title: 'My reservations history',
        component: MyReservationComponent,
      },
    ],
  },

  { path: '**', redirectTo: '' },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
