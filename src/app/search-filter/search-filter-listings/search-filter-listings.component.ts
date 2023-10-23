import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthenticationService } from 'src/app/authentication/authenticate/authentication.service';
import { CheckOption, ICuisine, IDiscount, ISearchListing, SearchListingsRequest } from '../model/search-filter.model';
import { SearchFilterService } from '../search-filter.service';
import { combineLatest } from 'rxjs';
import { NzMarks } from 'ng-zorro-antd/slider';

@Component({
  selector: 'app-search-filter-listings',
  templateUrl: './search-filter-listings.component.html',
  styleUrls: ['./search-filter-listings.component.less']
})
export class SearchFilterListingsComponent implements OnInit {

  searchValue ?: string | null;
  cuisineValue ?: number | null;
  cuisineList ?: ICuisine[] = [];
  discountList ?: IDiscount[] = [];
  marks : NzMarks = {
    0: '10%',
    25: '20%',
    50: '30%',
    75: '40%',
    100: '50%'
  }
  discountMap : Map<number, number> = new Map();
  discountFilter : number[] = [0, 100];
  checkOptions : CheckOption[] = [];
  allChecked ?: boolean;
  searchListingList : ISearchListing[] = [];

  constructor(
    private authenticationService: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private searchFilterService: SearchFilterService
  ) {
  }

  ngOnInit() {
    this.initialLoad();
  }

  private initialLoad(): void  {
    combineLatest([
      this.activatedRoute.queryParamMap,
      this.searchFilterService.getAllCuisines(),
      this.searchFilterService.getAllDiscounts()
    ]).subscribe(([params, cuisineList, discountList]) => {
      // Handle Search Value
      this.searchValue = params.get('searchValue');

      
      // Handle Cuisine List & Cuisine Value
      this.cuisineList = cuisineList;

      if (params.get('cuisineValue')) {
        this.cuisineValue = new Number(params.get('cuisineValue')).valueOf();
        this.allChecked = false;
        this.cuisineList.forEach((cuisine) => {
          this.checkOptions.push(new CheckOption(cuisine.cuisine, cuisine.id, cuisine.id === this.cuisineValue));
        });
      } else {
        this.allChecked = true;
        this.cuisineList.forEach((cuisine) => {
          this.checkOptions.push(new CheckOption(cuisine.cuisine, cuisine.id, true));
        });
      }

      // Handle Discount List
      this.discountList = discountList;
      this.discountMap.set(0, 10);
      this.discountMap.set(25, 20);
      this.discountMap.set(50, 30);
      this.discountMap.set(75, 40);
      this.discountMap.set(100, 50);

      // Search
      this.searchListings();
    })
  }

  public updateAllChecked(): void {
    this.checkOptions = this.checkOptions.map(item => ({
      ...item,
      checked: this.allChecked
    }))
  }

  
  public searchListings(): void {
    let searchListingsRequest: SearchListingsRequest = new SearchListingsRequest(
      this.searchValue? this.searchValue : '',
      this.checkOptions.filter((checkOption) => checkOption.checked = true).map((checkOption) => checkOption.value),
      this.discountMap.get(this.discountFilter[0]),
      this.discountMap.get(this.discountFilter[1])
      )

    this.searchFilterService.searchListings(searchListingsRequest).subscribe((searchListingList: ISearchListing[]) => {
      this.searchListingList = searchListingList;
    });
  }
}