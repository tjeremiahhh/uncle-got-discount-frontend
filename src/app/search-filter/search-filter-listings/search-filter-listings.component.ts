import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthenticationService } from 'src/app/authentication/authenticate/authentication.service';

@Component({
  selector: 'app-search-filter-listings',
  templateUrl: './search-filter-listings.component.html',
  styleUrls: ['./search-filter-listings.component.less']
})
export class SearchFilterListingsComponent implements OnInit {

  searchValue ?: string;
  cuisineValue ?: number;

  constructor(
    private authenticationService: AuthenticationService,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      console.log(params);

      // this.searchValue = value['searchValue'];
      // this.cuisineValue = new Number(value['cuisineValue']).valueOf();

      // console.log("Search value: " + this.searchValue + ", Cuisine value: " + this.cuisineValue);
    })
  }
}
