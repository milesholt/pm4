// modal-content.component.ts
import { Component, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-modal-dynamic',
  templateUrl: './modal-dynamic.component.html',
})
export class ModalDynamicComponent {
  @Input() template!: TemplateRef<any>;
  @Input() context?: any;
}
