import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
//import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';

import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import {
  DomSanitizer,
  SafeHtml,
  SafeResourceUrl,
} from '@angular/platform-browser';

import { Library } from '../../app.library';
import { CoreService } from '../../services/core.service';

import { environment } from 'src/environments/environment';

@Component({
  //standalone: true,
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  providers: [CoreService, Library],
  //imports:[IonicModule]
})
export class ContentComponent implements OnInit {
  pageContent: any = {};
  pageTitle: string = '';
  path: string = '';
  private observer: IntersectionObserver | undefined;
  private pagesJSON = 'assets/json/pages.json';
  public url: string;
  public title: string;

  constructor(
    public service: CoreService,
    public navCtrl: NavController,
    public router: Router,
    public lib: Library,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    public cdr: ChangeDetectorRef,
  ) {
    this.url = environment.url;
    this.title = environment.title;
  }

  ngOnInit(): void {
    this.route.url.subscribe((url) => {
      this.path = url[1].path; // Assuming the URL is in the form of '/page'
      this.loadPageContent(this.path);
    });
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges(); // Ensure change detection after view init
  }

  loadPageContent(page: string): void {
    this.service.http.getJSON(this.pagesJSON).subscribe((pages) => {
      if (pages.content[page]) {
        this.pageTitle = pages.content[page].title;
        this.pageContent = pages.content[page].content;
        this.cdr.detectChanges();
      } else {
        this.pageTitle = 'Page Not Found';
        this.pageContent = 'The requested page does not exist.';
      }
    });
  }

  getColumnClasses(colCount: number): string {
    const colSize = Math.floor(12 / colCount);
    return `ion-col-12 ion-col-sm-6 ion-col-md-${colSize} ion-col-lg-${colSize}`;
  }

  getColumnSizes(colCount: number) {
    let size = 12;
    let sizeMd = 12;
    let sizeLg = 12;

    switch (colCount) {
      case 1:
        size = 12;
        sizeMd = 12;
        sizeLg = 12;
        break;
      case 2:
        size = 12;
        sizeMd = 6;
        sizeLg = 6;
        break;
      case 3:
        size = 12;
        sizeMd = 4;
        sizeLg = 4;
        break;
      case 4:
        size = 12;
        sizeMd = 6;
        sizeLg = 3;
        break;
      default:
        size = Math.floor(12 / colCount);
        sizeMd = size;
        sizeLg = size;
        break;
    }

    return {
      size: size, // Base size for small screens
      sizeMd: sizeMd, // Size for medium screens (tablet)
      sizeLg: sizeLg, // Size for large screens (desktop)
    };
  }

  doChildClasses(modules: any) {
    let r = '';
    //if no media in module, return as 'content-wrap' (text and buttons only)
    const media = ['image', 'video', 'slider'];
    if (modules.some((mod: any) => !media.includes(mod.type)))
      r = 'content-wrap';
    return r;
  }

  sanitizeContent(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  sanitizeUrl(url: string): SafeResourceUrl {
    const sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    console.log(sanitizedUrl); // Debug statement
    return sanitizedUrl;
  }
}
