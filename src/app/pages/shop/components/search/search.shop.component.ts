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
      if (params['search']) {
        this.search = params['search'];
        setTimeout(async () => {
          await this.beginSearch();
        }, 1000);
      }
      // Call any method or perform any action based on the new searchQuery value
    });

    const query = this.route.snapshot.queryParamMap.get('search');
    if (query) {
      this.search = query;
      setTimeout(async () => {
        await this.beginSearch();
      }, 1000);
    }
  }

  async beginSearch(event: any = null) {
    const lowerKeyword = this.search.toLowerCase();
    /*this.feed = this.feed.filter(
      (item: any) =>
        item.title.toLowerCase().includes(lowerKeyword) ||
        item.description.toLowerCase().includes(lowerKeyword) ||
        item.tags.some((tag: any) => tag.toLowerCase().includes(lowerKeyword)),
    );*/ //

    this.feedFilter = this.feed.filter(
      (item: any) =>
        item.title.toLowerCase().includes(lowerKeyword) ||
        item.description.toLowerCase().includes(lowerKeyword),
    );
    if (this.feedFilter.length === 0 && lowerKeyword !== '')
      this.searchMessage = 'No items found';
    else this.searchMessage = '';
    let searchData = {
      keyword: this.search,
      results: this.feedFilter,
    };
    this.searchChange.emit(searchData);
  }
}
