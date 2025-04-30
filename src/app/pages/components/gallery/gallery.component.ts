import {
  Component,
  OnInit,
  Input,
  Output,
  ChangeDetectorRef,
  HostListener,
  ViewChild,
  TemplateRef,
  EventEmitter,
} from '@angular/core';
//import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { Library } from '../../../app.library';
import { CoreService } from '../../../services/core.service';

import { ModalController } from '@ionic/angular';
import { LibraryComponent } from '../library/library.component';
import { ImageComponent } from '../image/image.component';

@Component({
  //standalone: true,
  selector: 'app-gallery-comp',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  providers: [CoreService, Library],
  //imports:[IonicModule]
})
export class GalleryComponent implements OnInit {
  @ViewChild('imageTemplate') imageTemplate!: TemplateRef<any>;
  @Input() data: any[] = [];
  @Input() type: any;
  @Input() username: any;
  @Input() params: any = {};
  @Output() callback = new EventEmitter<any>();

  searchQuery: string = '';
  filteredImagesList: any[] = [];
  lightboxOpen: boolean = false;
  //currentImage: any = null;
  currentIndex: number = 0;

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
    this.filteredImagesList = [...this.data];

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
      return this.data;
    }
    return this.data.filter((image) =>
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

      this.data.push(...moreImages);
      this.filteredImagesList = this.filteredImages(); // Re-filter the images after loading more
      event.target.complete();
    }, 1000);
  }

  openLightbox(image: any) {
    this.currentIndex = this.data.findIndex((img) => img.src === image.src);
    this.lightboxOpen = true;
  }

  closeLightbox() {
    this.lightboxOpen = false;
  }

  nextImage() {
    if (this.currentIndex < this.data.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0; // Loop back to first image
    }
  }

  prevImage() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.data.length - 1; // Loop back to last image
    }
  }

  get currentImage() {
    return this.data[this.currentIndex] || null;
  }

  handleSelectImage(result: any) {}

  async addImages(data: any = null) {
    console.log(LibraryComponent);

    const modalData = {
      setParams: {
        type: 'library',
        siteId: this.params?.siteId,
        isSelect: true,
      },
    };

    const result = await this.service.modal.openModal(
      null,
      modalData,
      ImageComponent,
      false
    );

    if (result) {
      console.log('Collected image data:', result);
      console.log('Image added');
      let imageUrl = result.url;
      let imageData = {
        url: result.url,
        tags: [],
        alt: '',
        caption: '',
        description: '',
        title: '',
        created: new Date(),
        modified: new Date(),
      };

      this.data.push(imageData);
      //callback data to parent component
      this.callback.emit(this.data);
    }
  }

  closeModal(modal: any, data: any) {
    modal.dismiss(data); // Pass collected data back when closing
    console.log('handle updated data passed back');
  }

  // Keyboard navigation
  @HostListener('document:keydown.arrowRight', ['$event'])
  handleRightArrow(event: KeyboardEvent) {
    this.nextImage();
  }

  @HostListener('document:keydown.arrowLeft', ['$event'])
  handleLeftArrow(event: KeyboardEvent) {
    this.prevImage();
  }
}
