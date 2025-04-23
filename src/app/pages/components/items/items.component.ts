import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormComponent } from '../form/form.component';
import { IonItemSliding } from '@ionic/angular';

import { Library } from '../../../app.library';
import { CoreService } from '../../../services/core.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss'],
  providers: [CoreService, Library],
})
export class ItemsComponent {
  @Output() callback = new EventEmitter();
  @Input() el: any;
  @Input() params: any = {
    itemLabel: 'name',
  };
  @Input() data: any[] = [];

  constructor(
    private modalCtrl: ModalController,
    public service: CoreService,
    public lib: Library
  ) {}

  ngOnInit() {
    this.initializeItems();
  }

  initializeItems() {
    const defaultFields = [
      {
        name: 'Name',
        key: 'name',
        value: '',
        type: 'text',
        placeholder: 'Enter name',
      },
    ];
    //this.data = [];
  }

  async openFormModal(item: any = null) {
    console.log(item);

    const formData = {
      el: {
        action: 'returnform',
        fields: item ? [...item.fields] : [...this.el.fields], // Pass existing or new fields
      },
    };

    const result = await this.service.modal.openModal(
      null,
      formData,
      FormComponent,
      false
    );

    if (result.data) {
      if (item) {
        this.updateItem(result.data.fields, item);
      } else {
        this.addItem(result.data.fields);
      }
    }
  }

  addItem(fields: any) {
    this.data.push({ id: Date.now(), fields });
    this.emit(this.data);
  }

  getItemLabel(item: any) {
    return (
      item.fields.find((f: any) => f.key === this.params.itemLabel)?.value ||
      'Untitled Item'
    );
  }

  updateItem(updatedFields: any, item: any) {
    const index = this.data.findIndex((i) => i.id === item.id);
    if (index !== -1) {
      this.data[index].fields = updatedFields;
    }
    this.emit(this.data);
  }

  duplicateItem(item: any) {
    const clonedFields = this.lib.shallowCopy(item.fields);
    this.data.push({ id: Date.now(), fields: clonedFields });
    this.emit(this.data);
  }

  deleteItem(item: any) {
    this.data = this.data.filter((i) => i.id !== item.id);
    this.emit(this.data);
  }

  reorderItems(event: any) {
    const movedItem = this.data.splice(event.detail.from, 1)[0];
    this.data.splice(event.detail.to, 0, movedItem);
    event.detail.complete();
    this.emit(this.data);
  }

  showItemOptions(item: IonItemSliding) {
    item.open('end');
  }

  formatData(items: any) {
    const formattedData: any = [];

    console.log('formatting data');
    console.log(items);

    // Loop through fields and extract key-value pairs (excluding 'submit' type)
    items.forEach((item: any, idx: number) => {
      let itm: any = { data: {} };
      item.fields.forEach((field: any) => {
        if (field.type !== 'submit') {
          itm.data[field.key] = field.value;
        }
      });
      itm.id = item.id;
      itm.fields = item.fields;
      formattedData.push(itm);
    });

    return formattedData;
  }

  emit(data: any) {
    let postData: any = this.formatData(data);
    this.callback.emit(postData);
  }
}
