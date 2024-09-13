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
          isModal: true,
        },
      });

      /*modal.onDidDismiss().then((res: any) => {
        if (res) {
          console.log(res);
        }
      });*/

      await modal.present();

      const { data } = await modal.onDidDismiss(); // Wait for the modal to be dismissed
      return data; // Return the data to the caller
    } catch (error) {
      console.error('Error creating modal:', error);
    }
  }

  dismiss(returnData?: any) {
    this.modalController.dismiss(returnData);
  }
}
