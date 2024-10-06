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

      // Check for open modal, dismiss any, and wait for it to complete
      const topModal = await this.modalController.getTop();
      if (topModal) {
        await this.modalController.dismiss();
      }

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

  async dismissAllExceptTop() {
    console.log('dismissAllExceptTop');
    try {
      let topModal: any | null = await this.modalController.getTop();

      // Dismiss all modals until only the top one remains
      while (topModal) {
        // Dismiss the current top modal
        await this.modalController.dismiss();
        // Update topModal to the next modal in the stack
        topModal = await this.modalController.getTop();
      }

      // Optional: Re-open the last modal as the front modal if needed
      if (topModal) {
        await topModal.present();
      }
    } catch (error) {
      console.error('Error dismissing modals:', error);
    }
  }

  async dismissAllModals() {
    console.log('dismissAllModals');
    try {
      let topModal = await this.modalController.getTop();

      // Keep dismissing the top modal until there are no more modals
      while (topModal) {
        await this.modalController.dismiss();
        topModal = await this.modalController.getTop(); // Update the top modal reference
      }
    } catch (error) {
      console.error('Error dismissing all modals:', error);
    }
  }
}
