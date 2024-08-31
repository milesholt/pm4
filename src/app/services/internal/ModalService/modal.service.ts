// modal.service.ts
import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalDynamicComponent } from 'src/app/pages/components/modal/modal-dynamic.component';
import { TemplateRef } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(private modalController: ModalController) {}

  async openModal(template: TemplateRef<any>, data: any) {
    try {
      if (!template || !data) {
        console.error('Template or data is missing');
        console.log(template);
        console.log(data);
        return;
      }

      console.log(data);

      const modal = await this.modalController.create({
        component: ModalDynamicComponent,
        componentProps: {
          template: template,
          context: data,
        },
      });

      return await modal.present();
    } catch (error) {
      console.error('Error creating modal:', error);
    }
  }
}
