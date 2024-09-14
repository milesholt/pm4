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
} from '@angular/core';
//import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
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
  @Input() params: any | null = null;
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
      name: 'form',
      title: 'Form',
      component: FormComponent,
      icon: 'list',
      params: {},
    },
    {
      name: 'faq',
      title: 'FAQ',
      component: AccordionComponent,
      icon: 'help-circle-outline',
      params: {},
    },
    {
      name: 'mailinglist',
      title: 'Mailing List',
      component: FormComponent,
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
      component: GalleryComponent,
      icon: 'logo-instagram',
      params: {},
    },
    {
      name: 'googledrive',
      title: 'Google Drive',
      component: DriveComponent,
      icon: 'logo-google',
      params: {},
    },
    {
      name: 'video',
      title: 'Video',
      component: VideoComponent,
      icon: 'videocam',
      params: {},
    },
    {
      name: 'slideshow',
      title: 'Slideshow',
      component: SliderComponent,
      icon: 'albums',
      params: {},
    },
    {
      name: 'gallery',
      title: 'Gallery',
      component: GalleryComponent,
      icon: 'images',
      params: {},
    },
  ];
  activeModule: any = {};

  isActiveModule: boolean = false;
  isSettings: boolean = false;

  constructor(
    public service: CoreService,
    public navCtrl: NavController,
    public router: Router,
    public lib: Library,
    private modalController: ModalController
  ) {}

  async ngOnInit() {
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
      module.params = modParams;

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
        ? this.params
        : this.lib.deepCopy(mod?.params || {});

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
    this.showSettings();
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
    console.log('handle settings callback');
    this.activeModule.params.settings.form = response.data;
    this.callback.emit({
      name: this.activeModule.name,
      params: this.activeModule.params,
    });
    this.closeSettings();
  }
}
