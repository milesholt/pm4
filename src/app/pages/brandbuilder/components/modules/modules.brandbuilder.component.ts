import { Component, Input, OnInit } from '@angular/core';
//import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { Library } from '../../../../app.library';
import { CoreService } from '../../../../services/core.service';

import { DynamicComponent } from '../../../components/dynamic/dynamic.component.interface';

import { ContactFormComponent } from 'src/app/pages/components/contactform/contactform.component';
import { AccordionComponent } from 'src/app/pages/components/accordion/accordion.component';
import { GalleryComponent } from 'src/app/pages/components/gallery/gallery.component';

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

  modules: any = [
    { name: 'form', title: 'Form', component: ContactFormComponent, icon: 'list', params: {} },
    { name: 'faq', title: 'FAQ', component: AccordionComponent, icon: 'help-circle-outline', params: {} },
    { name: 'mailinglist', title: 'Mailing List', component: ContactFormComponent, icon: 'mail', params: {} },
    { name: 'mailchimp', title: 'Mailchimp', component: null, icon: 'mail', params: {} },
    { name: 'youtube', title: 'Youtube', component:null, icon: 'logo-youtube', params: {} },
    { name: 'link', title: 'Link', component:null, icon: 'link', params: {} },
    { name: 'custom-url', title: 'Embed', component:null, icon: 'code-working', params: {} },
    { name: 'instagram', title: 'Instagram', component: GalleryComponent, icon: 'logo-instagram', params: {} },
    { name: 'googledrive', title: 'Google Drive', component: null, icon: 'logo-google', params: {} },
    { name: 'video', title: 'Video', component: null, icon: 'videocam', params: {} },
    { name: 'slider', title: 'Slideshow', component: null, icon: 'albums', params: {} },
    { name: 'gallery', title: 'Gallery', component: null, icon: 'images', params: {} },
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
  }

  loadActiveModule(name:string | null = this.name) {
    if(name == null) return;

    console.log('loading module');

    this.activeModule = {
      name: this.name,
      params: this.params
    }

    console.log(this.activeModule);

    this.isActiveModule = true;
    //Pass parameters to active module
    /*this.modules.forEach((module: any) => {
      if (module.name === this.activeModule.name) {
        console.log(module.params);
        module.component.params = module.params;
        console.log(module.component);
      }
    });*/

  }

  applyModule() {
    this.isActiveModule = true;
  }

  selectModule(module:any){
    this.activeModule = {
      name: module.name,
      params: module.params
    }
    this.showSettings();
  }

  removeModule() {
    this.isActiveModule = false;
    this.activeModule = {};
  }

  showSettings() {
    this.isSettings = true;
  }

  applySettings(){
    this.isSettings = false;
    this.isActiveModule = true;
  }
}
