import { Input, Output, Component, OnInit, TemplateRef } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ModalController } from '@ionic/angular';

import { Library } from '../../../app.library';
import { CoreService } from '../../../services/core.service';
/*
@Component({
  //standalone: true,
  selector: 'app-modal-comp',
  templateUrl: './modal.component.html',
  {styleUrls: ['./modal.component.scss'],
  //providers: [CoreService, Library],
  //imports:[IonicModule]
})
export class ModalComponent implements OnInit {
  @Input() data: any;
  form: any = false;

  constructor(
    public service: CoreService,
    public navCtrl: NavController,
    public router: Router,
    public lib: Library,
    private modalController: ModalController
  ) {}

  ngOnInit() {}

  formatData() {
    return Object.keys(this.data.form);
  }

  dismiss() {
    this.modalController.dismiss();
  }

  submitForm() {
    // You can also perform any validation here before dismissing
    this.modalController.dismiss(this.data);
  }
}*/

@Component({
  selector: 'app-modal-comp',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  @Input() data: any;
  form: any = false;
  fields: any = [];

  constructor(
    public navCtrl: NavController,
    public router: Router,
    private modalController: ModalController
  ) {}

  ngOnInit(): void {
    this.formatData();
  }

  formatData() {
    console.log('format data', this.data);

    if (this.data?.form) {
      this.fields = this.data.form;
      console.log('fields', this.fields);
      return Object.keys(this.data.form);
    }
    if (this.data.length) {
      console.log('here');
      let d = this.data.filter((f: any) => f?.type !== 'submit');
      this.fields = d;
      return Object.keys(d);
    }
    return [];
  }

  dismiss(data: any = null) {
    console.log('dismissing modal');
    this.modalController.dismiss(data);
  }

  submitForm() {
    // You can also perform any validation here before dismissing
    this.modalController.dismiss(this.data);
  }
}
