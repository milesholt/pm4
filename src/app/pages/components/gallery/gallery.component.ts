import {
  Component,
  OnInit,
  Input,
  Output,
  ChangeDetectorRef,
} from '@angular/core';
//import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { Library } from '../../../app.library';
import { CoreService } from '../../../services/core.service';

@Component({
  //standalone: true,
  selector: 'app-gallery-comp',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  providers: [CoreService, Library],
  //imports:[IonicModule]
})
export class GalleryComponent implements OnInit {
  images: string[] = [];

  @Input() type: any;
  @Input() username: any;

  constructor(
    public service: CoreService,
    public navCtrl: NavController,
    public router: Router,
    public lib: Library
  ) {}

  ngOnInit() {
    this.loadImages();
  }

  loadImages() {
    switch (this.type) {
      case 'instagram':
        this.loadInstagram();
        break;
    }
  }

  loadInstagram() {
    this.service.instagram.getImages(this.username).subscribe(
      (images) => (this.images = images),
      (error) => console.error('Error fetching Instagram images', error)
    );
  }
}
