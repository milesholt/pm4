import {
  Component,
  ViewContainerRef,
  AfterViewInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  OnInit,
  TemplateRef,
  ChangeDetectorRef,
} from '@angular/core';
//import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { Library } from '../../../../app.library';
import { CoreService } from '../../../../services/core.service';

import { DynamicComponent } from '../../../components/dynamic/dynamic.component.interface';

import { DynamicWrapperComponent } from 'src/app/pages/components/dynamic/dynamic.component';

import { FormComponent } from 'src/app/pages/components/form/form.component';
import { AccordionComponent } from 'src/app/pages/components/accordion/accordion.component';
import { GalleryComponent } from 'src/app/pages/components/gallery/gallery.component';
import { VideoComponent } from 'src/app/pages/components/video/video.component';
import { SliderComponent } from 'src/app/pages/components/slider/slider.component';

import { DriveComponent } from '../drive/drive.brandbuilder.component';

import { EmbedComponent } from '../embed/embed.brandbuilder.component';

import { MailchimpComponent } from '../mailchimp/mailchimp.brandbuilder.component';

import { ModalController } from '@ionic/angular';
import { ModalComponent } from '../../../components/modal/modal.component';

import { ImageComponent } from 'src/app/pages/components/image/image.component';

/*
@Component({
  selector: 'app-some-component',
  template: '<div>Some Component with param: {{params | json}}</div>',
})
export class SomeComponent implements DynamicComponent {
  @Input() params: any;
}*/

@Component({
  //standalone: true,
  selector: 'app-modules-comp',
  templateUrl: './modules.brandbuilder.component.html',
  styleUrls: ['./modules.brandbuilder.component.scss'],
  providers: [CoreService, Library],
  //imports:[IonicModule]
})
export class ModulesComponent implements OnInit {
  @Input() name: string | null = null;
  @Input() id: string | null = null;
  @Input() params: any | null = null;
  @Input() photos: any | null = null;
  @Input() media: any | null = null;

  @Output() callback = new EventEmitter();

  @ViewChild('settingsTemplate') settingsTemplate!: TemplateRef<any>;
  @ViewChild('libraryTemplate') libraryTemplate!: TemplateRef<any>;

  @ViewChild('dynamicComponentContainer', {
    read: ViewContainerRef,
    static: true,
  })
  dynamicComponentContainer!: ViewContainerRef;

  @ViewChild('dynamicMod', { static: false })
  dynamicMod!: DynamicWrapperComponent;

  modules: any = [
    {
      name: 'image',
      title: 'Image',
      component: ImageComponent,
      icon: 'picture',
      params: { skipSettings: true },
    },
    {
      name: 'form',
      title: 'Form',
      component: FormComponent,
      icon: 'list',
      params: {},
    },
    {
      name: 'faq',
      title: 'FAQ',
      component_off: AccordionComponent,
      component: null,
      icon: 'help-circle-outline',
      params: {},
    },
    {
      name: 'mailinglist',
      title: 'Mailing List',
      component_off: FormComponent,
      component: null,
      icon: 'mail',
      params: {},
    },
    {
      name: 'mailchimp',
      title: 'Mailchimp',
      component: MailchimpComponent,
      icon: 'mail',
      params: {},
    },
    {
      name: 'youtube',
      title: 'Youtube',
      component: VideoComponent,
      icon: 'logo-youtube',
      params: {},
    },
    { name: 'link', title: 'Link', component: null, icon: 'link', params: {} },
    {
      name: 'embed',
      title: 'Embed',
      component: EmbedComponent,
      icon: 'code-working',
      params: {},
    },
    {
      name: 'instagram',
      title: 'Instagram',
      component_off: GalleryComponent,
      component: null,
      icon: 'logo-instagram',
      params: {},
    },
    {
      name: 'googledrive',
      title: 'Google Drive',
      component: DriveComponent,
      component_off: null,
      icon: 'logo-google',
      params: { skipSettings: true },
    },
    {
      name: 'video',
      title: 'Video',
      component_off: VideoComponent,
      component: null,
      icon: 'videocam',
      params: {},
    },
    {
      name: 'slideshow',
      title: 'Slideshow',
      component_off: SliderComponent,
      component: null,
      icon: 'albums',
      params: {},
    },
    {
      name: 'gallery',
      title: 'Gallery',
      component_off: GalleryComponent,
      component: null,
      icon: 'images',
      params: {},
    },
  ];
  activeModule: any = {};

