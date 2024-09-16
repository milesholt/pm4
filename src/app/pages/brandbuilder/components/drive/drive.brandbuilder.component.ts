import {
  Input,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
//import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { Library } from '../../../../app.library';
import { CoreService } from '../../../../services/core.service';

@Component({
  //standalone: true,
  selector: 'app-drive-comp',
  templateUrl: './drive.brandbuilder.component.html',
  styleUrls: ['./drive.brandbuilder.component.scss'],
  providers: [CoreService, Library],
  //imports:[IonicModule]
})
export class DriveComponent implements OnInit {
  files: any[] = [];
  selectedFile: string | null = null;
  isGapiInitialized = false;
  accessToken: string = '';

  @Input() params: any = {
    type: 'default',
    fileid: '',
    width: '100%',
    height: '100%',
    skipSettings: true,
    settings: {
      form: {
        action: 'returnform',
        classes: 'nocol',
        fields: [
          {
            key: 'fileid',
            name: 'File ID',
            value: '',
            type: 'text',
            placeholder: 'Enter your File ID here',
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

  @ViewChild('iniTemplate') iniTemplate!: TemplateRef<any>;

  constructor(
    public service: CoreService,
    public navCtrl: NavController,
    public router: Router,
    public lib: Library
  ) {}

  ngOnInit() {
    if (this.selectedFile == null) this.iniModule();

    // Subscribe to the initialization status of gapi
    this.service.drive.gapiLoaded$.subscribe((isInitialized: any) => {
      console.log('is initialized');
      console.log(isInitialized);
      this.isGapiInitialized = isInitialized;
    });
    setTimeout(() => {
      if (!this.isGapiInitialized) {
        this.service.drive.initializeGapiClient();
      }
    }, 2000);
  }

  async iniModule() {
    const result = await this.service.modal.openModal(
      this.iniTemplate,
      this.files
    );

    if (result) {
      //this.service.modal.dismiss();
    }
  }

  signIn() {
    console.log('logging into drive');
    this.service.drive.login().then((user: any) => {
      console.log('lising files');
      const accessToken = user.getAuthResponse().access_token;
      // Store the access token for later use in the API call
      this.accessToken = accessToken;
      this.listFiles();
    });
  }

  listFiles() {
    this.service.drive.listImages().then((response: any) => {
      this.files = response.result.files;
    });
  }

  /*selectFile(file: any) {
    this.selectedFile = file;
  }*/

  selectFile(file: any) {
    //alert('selected file');
    /* this.service.drive.listFileContent(file.id).then((response: any) => {
      //alert(response.body);
      this.convertToBase64(response.body);
    });*/

    this.service.modal.dismiss();

    // Fetch the file from the webContentLink as a Blob
    fetch(`https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob(); // Get the file as a Blob
      })
      .then((blob) => {
        this.convertToBase64(blob); // Convert Blob to Base64
      })
      .catch((error) => {
        alert('Error fetching Blob');
        console.error('Error fetching Blob:', error);
      });
  }

  convertToBase64(binaryData: Blob) {
    if (!binaryData || !(binaryData instanceof Blob)) {
      alert('Invalid Blob');
      console.error('Invalid Blob:', binaryData);
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      this.selectedFile = reader.result as string; // Base64 string
    };

    reader.onerror = () => {
      console.error('Error:', reader.error);
    };

    reader.readAsDataURL(binaryData); // Convert binary data to Base64
  }
}
