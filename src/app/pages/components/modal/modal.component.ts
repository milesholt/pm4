import { Input, Output, Component, OnInit } from '@angular/core';
//import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ModalController } from '@ionic/angular';

import { Library } from '../../../app.library';
import { CoreService } from '../../../services/core.service';

@Component({
  //standalone: true,
  selector: 'app-nav',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  providers: [CoreService, Library],
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
}
