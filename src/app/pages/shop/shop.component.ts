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
  constructor(public service: CoreService, public router: Router) {}

  ngOnInit() {
    this.test();
  }

  test() {
    console.log(this.service.shop);
  }
}
