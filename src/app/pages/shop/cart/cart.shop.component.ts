import {
  Input,
  ChangeDetectorRef,
  Component,
  OnInit,
  SimpleChanges,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CoreService } from '../../../services/core.service';
import { Library } from '../../../app.library';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-shop-cart',
  templateUrl: './cart.shop.component.html',
  styleUrls: ['./cart.shop.component.scss'],
  providers: [CoreService, Library],
})
export class CartShopComponent implements OnInit {
  products: any;
  constructor(
    public service: CoreService,
    public router: Router,
    private route: ActivatedRoute,
    public library: Library,
    private elementRef: ElementRef<HTMLElement>,
  ) {}

  ngOnInit() {
    const element = this.elementRef.nativeElement;
    this.service.shop.getCart();
  }
}
