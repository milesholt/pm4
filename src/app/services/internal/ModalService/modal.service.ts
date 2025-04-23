// modal.service.ts
import { ModalDynamicComponent } from 'src/app/pages/components/modal/modal-dynamic.component';
import { ModalComponent } from 'src/app/pages/components/modal/modal.component';

import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TemplateRef } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(private modalController: ModalController) {}

  /*async openModal(template: TemplateRef<any> | null, context: any) {
    try {
      if (!context) {
        console.error('Context is missing');
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

      await modal.present();

      const { data } = await modal.onDidDismiss(); // Wait for the modal to be dismissed
      return data; // Return the data to the caller
    } catch (error) {
      console.error('Error creating modal:', error);
    }
  }*/

  async openModal(
    template: TemplateRef<any> | null,
    context: any,
    component: any = false,
    dismissTop: boolean = true
  ) {
    try {
      if (!context) {
        console.error('Context is missing');
        console.log(context);
        return;
      }

      console.log(context);

      //dimiss top modal condition
      if (!!dismissTop) this.dismissTop();

      // If no template is provided, use ModalComponent instead

      //Set default data structure for ModalComponent
      let modalData = { data: context };

      if (component == false) {
        component = template ? ModalDynamicComponent : ModalComponent;
      } else {
        //pass data as is for any component
        modalData = context;
      }

      const modal = await this.modalController.create({
        component: component,
        componentProps: template
          ? { template: template, context: { context }, isModal: true }
          : modalData, // Pass context as data for ModalComponent or other Component
      });

      await modal.present();

      //const { data } = await modal.onDidDismiss(); // Wait for the modal to be dismissed
      //return data; // Return the data to the caller

      // Listen for data from the modal
      const { data } = await modal.onWillDismiss();
      if (data) return data;
    } catch (error) {
      console.error('Error creating modal:', error);
    }
  }

  async dismiss(returnData?: any) {
    const topModal = await this.modalController.getTop();
    if (!topModal) return;
    this.modalController.dismiss(returnData);
  }

  async dismissTop(returnData?: any) {
    console.log('dismissing top modal');
    console.log(returnData);
    const topModal = await this.modalController.getTop();
    if (topModal) {
      await topModal.dismiss(returnData); // Dismiss only the form modal
    }
  }

  async isModal() {
    const topModal = await this.modalController.getTop();
    if (topModal) {
      return true;
    }
    return false;
  }

  async dismissAllExceptTop(returnData?: any) {
    console.log('dismissAllExceptTop');
    try {
      let topModal: any | null = await this.modalController.getTop();

      // Dismiss all modals until only the top one remains
      while (topModal) {
        // Dismiss the current top modal
        await this.modalController.dismiss(returnData);
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
