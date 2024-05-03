import { Component, OnInit } from '@angular/core';
//import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { Library } from '../../../app.library';
import { CoreService } from '../../../services/core.service';

@Component({
  //standalone: true,
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  providers: [CoreService, Library],
  //imports:[IonicModule]
})
export class ContentComponent implements OnInit {
  alias: any = false;

  pages: any = {
    'shipping-policy': {
      title: 'Shipping Policy',
      alias: 'shipping-policy',
      content: 'Shipping Policy content',
    },
    'refund-policy': {
      title: 'Refund Policy',
      alias: 'refund-policy',
      content: 'Refund Policy content',
    },
    'privacy-policy': {
      title: 'Privacy Policy',
      alias: 'privacy-policy',
      content: 'Privacy Policy content',
    },
    'terms-and-conditions': {
      title: 'Terms & Conditions',
      alias: 'terms-and-conditions',
      content: 'Terms and conditions content',
    },
  };

  constructor(
    public service: CoreService,
    public navCtrl: NavController,
    public router: Router,
    public route: ActivatedRoute,
    public lib: Library,
  ) {}

  ngOnInit() {
    // Access the alias from the route parameters
    this.alias = this.router.url;
    // Remove the leading slash from the current route
    if (this.alias.startsWith('/')) {
      this.alias = this.alias.substring(1); // Remove the leading '/'
    }
  }

  //
}
