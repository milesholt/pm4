import {
  Input,
  Output,
  EventEmitter,
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
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
export class SearchShopComponent implements OnInit, OnChanges {
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['feed'] && this.feed.length) {
      this.checkQuery();
    }
  }

  async checkQuery() {
    let clear: boolean = false;

    this.route.queryParams.subscribe((params) => {
      const query = params['search'];
      if (query) {
        this.search = query == 'false' || query == 'all' ? '' : query;
        clear = false;
        //this.beginSearch(null, false);

        /*setTimeout(async () => {
          await this.beginSearch(null, false);
        }, 1000);*/
      }
      // Call any method or perform any action based on the new searchQuery value
    });

    this.route.paramMap.subscribe((params) => {
      const category = params.get('category');
      if (category) {
        this.search = category == 'false' || category == 'all' ? '' : category;
        clear = true;
        //this.beginSearch(null, true);

        /*setTimeout(async () => {
          alert(this.search);
          //
          await this.beginSearch(null, true);
        }, 1000);*/
      }
    });

    const query = this.route.snapshot.queryParamMap.get('search');
    if (query) {
      this.search = query;
      clear = true;
      //await this.beginSearch(null, true);

      /*setTimeout(async () => {
        await this.beginSearch(null, true);
      }, 1000);*/
    }

    await this.beginSearch(null, clear);
  }

  async beginSearch(event: any = null, clearSearch: boolean = false) {
    let s = '';

    if (this.search == 'false' || this.search == 'all' || this.search == '')
      this.search = '';

    s = this.search;

    //catch different spellings
    if (this.search == 'anti-aging') this.search = 'anti-ageing';
    if (this.search == 'anti-ageing') s = s + ' anti-aging';

    //if search input event, split only spaces, otherwise spaces and hyphens
    const regex = event ? /[\s]+/ : /[\s-]+/;

    const keywords = s
      .toLowerCase()
      .replace(/\banti-ageing\b/g, 'ANTI_AGEING')
      .replace(/\banti-aging\b/g, 'ANTI_AGING')
      .split(regex) //split hyphen and spaces
      .filter((keyword) => keyword)
      .map((keyword) => (keyword === 'ANTI_AGEING' ? 'anti-ageing' : keyword))
      .map((keyword) => (keyword === 'ANTI_AGING' ? 'anti-aging' : keyword));

    let excludedProducts: any = [];

    if (keywords.length === 0) {
      this.feedFilter = this.feed;
    } else if (keywords.join('') === 'featured') {
      var featuredProducts = [
        'Ashwagandha',
        'Collagen Gummies',
        'Complete Multivitamin',
        'Mushroom Extract Complex',
      ];

      this.feedFilter = this.feed.filter((item: any) =>
        featuredProducts.includes(item.title),
      );
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
        const handle = item.handle;

        return keywords.some(
          (keyword) =>
            title.includes(keyword) ||
            handle.includes(keyword) ||
            description.includes(keyword) ||
            productType.includes(keyword),
        );
      });

      //Exclude any products from filter if necessary
      //If there is a search input event (event is not null), ignore exlusions
      var excludeProducts = event
        ? []
        : ["Lion's Mane", 'Mushroom Coffee', '5-HTP'];

      //capture and return any excluded products
      excludedProducts = this.feedFilter.filter((item: any) =>
        excludeProducts.some((product) => item.title.includes(product)),
      );

      this.feedFilter = this.feedFilter.filter(
        (item: any) =>
          !excludeProducts.some((product) => item.title.includes(product)),
      );
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
      excluded: excludedProducts,
      products: this.feed,
    };
    if (clearSearch) this.search = '';
    this.searchChange.emit(searchData);
  }
}
