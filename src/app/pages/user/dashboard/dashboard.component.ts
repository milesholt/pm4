import { Component, OnDestroy, OnInit } from '@angular/core';
import { CoreService } from '../../../services/core.service';
import { Library } from '../../../app.library';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [CoreService, Library],
})
export class DashboardComponent implements OnInit, OnDestroy {
  message: string = '';
  sites: any = [];
  action: string | boolean = false;
  generated: any = false;
  companyInfo: any = false;
  private subscription: Subscription | null = null;

  constructor(
    public service: CoreService,
    public library: Library,
    public router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(async (params: Params) => {
      if (params['action']) this.action = params['action'];
    });
    this.action = localStorage.getItem('doAction') ?? false;

    if (!!this.action) {
      this.doAction(this.action);
    }
  }

  async doAction(action: any = false) {
    switch (action) {
      case 'createSite':
        this.message = 'Setting up, one moment...';
        this.generated = localStorage.getItem('generatedSite');
        this.companyInfo = localStorage.getItem('companyInfo');

        if (!!this.generated && !!this.companyInfo) {
          await this.createSite();
        } else {
          this.message = 'Sorry there was a problem loading your info.';
        }

        break;
    }
  }

  signOut() {
    return this.service.auth.SignOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['login']);
    });
  }

  //Main site functionality

  async createSite() {
    // Example: Add a document
    this.message =
      'Preparing to store site...' + JSON.parse(this.companyInfo).name;
    this.service.firestore
      .createDocument('sites', {
        name: JSON.parse(this.companyInfo).name,
      })
      .then(async () => {
        this.message = 'Site being setup..';
        await this.getSites();
      })
      .catch((e: any) => {
        this.message = e;
      });
  }

  async observeSites() {
    // Example: Fetch documents
    this.message = 'Fetching database...';
    this.subscription = this.service.firestore.getDocuments('sites').subscribe({
      next: (data) => {
        this.message = 'Got sites';
        this.sites = data; // Process data here
        console.log('Documents fetched:', this.sites);
        this.updateSite();
      },
      error: (error) => {
        this.message = error.message;
        console.error('Error fetching documents: ', error);
      },
      complete: async () => {
        // Final action after data is processed and observable completes
        console.log('Subscription complete');
        this.message = 'done';
        this.updateSite();
      },
    });
  }

  async getSites() {
    // Example: Fetch documents
    this.message = 'Fetching database...';
    this.service.firestore
      .getDocumentsPromise('sites')
      .then(async (data: any) => {
        this.sites = data;
        this.message = 'Got sites';
        await this.updateSite();
      })
      .catch((e: any) => {
        this.message = e;
      });
  }

  ngOnDestroy() {
    // Unsubscribe from the observable to stop receiving data updates
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.updateSite(); // Finalize data processing
    }
  }

  deleteSite() {
    // Example usage of deleting a document
    const collectionName = 'sites';
    //const documentId = 'eLPOqsKWpPos5c0ezpFW'; // You need to have this ID
    const documentId = this.sites[0].id;

    this.service.firestore
      .deleteDocument(collectionName, documentId)
      .then(() => {
        this.message = 'Site deleted';
        console.log('Document deleted successfully!');
      })
      .catch((error) => {
        this.message = error;
        console.error('Error deleting document: ', error);
      });
  }

  updateSite() {
    this.message = 'Updating database...';
    // Example usage of updating a document
    const collectionName = 'sites';

    //const documentId = 'eLPOqsKWpPos5c0ezpFW'; // You need to have this ID
    let lastSite = this.sites[this.sites.length - 1];
    console.log('sites');
    console.log(this.sites);
    const documentId = lastSite.id;

    //const updatedData = { fieldName: 'new value' };
    const updatedData = {
      data: this.generated,
    };

    this.service.firestore
      .updateDocument(collectionName, documentId, updatedData)
      .then(() => {
        //this.message = 'Site updated';
        const siteurl = '/brandbuilder?site=' + documentId;
        this.message =
          'Success, your site url is : <a href="' +
          siteurl +
          '">' +
          siteurl +
          '<a/>';
        console.log('Document updated successfully!');
        localStorage.removeItem('generatedSite');
        localStorage.removeItem('companyInfo');
        localStorage.removeItem('doAction');

        return false;
      })
      .catch((error) => {
        this.message = 'Site could not be updated';
        console.error('Error updating document: ', error);
      });
  }
}
