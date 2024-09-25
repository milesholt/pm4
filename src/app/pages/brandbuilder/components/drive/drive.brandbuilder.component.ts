import {
  Input,
  Component,
  OnInit,
  AfterViewInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
//import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { Library } from '../../../../app.library';
import { CoreService } from '../../../../services/core.service';
import { response } from 'express';

@Component({
  //standalone: true,
  selector: 'app-drive-comp',
  templateUrl: './drive.brandbuilder.component.html',
  styleUrls: ['./drive.brandbuilder.component.scss'],
  providers: [CoreService, Library],
  //imports:[IonicModule]
})
export class DriveComponent implements OnInit, AfterViewInit {
  files: any[] = [];
  isFiles: boolean = false;
  isLoadingFile: boolean = false;
  currentFolderName: string = 'root';
  selectedFile: any = null;
  selectedFileTemp: any = null;
  selectedImage: string | null = null;

  isGapiInitialized = false;
  accessToken: string = '';
  //
  recentFolders: any[] = [];
  navigationStack: any[] = [];

  viewMode: string = 'grid';

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

  ngAfterViewInit(): void {
    if (this.selectedFile == null) this.iniModule();
  }

  async edit() {
    //temporarily store existing File
    this.selectedFileTemp = this.lib.deepCopy(this.selectedFile);
    this.selectedFile = null;

    //If for some reason drive is not initialised
    if (!this.isGapiInitialized) {
      this.service.drive.initializeGapiClient();
    }

    //Show modal
    this.iniModule();
  }

  async iniModule() {
    console.log('loading drive module');
    console.log(this.iniTemplate);
    console.log(this.files);
    const data = await this.service.modal.openModal(
      this.iniTemplate,
      this.files
    );

    if (data) {
      //handle selected data
    } else {
      //handle no data
      //restore previous set file
      this.selectedFile = this.lib.deepCopy(this.selectedFileTemp);
      this.selectedFileTemp = null;
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

  listImages() {
    this.service.drive.listImages().then((response: any) => {
      this.files = response.result.files;
    });
  }

  listFiles(folderId: string = 'root', event: any = null) {
    if (event !== null) {
      const selectElement = event.target as HTMLSelectElement;
      folderId = selectElement.value;
    }

    this.service.drive
      .listFiles(folderId)
      .then((response: any) => {
        this.isFiles = true;
        //this.files = response.result.files;
        this.files = response.result.files.map((file: any) => ({
          ...file,
          thumbnail:
            file.thumbnailLink ||
            `https://drive.google.com/thumbnail?sz=w80-h80&id=${file.id}`,
        }));
        this.updateRecentFolders(folderId); // Keep track of recent folders
      })
      .catch((error: any) => {
        alert(error);
        console.error('Error fetching files:', error);
      });
  }

  getFileThumbnail(file: any): string {
    return file.thumbnail;
  }

  openFolder(file: any) {
    if (file.mimeType === 'application/vnd.google-apps.folder') {
      this.listFiles(file.id); // Open the folder
      this.navigationStack.push(file.id); // Keep track of navigation
      this.currentFolderName = file.name;
    }
  }

  back() {
    if (this.navigationStack.length > 1) {
      this.navigationStack.pop(); // Remove the current folder
      const previousFolderId =
        this.navigationStack[this.navigationStack.length - 1];
      this.listFiles(previousFolderId); // Navigate back to the previous folder
    } else {
      //go to root if index is 0
      this.listFiles('root');
    }
  }

  updateRecentFolders(folderId: string) {
    const existingIndex = this.recentFolders.findIndex(
      (folder) => folder.id === folderId
    );
    if (existingIndex > -1) {
      this.recentFolders.splice(existingIndex, 1); // Remove duplicate
    }
    this.recentFolders.unshift({ id: folderId, name: this.currentFolderName }); // Add to the top of the list
    if (this.recentFolders.length > 10) {
      this.recentFolders.pop(); // Keep the list limited to 10
    }
  }

  doFile(file: any) {
    if (file.mimeType === 'application/vnd.google-apps.folder') {
      // It's a folder
      this.openFolder(file);
    } else if (file.mimeType.startsWith('image/')) {
      // It's an image
      //this.selectImage(file);
      this.isLoadingFile = true;
      this.selectedFile = file;
      this.doImage(file);
    } else if (file.mimeType.startsWith('video/')) {
      // It's a video
      this.selectedFile = file;
    }
  }

  /*selectFile(file: any) {
    this.selectedFile = file;
  }*/

  toggleView(mode: string) {
    this.viewMode = mode;
  }

  getFileUrl(file: any): string {
    return `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media&access_token=${this.accessToken}`;
  }

  doImage(file: any) {
    //alert('selected file');
    /* this.service.drive.listFileContent(file.id).then((response: any) => {
      //alert(response.body);
      this.convertToBase64(response.body);
    });*/

    this.service.modal.dismiss(file);

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
      console.error('Invalid Blob:', binaryData);
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      this.selectedImage = reader.result as string; // Base64 string
      this.isLoadingFile = false;
    };

    reader.onerror = () => {
      console.error('Error:', reader.error);
    };

    reader.readAsDataURL(binaryData); // Convert binary data to Base64
  }
}
