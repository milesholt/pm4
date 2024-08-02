import {
  Component,
  OnInit,
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { PexelsService } from '../services/pexels.service';

import { CoreService } from '../../services/core.service';
import { Library } from '../../app.library';

import { Observable } from 'rxjs';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  query,
  stagger,
} from '@angular/animations';

import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from '@google/generative-ai';
import { environment } from '../../../environments/environment';

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

  activePageTitle: string = '';
  activePage: any = false;
  activeIndex = 0;
  isChanging: boolean = false;

  /*companyName: string = 'Roses R Us';
    companyDescription: string =
      "We're a premium boutique floral delivery service. We deliver fresh, high quality flower bouquets with a wide variety of different flowers from roses, sunflowers to lavender and orchids.";
    companyProducts: string =
      'flower bouquets, roses, sunflowers, lavender, orchids';
  */
  companyName: string = 'Black & Red Tattoo Parlor';
  companyDescription: string =
    "We're an old fashioned tattoo shop based in Las Vegas. We provide high quality tattoo services. We offer a wider variety of styles and tattoo application methods, with a team of dedicated and professional ink artists. We do all methods of tattooing from Stick and Poke Hand Poke, Single Needle, Yantra/Sak Yants, and Tebori. We also provide tattoo removal services.";
  companyProducts: string =
    'bamboo tattoo, blackwork tattoo, black ink tattoo, watercolour tattoo, body art tattoo, geometric tattoo, tattoo removal, bespoke tattoo design service';

  showCreate: boolean = false;
  showPreview: boolean = false;
  showPublish: boolean = false;

  photos: any[] = [];

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
    { name: 'form', title: '', classes: '' },
    { name: 'faq', title: '', classes: '' },
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

  currentYear: number;

  private observer: IntersectionObserver | undefined;

  constructor(
    public service: CoreService,
    private lib: Library,
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef,
    public router: Router,
    public route: ActivatedRoute
  ) {
    this.currentYear = new Date().getFullYear();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const docId = params['site']; // Get the document ID from query parameters
      if (docId) {
        this.prepareSiteLoad();
        this.loadDocument(docId);
      } else {
        this.showSection('create');
      }
    });
  }

  prepareSiteLoad() {
    //add class to body to hide elements when viewing a Site
    document.body.classList.add('is-site');
  }

  loadDocument(docId: string) {
    let site: any = false;
    var local = localStorage.getItem('bb_' + docId);
    if (local) {
      console.log('got site locally');
      site = JSON.parse(local);
      console.log(site);
      this.finishLoadSite(site, docId);
    } else {
      console.log('getting site remotely');
      this.service.firestore.getDocumentById('sites', docId).subscribe(
        (doc) => {
          if (doc) {
            console.log('Loading document from site id: ' + docId);
            site = doc;
            this.finishLoadSite(site, docId);
          } else {
            this.message = 'Site not found';
          }
        },
        (error) => {
          this.message = error.message;
          console.error('Error fetching document: ', error);
        }
      );
    }
  }

  finishLoadSite(doc: any, docId: string) {
    const d = JSON.parse(doc.data);
    console.log('Got site:');
    console.log(d);
    this.generated = d.content;
    this.companyName = d.details.companyInfo.companyName;
    this.companyDescription = d.details.companyInfo.companyDescription;
    this.companyProducts = d.details.companyInfo.companyProducts;
    this.photos = d.media.photoData;
    this.activeIndex = 0;
    this.activePage = this.generated[0];
    this.activePageTitle = this.generated[0].title;

    localStorage.setItem('bb_' + docId, JSON.stringify(doc));

    this.showSection('preview');

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
        this.message = 'Generating structure...';
        this.aiform = await this.doAIStructure();
      })
      .then(async (result: any) => {
        this.message = 'Generating layouts...';
        this.generated = await this.doSections();
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

  selectRandom(arr: any = 10) {
    const randomIndex = Math.floor(Math.random() * arr.length);
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
  }

  showSection(section: string = 'create') {
    switch (section) {
      case 'create':
        this.showPreview = false;
        this.showCreate = true;
        this.showPublish = false;
        break;
      case 'preview':
        this.showPreview = true;
        this.showCreate = false;
        this.showPublish = false;
        break;
      case 'publish':
        this.showPreview = false;
        this.showCreate = false;
        this.showPublish = true;
        break;
      default:
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
          //loop through sections
          page.sections.forEach((section: any, index: number) => {
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

            //clone a random layout
            page.layout.push(
              this.cloneObject(
                /*this.contentLayouts[
                Math.floor(Math.random() * this.contentLayouts.length)
              ],*/

                this.contentLayouts[layoutIndex]
              )
            );
            //copy modules
            page.layout[index].modules = this.lib.deepCopy(section.modules);
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
                    if (typeof this.aiform[sectionName].content !== 'undefined')
                      col.content = this.aiform[sectionName].content;

                  if (typeof col.image !== 'undefined')
                    col.image =
                      this.photos[this.selectRandom(this.photos)].src.large;
                }
              });
            });
          });
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

  doImages() {
    //alert('image');
    this.message = 'Generating images...';
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
    //return this.generated;
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
          alert('failed');
          this.message = 'Failed to generate content. Try again?';
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
      companyName: this.companyName,
      companyDescription: this.companyDescription,
      companyProducts: this.companyProducts,
    };

    const siteData = {
      content: this.generated,
      details: {
        companyInfo: companyInfo,
      },
      media: {
        photoData: this.photos,
      },
    };

    localStorage.setItem('generatedSite', JSON.stringify(siteData));
    localStorage.setItem('companyInfo', JSON.stringify(companyInfo));
    localStorage.setItem('doAction', 'createSite');

    this.router.navigate(['dashboard']);
  }

  //Grid Component

  moveRowUp(index: number) {
    //define rows
    const rows = this.activePage.layout;
    if (index > 0) {
      [rows[index - 1], rows[index]] = [rows[index], rows[index - 1]];
    }
  }

  moveRowDown(index: number) {
    const rows = this.activePage.layout;
    if (index < rows.length - 1) {
      [rows[index + 1], rows[index]] = [rows[index], rows[index + 1]];
    }
  }

  deleteRow(index: number) {
    const rows = this.activePage.layout;
    rows.splice(index, 1);
  }

  copyRow(index: number) {
    let rows = this.activePage.layout;
    const rowToCopy = this.lib.deepCopy(rows[index]);
    rows.splice(index + 1, 0, rowToCopy);
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
  }

  onContentChange(event: any, ridx: number, cidx: number, midx: number) {
    console.log(event);
    //this.generated[this.activeIndex].layout[ridx].structure[cidx][midx].content = event;
  }

  onImageChange(event: any, ridx: number, cidx: number, midx: number) {
    if (this.service.auth.isLoggedIn) {
      const imgMod = this.activePage.layout[ridx].structure[cidx][midx].image;
      console.log(imgMod);

      //const newPic = this.photos[this.selectRandom(this.photos)].src.large;
      console.log(this.photos);
      if (this.photos.length) {
        this.activePage.layout[ridx].structure[cidx][midx].image =
          this.photos[this.selectRandom(this.photos)].src.large;
      }
    }
  }

  onImageChange2(event: any, obj: any) {
    if (this.service.auth.isLoggedIn) {
      if (this.photos.length) {
        obj.image = this.photos[this.selectRandom(this.photos)].src.large;
        console.log(obj);
      }
    }
  }

  checkContent(content: any) {
    if (content == '') {
      console.log('content is blank');
    }
    return content;
  }
}
