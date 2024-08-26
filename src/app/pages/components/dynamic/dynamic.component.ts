import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { DynamicComponent } from './dynamic.component.interface';

@Component({
  selector: 'app-dynamic-wrapper',
  template: '<ng-container #container></ng-container>',
})
export class DynamicWrapperComponent implements OnInit {
  @Input() component: any;
  @Input() params: any;
  @ViewChild('container', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;

  ngOnInit() {
    // Clear previous component if any
    this.container.clear();

    // Create the component dynamically
    const componentRef = this.container.createComponent(this.component);

    // Pass the @Input() parameters
    //Object.assign(componentRef.instance as DynamicComponent, this.params);
    const instance = componentRef.instance as DynamicComponent;
    instance.params = this.params;
  }
}
