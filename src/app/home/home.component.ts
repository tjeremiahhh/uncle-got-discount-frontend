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
  businessListings : BusinessListing[] = [];
  searchValue ?: string;
  searchResults ?: ISearchResult[] = [];
  thumbnail : any;

  constructor(
    private homeService : HomeService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) { }

  ngOnInit() {
    this.homeService.getAllBusinessListings().subscribe({
      next: (res : any) => {
        this.businessListings = res;
      }
    })
  }
  
  public clearSearchValue(): void {
    this.searchValue = "";
    this.searchResults = [];
  }

  public searchByOutletName(event: Event): void {
    const value: string = (event.target as HTMLInputElement).value;

    if (value.length == 0) {
      this.searchResults = [];
      return;
    }

    this.homeService.searchByOutletName(value).subscribe({
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
    this.router.navigate(['view-restaurant'], { queryParams: { id: this.searchValue }});
  }
}
