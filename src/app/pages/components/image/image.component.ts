import {
  Component,
  Input,
  Output,
  OnInit,
  OnDestroy,
  ElementRef,
  EventEmitter,
  ViewChild,
  AfterViewInit,
  TemplateRef,
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
  @Output() callback = new EventEmitter();
  @ViewChild('iniTemplate') iniTemplate!: TemplateRef<any>;

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

  showCustom: boolean = false;
  showGallery: boolean = true;
  selectedItem: any = null;

  constructor(
    private el: ElementRef,
    public lib: Library,
    public service: CoreService
  ) {}

  async ngOnInit() {
    this.showCustom = false;
    this.showGallery = true;
    //this.params = { ...this.defaultProperties, ...this.params };

    await this.doForm();

    console.log('params for image module');
    console.log(this.params);
  }

  async edit() {
    this.iniModule();
  }

  async load(params: any = this.params) {
    console.log('loading image module');
    this.iniModule(params);
  }

  async iniModule(params: any = this.params) {
    this.params = params;
    console.log('ini image mod');
    console.log(this.params);
    switch (this.params.type) {
      case 'googledrive':
        this.doGoogleDrive();
        break;
      case 'default':
        //await this.iniModule();
        await this.loadModal(params);
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
      if (this.params['media']['photoData'].length) {
        let allImages = this.params['media']['photoData'];
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

  async loadModal(params: any = this.params) {
    console.log('load modal');
    console.log(this.params.media.photoData);
    console.log(this.iniTemplate);
    if (!this.iniTemplate) {
      console.log('no template found');
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    if (this.iniTemplate) {
      const data = await this.service.modal.openModal(
        this.iniTemplate,
        this.params.media.photoData
      );

      if (data) {
        //handle selected data
      } else {
        //handle no data
      }
    } else {
      console.log('Template or data still missing after delay');
    }
  }

  async doCustom() {
    this.showGallery = false;
    this.showCustom = true;
  }

  doGallery() {
    this.showGallery = true;
    this.showCustom = false;
  }

  async doGoogleDrive() {
    console.log('emit google drive');
    const p = { action: 'loadmodule', moduleName: 'googledrive' };
    //this.callback.emit(p);
    this.service.modal.dismiss();
    this.callback.emit(p);
    this.service.modal.dismissAllExceptTop();
  }

  onImageChange(e: any) {}

  selectImage(image: any) {
    console.log(image);
    const imageUrl = typeof image == 'string' ? image : image.src.large;
    this.params.url = imageUrl;
    this.params.settings.form.fields.forEach((field: any) => {
      if (field.key == 'url') field.value = imageUrl;
    });
    this.emit(this.params);
    this.service.modal.dismiss();
  }

  emit(params: any) {
    this.callback.emit(params);
  }
}
