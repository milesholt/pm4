import { Input, Output, Component, OnInit } from '@angular/core';
//import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { Library } from '../../../../app.library';
import { CoreService } from '../../../../services/core.service';
import { map } from 'rxjs';

@Component({
  //standalone: true,
  selector: 'app-users-back',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [CoreService, Library],
  //imports:[IonicModule]
})
export class UsersBackendComponent implements OnInit {
  vendor: any;
  message: any = '';
  isLoading: boolean = false;
  users: any = [];
  filterSite: string = 'All';
  @Input() sites: any = null;

  constructor(
    public service: CoreService,
    public navCtrl: NavController,
    public router: Router,
    public lib: Library
  ) {}

  ngOnInit() {
    //get vendor info
    this.vendor = this.service.auth.getUser();
    if (this.sites) {
      this.getUsers();
    }
  }

  async getUsers() {
    this.isLoading = true;
    this.message = '';

    let allUsers: any[] = []; // Store users as an array

    const promises = this.sites.map(async (site: any) => {
      const pathSegments = [
        'users',
        this.vendor.uid,
        'sites',
        site.id,
        'users',
      ];
      const data = await this.service.firestore.getDocumentsPromise(
        pathSegments
      );

      const usersArray = Object.keys(data).map((userId: any) => {
        const user = data[userId];

        return {
          ...user,
          id: userId,
          siteId: site.id,
          siteName: site.name,
          createdAt: user.createdAt
            ? this.formatTimestamp(user.createdAt)
            : null, // Convert timestamp
        };
      });

      return usersArray;
    });

    try {
      const results = await Promise.all(promises);

      // Flatten the array of arrays
      allUsers = results.flat();

      this.users = allUsers;
      this.isLoading = false;
    } catch (e) {
      this.message = e;
      this.isLoading = false;
    }
  }

  formatTimestamp(timestamp: { seconds: number; nanoseconds: number }): string {
    const date = new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds
    return date.toLocaleString(); // Format to readable date & time
  }
}
