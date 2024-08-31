import {
  Component,
  ViewContainerRef,
  AfterViewInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core';
//import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { Library } from '../../../../app.library';
import { CoreService } from '../../../../services/core.service';

import { DynamicComponent } from '../../../components/dynamic/dynamic.component.interface';

import { FormComponent } from 'src/app/pages/components/form/form.component';
import { AccordionComponent } from 'src/app/pages/components/accordion/accordion.component';
import { GalleryComponent } from 'src/app/pages/components/gallery/gallery.component';
import { VideoComponent } from 'src/app/pages/components/video/video.component';
import { SliderComponent } from 'src/app/pages/components/slider/slider.component';
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
  @Input() params: any = {};
  @Output() callback = new EventEmitter();

  @ViewChild('dynamicComponentContainer', {
    read: ViewContainerRef,
    static: true,
  })
  dynamicComponentContainer!: ViewContainerRef;

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
      component: null,
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
      component: null,
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
      component: null,
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
    public lib: Library
  ) {}

  ngOnInit() {
    this.loadActiveModule();
    this.loadParams();
  }

  loadParams() {
    this.modules.forEach((module: any) => {
      if (module.component == null) return;

      // Create the component instance dynamically
      const componentRef: any = this.dynamicComponentContainer.createComponent(
        module.component
      );

      console.log(componentRef.instance);

      // Access the params of the child component
      const modParams = componentRef.instance.params ?? {};

      // Assign params back to the module
      module.params = modParams;

      // Destroy the component instance since it's not needed anymore
      componentRef.destroy();
    });
  }

  loadActiveModule(name: string | null = this.name) {
    if (name == null) return;
    this.activeModule = {
      name: this.name,
      params: this.params,
    };
    this.isActiveModule = true;
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
    this.showSettings();
  }

  removeModule() {
    this.isActiveModule = false;
    this.activeModule = {};
  }

  showSettings() {
    this.isSettings = true;
  }

  applySettings() {
    this.isSettings = false;
    this.isActiveModule = true;
  }

  handleSettingsCallback(response: any) {
    this.activeModule.params.settings.form = response.data;
    this.callback.emit({
      name: this.activeModule.name,
      params: this.activeModule.params,
    });
    this.applySettings();
  }
}