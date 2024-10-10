import { Input, Output, Component, OnInit } from '@angular/core';
//import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { Library } from '../../../../app.library';
import { CoreService } from '../../../../services/core.service';

import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { Platform } from '@ionic/angular';

@Component({
  //standalone: true,
  selector: 'app-link-comp',
  templateUrl: './link.brandbuilder.component.html',
  styleUrls: ['./link.brandbuilder.component.scss'],
  providers: [CoreService, Library],
  //imports:[IonicModule]
})
export class LinkComponent implements OnInit {
  public embedHtml: SafeHtml = '';

  @Input() media: any = null;

  @Input() params: any = {
    type: 'default',
    heading: '',
    description: '',
    link: '',
    label: '',
    window: '',
    settings: {
      form: {
        action: 'returnform',
        classes: 'nocol',
        fields: [
          {
            key: 'heading',
            name: 'Heading',
            value: '',
            type: 'text',
            placeholder: 'Enter a custom heading for your link (optional)',
          },
          {
            key: 'description',
            name: 'Description',
            value: '',
            type: 'text',
            placeholder: 'Enter a custom description (optional)',
          },
          {
            key: 'link',
            name: 'Destination Link',
            value: '',
            type: 'text',
            placeholder: 'Enter your destination link here',
          },
          {
            key: 'type',
            name: 'Link Type',
            value: 'button',
            type: 'select',
            options: [
              { label: 'Button', value: 'button' },
              { label: 'Text Link', value: 'text' },
            ],
            placeholder: 'Choose what kind of link this is',
          },
          {
            key: 'window',
            name: '',
            value: '',
            type: 'radio',
            options: [
              { label: 'Open in same window', value: 'parent' },
              { label: 'Open in new window', value: 'blank' },
            ],
            placeholder: 'Choose how link should open',
          },
          {
            key: 'label',
            name: 'Label',
            value: '',
            type: 'text',
            placeholder: 'Enter a label for this link',
          },
          {
            key: 'width',
            name: 'Width',
            value: '100%',
            type: 'text',
            placeholder: 'Enter width (eg. 100%)',
          },
          {
            key: 'height',
            name: 'Height',
            value: '100%',
            type: 'text',
            placeholder: 'Enter height (eg. auto)',
          },
          {
            key: 'submit',
            name: 'Apply',
            type: 'submit',
          },
        ],
      },
    },
  };

  constructor(
    public service: CoreService,
    public navCtrl: NavController,
    public router: Router,
    public lib: Library,
    private sanitizer: DomSanitizer,
    public platform: Platform
  ) {}

  ngOnInit() {
    this.doForm();

    console.log(this.params);

    switch (this.params.type) {
      case 'button':
        break;
      case 'text':
        break;
      case 'default':
        this.params.type = 'button';
        break;
    }
  }

  doForm() {
    //Handle any input values from form
    this.params.settings.form.fields.forEach((field: any) => {
      if (this.params.hasOwnProperty(field.key))
        this.params[field.key] = field.value;
    });
  }

  doButton() {
    //const { link, window } = this.params;
    const link: string = this.params.link;
    const win: string = this.params.window;

    // Check if the link is an external URL
    const isExternal = /^(http|https):\/\//.test(link);

    if (isExternal) {
      if (win === 'blank') {
        // Open external link in a new tab or window
        window.open(link, '_blank');
      } else {
        // Open external link in the same window
        window.location.href = link;
      }
    } else {
      // Handle internal navigation
      if (win === 'blank' && this.platform.is('cordova')) {
        // On mobile, use InAppBrowser for opening links in new window
        window.open(link, '_blank');
      } else {
        // Navigate within the app
        this.router.navigate([link]);
      }
    }
  }
}