  isActiveModule: boolean = false;
  isSettings: boolean = false;
  isEditing: boolean = false;

  constructor(
    public service: CoreService,
    public navCtrl: NavController,
    public router: Router,
    public route: ActivatedRoute,
    public lib: Library,
    private modalController: ModalController,
    public cdr: ChangeDetectorRef
  ) {}


  
  async ngOnInit() {

    this.route.queryParams.subscribe((params) => {
      if (this.service.auth.isLoggedIn && params['edit']) {
          this.isEditing = true;
      }
    });
    

    await this.loadParams();
    this.loadActiveModule();
  }

  loadParams() {
    //console.log('loading params');

    this.modules.forEach((module: any) => {
      if (module.component == null) return;

      // Create the component instance dynamically
      const componentRef: any = this.dynamicComponentContainer.createComponent(
        module.component
      );

      //console.log(componentRef.instance);

      // Access the params of the child component
      const modParams = componentRef.instance.params ?? {};

      // Assign params back to the module
      module.params = {...module.params, ...modParams};
      module.params.id = this.id;
      module.params.media = this.media;
      module.params.images = this.photos;

      //console.log('mod should have params');
      //console.log(module);

      // Destroy the component instance since it's not needed anymore
      componentRef.destroy();
    });
  }

  loadActiveModule(name: string | null = this.name) {
    if (name == null) return;

    //load related module from list
    const mod: any =
      this.modules.filter((mod: any) => mod.name === name)[0] ?? null;

    //load set params, otherwise copy default loaded params from module component
    this.params =
      this.params !== null && !this.lib.isEmpty(this.params)
        ? { ...mod?.params, ...this.params }
        : this.lib.deepCopy(mod?.params || {});

    console.log('active module');
    console.log(name);

    console.log(this.params);

    this.params.id = mod?.params.id;

    this.activeModule = {
      name: this.name,
      params: this.params,
    };
    this.isActiveModule = true;
  }

  callDynamicMethod(methodName: string) {
    if (this.dynamicMod && this.dynamicMod.componentRef) {
      const componentInstance = this.dynamicMod.componentRef.instance;

      // Ensure the method exists on the component
      if (typeof componentInstance[methodName] === 'function') {
        componentInstance[methodName](); // Dynamically call the method
      } else {
        console.error(
          `${methodName} is not available on the dynamic component`
        );
      }
    }
  }

  applyModule() {
    this.isActiveModule = true;
  }

  selectModule(module: any) {
    this.activeModule = {
      name: module.name,
      params: module.params,
    };
    console.log(this.activeModule);
    this.service.modal.dismiss();
    const skipSettings = this.activeModule.params?.skipSettings ?? false;
    console.log(this.activeModule.params);
    if (!skipSettings) {
      this.showSettings();
    } else {
      this.isActiveModule = true;
    }
    //
  }

  removeModule() {
    this.isActiveModule = false;
    this.activeModule = {};
  }

  async openLibrary() {
    const result = await this.service.modal.openModal(
      this.libraryTemplate,
      this.modules
    );

    if (result) {
      console.log('Library closed with data:', result);
    }
  }

  async showSettings() {
    this.isSettings = true;
    const result = await this.service.modal.openModal(
      this.settingsTemplate,
      this.activeModule
    );

    if (result) {
      console.log('Modal dismissed with data:', result);
      this.isSettings = false;
    }
  }

  closeSettings() {
    console.log('applying settings');
    this.isSettings = false;
    this.isActiveModule = true;
    this.service.modal.dismiss();
  }

  handleSettingsCallback(response: any) {
    console.log('updated settings callback');
    console.log(response);

    let modParams = this.activeModule.params;

    //Update form
    modParams.settings.form = this.lib.deepCopy(response.data);

    console.log('modParams form');
    console.log(modParams.settings.form);
    //Update values
    modParams.settings.form.fields.forEach((field: any) => {
      if (modParams.hasOwnProperty(field.key)) {
        modParams[field.key] = field.value;
      }
    });

    console.log(modParams);

    this.callback.emit({
      name: this.activeModule.name,
      params: this.activeModule.params,
    });
    this.closeSettings();
  }

  handleModuleCallback(response: any) {
    this.activeModule.params = response;
    this.callback.emit({
      name: this.activeModule.name,
      params: this.activeModule.params,
    });
  }
}
