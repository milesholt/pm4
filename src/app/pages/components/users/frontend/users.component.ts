import {
  Input,
  Output,
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ViewChildren,
  TemplateRef,
  ChangeDetectorRef,
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
})
export class UsersFrontendComponent implements OnInit, AfterViewInit {
  localUser: any;
  @Input() userId: string | null = null;
  @Input() siteId: string | null = null;
  @Input() vendorId: string | null = null;
  @ViewChild('imageTemplate') imageTemplate!: TemplateRef<any>;

  @ViewChild('profileTab', { static: true }) profileTab!: TemplateRef<any>;
  @ViewChild('photosTab', { static: true }) photosTab!: TemplateRef<any>;

  tabs: any[] = [];

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
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    // Get vendorId from route/query params
    this.route.queryParams.subscribe((params) => {
      this.routeParams = params;
      this.userId = params['userId'] || null;
      this.vendorId = params['vendorId'] || null;
      this.siteId = params['siteId'] || null;
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.tabs = [
        { title: 'Profile', template: this.profileTab },
        { title: 'Photos', template: this.photosTab },
      ];
      // Trigger change detection manually
      this.cdr.detectChanges();
    });
  }

  ngOnInit() {
    this.tabs = [
      {
        title: 'Profile',
        template: this.profileTab,
      },
      {
        title: 'Photos',
        template: this.photosTab,
      },
    ];
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

  getUserFields() {
    let fieldData = this.userForm.fields;
    if(this.user?.userData?.profile?.length){
      fieldData = this.user.userData.profile;
    }
    let fields = fieldData.filter(
      (field: any) => field.type !== 'submit'
    );
    return fields;
  }

  async addImages() {
    const result = await this.service.modal.openModal(this.imageTemplate, {});

    if (result) {
      console.log('Collected iage data:', result);
      console.log('Image added');
      let imageUrl = result.url;
      let imageData = {
        url: result.url,
        tags: [],
        alt: '',
        caption: '',
        description: '',
        title: '',
        created: new Date(),
        modified: new Date(),
      };
      if (imageUrl) (this.user.userData ??= {}).images ??= [];
      this.user.userData.images.push(imageData);

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
    console.log('handle updated data passed back');
  }

  async editProfile() {
    const result = await this.service.modal.openModal(
      null,
      this.getUserFields()
    );
    console.log('data returned');
    console.log(result);
    //update data

    if(result){

      let profileData = result.data.fields;
      this.user.userData.profile = profileData;

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
}
