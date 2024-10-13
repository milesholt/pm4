import {
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
} from '@angular/core';
//import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { Library } from '../../../../app.library';
import { CoreService } from '../../../../services/core.service';

@Component({
  //standalone: true,
  selector: 'app-layouts-comp',
  templateUrl: './layouts.brandbuilder.component.html',
  styleUrls: ['./layouts.brandbuilder.component.scss'],
  providers: [CoreService, Library],
  //imports:[IonicModule]
})
export class LayoutsComponent implements OnInit {
  @Input() name: string | null = null;
  @Input() id: string | null = null;
  @Input() params: any | null = null;
  @Input() media: any | null = null;
  @Input() isEditing: boolean = false;
  @Output() callback = new EventEmitter();
  @ViewChild('layoutTemplate') layoutTemplate!: TemplateRef<any>;

  layouts: any = [
    {
      name: 'hero',
      title: 'Fullscreen Hero Container',
      icon: 'picture',
      structure: [
        [{ heading: '' }, { content: '' }, { module: null, params: {} }],
      ],
      params: {
        classes: 'hero-container center col-1-center-content',
        parentclasses: 'col-1 hero-layout fullscreen full-width',
      },
    },
    {
      name: 'left-content',
      title: 'Image with Left Content',
      icon: 'picture',
      structure: [
        [{ heading: '' }, { content: '' }],
        [{ module: 'image', params: {} }],
      ],
      params: {
        classes: 'col-2-left-content',
        parentclasses: 'col-2',
      },
    },
    {
      name: 'right-content',
      title: 'Image with Right Content',
      icon: 'picture',
      structure: [
        [{ module: 'image', params: {} }],
        [{ heading: '' }, { content: '' }],
      ],
      params: {
        classes: 'col-2-right-content',
        parentclasses: 'col-2',
      },
    },
    {
      name: '3-column',
      title: '3 Column Grid',
      icon: 'picture',
      structure: [
        [{ heading: '' }, { content: '' }, { module: null, params: {} }],
        [{ heading: '' }, { content: '' }, { module: null, params: {} }],
        [{ heading: '' }, { content: '' }, { module: null, params: {} }],
      ],
      params: {
        classes: 'col-3-grid',
        parentclasses: 'col-3',
      },
    },
    {
      name: '4-column',
      title: '4 Column Grid',
      icon: 'picture',
      structure: [
        [{ heading: '' }, { content: '' }, { module: null, params: {} }],
        [{ heading: '' }, { content: '' }, { module: null, params: {} }],
        [{ heading: '' }, { content: '' }, { module: null, params: {} }],
        [{ heading: '' }, { content: '' }, { module: null, params: {} }],
      ],
      params: {
        classes: 'col-4-grid',
        parentclasses: 'col-4',
      },
    },
    {
      name: 'center-content',
      title: '1 Column Center Content',
      icon: 'picture',
      structure: [
        [{ heading: '' }, { content: '' }, { module: null, params: {} }],
      ],
      params: {
        classes: 'col-1-center-content',
        parentclasses: 'col-1',
      },
    },
    {
      name: 'product-list',
      title: 'Product List',
      icon: 'picture',
      structure: [
        [{ heading: '' }, { content: '' }, { module: null, params: {} }],
        [{ heading: '' }, { content: '' }, { module: null, params: {} }],
        [{ heading: '' }, { content: '' }, { module: null, params: {} }],
      ],
      params: {
        classes: 'col-3-product-list',
        parentclasses: 'col-3 product-list-layout',
      },
    },
    {
      name: 'testimonial',
      title: 'Testimonial Section',
      icon: 'picture',
      structure: [
        [{ module: 'image', params: {} }, { heading: '' }, { content: '' }],
        [{ module: 'image', params: {} }, { heading: '' }, { content: '' }],
        [{ module: 'image', params: {} }, { heading: '' }, { content: '' }],
      ],
      params: {
        classes: 'col-3-testimonial',
        parentclasses: 'col-3 testimonial-layout',
      },
    },
    {
      name: 'custom',
      title: 'Custom Layout',
      icon: 'picture',
      structure: [[{ module: null, params: {} }]],
      params: {
        classes: 'custom-container',
        parentclasses: 'col-1 custom-layout',
      },
    },
  ];

  constructor(
    public service: CoreService,
    public navCtrl: NavController,
    public router: Router,
    public lib: Library
  ) {}

  ngOnInit() {}

  edit() {
    this.loadLayouts();
  }

  load() {
    this.loadLayouts();
  }

  emit() {
    this.callback.emit(this.params);
  }

  loadLayouts() {
    this.service.modal.openModal(this.layoutTemplate, {});
  }

  selectLayout(layout: any) {
    this.callback.emit(layout);
    this.service.modal.dismiss();
  }
}
