import { Component, OnInit } from '@angular/core';
import { CoreService } from '../../services/core.service';
import { Library } from '../../app.library';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shop.component.ts',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
  providers: [CoreService, Library],
})
export class ShopComponent implements OnInit {
  products: any;
  constructor(
    public service: CoreService,
    public router: Router,
  ) {}

  ngOnInit() {
    this.test();
  }

  test() {
    this.service.shop.getProducts(this.service.shop.client).then((products) => {
      console.log(products);
      this.products = products;
    });
  }
}
