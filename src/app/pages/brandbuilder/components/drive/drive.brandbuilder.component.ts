import {
  Input,
  Output,
  Component,
  OnInit,
  EventEmitter,
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
  accessToken: string | null = null;

  recentFolders: any[] = [];
  navigationStack: any[] = [];

  viewMode: string = 'grid';

  @Output() callback = new EventEmitter();

  @Input() params: any = {
    type: 'default',
    fileid: '',
    fileData: '',
    file: {},
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

  async ngOnInit() {
    // Subscribe to the initialization status of gapi
    this.service.drive.gapiLoaded$.subscribe(async (isInitialized: any) => {
      console.log('is initialized');
      console.log(isInitialized);
      this.isGapiInitialized = isInitialized;

      //check for access token
      //await this.getToken();
      //console.log(this.accessToken);
      if (this.service.drive.isSignedIn()) {
        //already signed in
        //refresh access token in case it expired
        const authInstance = gapi.auth2.getAuthInstance();
        authInstance.currentUser
          .get()
          .reloadAuthResponse()
          .then((authResponse) => {
            this.accessToken = authResponse.access_token;
            this.storeToken(); // Save new token
            this.iniDrive(); // Retry API call
          });
      }
    });
    setTimeout(() => {
      if (!this.isGapiInitialized) {
        this.service.drive.initializeGapiClient();
      }
    }, 2000);
  }

  ngAfterViewInit(): void {
    if (!this.lib.isEmpty(this.params.file)) {
      this.loadFile(this.params.file);
      //this.doFile(this.params.file);
    } else {
      if (this.selectedFile == null) this.iniModule();
    }
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

  emit(params: any) {
    this.callback.emit(params);
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

  async signIn() {
    //check token

    console.log('getting access token');

    if (!this.service.drive.isSignedIn()) {
      if (this.accessToken == null) {
        await this.service.drive.login().then(async (user: any) => {
          console.log('lising files');
          const accessToken = user.getAuthResponse().access_token;
          // Store the access token for later use in the API call
          this.accessToken = accessToken;
          this.storeToken();
          this.iniDrive();
        });
      }
    } else {
      //already signed in
      //refresh access token in case it expired
      const authInstance = gapi.auth2.getAuthInstance();
      authInstance.currentUser
        .get()
        .reloadAuthResponse()
        .then((authResponse) => {
          this.accessToken = authResponse.access_token;
          this.storeToken(); // Save new token
          this.iniDrive(); // Retry API call
        });
    }
  }

  async iniDrive() {
    if (this.accessToken !== null) {
      await gapi.client.setToken({ access_token: this.accessToken });
      this.listFiles();
    } else {
      console.log('No access token or not signed in');
    }
  }

  async getToken(): Promise<void> {
    const documentId = 'settings';
    const userId = this.service.auth.getUser().uid;
    const pathSegments = ['users', userId, 'user'];

    return new Promise<void>((resolve, reject) => {
      this.service.firestore
        .getDocumentById(pathSegments, documentId)
        .subscribe(
          (document) => {
            const googleDriveToken = document.tokens?.access?.googleDrive;
            if (googleDriveToken) {
              console.log('found token');
              this.accessToken = googleDriveToken;
              console.log(this.accessToken);
              resolve(); // Resolve the promise when the token is found
            } else {
              console.log('could not find access token');
              resolve(); // Resolve even if the token is not found (optional: handle this case differently)
            }
          },
          (error) => {
            console.error('Error retrieving document:', error);
            reject(error); // Reject the promise if there's an error
          }
        );
    });
  }

  async storeToken() {
    const documentId = 'settings'; // Adjust if needed
    const userId = this.service.auth.getUser().uid; // The current user ID
    const pathSegments = ['users', userId, 'user']; // Path to the document

    const updatedData = {
      'tokens.access.googleDrive': this.accessToken,
    };

    this.service.firestore
      .updateDocument(pathSegments, documentId, updatedData)
      .then(() => {
        console.log('Document successfully updated!');
      })
      .catch((error) => {
        console.error('Error updating document: ', error);
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

  loadFile(file: any) {
    if (file.mimeType.startsWith('image/')) {
      if (file.hasOwnProperty('url') && file.url !== '') {
        this.selectedImage = file.url;
        this.selectedFile = file;
        this.isLoadingFile = false;
      }
    } else if (file.mimeType.startsWith('video/')) {
      // It's a video
      this.selectedFile = file;
    }
  }

  doFile(file: any) {
    //attach accesstoken to file

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
    this.service.modal.dismiss(file);
    this.params.file = file;
    this.params.fileid = file.id;

    if (this.accessToken !== null) {
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
          //this.convertToBase64(blob); // Convert Blob to Base64
          //upload to storage

          // Determine the file extension based on MIME type (e.g., image/jpeg -> .jpg)
          const mimeType = blob.type;
          const extension =
            this.service.drive.getExtensionFromMimeType(mimeType);

          if (!extension) {
            throw new Error('Unable to determine file extension'); // Handle invalid extension
          }

          // Create the file name using mod_id.[ext]
          const fileName = `mod_id.${extension}`;

          // Upload to Firebase Storage
          const folderPath = this.service.auth.getUser().uid + '/images/';

          // Call uploadToStorage and get the download URL
          this.service.firestore
            .uploadToStorage(blob, folderPath, fileName)
            .then((downloadURL: string) => {
              alert(downloadURL);

              // Store the download URL or use it to load in an image element
              file.url = downloadURL;
              this.selectedImage = downloadURL;
              this.isLoadingFile = false;
              this.emit(this.params);
            })
            .catch((error: any) => {
              alert(error);
            });
        })
        .catch((error) => {
          alert('Error fetching Blob');
          console.error('Error fetching Blob:', error);
        });
    }
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
      //this.params.fileData = this.selectedImage;
      this.emit(this.params);
    };

    reader.onerror = () => {
      console.error('Error:', reader.error);
    };

    reader.readAsDataURL(binaryData); // Convert binary data to Base64
  }
}
