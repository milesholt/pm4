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
  @Output() callback = new EventEmitter<any>();

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
    this.reloadSelectedTab(0); // Reload content when tab is clicked
  }

  // Triggered when switching tabs
  reloadSelectedTab(index: number = 0) {
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
        console.log(currentTab.params);
        //componentInstance['params'] = currentTab.params;
        const compParams = componentInstance.params ?? {};
        // Assign set params to existing component params
        componentInstance['params'] = { ...compParams, ...currentTab.params };
        console.log('new params');
        console.log(componentInstance['params']);
      }

      if (currentTab.el) {
        componentInstance['el'] = currentTab.el;
      }

      if (currentTab.data) {
        componentInstance['data'] = currentTab.data;
      }

      // Listen for the callback event from the dynamic component
      if (componentInstance.callback) {
        componentInstance.callback.subscribe((data: any) => {
          this.handleCallback(data, index);
        });
      }

      if (componentInstance.changes) {
        componentInstance.changes.subscribe((data: any) => {
          this.handleChanges(data, index);
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
  async onTabClick(index: number) {
    this.selectedTab = index;
    this.reloadSelectedTab(index); // Reload content when tab is clicked
  }

  handleCallback(data: any, tabIdx: number) {
    this.tabs[tabIdx].data = data;
  }

  handleChanges(changeData: any, tabIdx: number) {
    this.tabs[tabIdx].data = this.collectedData;
    this.tabs[tabIdx].el = changeData.el;
  }

  submit() {
    this.callback.emit(this.collectedData);
  }
}
