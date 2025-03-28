import { Input, Output, Component, EventEmitter, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { Library } from '../../../app.library';
import { CoreService } from '../../../services/core.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss'],
  providers: [CoreService, Library],
})
export class ItemsComponent implements OnInit {
  @Input() el: any = null;
  @Input() params: any = null;
  @Output() itemsChange = new EventEmitter<any[]>();

  items: any[] = [];
  itemForm: FormGroup;
  editingIndex: number | null = null;

  constructor(
    public service: CoreService,
    public navCtrl: NavController,
    public router: Router,
    public lib: Library,
    private fb: FormBuilder
  ) {
    this.itemForm = this.fb.group({
      name: new FormControl(''),
      key: new FormControl(''),
      type: new FormControl(''),
      value: new FormControl(''),
    });
  }

  ngOnInit() {}

  generateUniqueKey(): string {
    let index = this.items.length + 1;
    let newKey = `item${index}`;

    while (this.items.some((item) => item.key === newKey)) {
      index++;
      newKey = `item${index}`;
    }
    return newKey;
  }

  generateUUID(): string {
    return crypto.randomUUID(); // Generate a unique identifier
  }

  addItem() {
    const newItem = {
      id: this.generateUUID(), // Unique identifier for drag tracking
      key: this.generateUniqueKey(),
      ...this.itemForm.value,
      fields: [],
      params: [],
    };

    this.items.push(newItem);
    this.itemsChange.emit(this.items);
    this.itemForm.reset();
  }

  editItem(index: number) {
    this.editingIndex = index;
    this.itemForm.patchValue(this.items[index]);
  }

  updateItem() {
    if (this.editingIndex !== null) {
      this.items[this.editingIndex] = {
        ...this.items[this.editingIndex], // Preserve ID
        ...this.itemForm.value,
      };

      this.itemsChange.emit(this.items);
      this.editingIndex = null;
      this.itemForm.reset();
    }
  }

  deleteItem(index: number) {
    this.items.splice(index, 1);
    this.itemsChange.emit(this.items);
  }

  duplicateItem(index: number) {
    const duplicate = JSON.parse(JSON.stringify(this.items[index])); // Deep clone
    duplicate.id = this.generateUUID(); // Ensure unique ID
    duplicate.key = this.generateUniqueKey();

    this.items.splice(index + 1, 0, duplicate);
    this.itemsChange.emit(this.items);
  }

  reorderItems(event: any) {
    const itemToMove = this.items.splice(event.detail.from, 1)[0]; // Remove from old position
    this.items.splice(event.detail.to, 0, itemToMove); // Insert at new position
    event.detail.complete(); // Mark reorder complete
    this.itemsChange.emit(this.items);
  }
}
