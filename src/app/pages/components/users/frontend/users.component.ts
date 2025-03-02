import { Input, Output, Component, OnInit } from '@angular/core';
//import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { Library } from '../../../../app.library';
import { CoreService } from '../../../../services/core.service';

@Component({
  //standalone: true,
  selector: 'app-users-front',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [CoreService, Library],
  //imports:[IonicModule]
})
export class UsersFrontendComponent implements OnInit {
  localUser: any;
  @Input() userId: string | null = null;
  @Input() siteId: string | null = null;
  @Input() vendorId: string | null = null;
  user: any;
  routeParams: any;
  //

  constructor(
    public service: CoreService,
    public navCtrl: NavController,
    public router: Router,
    public lib: Library,
    private route: ActivatedRoute
  ) {
    // Get vendorId from route/query params
    this.route.queryParams.subscribe((params) => {
      this.routeParams = params;
      this.userId = params['userId'] || null;
      this.vendorId = params['vendorId'] || null;
      this.siteId = params['siteId'] || null;
    });
  }

  ngOnInit() {
    this.getUser();
  }

  async getUser() {
    if (!this.userId) return;
    const pathSegments = [
      'users',
      this.vendorId,
      'sites',
      this.siteId,
      'users',
    ];
    await this.service.firestore
      .getDocumentPromise(pathSegments, this.userId)
      .then((user) => {
        this.user = user;
      })
      .catch((e: any) => {
        console.log('error getting user');
      });
  }
}
