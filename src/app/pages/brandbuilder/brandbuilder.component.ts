import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
//import { PexelsService } from '../services/pexels.service';

import { ModalController } from '@ionic/angular';
import { ModalComponent } from '../components/modal/modal.component';
import { ThemeBrandBuilderComponent } from './components/theme/theme.brandbuilder.component';

import { Library } from '../../app.library';
import { CoreService } from '../../services/core.service';

import { animate, style, transition, trigger } from '@angular/animations';

import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from '@google/generative-ai';
import { environment } from '../../../environments/environment';
import { error } from 'console';

@Component({
  selector: 'app-brandbuilder',
  templateUrl: 'brandbuilder.component.html',
  styleUrls: ['brandbuilder.component.scss'],
  animations: [
    trigger('rowAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate(
          '300ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '300ms ease-out',
          style({ opacity: 0, transform: 'translateY(20px)' })
        ),
      ]),
    ]),
    trigger('columnAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate(
          '300ms ease-out',
          style({ opacity: 1, transform: 'translateX(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '300ms ease-out',
          style({ opacity: 0, transform: 'translateX(20px)' })
        ),
      ]),
    ]),
  ],
})
export class BrandBuilderComponent
  implements OnInit, AfterViewChecked, AfterViewInit
{
  //companyName: string = '';
  //companyDescription: string = '';
  // companyProducts: string = '';
  //
  @ViewChild('previewPanel') previewPanel!: ElementRef;

  currentStage: number = 1;

  siteId: any = false;
  isCreating: boolean = true;
  isEditing: boolean = false;
  activePageTitle: string = '';
  activePage: any = false;
  activeIndex = 0;
  isChanging: boolean = false;
  activeTheme = 0;

  isSaved: boolean = false;
  isSaving: boolean = false;
  isFailed: boolean = false;

  versions: any = [];
  activeVersion: number = 0;
  maxVersions: number = 50;

  /*companyName: string = 'Roses R Us';
    companyDescription: string =
      "We're a premium boutique floral delivery service. We deliver fresh, high quality flower bouquets with a wide variety of different flowers from roses, sunflowers to lavender and orchids.";
    companyProducts: string =
      'flower bouquets, roses, sunflowers, lavender, orchids';
  */
  demoIdx = 0;
  isDemoClicked: boolean = false;
  demos: any = [
    {
      name: 'Black & Red Tattoo Parlor',
      description:
        "We're an old fashioned tattoo shop based in Las Vegas. We provide high quality tattoo services. We offer a wider variety of styles and tattoo application methods, with a team of dedicated and professional ink artists. We do all methods of tattooing from Stick and Poke Hand Poke, Single Needle, Yantra/Sak Yants, and Tebori. We also provide tattoo removal services.\n",
      products:
        'bamboo tattoo, blackwork tattoo, black ink tattoo, watercolour tattoo, body art tattoo, geometric tattoo, tattoo removal, bespoke tattoo design service',
      email: '',
      instagram: '',
    },
    {
      name: 'Paws 4 Coffee',
      description:
        "We're a small family run cafe, but that also runs an animal rescue shelter for stray dogs and cats. We'e based in San Francisco and have been going for the last 3 or so years. All our coffee is homegrown and while enjoying our coffee, customers can enjoy the company of our rescue feline friends. This helps the customers get to know and spend time with the animals, and even giving them a chance of finding a new home. We also offer workshops on pet care and how to grow your own coffee \n",
      products:
        'arabica coffee, robusta coffee, rescue animal adoption, pet care workshop, coffee growing workshop',
      email: '',
      instagram: '',
    },
    {
      name: 'Death Valley Fitness',
      description:
        "Based near the region of Death Valley, we're a 24 hour self service gym. We offer high-end premium gym facilites, weights and machines that cover all upper, lower body and core, abdominal areas. Customers can swipe in an out using our mobile app. We offer a range of membership options to suit all needs. We also offer evening and morning yoga and pilates classes for those getting ready or coming back from work. \n",
      products:
        'weight training, yoga, pilates, 24 hour gym service, self service, cardio machines, high intensity training',
      email: '',
      instagram: '',
    },
    {
      name: 'Vegas Vinyls',
      description:
        'Your one stop shop in Vegas for the authentic, vintage vinyl. We cater to every genre from old skool hip hop, to rnb, to chicago house. From old and new. We also sell original and limited editions. we organise weekend events with live music and djs. we also host launch events for up and coming artists that have releases in vinyl. we also have a small bar where people can hang out, or just listen to great music.',
      products:
        'music vinyl collections, live music, rhythm and blues, country music genre, hip hop genre, chicago house, techno genre, rock genre, limited edition vinyl releases, new music releases on vinyl, vinyl turntables',
      email: '',
      instagram: '',
    },
  ];

  companyName: string = '';
  companyDescription: string = '';
  companyProducts: string = '';
  companyEmail: string = '';
  companyInstagram: string = '';

  showCreate: boolean = false;
  showPreview: boolean = false;
  showPublish: boolean = false;
  showHolding: boolean = false;

  isHoldingFailed: boolean = false;
  isHoldingPending: boolean = false;
  isHoldingSuccess: boolean = false;

  photos: any[] = [];
  media: any = {
    social: {
      instagram: [],
    },
  };

  themeStructure: any = {
    colours: [
      { primary: '', secondary: '', tertiary: '' },
      { primary: '', secondary: '', tertiary: '' },
      { primary: '', secondary: '', tertiary: '' },
    ],
    fonts: [
      { name: '', url: '' },
      { name: '', url: '' },
      { name: '', url: '' },
    ],
  };

  aiStructure: any = {
    welcome: { section: 'Welcome', title: '', content: '' },
    introduction: { section: 'Introduction', title: '', content: '' },
    problemSolution: {
      section: 'Problem and solution',
      title: '',
      content: '',
    },
    ourProducts: {
      section: 'Introduction of our products',
      title: '',
      content: '',
    },
    aboutUs: { section: 'About us', title: '', content: '' },
    ourMission: { section: 'Our mission', title: '', content: '' },
    ourHistory: { section: 'Our history', title: '', content: '' },
    ourValues: { section: 'Our values', title: '', content: '' },
    ourPromise: { section: 'Our promise', title: '', content: '' },
    primaryFeature: {
      section: 'Primary selling point or key feature',
      title: '',
      content: '',
    },
    secondaryFeature: {
      section: 'Secondary selling point or key feature',
      title: '',
      content: '',
    },
    thirdFeature: {
      section: 'Third selling point or key feature',
      title: '',
      content: '',
    },
    mainServices: { section: 'Main services', title: '', content: '' },
    primaryService: {
      section: 'Primary service',
      title: '',
      content: '',
    },
    secondaryService: {
      section: 'Secondary service',
      title: '',
      content: '',
    },
    thirdService: {
      section: 'Third service',
      title: '',
      content: '',
    },
    otherServices: { section: 'Other services', title: '', content: '' },
    mailingList: { section: 'Mailing list signup', title: '', content: '' },
    faq: { section: 'Frequently Asked Questions', title: '', content: '' },
  };

  modules: any = [
    { name: 'form', title: '', classes: '', params: {} },
    { name: 'faq', title: '', classes: '', params: {} },
    { name: 'mailchimp', title: '', classes: '', params: {} },
    { name: 'mailinglist', title: '', classes: '', params: {} },
    { name: 'gallery', title: '', classes: '', params: {} },
    { name: 'youtube', title: '', classes: '', params: {} },
    { name: 'video', title: '', classes: '', params: {} },
    { name: 'slideshow', title: '', classes: '', params: {} },
    { name: 'embed', title: '', classes: '', params: {} },
    { name: 'custom', title: '', classes: '', params: {} },
    { name: 'link', title: '', classes: '', params: {} },
    { name: 'googledrive', title: '', classes: '', params: {} },
    { name: 'instagram', title: '', classes: '', params: {} },
    { name: 'image', title: '', classes: '', params: {} },
  ];

  websiteStructure: any = [
    {
      title: 'Home',
      subheading: '',
      content: '',
      image: '',
      metadata: {
        title: '',
        description: '',
      },
      sections: [
        { name: 'welcome' },
        { name: 'introduction' },
        { name: 'problemSolution' },
        { name: 'primaryService' },
        { name: 'secondaryService' },
        { name: 'thirdService' },
        { name: 'primaryFeature' },
        { name: 'secondaryFeature' },
        { name: 'thirdFeature' },
        {
          name: 'mailingList',
          layoutId: 2,
          modules: [{ id: 0 }],
        },
        {
          name: 'faq',
          layoutId: 2,
          modules: [{ id: 1 }],
        },
        {
          name: 'contactform',
          layoutId: 3,
          modules: [{ id: 0, title: 'Get in touch' }],
        },
      ],
    },

    {
      title: 'About Us',
      subheading: '',
      content: '',
      image: '',
      metadata: {
        title: '',
        description: '',
      },
      sections: [
        { name: 'aboutUs' },
        { name: 'ourMission' },
        { name: 'ourHistory' },
        { name: 'ourValues' },
        { name: 'ourPromise' },
        { name: 'otherServices' },
        {
          name: 'mailingList',
          layoutId: 2,
          modules: [{ id: 0 }],
        },
        {
          name: 'faq',
          layoutId: 2,
          modules: [{ id: 1 }],
        },
      ],
    },
    {
      title: 'Our {Wildcard}',
      subheading: '',
      content: '',
      image: '',
      metadata: {
        title: '',
        description: '',
      },
      sections: [
        { name: 'ourProducts' },
        {
          name: 'mailingList',
          layoutId: 2,
          modules: [{ id: 0 }],
        },
        {
          name: 'faq',
          layoutId: 2,
          modules: [{ id: 1 }],
        },
      ],
    },
    {
      title: 'Shop',
      subheading: '',
      content: '',
      image: '',
      metadata: {
        title: '',
        description: '',
      },
      products: [
        {
          image: '',
          alias: '',
          title: '',
          description: '',
          price: '',
          tags: [''],
        },
      ],
      sections: [
        {
          name: 'mailingList',
          layoutId: 2,
          modules: [{ id: 0 }],
        },
        {
          name: 'faq',
          layoutId: 2,
          modules: [{ id: 1 }],
        },
      ],
    },
    {
      title: 'Contact Us',
      subheading: '',
      content: '',
      image: '',
      metadata: {
        title: '',
        description: '',
      },
      sections: [
        {
          name: 'mailingList',
          layoutId: 2,
          modules: [{ id: 0 }],
        },
        {
          name: 'faq',
          layoutId: 2,
          modules: [{ id: 1 }],
        },
        {
          name: 'contactform',
          layoutId: 3,
          modules: [{ id: 0, title: 'Get in touch' }],
        },
      ],
    },
  ];

  contentLayouts2 = [
    {
      classes: '2-col-left-content 2-col',
      rows: [
        {
          cols: [
            {
              modules: [
                {
                  type: 'heading',
                  value: '',
                },
                {
                  type: 'content',
                  value: '',
                },
                {
                  type: 'cta',
                  value: '',
                },
              ],
            },
            {
              modules: [
                {
                  type: 'image',
                  src: '',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      classes: '2-col-right-content 2-col',
      rows: [
        {
          cols: [
            {
              modules: [
                {
                  type: 'image',
                  scr: '',
                },
              ],
            },
            {
              modules: [
                {
                  type: 'heading',
                  value: '',
                },
                {
                  type: 'content',
                  value: '',
                },
                {
                  type: 'cta',
                  value: '',
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  contentLayouts = [
    {
      structure: [[{ heading: '' }, { content: '' }], [{ image: '' }]],
      params: {
        classes: 'col-2-left-content',
        parentclasses: 'col-2',
      },
    },
    {
      structure: [[{ image: '' }], [{ heading: '' }, { content: '' }]],
      params: {
        classes: 'col-2-right-content',
        parentclasses: 'col-2',
      },
    },
    {
      structure: [[{ heading: '' }, { content: '' }]],
      params: {
        classes: 'col-1-center-content',
        parentclasses: 'col-1',
      },
    },
    {
      structure: [[{}]],
      params: {
        classes: 'col-1-empty',
        parentclasses: 'col-1',
      },
    },
  ];

  /*contentLayouts = [
    {
      structure: [[{ heading: '' }, { content: '' }], [{ image: '' }]],
      params: {
        classes: 'col-2-left-content',
        parentclasses: 'col-2',
      },
    },
    {
      structure: [[{ image: '' }], [{ heading: '' }, { content: '' }]],
      params: {
        classes: 'col-2-right-content',
        parentclasses: 'col-2',
      },
    },
  ];*/

  generated: any = false;
  generating: any = false;

  message: string = '';
  aiform: any = false;
  themes: any = false;

  currentYear: number;

  private observer: IntersectionObserver | undefined;

  constructor(
    public service: CoreService,
    public lib: Library,
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef,
    public router: Router,
    public route: ActivatedRoute,
    private modalController: ModalController
  ) {
    this.currentYear = new Date().getFullYear();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const docId = params['site']; // Get the document ID from query parameters
      this.siteId = docId;
      if (docId) {
        this.prepareSiteLoad();
        if (this.service.auth.isLoggedIn && params['edit']) {
          console.log('user logged in');
          console.log(this.service.auth);
          this.isEditing = true;
          this.loadDocument(docId);
        } else {
          //if user has been logged out
          if (params['edit']) {
            this.router.navigate(['login']);
          }
          this.isEditing = false;
          console.log('loading public');
          this.loadPublic(docId);
        }
        this.isCreating = false;
      } else {
        this.siteId = false;
        this.isCreating = true;
        this.showSection('create');
      }
    });
  }

  prepareSiteLoad() {
    //add class to body to hide elements when viewing a Site
    document.body.classList.add('is-site');
  }

  loadPublic(docId: string) {
    this.showSection('holding');
    this.showHoldingStatus('pending');
    console.log(docId);
    const pathSegments = ['sites'];
    this.service.firestore.getDocumentById(pathSegments, docId).subscribe(
      (d) => {
        if (d) {
          console.log('doc:');
          console.log(d);
          const urlSegments = d.urlSegments;
          const siteId = d.siteId;
          const status = d.status;

          if (d.status !== 'published') {
            throw new Error('site is not public');
          }
          this.service.firestore.getDocumentById(urlSegments, siteId).subscribe(
            (doc) => {
              if (doc) {
                this.finishLoadSite(doc, siteId);
                return true;
              } else {
                this.showHoldingStatus('failed');
                this.message =
                  "Sorry, we couldn't load the site. Please try again later.";
                return false;
              }
            },
            (error) => {
              alert(error);
              this.message = error.message;
              console.error('Error fetching document: ', error);
            }
          );
          return true;
        } else {
          this.showHoldingStatus('failed');
          this.message =
            "Sorry, we couldn't find your site. Please check the ID and try again.";
          return false;
        }
      },
      (error) => {
        alert(error);
        this.message = error.message;
        console.error('Error fetching document: ', error);
      }
    );
  }

  loadDocument(docId: string) {
    this.showSection('holding');
    this.showHoldingStatus('pending');
    this.message = 'Getting your site, hold on...';

    let site: any = false;
    var local = localStorage.getItem('bb_' + docId);

    //console.log(docId);
    //console.log(JSON.stringify(local));

    if (local) {
      console.log('got site locally');
      site = JSON.parse(local);
      console.log(site);
      this.message = 'Loading local version...';
      this.finishLoadSite(site, docId);
    } else {
      console.log('getting site remotely');
      this.message = 'Checking for remote version...';
      //user should be logged in
      const userId = this.service.auth.getUser().uid;
      const pathSegments = ['users', userId, 'sites'];

      console.log('userid');
      console.log(userId);

      console.log('doc id');
      console.log(docId);

      this.service.firestore.getDocumentById(pathSegments, docId).subscribe(
        (doc) => {
          if (doc) {
            this.showHoldingStatus('success');
            this.message = 'Found your site, downloading...';
            console.log('Loading document from site id: ' + docId);
            site = doc;
            this.finishLoadSite(site, docId);
            return true;
          } else {
            this.showHoldingStatus('failed');
            this.message =
              "Sorry, we couldn't find your site. Please check the ID and try again.";
            return false;
          }
        },
        (error) => {
          alert(error);
          this.message = error.message;
          this.showHoldingStatus('failed');
          console.error('Error fetching document: ', error);
        }
      );
    }
  }

  async finishLoadSite(obj: any, docId: string) {
    this.showHoldingStatus('pending');
    this.message = 'Setting everything up...';
    //Firestore contains data node, otherwise raw data is passed from local
    const d = obj.hasOwnProperty('data') ? JSON.parse(obj.data) : obj;
    console.log('Got site:');
    console.log(d);
    if (!d.hasOwnProperty('content') || !d.content) {
      this.showHoldingStatus('failed');
      this.message = 'Uh oh, no data for this site..';
      return false;
    }
    this.generated = d.content;
    this.companyName = d.details.companyInfo.companyName;
    this.companyDescription = d.details.companyInfo.companyDescription;
    this.companyProducts = d.details.companyInfo.companyProducts;
    this.photos = d.media.photoData;
    this.media = d.media;
    this.activeIndex = 0;
    this.activePage = this.generated[0];
    this.activePageTitle = this.generated[0].title;
    this.themes = d.themes;
    this.activeTheme = d.themeId ?? 0;

    await this.loadImages();
    await this.doThemesCSS();

    this.showHoldingStatus('success');
    this.message = 'Your site is ready!';

    //localStorage.setItem('bb_' + docId, JSON.stringify(obj));

    this.recordChange();
    this.showSection('preview');

    return true;

    /*
    this.generated = d.content;
    this.companyName = d.details.companyInfo.companyName;
    this.companyDescription = d.details.companyInfo.companyDescription;
    this.companyProducts = d.details.companyInfo.companyProducts;
    this.photos = d.media.photoData;
    this.activeIndex = 0;
    this.activePage = this.generated[0];
    this.activePageTitle = this.generated[0].title;*/

    //store locally once loaded from remote
    //localStorage.setItem('bb_' + docId, JSON.stringify(doc));
    //this.showSection('preview');
    //this.errorMessage = null; // Clear any previous error
  }

  ngAfterViewInit(): void {
    this.initializeObserver();
  }

  ngAfterViewChecked(): void {
    this.observeElements();
  }

  initializeObserver() {
    this.observer = new IntersectionObserver(this.handleIntersect.bind(this), {
      threshold: 0.3, // Trigger when 30% of the target is visible
    });
  }

  observeElements() {
    if (!this.observer) return;

    const targetElements =
      this.elementRef.nativeElement.querySelectorAll('.anim');
    targetElements.forEach((element: any) => {
      this.observer!.observe(element);
    });
  }

  handleIntersect(entries: IntersectionObserverEntry[]) {
    entries.forEach((entry) => {
      if (entry.intersectionRatio >= 0.3) {
        // Element is at least 30% visible
        const targetElement = entry.target as HTMLElement;
        targetElement.classList.add('fade-in');
        // Perform your desired actions here
      }
    });
  }

  nextStage() {
    this.currentStage++;
  }

  previousStage() {
    this.currentStage--;
  }

  doDemo() {
    this.demoIdx = this.selectRandom(this.demos, this.demoIdx);
    this.companyName = this.demos[this.demoIdx].name;
    this.companyDescription = this.demos[this.demoIdx].description;
    this.companyProducts = this.demos[this.demoIdx].products;
  }

  async onSubmit() {
    console.log('running');
    this.message = 'Generating content...';
    this.generating = true;

    //await this.setupJSON();

    /*this.TestGeminiPro()
        .then(async (result) => {
          await this.doImages();
        })
        .then(async (result: any) => {
          //alert(JSON.stringify(result));
          //await this.doLayouts();
        })
        .finally(() => {
          this.activePage = this.generated[0];
          this.generating = false;
          this.generated = true;
        });*/

    this.TestGeminiPro()
      .then(async (result) => {
        this.generated = result;
        /*await this.doImages().subscribe((result) => {
            this.generated = result;
          });*/
        this.message = 'Generating images...';
        await this.doImages();

        this.message = 'Generating themes...';
        await this.doThemes();
        this.message = 'Generating style...';
        await this.doThemesCSS();
        this.message = 'Generating structure...';
        this.aiform = await this.doAIStructure();
      })
      .then(async (result: any) => {
        this.message = 'Generating layouts...';
        this.generated = await this.doSections();
        this.message = 'Loading images...';
        await this.loadImages();
      })
      .finally(() => {
        this.message = 'Finalising...';
        this.activePage = this.generated[0];
        this.generating = false;
      })
      .catch((e) => {
        this.message = 'Failed run';
      });
  }

  changePage(i: number = 0) {
    this.scrollToTop();
    this.isChanging = true;
    this.activeIndex = i;
    this.activePageTitle = this.generated[i].title;
    this.activePage = this.generated[i];
    setTimeout(() => {
      this.isChanging = false;
    }, 600);
  }

  // Function to scroll to the top of the main content container
  scrollToTop() {
    setTimeout(() => {
      //this.previewPanel.nativeElement.scrollTo({ top: 0, behavior: 'smooth' });
      const previewPanel = document.querySelector('#previewPanel');
      if (previewPanel) {
        previewPanel.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 800);
  }

  setupJSON() {
    this.websiteStructure.forEach((item: any) => {
      // Clone a random layout from the contentLayouts array
      const randomLayout = this.cloneObject(
        this.contentLayouts2[
          Math.floor(Math.random() * this.contentLayouts2.length)
        ]
      );
      // Assign the cloned layout to the item's layout property
      item.layout = randomLayout;
    });
    //alert(JSON.stringify(this.websiteStructure));
  }

  // Function to clone an object
  cloneObject(obj: any) {
    return JSON.parse(JSON.stringify(obj));
  }

  searchPhotos(query: string): Promise<any> {
    console.log('searching pexels:');
    return new Promise((resolve, reject) => {
      this.service.pexels.searchPhotos(query).subscribe((response) => {
        this.photos = response.photos;
        console.log(this.photos);
        resolve(this.photos);
      });
    });
  }

  /*selectRandom(arr: any = 10) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return randomIndex;
  }*/

  selectRandom(arr: any[], currentIndex?: number): number {
    let randomIndex: number;
    if (currentIndex === undefined) {
      randomIndex = Math.floor(Math.random() * arr.length);
    } else {
      do {
        randomIndex = Math.floor(Math.random() * arr.length);
      } while (randomIndex === currentIndex);
    }
    return randomIndex;
  }

  selectAlternate(idx: number = 0, arr: any = []) {
    // Update the layout index to alternate layouts
    const alternateIndex = (idx + 1) % arr.length;
    return alternateIndex;
  }

  hasProperty(col: any[], prop: string): boolean {
    return col.some((mod) => mod.hasOwnProperty(prop));
  }

  resetForm() {
    this.companyDescription = '';
    this.companyName = '';
    this.companyProducts = '';
    this.currentStage = 1;
  }

  showSection(section: string = 'create') {
    switch (section) {
      case 'create':
        this.showPreview = false;
        this.showCreate = true;
        this.showPublish = false;
        this.showHolding = false;
        break;
      case 'preview':
        this.showPreview = true;
        this.showCreate = false;
        this.showPublish = false;
        this.showHolding = false;
        break;
      case 'publish':
        this.showPreview = false;
        this.showCreate = false;
        this.showPublish = true;
        this.showHolding = false;
        break;
      case 'holding':
        this.showPreview = false;
        this.showCreate = false;
        this.showPublish = false;
        this.showHolding = true;
        break;
      default:
        break;
    }
  }

  showHoldingStatus(status: string = 'pending') {
    switch (status) {
      case 'pending':
        this.isHoldingPending = true;
        this.isHoldingFailed = false;
        this.isHoldingSuccess = false;
        break;
      case 'failed':
        this.isHoldingPending = false;
        this.isHoldingFailed = true;
        this.isHoldingSuccess = false;
        break;
      case 'success':
        this.isHoldingPending = false;
        this.isHoldingFailed = false;
        this.isHoldingSuccess = true;
        break;
    }
  }

  /* async runMultiple(i) {
      let versions: any = [];
      await this.TestGeminiPro.then(async (result) => {
        versions.push(result);
        i++;
        if (i < 5) {
          this.runMultiple(i);
          console.log(`Result ${i + 1}:`, result);
        } else {
          //work out which version is the longest
          let longest = 0;
          let index = 0;
          for (let i = 0; i < versions.length; i++) {
            if (versions[i].length > longest) {
              longest = versions[i].length;
              index = i;
            }
          }
          console.log(`Result:`, versions[index]);
        }
      });
    }*/

  async TestGeminiPro(): Promise<any> {
    const prompt =
      'Using the following details: company name: ' +
      this.companyName +
      ' and company description: ' +
      this.companyDescription +
      ' and the company products are:' +
      this.companyProducts +
      ' Please complete the following json structure with all the values completed. I need website content for Home, About Us, Our {Wildcard}, Shop, Products and Contact Us pages. Replace {Wildcard} with "Products", "Solutions", "Courses" or "Services", depending on company industry and description. Any title or heading can be no more than 5 words. The subheading can be no more than 10 words. The content property has to be a minimum of 100 words and no more than 500 words. Each page must have different content. No content can be the same, and no image can be the same for each page. For the metadata, title and description, please copy the title and summarize the content into one or two lines for the description. Use only this structure: ' +
      JSON.stringify(this.websiteStructure);

    try {
      const res = await this.doAI(prompt);
      return res;
    } catch (e) {
      throw e;
    }
  }

  async doAIStructure(): Promise<any> {
    console.log('doing ai form:');
    const prompt =
      'Using the data and content from this json: ' +
      JSON.stringify(this.generated) +
      this.companyProducts +
      ' Use this json structure: ' +
      JSON.stringify(this.aiStructure) +
      ' and complete the values for all title and content properties, using the structure property as a description and guidance for both title and content. Return only the updated json structure. All the title and content values should be completed. Titles should be no more than 10 words, and content no more than 300 words.';
    console.log(prompt);

    try {
      const res = await this.doAI(prompt);
      return res;
    } catch (e) {
      throw e;
    }
  }

  async doThemes() {
    console.log('doing themes:');
    const prompt =
      'Using the data and content from this json: ' +
      JSON.stringify(this.generated) +
      this.companyProducts +
      ' Use this json structure: ' +
      JSON.stringify(this.themeStructure) +
      ' and complete the values for all the empty properties, providing three groups of three hex colours - a primary, secondary and tertiary color - in hex code, and three suggested Google Fonts. The colors and fonts must be fitting to the company and website content, in terms of style. Return only the updated json structure. All the empty values should be completed. For colours, they must all be different to each other. No colour can be the same, nor can any be white or a shade of white. For the fonts please provide the name of the google font and a url to load the font and all available weights';
    console.log(prompt);

    try {
      const res = await this.doAI(prompt);
      console.log(res);
      this.themes = res;
      return res;
    } catch (e) {
      throw e;
    }
  }

  async doThemesCSS() {
    //console.log('Writing css for themes');
    let css = '';
    this.themes.fonts.forEach((font: any, index: number) => {
      css += '@import url("' + font.url + '");';
    });
    this.themes.fonts.forEach((font: any, index: number) => {
      css +=
        'body .theme' +
        index +
        ' * {font-family: "' +
        font.name +
        '", sans-serif!important;}';
      css +=
        '.theme' +
        index +
        ' h1, .theme' +
        index +
        ' h2, .theme' +
        index +
        ' h3, .theme' +
        index +
        ' h4, .theme' +
        index +
        ' h5, .theme' +
        index +
        ' h6 {font-family: "' +
        font.name +
        '", sans-serif!important;font-weight: 700!important;}';
      css +=
        '.theme' +
        index +
        ' p, .theme' +
        index +
        ' a, .theme' +
        index +
        ' span, .theme' +
        index +
        ' td, .theme' +
        index +
        ' li {font-family: "' +
        font.name +
        '", sans-serif!important;font-weight: 400!important;}';
    });

    this.themes.colours.forEach((colour: any, index: number) => {
      css +=
        '.theme' +
        index +
        ' .layout:nth-child(even){color:white; background-color:' +
        colour.primary +
        '!important; }';
      css +=
        '.theme' +
        index +
        ' .layout:nth-child(even) h1, .theme' +
        index +
        ' .layout:nth-child(even) h2, .theme' +
        index +
        ' .layout:nth-child(even) h3, .theme' +
        index +
        ' .layout:nth-child(even) p, .theme' +
        index +
        ' .layout:nth-child(even) a, .theme' +
        index +
        ' .layout:nth-child(even) li, .theme' +
        index +
        ' .layout:nth-child(even) span {color:white;}';
      css +=
        '.theme' +
        index +
        ' .col:nth-child(even){color:white; background-color:' +
        colour.tertiary +
        ';}';

      css +=
        '.theme' +
        index +
        ' .layout.col-1:nth-child(even) .col {color:white; background-color:' +
        colour.primary +
        '!important; }';

      css +=
        '.theme' +
        index +
        ' .layout.col-1:nth-child(odd) {color:white; background-color:' +
        colour.tertiary +
        '!important; }';

      css +=
        '.theme' +
        index +
        ' .col:nth-child(even)  p, .theme' +
        index +
        ' .col:nth-child(even)  h1, .theme' +
        index +
        ' .col:nth-child(even)  h2, .theme' +
        index +
        ' .col:nth-child(even)  h3, .theme' +
        index +
        ' .col:nth-child(even)  a, .theme' +
        index +
        ' .col:nth-child(even)  li {color:white;}';

      css +=
        '.theme' +
        index +
        ' h1, .theme' +
        index +
        '  p, .theme' +
        index +
        '  a {color:' +
        colour.primary +
        ';}';
      css +=
        '.theme' +
        index +
        ' h2, .theme' +
        index +
        '  h3 {color:' +
        colour.secondary +
        ';}';
    });

    this.loadStyles(css);

    //console.log(css);
  }

  async doSections() {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('do sections');
        console.log(this.generated);

        this.generated.forEach((page: any, idx: number) => {
          console.log(idx);
          //set layout as an array
          page.layout = [];
          console.log(page);
          let layoutIndex = 0;

          if (!page.hasOwnProperty('sections')) {
            page.sections = this.lib.deepCopy(
              this.websiteStructure[idx].sections
            );
          }

          //make sure page has sections
          //its possible ai does not return complete website structure with sections on each page
          if (page.sections) {
            //loop through sections
            page.sections.forEach((section: any) => {
              // Update the layout index to loop from 1 to 5
              console.log(section);

              if (section.hasOwnProperty('layoutId')) {
                layoutIndex = section.layoutId;

                console.log('using layoutId:');
                console.log(layoutIndex);
              } else {
                // Update the layout index to loop from 1 to 5
                /*layoutIndex =
              layoutIndex === this.contentLayouts.length - 1
                ? 0
                : layoutIndex + 1;*/
                layoutIndex = layoutIndex === 1 ? 0 : layoutIndex + 1;
              }

              /*this.contentLayouts[
              Math.floor(Math.random() * this.contentLayouts.length)
            ],*/

              let layout = this.cloneObject(this.contentLayouts[layoutIndex]);

              //copy modules
              if (section.hasOwnProperty('modules')) {
                console.log('section has modules');
                layout.modules = this.lib.deepCopy(section.modules);
              }

              //clone a random layout
              page.layout.push(layout);
            });

            //
            //loop through layouts and
            page.layout.forEach((layout: any, index: number) => {
              layout.structure.forEach((row: any) => {
                row.forEach((col: any) => {
                  var sectionName = page.sections[index].name;

                  //console.log(sectionName);

                  if (typeof this.aiform[sectionName] !== 'undefined') {
                    //console.log(typeof col.heading);
                    if (typeof col.heading !== 'undefined') {
                      if (typeof this.aiform[sectionName].title !== 'undefined')
                        col.heading = this.aiform[sectionName].title;
                    }
                    if (typeof col.content !== 'undefined')
                      if (
                        typeof this.aiform[sectionName].content !== 'undefined'
                      )
                        col.content = this.aiform[sectionName].content;

                    if (typeof col.image !== 'undefined') {
                      let allImages = [
                        ...this.photos,
                        ...this.media.social.instagram,
                      ];
                      console.log('all images');
                      console.log(allImages);

                      col.image =
                        allImages[this.selectRandom(allImages)].src.large;
                    }
                  }
                });
              });
            });
          } else {
            throw new Error(
              'page does not have any sections, cannot create layouts'
            );
          }
          console.log('end');
          console.log(page);
        });

        resolve(this.generated);
      } catch (e: any) {
        console.log('Error doing sections:');
        console.log(e);
        reject(false);
      }
    });
  }

  async doImages() {
    //alert('image');
    this.message = 'Generating images...';

    try {
      //this.cleanJsonResponse(response);
      this.searchPhotos(this.companyProducts).then((result) => {
        this.generated.forEach((page: any, index: number) => {
          page.image = this.photos[this.selectRandom(this.photos)].src.large;
          //alert(page.image);
          /*page.layout.forEach((row: any) => {
            row.array.forEach((col: any) => {
              if (col.image) {
                col.image = this.photos[this.selectRandom(this.photos)].src.large;
              }
            });
          });*/
        });
      });
      console.log('getting instagram:');

      await this.service.instagram.getImages(this.companyInstagram).subscribe(
        (images: any) => {
          this.media.social.instagram = images;
          console.log('this media should have images');
          console.log(this.media);
        },
        (error: any) => console.error('Error fetching Instagram images', error)
      );
      //return this.generated;
    } catch (e) {
      console.log('doImages failed');
      console.log(e);
      this.message = 'failed to generated images';
      throw e;
    }
  }

  async doLayouts() {
    //this.message = 'Generating layouts...';
    /*const prompt =
        'I have this json structure, which is an array of objects that each hold data for a web page: ' +
        JSON.stringify(this.generated) +
        ' For each page, choose an index at random from the following json structure: ' +
        JSON.stringify(this.contentLayouts) +
        ' and append the data from that index, to each page\'s property "layout". Then complete the empty values with content related to that page\'s data where the "layout" property exists. For the images pick a random picture from the following photos array: ' +
        JSON.stringify(this.photos) +
        ', but not one that already exists on the page.';*/
    const prompt =
      'Use this json structure: ' +
      JSON.stringify(this.generated) +
      ' to change the value of each "layout" property, using this data structure: ' +
      JSON.stringify(this.contentLayouts) +
      ' and return the updated json structure.';
    return await this.doAI(prompt);
  }

  async doAI(
    prompt: string,
    attempt: number = 0,
    attempt2: number = 0
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const genAI = new GoogleGenerativeAI(environment.ai.gemini.API_KEY);
      const generationConfig = {
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
          },
        ],
        maxOutputTokens: 100,
      };
      const model = genAI.getGenerativeModel({
        model: 'gemini-pro',
        ...generationConfig,
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;

      let res = await this.cleanJsonResponse(
        response.candidates?.[0].content.parts[0].text || response.text()
      );

      if (res == null) {
        if (attempt < 3) {
          attempt++;
          this.message =
            'Re-generating content. Hold on... (' + attempt + ' / 3 runs)';
          resolve(await this.doAI(prompt, attempt, attempt2));
        } else {
          this.message = 'Sorry, we failed to generate it this time.';
          this.isFailed = true;
          console.log('failed');
          reject(false);
        }
      } else {
        if (!this.checkJSONContentEmpty(res)) {
          if (attempt2 < 3) {
            attempt2++;
            this.message =
              'Re-formating content. Hold on... (' + attempt2 + ' / 3 runs )';
            resolve(await this.doAI(prompt, attempt, attempt2));
          } else {
            this.message = 'Failed to re-format content. Try again?';
            console.log('Failed to format JSON after three attempts');
            reject(false);
          }
        } else {
          this.message = 'Content generated';
          console.log('generated');
          console.log(res);
          resolve(res);
        }
      }
    });
  }

  async finalise() {
    setTimeout(() => {
      this.generated.forEach((page: any, index: number) => {
        page.image = this.photos[this.selectRandom(this.photos)].src.large;
        //alert(JSON.stringify(page, null, 2));
      });
      this.activePage = this.generated[0];
    }, 600);
  }

  async loadStyles(css: string) {
    const existingStyle = document.getElementById('customStyle');
    if (existingStyle) {
      existingStyle.innerHTML = css;
    } else {
      const styleElement = document.createElement('style');
      styleElement.id = 'customStyle';
      styleElement.type = 'text/css';
      styleElement.innerHTML = css;
      document.getElementsByTagName('head')[0].appendChild(styleElement);
    }
  }

  checkJSONContentEmpty(json: any) {
    let content = '';
    for (let i = 0; i < json.length; i++) {
      if (json[i].content === null || json[i].content.length === 0) {
        //break;
        return false;
      } else {
        if (content === json[i].content) return false;
        content = json[i].content;
      }
    }
    return true;
  }

  getSearchParams(category: string | boolean): any {
    return { search: category };
  }

  async cleanJsonResponse(response: any) {
    try {
      // Remove any extra quotes around the JSON
      let cleanedResponse = response.replace(/^"|"$/g, '');

      // Remove any unnecessary newlines and trim the string
      cleanedResponse = response.replace(/\n/g, '').trim();

      // Remove any leading and trailing quotes
      cleanedResponse = cleanedResponse.replace(/^"|"$/g, '');

      cleanedResponse = cleanedResponse.replace('```', '');

      // Parse the JSON to remove extra spaces

      let parsedJson = JSON.parse(cleanedResponse);
      //console.log(parsedJson);
      // Convert back to JSON string with standard formatting

      //return JSON.stringify(parsedJson);
      return parsedJson;
      //return cleanedResponse;
    } catch (error) {
      console.error('Invalid JSON response:', error);
      return null;
    }
  }

  storeSite() {
    const companyInfo = {
      name: this.companyName,
      description: this.companyDescription,
      products: this.companyProducts,
      email: this.companyEmail,
      social: {
        instagram: this.companyInstagram,
      },
    };

    const siteData = {
      content: this.generated,
      details: {
        companyInfo: companyInfo,
      },
      media: {
        photoData: this.photos,
        social: {
          instagram: this.media.social.instagram,
        },
      },
      themes: this.themes,
      themeId: this.activeTheme,
    };

    localStorage.setItem('generatedSite', JSON.stringify(siteData));
    localStorage.setItem('companyInfo', JSON.stringify(companyInfo));
    localStorage.setItem('doAction', 'createSite');

    //this.router.navigate(['dashboard?action=createSite']);

    const siteurl = ['dashboard'];
    const queryParams = { action: 'createSite' };
    this.router.navigate(siteurl, { queryParams });
  }

  saveChanges() {
    console.log(this.activePage);
    console.log(this.activeIndex);

    this.generated[this.activeIndex] = this.activePage;

    this.isSaving = true;
    const companyInfo = {
      name: this.companyName,
      description: this.companyDescription,
      products: this.companyProducts,
      email: this.companyEmail,
      social: {
        instagram: this.companyInstagram,
      },
    };
    const siteData = {
      content: this.generated,
      details: {
        companyInfo: companyInfo,
      },
      media: {
        photoData: this.photos,
        social: {
          instagram: this.media.social.instagram,
        },
      },
      themes: this.themes,
      themeId: this.activeTheme,
    };

    const updatedData = {
      data: JSON.stringify(siteData),
      modified: new Date(),
    };

    if (this.siteId !== '') {
      console.log(this.siteId);

      const collectionName = 'sites';

      const userId = this.service.auth.getUser().uid;
      const pathSegments = ['users', userId, 'sites'];

      this.service.firestore
        .updateDocument(pathSegments, this.siteId, updatedData)
        .then(() => {
          //this.message = 'Site updated';
          this.message = 'Changes saved';
          this.isSaved = true;
          this.isSaving = false;
          setTimeout(() => {
            this.isSaved = false;
            this.isSaving = false;
          }, 1000);
          console.log('Site updated successfully.');
          //localStorage.setItem('bb_' + this.siteId, updatedData.data);
          localStorage.setItem('bb_test', updatedData.data);
          const isUpdated = this.updateLocalStorageItem(
            'bb_' + this.siteId,
            updatedData.data
          );
          if (isUpdated) {
            console.log('The item was updated successfully.');
          } else {
            console.log('No change was made; the value was already set.');
          }

          return false;
        })
        .catch((error) => {
          this.message = 'Site could not be updated';
          console.error('Error updating document: ', error);
        });
    } else {
      alert('No site ID is set. Cannot save.');
    }
  }

  updateLocalStorageItem(key: string, newValue: string): boolean {
    // Step 1: Retrieve the current value
    const oldValue = localStorage.getItem(key);

    // Step 2: Set the new value
    localStorage.setItem(key, newValue);

    // Step 3: Compare old and new values
    if (oldValue === newValue) {
      console.log('Item was already set to this value, no update made.');
      return false; // No update occurred, value was the same
    } else {
      console.log('Item has been updated.');
      return true; // Update occurred
    }
  }

  //Grid Component

  moveRowUp(index: number) {
    //define rows
    const rows = this.activePage.layout;
    if (index > 0) {
      [rows[index - 1], rows[index]] = [rows[index], rows[index - 1]];
    }
    this.recordChange();
  }

  moveRowDown(index: number) {
    const rows = this.activePage.layout;
    if (index < rows.length - 1) {
      [rows[index + 1], rows[index]] = [rows[index], rows[index + 1]];
    }
    this.recordChange();
  }

  deleteRow(index: number) {
    const rows = this.activePage.layout;
    rows.splice(index, 1);
    this.recordChange();
  }

  copyRow(index: number) {
    let rows = this.activePage.layout;
    const rowToCopy = this.lib.deepCopy(rows[index]);
    rows.splice(index + 1, 0, rowToCopy);
    this.recordChange();
  }

  swapColumns(rowIndex: number, colIndex1: number, colIndex2: number) {
    console.log('swapping columns');
    console.log(rowIndex);
    console.log(colIndex1);
    console.log(colIndex2);
    const cols = this.activePage.layout[rowIndex].structure;

    console.log(cols);

    if (colIndex2 >= 0 && colIndex2 < cols.length) {
      [cols[colIndex1], cols[colIndex2]] = [cols[colIndex2], cols[colIndex1]];
    }
    this.recordChange();
  }

  onContentChange(event: any, ridx: number, cidx: number, midx: number) {
    console.log(event);
    //this.generated[this.activeIndex].layout[ridx].structure[cidx][midx].content = event;
  }

  onModuleChange(event: any, lidx: number, midx: number) {
    console.log(event.target.innerHTML);
    let v: string = '';
    if (event.target.innerHTML) v = event.target.innerHTML;
    if (event.target.value) v = event.target.value;

    console.log(v);
    //this.generated[this.activeIndex].layout[ridx].structure[cidx][midx].content = event;
  }

  onModuleCallback(response: any, module: any) {
    console.log('module callback');
    console.log(response);
    console.log(this.modules);
    try {
      module.id = this.modules.findIndex(
        (mod: any) => mod.name === response.name
      );
    } catch (e) {
      alert('Error. Could not update module');
    }

    module.params = response.params;

    console.log(module);
    console.log(this.generated);
    this.recordChange();
  }

  onContentInput(event: any, obj: any, prop: string) {
    //console.log(event);
    let v: string = '';
    if (event.target.innerHTML) v = event.target.innerHTML;
    if (event.target.value) v = event.target.value;
    //console.log(this.activePage);
    //const editableDiv = event.target as HTMLElement;
    //const savedPosition = this.lib.saveCursorPosition(editableDiv);
    //obj[prop] = v;
    //console.log(obj);
    this.recordChange();
    //this.lib.restoreCursorPosition(editableDiv, savedPosition);
    console.log(this.activePage);
  }

  recordChange() {
    //obj nodes is linked to activePage

    //clone existing object
    let p = this.lib.deepCopy(this.activePage);

    //if max undo versions, remove first one
    if (this.versions.length >= this.maxVersions) {
      this.versions.splice(0, 1);
    }
    //push new version
    this.versions.push(p);
    this.activeVersion = this.versions.length - 1;
    //console.log(this.versions);
    //console.log(this.activeVersion);
  }

  undoChange() {
    this.activeVersion =
      this.activeVersion - 1 < 0 ? 0 : this.activeVersion - 1;
    this.activePage = this.lib.deepCopy(this.versions[this.activeVersion]);
  }

  redoChange() {
    this.activeVersion =
      this.activeVersion + 1 > this.versions.length - 1
        ? this.activeVersion
        : this.activeVersion + 1;
    this.activePage = this.lib.deepCopy(this.versions[this.activeVersion]);
  }

  /*onImageChange(event: any, ridx: number, cidx: number, midx: number) {
    if (this.service.auth.isLoggedIn) {
      const imgMod = this.activePage.layout[ridx].structure[cidx][midx].image;
      console.log(imgMod);

      //const newPic = this.photos[this.selectRandom(this.photos)].src.large;
      console.log(this.photos);
      if (this.photos.length) {
        let allImages = [...this.photos, ...this.media.social.instagram];
        this.activePage.layout[ridx].structure[cidx][midx].image =
          allImages[this.selectRandom(allImages)].src.large;
        this.recordChange();
      }
    }
  }*/

  async onImageChange(event: any, obj: any) {
    if (this.isEditing) {
      if (this.photos.length) {
        let allImages = [...this.photos, ...this.media.social.instagram];
        let imageUrl = allImages[this.selectRandom(allImages)].src.large;
        obj.image = await this.loadImage(imageUrl);
        console.log(obj);
        this.recordChange();
      }
    }
  }

  checkContent(content: any) {
    if (content == '') {
      console.log('content is blank');
    }
    return content;
  }

  async changeTheme() {
    //this.activeTheme = this.activeTheme >= this.themes.colours.length ? 0 : this.activeTheme + 1;

    const data = {
      title: 'Website Settings',
      themes: this.themes,
      activeTheme: this.activeTheme,
    };

    const modal = await this.modalController.create({
      component: ThemeBrandBuilderComponent,
      componentProps: { data: data },
    });

    modal.onDidDismiss().then((res: any) => {
      if (res) {
        console.log(res);
        this.themes = res.data.themes;
        this.activeTheme = res.data.activeTheme;
        console.log(this.themes);
        this.doThemesCSS();
      }
    });

    return await modal.present();
  }

  async loadImages() {
    //console.log('loading images');
    //console.log(this.generated);
    this.generated.forEach(async (page: any) => {
      if (page.image) {
        //console.log('base64 encoding main page image:');
        page.image = await this.loadImage(page.image);
      }
      page.layout.forEach((row: any) => {
        row.structure.forEach((col: any) => {
          col.forEach(async (mod: any) => {
            if (mod.image) {
              //console.log('base64 encoding module image:');
              //console.log(mod.image);
              let img = await this.loadImage(mod.image);
              let allImages = [...this.photos, ...this.media.social.instagram];
              mod.image = img;
              mod.params = {
                ...mod.params,
                ...{ url: img, images: allImages },
              };
            }
          });
        });
      });
    });
  }

  async loadImage(url: string) {
    if (url.includes('imageloader.php')) url = url.split('?url=')[1];
    const base64Url = this.lib.base64Url(url); // Encode the URL to Base64
    return 'https://siteinanhour.com/server/imageloader.php?url=' + base64Url;
  }
}
