import {
  Component,
  Input,
  ComponentFactoryResolver,
  ViewChild,
  ViewContainerRef,
  OnInit,
  EventEmitter,
  Output,
} from '@angular/core';
//import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { Library } from '../../../app.library';
import { CoreService } from '../../../services/core.service';

@Component({
  //standalone: true,
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  providers: [CoreService, Library],
  //imports:[IonicModule]
})
export class TabsComponent implements OnInit {
  @Input() tabs: any[] = [];
  @Output() onSubmit = new EventEmitter<any>();

  @ViewChild('dynamicComponentContainer', {
    read: ViewContainerRef,
    static: true,
  })
  dynamicComponentContainer!: ViewContainerRef;

  constructor(
    public service: CoreService,
    public navCtrl: NavController,
    public router: Router,
    public lib: Library
  ) {}

  ngOnInit(): void {}

  selectedTab = 0;
  collectedData: any = {};

  handleCallback(data: any) {
    this.collectedData = { ...this.collectedData, ...data };
  }

  submit() {
    this.onSubmit.emit(this.collectedData);
  }
}
