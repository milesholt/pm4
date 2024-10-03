import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ElementRef,
  AfterViewInit,
} from '@angular/core';

import { Library } from '../../../app.library';
import { CoreService } from '../../../services/core.service';

interface ParamsType {
  type: string;
  settings: any;
  [key: string]: any;
}

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
  providers: [CoreService, Library],
})
export class ImageComponent implements OnInit {
  @Input() params: any = {
    type: 'default',
    url: '',
    width: '100%',
    height: '100%',
    settings: {
      form: {
        action: 'returnform',
        classes: 'nocol',
        fields: [
          {
            key: 'url',
            name: 'Image URL',
            value: '',
            type: 'text',
            placeholder: 'Enter your Image URL',
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
    private el: ElementRef,
    public lib: Library,
    public service: CoreService
  ) {}

  async ngOnInit() {
    //this.params = { ...this.defaultProperties, ...this.params };

    await this.doForm();

    console.log('params for image module');
    console.log(this.params);

    switch (this.params.type) {
      case 'googledrive':
        this.doGoogleDrive();
        break;
      case 'default':
        this.doCustom();
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

  async changeImage(event: any) {
    if (this.service.auth.isLoggedIn) {
      if (this.params['images'].length) {
        let allImages = this.params['images'];
        let imageUrl = allImages[this.lib.selectRandom(allImages)].src.large;
        this.params['url'] = await this.loadImage(imageUrl);
      }
    }
  }

  async loadImage(url: string) {
    if (url.includes('imageloader.php')) url = url.split('?url=')[1];
    const base64Url = this.lib.base64Url(url); // Encode the URL to Base64
    return 'https://siteinanhour.com/server/imageloader.php?url=' + base64Url;
  }

  doCustom() {}

  doGoogleDrive() {}

  onImageChange(e: any) {}
}
