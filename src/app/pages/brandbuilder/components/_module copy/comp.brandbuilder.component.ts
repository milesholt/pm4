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
  selector: 'app-template-comp',
  templateUrl: './comp.brandbuilder.component.html',
  styleUrls: ['./comp.brandbuilder.component.scss'],
  providers: [CoreService, Library],
  //imports:[IonicModule]
})
export class TemplateComponent implements OnInit {
  @Input() name: string | null = null;
  @Input() id: string | null = null;
  @Input() params: any | null = null;
  @Input() media: any | null = null;
  @Input() isEditing: boolean = false;
  @Output() callback = new EventEmitter();
  @ViewChild('itemsTemplate') itemsTemplate!: TemplateRef<any>;

  items: any = [];

  constructor(
    public service: CoreService,
    public navCtrl: NavController,
    public router: Router,
    public lib: Library
  ) {}

  ngOnInit() {}

  edit() {
    this.loadSettings();
  }

  load() {
    this.loadItems();
  }

  emit() {
    this.callback.emit(this.params);
  }

  loadSettings() {}

  loadItems() {
    this.service.modal.openModal(this.itemsTemplate, {});
  }

  selectItem(layout: any) {
    this.callback.emit(layout);
    this.service.modal.dismiss();
  }
}
