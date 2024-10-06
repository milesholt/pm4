// modal-content.component.ts
import { Component, Input, TemplateRef, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
//import { Library } from '../../../app.library';
//import { CoreService } from '../../../services/core.service';

import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-dynamic',
  templateUrl: './modal-dynamic.component.html',
})
export class ModalDynamicComponent implements OnInit {
  @Input() template!: TemplateRef<any>;
  @Input() context: any;

  modalContext: any;
  isModal = true;

  constructor(private modalController: ModalController) {}

  ngOnInit(): void {
    this.modalContext = { ...this.context, isModal: this.isModal };
    console.log('modalContext');
    console.log(this.modalContext);
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
