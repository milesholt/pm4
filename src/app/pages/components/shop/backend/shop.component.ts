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
import { ItemsComponent } from '../../items/items.component';

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
        el: {
          fields: [
            {
              name: 'Title',
              key: 'title',
              type: 'text',
              value: '',
              placeholder: 'Enter your product title',
            },
            {
              name: 'Description',
              key: 'description',
              type: 'textarea',
              value: '',
              placeholder: 'Enter your product description',
            },
            {
              name: 'Alias',
              key: 'alias',
              type: 'text',
              value: '',
              placeholder: 'Enter an alias for your product',
            },
            {
              name: 'Tags',
              key: 'tags',
              type: 'text',
              value: '',
              placeholder: 'Enter up to 5 tags for your product',
            },
            {
              name: 'Price',
              key: 'price',
              type: 'text',
              value: '',
              placeholder: 'Enter your product price',
            },
            {
              name: 'Currency',
              key: 'currency',
              type: 'text',
              value: '',
              placeholder: 'Enter a specific currency (optional)',
            },
            
          ],
        },
      },
      {
        title: 'Product Images',
        component: ImageComponent,
        params: { multiple: true, type: 'upload' },
      },
      {
        title: 'Variants',
        component: ItemsComponent,
        el: { 
          fields: [
          {
            name: 'Variant Title',
            key: 'title',
            type: 'text',
            value: '',
            placeholder: 'Enter your product title',
          },
          {
            name: 'Variant Description',
            key: 'description',
            type: 'textarea',
            value: '',
            placeholder: 'Enter your product description',
          },
          {
            name: 'Variant Alias',
            key: 'alias',
            type: 'text',
            value: '',
            placeholder: 'Enter an alias for your product',
          },
          {
            name: 'Variant Tags',
            key: 'tags',
            type: 'text',
            value: '',
            placeholder: 'Enter up to 5 tags for the variant',
          },
          {
            name: 'Price',
            key: 'price',
            type: 'text',
            value: '',
            placeholder: 'Enter variant price',
          },
          {
            name: 'Currency',
            key: 'currency',
            type: 'text',
            value: '',
            placeholder: 'Enter a specific currency (optional)',
          },
        ] 
      },
      },
      {
        title: 'Shipping & Delivery',
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
