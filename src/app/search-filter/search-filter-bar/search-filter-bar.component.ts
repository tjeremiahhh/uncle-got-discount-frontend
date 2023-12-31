import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {ICuisine, ISearchParams, ISearchResult, SearchParams } from '../model/search-filter.model';
import { SearchFilterService } from '../search-filter.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-search-filter-bar',
  templateUrl: './search-filter-bar.component.html',
  styleUrls: ['./search-filter-bar.component.less']
})
export class SearchFilterBarComponent implements OnInit {
  @Input("atSearchPage") atSearchPage ?: boolean;
  @Input("searchValue") searchValue ?: string;
  @Output() searchButtonClicked = new EventEmitter<string>();
  searchResults ?: ISearchResult[] = [];
  cuisineValue ?: number;
  cuisineList ?: ICuisine[] = [];
  thumbnail : any;

  constructor(
    private searchFilterService: SearchFilterService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.loadCuisineList();
  }

  public loadCuisineList(): void {
    this.searchFilterService.getAllCuisines().subscribe((cuisineList: ICuisine[]) => {
      this.cuisineList = cuisineList;
    });
  }
  
  public clearSearchValue(): void {
    this.searchValue = '';
    this.searchResults = [];
  }

  public searchByOutletName(event: Event): void {
    const value: string = (event.target as HTMLInputElement).value;

    if (value.length == 0) {
      this.searchResults = [];
      return;
    }

    this.searchFilterService.searchByOutletName(value, this.cuisineValue).subscribe({
      next: (res: ISearchResult[]) => {
        this.searchResults = res;
        this.searchResults.forEach((result: ISearchResult) => {
          if (result.imageFile) {
            const blob = new Blob([result.imageFile], {type: 'image/jpeg'})
            var reader = new FileReader();
            var base64data;
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
              this.thumbnail = reader.result;
              console.log(this.thumbnail);
            }
          }
        }) 
      }
    })
  }
  
  public routeToViewRestaurant(): void {
    // Route to reservation component
  }

  public routeToSearchFilterListings(): void {
    if (this.atSearchPage) {
      this.searchButtonClicked.emit(this.searchValue);
    } else {
      let queryParams = {
        searchValue: this.searchValue,
        cuisineValue: this.cuisineValue
      }

      this.router.navigate(['search-filter-listings'], { queryParams: queryParams });
    }
    
    
    // if (!this.atHomePage) {
    //   this.searchButtonClicked.emit();
    // }
  }
}
