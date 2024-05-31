import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
//import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { Library } from '../../../../app.library';
import { CoreService } from '../../../../services/core.service';

@Component({
  //standalone: true,
  selector: 'app-search-shop-comp',
  templateUrl: './search.shop.component.html',
  styleUrls: ['./search.shop.component.scss'],
  providers: [CoreService, Library],
  //imports:[IonicModule]
})
export class SearchShopComponent implements OnInit {
  public search: string = '';
  public searchMessage: string = '';
  public feedFilter: any = [];

  @Input() feed: any = [];
  @Output() searchChange = new EventEmitter<any>();

  constructor(
    public service: CoreService,
    public navCtrl: NavController,
    public router: Router,
    public route: ActivatedRoute,
    public lib: Library,
  ) {}

  async ngOnInit() {
    await this.checkQuery();
  }

  async checkQuery() {
    this.route.queryParams.subscribe((params) => {
      const query = params['search'];
      if (query) {
        this.search = query == 'false' || query == 'all' ? '' : query;

        setTimeout(async () => {
          await this.beginSearch(null, false);
        }, 1000);
      }
      // Call any method or perform any action based on the new searchQuery value
    });

    const query = this.route.snapshot.queryParamMap.get('search');
    if (query) {
      this.search = query;
      setTimeout(async () => {
        await this.beginSearch(null, true);
      }, 1000);
    }
  }

  async beginSearch(event: any = null, clearSearch: boolean = false) {
    if (this.search == 'false' || this.search == 'all' || this.search == '')
      this.search = '';
    const keywords = this.search
      .toLowerCase()
      .split(/[\s-]+/) //split hyphen and spaces
      .filter((keyword) => keyword);

    if (keywords.length === 0) {
      this.feedFilter = this.feed;
    } else {
      /*this.feed = this.feed.filter(
      (item: any) =>
        item.title.toLowerCase().includes(lowerKeyword) ||
        item.description.toLowerCase().includes(lowerKeyword) ||
        item.tags.some((tag: any) => tag.toLowerCase().includes(lowerKeyword)),
    );*/ //

      this.feedFilter = this.feed.filter((item: any) => {
        const title = item.title.toLowerCase();
        const description = item.description.toLowerCase();
        const productType = item.productType
          ? item.productType.toLowerCase()
          : '';

        return keywords.every(
          (keyword) =>
            title.includes(keyword) ||
            description.includes(keyword) ||
            productType.includes(keyword),
        );
      });
    }
    /* if (
      this.feedFilter.length === 0 &&
      lowerKeyword !== '' &&
      lowerKeyword !== 'false'
    )*/
    //this.searchMessage = 'No items found';
    //else this.searchMessage = '';
    let searchData = {
      keyword: this.search,
      results: this.feedFilter,
    };
    if (clearSearch) this.search = '';
    this.searchChange.emit(searchData);
  }
}
