import {
  Input,
  Output,
  Component,
  OnInit,
  ViewChild,
  ViewChildren,
  TemplateRef,
} from '@angular/core';
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
  @ViewChild('imageTemplate') imageTemplate!: TemplateRef<any>;

  user: any;
  routeParams: any;
  userForm: any = {
    action: 'returnform',
    classes: 'nocol',
    fields: [
      {
        key: 'name',
        name: 'Full Name',
        value: '',
        type: 'text',
        placeholder: 'Enter your full name',
      },
      {
        key: 'dob',
        name: 'Date of Birth',
        value: '',
        type: 'date',
        placeholder: 'Enter your date of birth (optional)',
      },
      {
        key: 'bio',
        name: 'Bio',
        placeholder: 'Enter a brief description about yourself',
        value: '',
        type: 'textarea',
        classes: 'nocol',
        required: true,
        autocomplete: true,
        prefix: '',
        suffix: '',
        counter: true,
        maxlength: 500,
        autogrow: true,
        options: [],
      },
      {
        key: 'interests',
        name: 'Interests',
        value: '',
        type: 'text',
        placeholder: 'Enter your interests',
      },
      {
        key: 'submit',
        name: 'Apply',
        type: 'submit',
      },
    ],
  };

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

  async addImages() {
    const result = await this.service.modal.openModal(this.imageTemplate, {});

    if (result) {
      console.log('Collected iage data:', result);
      console.log('Image added');
      let imageUrl = result.url;
      if (imageUrl) (this.user.userData ??= {}).images ??= [];
      this.user.userData.images.push(imageUrl);

      let userData = {
        userData: this.user.userData,
      };

      //Store images on userData
      const pathSegments = [
        'users',
        this.vendorId,
        'sites',
        this.siteId,
        'users',
      ];

      if (this.userId)
        await this.service.firestore.updateDocument(
          pathSegments,
          this.userId,
          userData
        );
    }
  }

  closeModal(modal: any, data: any) {
    modal.dismiss(data); // Pass collected data back when closing
  }
}
