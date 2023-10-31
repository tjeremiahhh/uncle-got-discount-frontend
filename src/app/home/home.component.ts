import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BusinessListing, ISearchResult } from './model/home.model';
import { HomeService } from './home.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Cuisines } from '../business-listing/model/business-listing.model';
import { ISearchParams } from '../search-filter/model/search-filter.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  businessListings: BusinessListing[] = [];
  cuisines: Cuisines[] = []

  constructor(
    private homeService: HomeService,
    private router: Router
  ) { }

  ngOnInit() {
    this.homeService.getAllBusinessListings().subscribe({
      next: (res: any) => {
        this.businessListings = res;
      }
    })

    this.homeService.getBusinessListingDescriptionDetails().subscribe({
      next: (res: any) => {
        this.cuisines = res.cuisines;
      }
    })
  }

  slideChange(direction: any, id: string) {
    const slider = document.getElementById(id);
    const sliderItems = slider?.getElementsByClassName('custom-list-item');

    if (slider && sliderItems) {
      const sliderItem = sliderItems[0].scrollWidth;
      slider.scrollLeft += sliderItem * direction;
    }
  }

  public searchByCuisine(cuisineValue: number): void {
    this.router.navigate(['search-filter-listings'], { queryParams: { cuisineValue: cuisineValue} });
  }
}
