import {
  Input,
  Output,
  ViewChild,
  Component,
  OnInit,
  ChangeDetectorRef,
  ElementRef,
  ViewChildren,
  TemplateRef,
  QueryList,
} from '@angular/core';
import { CoreService } from '../../../../services/core.service';
import { Library } from '../../../../app.library';
import { Router, ActivatedRoute, Params } from '@angular/router';
//import { ProductComponent } from './product/product.component';

import { TabsComponent } from '../../tabs/tabs.component';
import { FormComponent } from '../../form/form.component';
import { ImageComponent } from '../../image/image.component';

import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

import { register } from 'swiper/element/bundle';
register();

//

@Component({
  selector: 'app-shop-back',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
  providers: [CoreService, Library],
})
export class ShopComponentBackend implements OnInit {
  filterSite: any = { name: '', id: 0 };
  @Input() sites: any = null;
  vendor: any;
  message: string = '';
  products: any = [];
  productTabs: any = [];
  @ViewChild('productTemplate') productTemplate!: TemplateRef<any>;

  constructor(
    public service: CoreService,
    public router: Router,
    private route: ActivatedRoute,
    public library: Library,
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.filterSite = this.sites[0];
    //get vendor info
    this.vendor = this.service.auth.getUser();
    if (this.sites) {
      this.getProducts();
    }
  }

  changeSite(e: any) {}

  async getProducts() {
    if (!this.vendor.uid) return;
    const pathSegments = [
      'users',
      this.vendor.uid,
      'sites',
      this.filterSite.id,
      'products',
    ];
    await this.service.firestore
      .getDocumentsPromise(pathSegments)
      .then((products) => {
        if (products.length > 0) {
          this.products = products;
        } else {
          this.message = 'No products found for this site';
        }
      })
      .catch((e: any) => {
        console.log('error getting products or no products');
        this.message = 'There was an error retrieving your products';
      });
  }

  async addProduct() {
    /*{
      id: null,
      title: null,
      description: null,
      meta: null,
      tags: null,
      alias: null,
      images: [],
      productType: null,
      featuredImage: null,
      price: 0,
      currency: null,
      url: null,
      variants: [],
    }*/

    this.productTabs = [
      {
        title: 'Product Details',
        component: FormComponent,
        params: { fields: ['title', 'description', 'tags'] },
      },
      {
        title: 'Product Images',
        component: ImageComponent,
        params: { multiple: true, type: 'upload' },
      },
      {
        title: 'Variants',
        component: FormComponent,
        params: { fields: ['variants'] },
      },
      {
        title: 'Pricing & Rates',
        component: FormComponent,
        params: { fields: ['price', 'currency'] },
      },
    ];

    const result = await this.service.modal.openModal(this.productTemplate, {});

    if (result) {
      console.log('Collected Product Data:', result);
      alert('Product added');
    }
  }

  closeModal(modal: any, data: any) {
    modal.dismiss(data); // Pass collected data back when closing
  }
}
