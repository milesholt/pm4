import { Component, OnDestroy, OnInit } from '@angular/core';
import { CoreService } from '../../../services/core.service';
import { Library } from '../../../app.library';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { IonItemSliding } from '@ionic/angular';

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
  isCreateSite: boolean = false;
  private subscription: Subscription | null = null;

  constructor(
    public service: CoreService,
    public library: Library,
    public router: Router,
    private route: ActivatedRoute,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    this.route.queryParams.subscribe(async (params: Params) => {
      if (params['action']) this.action = params['action'];
    });
    this.action = localStorage.getItem('doAction') ?? false;
    await this.getSites();
    if (!!this.action) {
      this.doAction(this.action);
    }
  }

  async doAction(action: any = false) {
    switch (action) {
      case 'createSite':
        this.isCreateSite = true;
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
        //await this.getSites();
        await this.updateSite();
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
        this.message = '';
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

  async deleteSite(site: any = false) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this site?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Delete operation canceled');
          },
        },
        {
          text: 'Delete',
          handler: () => {
            const collectionName = 'sites';
            const documentId = site.id;

            this.service.firestore
              .deleteDocument(collectionName, documentId)
              .then(() => {
                this.message = 'Site deleted';
                console.log('Site deleted successfully!');
                this.getSites();
              })
              .catch((error) => {
                this.message = error;
                console.error('Error deleting document: ', error);
              });
          },
        },
      ],
    });

    await alert.present();
  }

  renameSite(siteName: any = false, sidx: number) {
    if (siteName == '') {
      alert('Site name cannot be blank');
      this.sites[sidx].name = 'Your site';
      return false;
    }
    return true;
  }

  updateSite(site: any = false) {
    this.message = 'Updating database...';
    // Example usage of updating a document
    const collectionName = 'sites';

    //const documentId = 'eLPOqsKWpPos5c0ezpFW'; // You need to have this ID
    let lastSite = this.sites[this.sites.length - 1];
    console.log('sites');
    console.log(this.sites);
    const documentId = !!site ? site.id : lastSite.id;

    //const updatedData = { fieldName: 'new value' };
    const updatedData = {
      data: this.generated,
      name: !!site ? site.name : this.generated.title,
    };

    this.service.firestore
      .updateDocument(collectionName, documentId, updatedData)
      .then(() => {
        if (!site && this.isCreateSite === true) {
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
          this.isCreateSite = false;
        } else {
          this.message = 'Site updated';
          setTimeout(() => {
            this.message = '';
          }, 2000);
        }

        return false;
      })
      .catch((error) => {
        this.message = 'Site could not be updated';
        console.error('Error updating document: ', error);
      });
  }

  genSiteLink(siteId: any = false) {
    if (!!siteId) {
      const siteurl = '/brandbuilder?site=' + siteId;

      this.message =
        'Here is your site url: <a href="' + siteurl + '">' + siteurl + '<a/>';
    }
  }

  slideItem(slidingItem: IonItemSliding) {
    slidingItem.open('end');
  }

  previewSite(siteId: any = false) {
    console.log('previewing site');
    if (siteId) {
      const siteurl = ['brandbuilder'];
      const queryParams = { site: siteId };
      this.router.navigate(siteurl, { queryParams });
    }
  }
}
