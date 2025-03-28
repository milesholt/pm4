import {
  Component,
  Input,
  ViewChild,
  ViewContainerRef,
  OnInit,
  Output,
  EventEmitter,
  TemplateRef,
} from '@angular/core';
import { CoreService } from '../../../services/core.service';
import { Library } from '../../../app.library';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  providers: [CoreService, Library],
})
export class TabsComponent implements OnInit {
  @Input() tabs: any[] = [];
  @Output() onSubmit = new EventEmitter<any>();

  @ViewChild('dynamicComponentContainer', {
    read: ViewContainerRef,
    static: true,
  })
  dynamicComponentContainer!: ViewContainerRef;

  selectedTab = 0;
  collectedData: any = {};

  constructor(public service: CoreService, public lib: Library) {}

  ngOnInit(): void {
    this.selectedTab = 0;
    this.reloadSelectedTab(); // Reload content when tab is clicked
  }

  // Triggered when switching tabs
  reloadSelectedTab() {
    const currentTab = this.tabs[this.selectedTab];

    // Clear the previous content
    this.dynamicComponentContainer.clear();

    // If there's a component to load, render it dynamically
    if (currentTab.component) {
      const componentRef = this.dynamicComponentContainer.createComponent(
        currentTab.component
      );
      const componentInstance = componentRef.instance as any; // Can be more specific if needed

      // Pass params if available
      if (currentTab.params) {
        componentInstance['params'] = currentTab.params;
      }

      if (currentTab.el) {
        componentInstance['el'] = currentTab.el;
      }

      // Listen for the callback event from the dynamic component
      if (componentInstance.callback) {
        componentInstance.callback.subscribe((data: any) => {
          this.handleCallback(data);
        });
      }
    }

    // If there's a template to load, render it using ngTemplateOutlet
    if (currentTab.template) {
      const templateRef = currentTab.template as TemplateRef<any>;
      this.dynamicComponentContainer.createEmbeddedView(templateRef);
    }
  }

  // Tab click handler
  onTabClick(index: number) {
    this.selectedTab = index;
    this.reloadSelectedTab(); // Reload content when tab is clicked
  }

  handleCallback(data: any) {
    this.collectedData = { ...this.collectedData, ...data };
  }

  submit() {
    this.onSubmit.emit(this.collectedData);
  }
}
