import { Component, OnInit } from '@angular/core';
import { BusinessListing, ISearchResult } from './model/home.model';
import { HomeService } from './home.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  businessListings: BusinessListing[] = [];

  constructor(
    private homeService: HomeService,
  ) { }

  ngOnInit() {
    this.homeService.getAllBusinessListings().subscribe({
      next: (res: any) => {
        this.businessListings = res;
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
}
