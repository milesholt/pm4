import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ChangeDetectorRef,
} from '@angular/core';
import { DynamicComponent } from './dynamic.component.interface';

@Component({
  selector: 'app-dynamic-wrapper',
  template: '<ng-container #container ></ng-container>',
})
export class DynamicWrapperComponent implements OnInit {
  @Input() component: any;
  @Input() params: any;

  @Output() callback = new EventEmitter();

  @ViewChild('container', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;
  componentRef: any;

  constructor(public cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.createComponent();
  }

  createComponent() {
    this.cdr.detectChanges();

    console.log('creating component');
    console.log(this.params);

    // Clear previous component if any
    this.container.clear();

    // Create the component dynamically
    this.componentRef = this.container.createComponent(this.component);

    // Pass the @Input() parameters
    //Object.assign(componentRef.instance as DynamicComponent, this.params);
    const instance = this.componentRef.instance as DynamicComponent;
    instance.params = this.params;

    // Subscribe to the dynamic component's output event if it exists
    if (instance.callback) {
      instance.callback.subscribe((data: any) => {
        this.callback.emit(data); // Emit the event back to the parent component
      });
    }

    return this.componentRef;
  }
}
