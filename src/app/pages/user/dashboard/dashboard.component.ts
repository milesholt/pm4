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
  isLoading: boolean = false;
  userSettings: any;

  showSites: boolean = true;
  showMemberships: boolean = false;
  showSettings: boolean = false;
  showProfile: boolean = false;

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
    this.isLoading = true;
    await this.getSites();
    if (!!this.action) {
      this.doAction(this.action);
    }
  }

  async doAction(action: any = false) {
    switch (action) {
      case 'createSite':
        console.log('creating site');
        this.isCreateSite = true;
        this.message = 'Setting up, one moment...';
        this.generated = localStorage.getItem('generatedSite');
        this.companyInfo = localStorage.getItem('companyInfo');

        if (!!this.generated && !!this.companyInfo) {
          this.companyInfo = JSON.parse(this.companyInfo);
          await this.createSite();
        } else {
          this.message = 'Sorry there was a problem loading your info.';
        }

        break;

      case 'checkUser':
        this.checkUser();
        break;

      case 'newUser':
        this.setupUser();
        break;
    }
  }

  checkUser() {
    const userId = this.service.auth.userId;
    const pathSegments = ['users', userId, 'user'];
    const docName = 'settings';

    this.service.firestore
      .getDocumentById(pathSegments, <string>docName)
      .subscribe(
        (doc) => {
          if (doc) {
            this.userSettings = JSON.parse(doc);
          }
        },
        (error) => {
          console.log('No user found, setting up new user');
          this.setupUser();
        }
      );
  }

  setupUser() {
    const userId = this.service.auth.userId;
    const pathSegments = ['users', userId, 'user'];
    const documentName = 'settings';
    const documentData = {
      aiLimit: 100,
      aiCalls: 0,
      membershipId: 'gold',
      siteLimit: 5,
      sitesCreated: 0,
    };

    this.service.firestore
      .createDocument(pathSegments, documentData, documentName)
      .then(async () => {
        this.message = 'User set up.';
      })
      .catch((e: any) => {
        alert('here');
        this.message = e;
      });
  }

  signOut() {
    return this.service.auth.SignOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['login']);
    });
  }

  //Main site functionality

  showSection(section: string) {
    switch (section) {
      case 'sites':
        this.showSites = true;
        this.showMemberships = false;
        this.showSettings = false;
        this.showProfile = false;
        break;
      case 'memberships':
        this.showSites = false;
        this.showMemberships = true;
        this.showSettings = false;
        this.showProfile = false;
        break;
      case 'settings':
        this.showSites = false;
        this.showMemberships = false;
        this.showSettings = true;
        this.showProfile = false;
        break;
      case 'profile':
        this.showSites = false;
        this.showMemberships = false;
        this.showSettings = false;
        this.showProfile = true;
        break;
    }
  }

  async createSite() {
    if (this.userSettings.sitesCreated + 1 > this.userSettings.siteLimit) {
      const details = {
        heading: 'Site limit reached',
        message:
          "Thanks for using SiteInAnHour. You've now reached your limit for this membership. Upgrade to continue creating more sites.",
        confirmLabel: 'Upgrade',
      };
      this.createAlert(details).then((res: any) => {
        if (res) {
          this.showSection('memberships');
        }
      });
    }
    // Example: Add a document
    this.message = 'Preparing to store site...' + this.companyInfo.name;
    const userId = this.service.auth.userId;
    const pathSegments = ['users', userId, 'sites'];

    const documentData = {
      name: this.companyInfo.name,
      created: new Date(),
      modified: new Date(),
    };

    this.service.firestore
      .createDocument(pathSegments, documentData)
      .then(async () => {
        this.message = 'Site being setup..';
        //await this.getSites();
        await this.updateSite();
      })
      .catch((e: any) => {
        alert('here');
        this.message = e;
      });
  }

  async observeSites() {
    // Example: Fetch documents
    this.message = 'Fetching database...';
    const userId = this.service.auth.userId;
    const pathSegments = ['users', userId, 'sites'];
    this.subscription = this.service.firestore
      .getDocuments(pathSegments)
      .subscribe({
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
    const userId = this.service.auth.userId;
    const pathSegments = ['users', userId, 'sites'];

    this.service.firestore
      .getDocumentsPromise(pathSegments)
      .then(async (data: any) => {
        this.sites = data;
        this.message = '';
        this.isLoading = false;
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
    const details = {
      heading: 'Confirm Delete',
      message: 'Are you sure you want to delete this site?',
      confirmLabel: 'Delete',
    };
    this.createAlert(details).then((res: any) => {
      if (res) {
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
      }
    });

    /*const alert = await this.alertController.create({
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

    await alert.present();*/
  }

  async createAlert(details: any) {
    const alert = await this.alertController.create({
      header: details.heading,
      message: details.message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Alert operation canceled');
            return false;
          },
        },
        {
          text: details.confirmLabel,
          handler: () => {
            //handle confirm callback
            return true;
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
    //const collectionName = 'sites';

    //const documentId = 'eLPOqsKWpPos5c0ezpFW'; // You need to have this ID
    let lastSite = this.sites[this.sites.length - 1];
    console.log('sites');
    console.log(this.sites);
    const documentId = !!site ? site.id : lastSite.id;

    const userId = this.service.auth.userId;
    const pathSegments = ['users', userId, 'sites'];

    //const updatedData = { fieldName: 'new value' };
    const updatedData = {
      data: this.generated,
      name: !!site ? site.name : this.companyInfo.name,
      modified: new Date(),
    };

    this.service.firestore
      .updateDocument(pathSegments, documentId, updatedData)
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

        return true;
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
