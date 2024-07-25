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
import { RouterOutlet } from '@angular/router';
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
    trigger('fadeSlideIn', [
      state('void', style({ opacity: 0, transform: 'translateY(20px)' })),
      transition(':enter', [
        animate(
          '1000ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' }),
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

  showCreate: boolean = true;
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
        'welcome',
        'introduction',
        'problemSolution',
        'primaryService',
        'secondaryService',
        'thirdService',
        'primaryFeature',
        'secondaryFeature',
        'thirdFeature',
        'mailingList',
        'faq',
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
        'aboutUs',
        'ourMission',
        'ourHistory',
        'ourValues',
        'ourPromise',
        'otherServices',
        'mailingList',
        'faq',
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
      sections: ['ourProducts', 'mailingList', 'faq'],
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
      sections: ['mailingList', 'faq'],
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
      sections: ['mailingList', 'faq'],
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
  ];

  generated: any = false;
  generating: any = false;

  message: string = '';
  aiform: any = false;

  currentYear: number;

  private observer: IntersectionObserver | undefined;

  constructor(
    private service: CoreService,
    private lib: Library,
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef,
  ) {
    this.currentYear = new Date().getFullYear();
  }

  ngOnInit(): void {
    //this.showSection('create');
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
        ],
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
    return new Promise(async (resolve) => {
      console.log('do sections');
      console.log(this.generated);

      this.generated.forEach((page: any, idx: number) => {
        console.log(idx);
        //set layout as an array
        page.layout = [];
        console.log(page);
        let layoutIndex = 0;
        //loop through sections
        page.sections.forEach((section: any) => {
          //clone a random layout
          page.layout.push(
            this.cloneObject(
              /*this.contentLayouts[
                Math.floor(Math.random() * this.contentLayouts.length)
              ],*/

              this.contentLayouts[layoutIndex],
            ),
          );
          // Update the layout index to loop from 1 to 5
          layoutIndex =
            layoutIndex === this.contentLayouts.length - 1
              ? 0
              : layoutIndex + 1;
        });

        //

        //loop through layouts and
        page.layout.forEach((layout: any, index: number) => {
          layout.structure.forEach((row: any) => {
            row.forEach((col: any) => {
              //console.log(typeof col.heading);
              if (typeof col.heading !== 'undefined') {
                if (
                  typeof this.aiform[page.sections[index]].title !== 'undefined'
                )
                  col.heading = this.aiform[page.sections[index]].title;
              }
              if (typeof col.content !== 'undefined')
                if (
                  typeof this.aiform[page.sections[index]].content !==
                  'undefined'
                )
                  col.content = this.aiform[page.sections[index]].content;

              if (typeof col.image !== 'undefined')
                col.image =
                  this.photos[this.selectRandom(this.photos)].src.large;
            });
          });
        });
        console.log('end');
        console.log(page);
      });

      resolve(this.generated);
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
    attempt2: number = 0,
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
        response.candidates?.[0].content.parts[0].text || response.text(),
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
}