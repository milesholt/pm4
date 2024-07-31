import { Component, OnInit } from '@angular/core';
import { CoreService } from '../../../services/core.service';
import { Library } from '../../../app.library';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [CoreService, Library],
})
export class DashboardComponent implements OnInit {
  message: string = '';
  sites: any = [];
  action: string | boolean = false;
  generated: any = false;
  companyInfo: any = false;

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

    if (!!this.action) this.doAction(this.action);
  }

  async doAction(action: any = false) {
    switch (action) {
      case 'createSite':
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
    this.service.firestore
      .createDocument('sites', { name: this.companyInfo.companyName })
      .then(async () => {
        this.message = 'Site being setup..';
        await this.getSites();
        await this.updateSite();
      })
      .catch((e: any) => {
        this.message = e;
      });
  }

  getSites() {
    // Example: Fetch documents
    this.service.firestore.getDocuments('sites').subscribe(
      (data: any) => {
        this.sites = data;
      },
      (error) => {
        this.message = error.message;
        console.error('Error fetching sites: ', error);
      }
    );
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
    // Example usage of updating a document
    const collectionName = 'sites';
    //const documentId = 'eLPOqsKWpPos5c0ezpFW'; // You need to have this ID
    const documentId = this.sites[0].id;

    //const updatedData = { fieldName: 'new value' };
    const updatedData = this.generated;

    this.service.firestore
      .updateDocument(collectionName, documentId, updatedData)
      .then(() => {
        //this.message = 'Site updated';
        this.message =
          'Success, your site url is : https://siteinanhour.com/?site=' +
          this.sites[0].id;
        console.log('Document updated successfully!');
      })
      .catch((error) => {
        this.message = 'Site could not be updated';
        console.error('Error updating document: ', error);
      });
  }
}
