import { Component, OnInit } from '@angular/core';
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
  selectedFile: any;

  constructor(
    public service: CoreService,
    public navCtrl: NavController,
    public router: Router,
    public lib: Library
  ) {}

  ngOnInit() {}

  signIn() {
    this.service.drive.login().then(() => {
      this.listFiles();
    });
  }

  listFiles() {
    this.service.drive.listImages().then((response: any) => {
      this.files = response.result.files;
    });
  }

  selectFile(file: any) {
    this.selectedFile = file;
  }
}
