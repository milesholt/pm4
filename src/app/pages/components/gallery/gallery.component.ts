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

import { ModalController } from '@ionic/angular';

@Component({
  //standalone: true,
  selector: 'app-gallery-comp',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  providers: [CoreService, Library],
  //imports:[IonicModule]
})
export class GalleryComponent implements OnInit {
  @Input() images: any[] = [];
  @Input() type: any;
  @Input() username: any;
  @Input() params: any = {};

  searchQuery: string = '';
  filteredImagesList: any[] = [];
  lightboxOpen: boolean = false;
  currentImage: any = null;

  constructor(
    public service: CoreService,
    public navCtrl: NavController,
    public router: Router,
    public lib: Library,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.loadImages();
  }

  loadImages() {
    this.filteredImagesList = [...this.images];

    switch (this.type) {
      case 'instagram':
        this.loadInstagram();
        break;
      case 'default':
        this.loadDefault();
        break;
    }
  }

  loadDefault() {}

  loadInstagram() {
    /*this.service.instagram.getImages(this.username).subscribe(
      (images) => (this.images = images),
      (error) => console.error('Error fetching Instagram images', error)
    );*/
    this.service.instagram.getImages(this.username);
  }

  filteredImages() {
    if (!this.searchQuery) {
      return this.images;
    }
    return this.images.filter((image) =>
      image.alt.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  loadMoreImages(event: any) {
    // Simulate loading more images (e.g., from an API).
    setTimeout(() => {
      const moreImages = [
        { src: 'https://example.com/img4.jpg', alt: 'Image 4' },
        { src: 'https://example.com/img5.jpg', alt: 'Image 5' },
      ];

      this.images.push(...moreImages);
      this.filteredImagesList = this.filteredImages(); // Re-filter the images after loading more
      event.target.complete();
    }, 1000);
  }

  openLightbox(image: any) {
    this.currentImage = image;
    this.lightboxOpen = true;
  }

  closeLightbox() {
    this.lightboxOpen = false;
    this.currentImage = null;
  }
}
