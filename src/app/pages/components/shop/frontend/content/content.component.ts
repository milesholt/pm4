import { Component, OnInit } from '@angular/core';
//import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { Library } from '../../../app.library';
import { CoreService } from '../../../services/core.service';

//import { HttpClientModule } from '@angular/common/http';

@Component({
  //standalone: true,
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  providers: [CoreService, Library],
  //imports:[IonicModule]
})
export class ShopContentComponent implements OnInit {
  alias: any = false;
  pageContent: any;

  pages: any = {
    'shipping-policy': {
      title: 'Shipping Policy',
      alias: 'shipping-policy',
      components: [],
    },
    'refund-policy': {
      title: 'Refund Policy',
      alias: 'refund-policy',
      components: [],
    },
    'privacy-policy': {
      title: 'Privacy Policy',
      alias: 'privacy-policy',
      components: [],
    },
    'terms-and-conditions': {
      title: 'Terms & Conditions',
      alias: 'terms-and-conditions',
      components: [],
    },
    'about-us': {
      title: 'About Us',
      alias: 'about-us',
      components: [],
    },
    'contact-us': {
      title: 'Contact Us',
      alias: 'contact-us',
      components: ['app-contactform-comp'],
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
      this.loadPageContent(this.alias);
    }
  }

  loadPageContent(page: any) {
    //Content has to be stored in assets folder to be called locally
    const url = `assets/content/${page}.html`;

    this.service.http.getTest(url, { responseType: 'text' }).subscribe(
      (response) => {
        this.pageContent = response;
      },
      (error) => {
        console.log(error);
      },
    );

    // Adjust the URL to match the path where your HTML pages are stored
    //const url = `${this.alias}.html`; // Assuming HTML pages are stored in 'src/assets'
    // Fetch HTML content using HttpClient
    /*this.http.get(url, { responseType: 'text' }).subscribe(
      (htmlContent: string) => {
        this.pageContent = htmlContent;
      },
      (error) => {
        console.error('Error loading page content:', error);
        // Handle error appropriately
      },
    );*/
  }

  //
}
