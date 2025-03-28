import { Input, Output, Component, OnInit } from '@angular/core';
//import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { Library } from '../../../app.library';
import { CoreService } from '../../../services/core.service';

@Component({
  //standalone: true,
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss'],
  providers: [CoreService, Library],
  //imports:[IonicModule]
})
export class ItemsComponent implements OnInit {
  @Input() el: any = null;
  @Input() params: any = null;
  items: any = [];
  item: any = {
    name: '',
    key: '',
    type: '',
    value: '',
    fields: [],
    params: [],
  };

  constructor(
    public service: CoreService,
    public navCtrl: NavController,
    public router: Router,
    public lib: Library
  ) {}

  ngOnInit() {}

  editItem() {}

  deleteItem() {}

  addItem() {}
}
