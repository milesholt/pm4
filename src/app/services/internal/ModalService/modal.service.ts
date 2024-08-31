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

  async openModal(template: TemplateRef<any>, context: any) {
    try {
      if (!template || !context) {
        console.error('Template or data is missing');
        console.log(template);
        console.log(context);
        return;
      }

      console.log(context);

      const modal = await this.modalController.create({
        component: ModalDynamicComponent,
        componentProps: {
          template: template,
          context: { context },
        },
      });

      modal.onDidDismiss().then((res: any) => {
        if (res) {
          console.log(res);
        }
      });

      return await modal.present();
    } catch (error) {
      console.error('Error creating modal:', error);
    }
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
