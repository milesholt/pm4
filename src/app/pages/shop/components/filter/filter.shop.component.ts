import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
//import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { Library } from '../../../../app.library';
import { CoreService } from '../../../../services/core.service';

@Component({
  //standalone: true,
  selector: 'app-filter-shop-comp',
  templateUrl: './filter.shop.component.html',
  styleUrls: ['./filter.shop.component.scss'],
  providers: [CoreService, Library],
  //imports:[IonicModule]
})
export class FilterShopComponent implements OnInit {
  public filter: string = '';
  public order: string = 'default';
  //public searchMessage: string = '';
  public feedFilter: any = [];
  sort: any = {};
  sort_options: any = [
    {
      key: 'price-asc',
      value: 'Price - Ascending',
      type: 'number',
      order: 'asc',
    },
    {
      key: 'price-des',
      value: 'Price - Descending',
      type: 'number',
      order: 'desc',
    },
    {
      key: 'name-asc',
      value: 'Name - Ascending',
      type: 'string',
      order: 'asc',
    },
    {
      key: 'name-des',
      value: 'Name - Descending',
      type: 'string',
      order: 'desc',
    },
  ];

  @Input() feed: any = [];
  @Output() filterChange = new EventEmitter<any>();

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
      const query = params['filter'];
      if (query) {
        this.filter = query == 'false' ? '' : query;

        setTimeout(async () => {
          await this.beginFilter();
        }, 1000);
      }
      // Call any method or perform any action based on the new searchQuery value
    });

    const query = this.route.snapshot.queryParamMap.get('search');
    if (query) {
      this.filter = query;
      setTimeout(async () => {
        await this.beginFilter();
      }, 1000);
    }
  }

  async beginFilter(event: any = null) {
    const lowerFilter = this.filter.toLowerCase();
    /*this.feed = this.feed.filter(
      (item: any) =>
        item.title.toLowerCase().includes(lowerKeyword) ||
        item.description.toLowerCase().includes(lowerKeyword) ||
        item.tags.some((tag: any) => tag.toLowerCase().includes(lowerKeyword)),
    );*/ //

    /*this.feedFilter = this.feed.filter(
      (item: any) =>
        //item.title.toLowerCase().includes(lowerKeyword) ||
        //item.description.toLowerCase().includes(lowerKeyword),
    );*/

    this.feedFilter = await this.sortFeed(this.feed);

    let filterData = {
      filter: this.filter,
      results: this.feedFilter,
    };
    this.filterChange.emit(filterData);
  }

  async sortFeed(feed: any) {
    switch (this.sort.key) {
      case 'price-asc':
        feed.sort(function (a: any, b: any) {
          //a = a.value.fields.filter(f => f.type == 'currency');
          //b = b.value.fields.filter(f => f.type == 'currency');
          a = a.variants[0].price.amount;
          b = b.variants[0].price.amount;
          return parseFloat(a) - parseFloat(b);
        });
        break;
      case 'price-des':
        feed.sort(function (a: any, b: any) {
          //a = a.value.fields.filter(f => f.type == 'currency');
          //b = b.value.fields.filter(f => f.type == 'currency');
          a = a.variants[0].price.amount;
          b = b.variants[0].price.amount;
          return parseFloat(b) - parseFloat(a);
        });
        break;
      case 'name-asc':
        feed.sort(function (a: any, b: any) {
          if (a.title < b.title) return -1;
          if (a.title > b.title) return 1;
          return 0;
        });
        break;
      case 'name-des':
        feed.sort(function (a: any, b: any) {
          if (b.title < a.title) return -1;
          if (b.title > a.title) return 1;
          return 0;
        });
        break;
    }
    //this.sortedpages = this.lib.deepCopy(this.filteredpages);
    //this.doPagination(this.sortedpages);
  }
}
