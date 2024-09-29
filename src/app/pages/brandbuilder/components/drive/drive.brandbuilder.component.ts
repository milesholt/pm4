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
import { firstValueFrom } from 'rxjs'; // Import this function from RxJS

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

  errorMessage: any = {};

  viewMode: string = 'grid';

  @Output() callback = new EventEmitter();

  @Input() params: any = {
    type: 'default',
    fileid: '',
    fileData: '',
    file: {},
    width: '100%',
    height: 'auto',
    skipSettings: true,
    settings: {
      form: {
        action: 'returnform',
        classes: 'nocol',
        fields: [
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

  async doImage(file: any) {
    this.service.modal.dismiss(file);
    this.params.file = file;
    this.params.fileid = file.id;
    this.errorMessage = {};

    if (this.accessToken !== null) {
      try {
        // Fetch the file from Google Drive as a Blob
        const response = await fetch(
          `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`,
          {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
            },
          }
        );

        if (!response.ok) {
          alert('network error');
          throw new Error(
            `Network response was not ok: ${response.status} ${response.statusText}`
          );
        }

        const blob = await response.blob(); // Get the file as a Blob

        if (blob.size === 0) {
          alert('blob size is 0');
          throw new Error('Received an empty Blob');
        }

        const mimeType = blob.type;
        const extension = this.service.drive.getExtensionFromMimeType(mimeType);

        if (!extension) {
          throw new Error('Unable to determine file extension');
        }

        // Create the folder path using user ID
        const folderPath = `${this.service.auth.getUser().uid}/images/`;
        const targetWidths = [480, 720, 1080]; // Different widths for different screen sizes

        const fileFromBlob = new File([blob], `mod_id.${extension}`, {
          type: mimeType,
        });

        // Use FormData to properly send the file
        const formData = new FormData();
        formData.append('file', fileFromBlob, 'mod_id.' + extension); // Add the file blob to FormData
        formData.append('widths', JSON.stringify(targetWidths)); // Send widths as a JSON string

        let downloadURL = '';

        // Convert to webp format and return blob data
        try {
          const res = await firstValueFrom(
            this.service.http.post(
              'https://siteinanhour.com/server/imageconvert.php',
              formData
            )
          );

          const compressedBlobs = res.blobs;

          for (let index = 0; index < targetWidths.length; index++) {
            const width = targetWidths[index];
            const fileName = this.params.id + `_${width}.webp`; // Name with width suffix

            //make sure blob data is formatted correctly
            const blobData = compressedBlobs[index].blob;
            const byteCharacters = atob(blobData); // Decode base64

            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'image/webp' });

            //upload webp images to Firebase Storage
            downloadURL = await this.service.firestore.uploadToStorage(
              blob,
              folderPath,
              fileName
            );
          }

          // Return the largest image URL
          file.url = downloadURL;
          this.selectedImage = file.url;
          this.isLoadingFile = false;
          this.emit(this.params);
        } catch (e) {
          //post error
          //alert(JSON.stringify(e));
          this.errorMessage = e;
        }
      } catch (error) {
        console.error('Error compressing or uploading images:', error);
        alert('Error fetching or processing image');
      }
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
