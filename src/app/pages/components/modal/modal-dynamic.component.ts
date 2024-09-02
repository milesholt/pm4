// modal-content.component.ts
import { Component, Input, TemplateRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-dynamic',
  templateUrl: './modal-dynamic.component.html',
})
export class ModalDynamicComponent implements OnInit {
  @Input() template!: TemplateRef<any>;
  @Input() context: any;

  modalContext: any;
  isModal = true;

  constructor() {}

  ngOnInit(): void {
    this.modalContext = { ...this.context, isModal: this.isModal };
  }
}
