import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/authentication/authenticate/authentication.service';
import { CheckOption, ICuisine, IDiscount, ISearchListing, ISearchListingsPageable, ISearchListingsRequest, ISearchParams, SearchListingsRequest } from '../model/search-filter.model';
import { SearchFilterService } from '../search-filter.service';
import { Subject, combineLatest, finalize, switchMap, tap } from 'rxjs';
import { NzMarks } from 'ng-zorro-antd/slider';
import { IPageableResponseBody } from 'src/app/model/pageable-response.model';
import { HttpParams } from '@angular/common/http';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { deepCopy } from '@angular-devkit/core/src/utils/object';

@Component({
  selector: 'app-search-filter-listings',
  templateUrl: './search-filter-listings.component.html',
  styleUrls: ['./search-filter-listings.component.less']
})
export class SearchFilterListingsComponent implements OnInit {

  searchValue ?: string;
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
  isLoading: boolean = false;
  searchListings$: Subject<ISearchListingsPageable> = new Subject<ISearchListingsPageable>();

  page: number = 1;
  size: number = 10;
  sort: string[] = [];
  total: number = 0;
  totalPages: number = 0;

  sortParams = [
    { name: 'Outlet Name', sort: { key: 'business_listings.outlet_name', value: '' }},
    { name: 'Address', sort: { key: 'business_listings.address', value: '' }}
  ]

  defaultTableQueryParams: NzTableQueryParams = {
    pageIndex: 1,
    pageSize: 10,
    sort: this.sortParams.map((param) => param.sort),
    filter: []
  }

  tableQueryParams: NzTableQueryParams = deepCopy(this.defaultTableQueryParams);

  constructor(
    private authenticationService: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private searchFilterService: SearchFilterService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.initialLoad();
  }

  public min(num1: number, num2: number): number {
    return Math.min(num1, num2);
  }

  private buildSearchObject(tableQueryParams?: NzTableQueryParams): ISearchListingsPageable {
    let searchListingsRequest: SearchListingsRequest = new SearchListingsRequest(
      this.searchValue? this.searchValue : '',
      this.checkOptions.filter((checkOption) => checkOption.checked === true).map((checkOption) => checkOption.value),
      this.discountMap.get(this.discountFilter[0]),
      this.discountMap.get(this.discountFilter[1])
      )
    
    return { search: searchListingsRequest, pageable: tableQueryParams? tableQueryParams : this.tableQueryParams };
  }

  private initialLoad(): void  {
    combineLatest([
      this.activatedRoute.queryParamMap,
      this.searchFilterService.getAllCuisines(),
      this.searchFilterService.getAllDiscounts()
    ]).subscribe(([params, cuisineList, discountList]) => {
      // Handle Search Value
      this.searchValue = params.get('searchValue')?.valueOf();

      // Handle Cuisine List & Cuisine Value
      this.cuisineList = cuisineList;

      if (params.get('cuisineValue')) {
        this.cuisineValue = new Number(params.get('cuisineValue')).valueOf();
        this.allChecked = false;
        this.checkOptions = this.cuisineList.map((cuisine: ICuisine) => new CheckOption(cuisine.cuisine, cuisine.id, cuisine.id === this.cuisineValue))
      } else {
        this.allChecked = true;
        this.checkOptions = this.cuisineList.map((cuisine: ICuisine) => new CheckOption(cuisine.cuisine, cuisine.id, true));
      }

      // Handle Discount List
      this.discountList = discountList;
      this.discountMap.set(0, 10);
      this.discountMap.set(25, 20);
      this.discountMap.set(50, 30);
      this.discountMap.set(75, 40);
      this.discountMap.set(100, 50);

      // Search
      let searchListingsRequest: SearchListingsRequest = new SearchListingsRequest(
        this.searchValue? this.searchValue : '',
        this.checkOptions.filter((checkOption) => checkOption.checked === true).map((checkOption) => checkOption.value),
        this.discountMap.get(this.discountFilter[0]),
        this.discountMap.get(this.discountFilter[1])
        )

      this.searchListings$.pipe(
        tap(() => this.isLoading = true),
        switchMap((searchListingsPageable: ISearchListingsPageable) => 
          this.searchFilterService.searchListings(searchListingsPageable).pipe(finalize(() => this.isLoading = false))
        )
      ).subscribe((searchListingList: IPageableResponseBody<ISearchListing>) => {
        this.searchListingList = searchListingList.content;
        this.total = searchListingList.totalElements;
      });

      this.searchListings$.next(this.buildSearchObject());
    })
  }

  public updateAllChecked(): void {
    this.checkOptions = this.checkOptions.map(item => ({
      ...item,
      checked: this.allChecked
    }))

    this.searchListings();
  }

  public searchListings(searchValue?: string): void {
    if (searchValue != undefined) {
      this.searchValue = searchValue;
    }

    let searchListingsRequest: SearchListingsRequest = new SearchListingsRequest(
      this.searchValue? this.searchValue : '',
      this.checkOptions.filter((checkOption) => checkOption.checked === true).map((checkOption) => checkOption.value),
      this.discountMap.get(this.discountFilter[0]),
      this.discountMap.get(this.discountFilter[1])
      )

    this.searchListings$.next(this.buildSearchObject());
  }

  // Pagination
  public toFirstPage(): void {
    this.page = 1;
    this.searchListings();
  }

  public toLastPage(): void {
    this.page = this.totalPages;
    this.searchListings();
  }

  public onParamsChange(index: number): void {
    const value = this.tableQueryParams.sort[index].value;

    this.tableQueryParams.sort = deepCopy(this.defaultTableQueryParams.sort);
    
    this.tableQueryParams.sort[index].value = value === ''? 'ascend' : value === 'ascend'? 'descend' : '';

    this.searchListings$.next(this.buildSearchObject());
  }

  ngOnDestroy(): void {
    this.searchListings$.unsubscribe();
  }
}
