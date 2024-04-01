import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
//import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
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

  @Input() feed: any = [];
  @Output() searchChange = new EventEmitter<any>();

  constructor(
    public service: CoreService,
    public navCtrl: NavController,
    public router: Router,
    public lib: Library,
  ) {}

  ngOnInit() {}

  beginSearch(event: any) {
    const lowerKeyword = this.search.toLowerCase();
    /*this.feed = this.feed.filter(
      (item: any) =>
        item.title.toLowerCase().includes(lowerKeyword) ||
        item.description.toLowerCase().includes(lowerKeyword) ||
        item.tags.some((tag: any) => tag.toLowerCase().includes(lowerKeyword)),
    );*/ //

    this.feed = this.feed.filter(
      (item: any) =>
        item.title.toLowerCase().includes(lowerKeyword) ||
        item.description.toLowerCase().includes(lowerKeyword),
    );
    if (this.feed.length === 0 && lowerKeyword !== '')
      this.searchMessage = 'No items found';
    else this.searchMessage = '';
    let searchData = {
      keyword: this.search,
      results: this.feed,
    };
    this.searchChange.emit(searchData);
  }
}
