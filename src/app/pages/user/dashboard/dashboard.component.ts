import { Component, OnDestroy, OnInit } from '@angular/core';
import { CoreService } from '../../../services/core.service';
import { Library } from '../../../app.library';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { IonItemSliding } from '@ionic/angular';
import { filter } from 'rxjs/operators';

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
  userId: string | boolean = false;

  showSites: boolean = true;
  showMemberships: boolean = false;
  showSettings: boolean = false;
  showProfile: boolean = false;

  publishId: boolean | string = false;
  initialLoad = true;

  private subscription: Subscription | null = null;
  private authSubscription: Subscription | null = null;

  constructor(
    public service: CoreService,
    public library: Library,
    public router: Router,
    private route: ActivatedRoute,
    private alertController: AlertController
  ) {
    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe(() => {
        //if refreshed initialLoad will be true and ngOninit will run anyway, so skip and set to false
        //ngOnInit does not fire on route changes, but initalLoad will be set to false, so here we can fire it
        if (this.initialLoad) {
          this.initialLoad = false; //ngOnInit will be called on page load automatically
        } else {
          this.ngOnInit(); // Manually call ngOnInit on route change
        }
      });
  }

  async ngOnInit() {
    this.message = '';
    this.route.queryParams.subscribe(async (params: Params) => {
      if (params['action']) this.action = params['action'];
    });
    this.action = localStorage.getItem('doAction') ?? false;
    this.isLoading = true;

    // 1. Check if user is already logged in with credentials stored locally
    const localUser = this.service.auth.getUser(); // Assuming getUser() checks localStorage for user data

    if (localUser.uid) {
      this.userId = localUser.uid;
      this.checkUser();
    } else {
      // 2. Subscribe to authentication state if no local user is found
      this.authSubscription = this.service.auth.authState$.subscribe((user) => {
        if (user) {
          this.userId = user.uid;
          this.checkUser();

          // Unsubscribe after the first successful login
          if (this.authSubscription) {
            this.authSubscription.unsubscribe();
            this.authSubscription = null;
          }
        }
      });
    }

    /*await this.getSites();
    if (!!this.action) {
      this.doAction(this.action);
    }*/
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
          //this.message = 'Sorry there was a problem loading your info.';
          //onrefresh if query is still there but site could already be created
          this.isCreateSite = false;
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

  checkUserSettings() {
    console.log('checking user settings');

    const userId = this.userId;
    const pathSegments = ['users', userId, 'user'];
    const docId = 'settings';

    console.log(pathSegments);

    this.service.firestore.getDocumentById(pathSegments, docId).subscribe(
      (doc) => {
        if (doc) {
          this.userSettings = JSON.parse(JSON.stringify(doc));
          console.log('User settings:', this.userSettings);
        } else {
          console.log('No user settings found, setting up new user settings');
          this.setupUserSettings();
        }
      },
      (error) => {
        console.error('Error fetching user settings:', error.message);
        this.setupUserSettings();
      }
    );
  }

  async checkUser() {
    console.log('checking user');

    const userId = this.userId;
    console.log(userId);
    const pathSegments = ['users'];

    this.service.firestore
      .getDocumentById(pathSegments, <string>userId)
      .subscribe(
        async (doc) => {
          if (doc) {
            console.log('User found:');
            console.log(doc);
            //run user processes
            await this.checkUserSettings();
            await this.getSites();
            if (!!this.action) {
              this.doAction(this.action);
            }
          }
        },
        async (error) => {
          console.error('Error fetching user settings:', error.message);
          console.log('Setting up user and user settings');
          await this.setupUser();
          await this.setupUserSettings();
          await this.getSites();
        }
      );
  }

  setupUser() {
    console.log('setting up user');

    const userId = this.userId;
    const basePath = ['users'];
    const subcollections = ['user', 'sites', 'campaigns', 'videos'];

    // Create the main user document if it doesn't exist
    this.service.firestore
      .createDocument(basePath, { createdAt: new Date() }, userId)
      .then(() => {
        // Create subcollections with a placeholder document
        console.log('Setting up user collections');
        subcollections.forEach((subcollection) => {
          const userBasePath = ['users', userId];
          const subcollectionPath = [...userBasePath, subcollection];
          this.createPlaceholderDocument(subcollectionPath);
        });
        console.log('User database stucture set up');
        return true;
      })
      .catch((error) => {
        console.error('Error setting up user:', error);
      });
  }

  // Helper method to create a placeholder document in a subcollection
  createPlaceholderDocument(pathSegments: any) {
    const placeholderData = { isPlaceholder: true };
    this.service.firestore
      .createDocument(pathSegments, placeholderData, 'placeholder')
      .then(() => {
        console.log(`Created placeholder in ${pathSegments.join('/')}`);
      })
      .catch((error) => {
        console.error(
          `Error creating placeholder in ${pathSegments.join('/')}:`,
          error
        );
      });
  }

  setupUserSettings() {
    console.log('setting user settings');
    const userId = this.userId;
    const pathSegments = ['users', userId, 'user'];
    const documentName = 'settings';
    const documentData = {
      aiLimit: 100,
      aiCalls: 0,
      membershipId: 'starter',
      siteLimit: 5,
      sitesCreated: 0,
    };

    this.service.firestore
      .createDocument(pathSegments, documentData, documentName)
      .then(async () => {
        this.message = 'User set up.';
        this.userSettings = documentData;
      })
      .catch((e: any) => {
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
    /*if (this.userSettings.sitesCreated + 1 > this.userSettings.siteLimit) {
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
    }*/
    // Example: Add a document
    this.message = 'Preparing to store site...' + this.companyInfo.name;
    const userId = this.userId;
    const pathSegments = ['users', userId, 'sites'];

    const documentData = {
      name: this.companyInfo.name,
      created: new Date(),
      modified: new Date(),
    };

    this.service.firestore
      .createDocument(pathSegments, documentData)
      .then(async (doc) => {
        this.message = 'Site being setup..';
        console.log('doc:');
        console.log(doc.id);
        //await this.getSites();
        console.log('publishing...');
        await this.publishSite(doc.id);
        console.log('updating...');
        await this.updateSite(doc);
      })
      .catch((e: any) => {
        this.message = e;
      });
  }

  async observeSites() {
    // Example: Fetch documents
    this.message = 'Fetching database...';
    const userId = this.userId;
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
    console.log('getting sites');
    // Example: Fetch documents
    this.message = 'Fetching database...';
    const userId = this.userId;
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

    // Ensure we clean up the subscription if the component is destroyed
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
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
        //const collectionName = 'sites';
        const userId = this.userId;
        const pathSegments = ['users', userId, 'sites'];

        const documentId = site.id;

        this.service.firestore
          .deleteDocument(pathSegments, documentId)
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

  async createAlert(details: any): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const alert = await this.alertController.create({
        header: details.heading,
        message: details.message,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Alert operation canceled');
              resolve(false); // Resolve with `false` if canceled
            },
          },
          {
            text: details.confirmLabel,
            handler: () => {
              // Handle confirm callback
              resolve(true); // Resolve with `true` if confirmed
            },
          },
        ],
      });

      await alert.present();
    });
  }

  renameSite(siteName: any = false, sidx: number) {
    if (siteName == '') {
      alert('Site name cannot be blank');
      this.sites[sidx].name = 'Your site';
      return false;
    }
    return true;
  }

  publishSite(siteId: any = false) {
    return new Promise((resolve, reject) => {
      console.log('publishing site');

      const userId = this.userId;

      console.log('userid:');
      console.log(userId);

      const pathSegments = ['sites'];
      const urlSegments = ['users', userId, 'sites'];

      //const updatedData = { fieldName: 'new value' };
      const siteData = {
        urlSegments: urlSegments,
        siteId: siteId,
        status: 'published',
      };

      console.log(siteData);

      this.service.firestore
        .createDocument(pathSegments, siteData)
        .then((doc) => {
          console.log('site published');
          console.log(doc.id);
          this.publishId = doc.id;
          console.log('publishId:');
          console.log(this.publishId);
          resolve(this.publishId);
        })
        .catch(() => {
          console.log('site not pulished');
          reject();
        });
    });
  }

  updateSite(site: any = false) {
    this.message = 'Updating database...';
    // Example usage of updating a document
    //const collectionName = 'sites';

    if (!site) {
      alert('No site to update');
      return false;
    }

    //const documentId = 'eLPOqsKWpPos5c0ezpFW'; // You need to have this ID
    //let lastSite = this.sites[this.sites.length - 1];
    //console.log('sites');
    //console.log(this.sites);
    //const documentId = !!site ? site.id : lastSite.id;

    const documentId = site.id;

    const userId = this.userId;
    const pathSegments = ['users', userId, 'sites'];

    //const updatedData = { fieldName: 'new value' };
    const updatedData = {
      data: this.generated,
      name: !!site && site.name ? site.name : this.companyInfo.name,
      modified: new Date(),
      publishId: this.publishId,
    };

    this.service.firestore
      .updateDocument(pathSegments, documentId, updatedData)
      .then(() => {
        if (this.isCreateSite === true) {
          //this.message = 'Site updated';
          const siteurl = '/brandbuilder?site=' + this.publishId;
          this.message =
            'Success, your site url is : <a target="_blank" href="' +
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

    return true;
  }

  genSiteLink(site: any = false) {
    if (!!site) {
      const siteurl =
        'https://siteinanhour.com/brandbuilder?site=' + site.publishId;

      this.message =
        'Here is your site url:<br><a target="_blank" href="' +
        siteurl +
        '">' +
        siteurl +
        '<a/>';
    }
  }

  slideItem(slidingItem: IonItemSliding) {
    slidingItem.open('end');
  }

  previewSite(siteId: any = false) {
    console.log('previewing site');
    if (siteId) {
      const siteurl = ['brandbuilder'];
      const queryParams = { site: siteId, edit: true };
      this.router.navigate(siteurl, { queryParams });
    }
  }
}
