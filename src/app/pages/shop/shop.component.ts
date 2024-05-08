import {
  ViewChild,
  Component,
  OnInit,
  ChangeDetectorRef,
  ElementRef,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { CoreService } from '../../services/core.service';
import { Library } from '../../app.library';
import { Router, ActivatedRoute } from '@angular/router';
//import { ProductComponent } from './product/product.component';

import { register } from 'swiper/element/bundle';
register();

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
  providers: [CoreService, Library],
})
export class ShopComponent implements OnInit {
  products: any = [];
  filterProducts: any = [];
  filterCategory: string = 'all';
  featuredProducts: any = [];
  private observer: IntersectionObserver | undefined;

  heroSlides: any = {
    Mushroom: {
      product: 'Mushroom',
      slides: [
        {
          title: 'Fungi',
          description: 'Discover the power of mushrooms',
          image: 'http://obscura.solutions/assets/images/mushroom.webp',
        },
      ],
      content: [
        {
          title: 'Unlock Your Health Potential with Mushroom Supplements',
          content:
            '<p>Mushrooms have been revered for centuries for their powerful health benefits. Discover the transformative effects of mushroom supplements and elevate your well-being naturally.</p>',
          template: 'col-1',
        },
        {
          title: 'Experience the Power of Nature',
          content:
            "<p>Harness the ancient wisdom of mushrooms to supercharge your health journey. Our premium mushroom supplements are meticulously crafted to deliver potent benefits straight from nature's pharmacy.<p>",
          image: 'http://obscura.solutions/assets/images/cordyceps.webp',
          template: 'col-2',
        },
        {
          title: "Discover Nature's Secret",
          content:
            '<p>Delve into the world of medicinal mushrooms and unlock a treasure trove of wellness. From boosting cognitive function to enhancing immune support, these extraordinary fungi offer a holistic approach to vitality.<p>',
          image: 'http://obscura.solutions/assets/images/reishi_mushroom.webp',
          template: 'col-2',
        },
        {
          title: 'Why Fungi',
          content: [
            {
              title: 'Immune Support',
              subtitle: 'Enhanced Immunity',
              content:
                "<p>Strengthen your body's defenses and ward off illness with mushroom supplements, rich in beta-glucans and antioxidants that fortify the immune system.</p>",
              image: 'http://obscura.solutions/assets/icons/vitamin.png',
              classes: 'icon',
            },
            {
              title: 'Cognitive Enhancement',
              subtitle: 'Brain Health',
              content:
                "<p>Boost mental clarity and support brain health with mushroom extracts like Lion's Mane, renowned for promoting neural growth and memory function.</p>",
              image: 'http://obscura.solutions/assets/icons/brain.png',
              classes: 'icon',
            },
            {
              title: 'Energy Boost',
              subtitle: 'Energy & Vitality',
              content:
                '<p>Experience sustained energy levels and vitality with Cordyceps mushroom, an adaptogen that enhances endurance and oxygen utilization in the body.</p>',
              image: 'http://obscura.solutions/assets/icons/energy.png',
              classes: 'icon',
            },
            {
              title: 'Anxiety Relief',
              subtitle: '',
              content:
                '<p>Find relief from anxiety and stress with mushroom supplements, containing adaptogens that promote relaxation and emotional balance.</p>',
              image: 'http://obscura.solutions/assets/icons/mental-health.png',
              classes: 'icon',
            },
            {
              title: 'Natural Anti-Depressant',
              subtitle: '',
              content:
                '<p>Lift your spirits and combat depression naturally with mushroom extracts, known for their mood-regulating properties and serotonin support.</p>',
              image: 'http://obscura.solutions/assets/icons/lotus.png',
              classes: 'icon',
            },
            {
              title: 'Fights Infection',
              subtitle: '',
              content:
                "<p>Bolster your body's natural defenses and combat infections with mushroom extracts rich in immunomodulating compounds, offering protection against pathogens and toxins</p>",
              image: 'http://obscura.solutions/assets/icons/infection.png',
              classes: 'icon',
            },
            {
              title: 'Antioxidant Power',
              subtitle: '',
              content:
                '<p>Protect your cells from oxidative damage and premature aging with mushroom supplements rich in potent antioxidants, supporting overall health and longevity.</p>',
              image: 'http://obscura.solutions/assets/icons/molecule.png',
              classes: 'icon',
            },
            {
              title: 'Anti-Inflammatory',
              subtitle: '',
              content:
                '<p>Combat inflammation and promote joint health with mushroom extracts known for their anti-inflammatory properties, easing discomfort and promoting mobility.</p>',
              image: 'http://obscura.solutions/assets/icons/inflammation.png',
              classes: 'icon',
            },
            {
              title: 'Cancer Prevention',
              subtitle: '',
              content:
                "<p>Support your body's natural defense against cancer with mushroom supplements, containing bioactive compounds that inhibit tumor growth and boost immune surveillance.</p>",
              image: 'http://obscura.solutions/assets/icons/cancer.png',
              classes: 'icon',
            },
          ],
          template: 'col-3',
        },
        {
          title: 'Some content 4',
          content: '<p>Html content goes here4<p>',
          image: 'http://obscura.solutions/assets/images/reishi_mushroom.webp',
          template: 'col-4',
        },
      ],
      questions: [
        {
          title: 'What are the health benefits of Mushrooms?',
          content:
            "Mushrooms offer a myriad of health benefits, including immune support, cognitive enhancement, and antioxidant properties. Varieties like Lion's Mane promote brain health and focus, while Reishi and Cordyceps contribute to stress reduction and energy levels. Additionally, mushrooms contain bioactive compounds that may aid in combating inflammation, supporting heart health, and even potentially preventing certain types of cancer.",
        },
      ],
      featuredProducts: [
        'gid://shopify/Product/8945628414289',
        'gid://shopify/Product/8945648959825',
        'gid://shopify/Product/8959035638097',
      ],
    },
  };

  //

  @ViewChild('mainSwiper', { static: false }) mainSwiper!: ElementRef;
  @ViewChildren('item') items?: QueryList<ElementRef>;

  constructor(
    public service: CoreService,
    public router: Router,
    private route: ActivatedRoute,
    public library: Library,
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef,
    //public productComponent: ProductComponent,
  ) {}

  ngOnInit() {
    this.test();
    this.checkReturn();
  }

  ngAfterViewInit(): void {
    this.initializeObserver();
  }

  ngAfterViewChecked(): void {
    this.observeElements();
  }

  initializeObserver() {
    this.observer = new IntersectionObserver(this.handleIntersect.bind(this), {
      threshold: 0.5, // Trigger when 50% of the target is visible
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
      if (entry.intersectionRatio >= 0.5) {
        // Element is at least 50% visible
        const targetElement = entry.target as HTMLElement;
        targetElement.classList.add('fade-in');
        console.log(targetElement);
        // Perform your desired actions here
      }
    });
  }

  /*scrollToSection() {
    // Perform scrolling action to the desired section
    const sectionElement = document.getElementById('productsGrid');
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth' });
    }
  }*/

  async checkReturn() {
    if (this.router.url.indexOf('?return') > -1) {
      const checkoutId = localStorage.getItem('checkoutId');
      if (checkoutId === null || checkoutId === undefined)
        this.router.navigate(['/shop']);
      const checkout = await this.service.shop.fetchCheckout(checkoutId);
      this.service.shop.checkoutComplete = false;
      if (checkout.completedAt !== null)
        this.service.shop.checkoutComplete = true;
    }
  }

  async doFeatured() {
    if (this.filterCategory !== 'all') {
      const cat = this.heroSlides[this.filterCategory];

      this.featuredProducts = await this.products.filter((product: any) =>
        cat.featuredProducts.includes(product.id),
      );
    }
  }

  async handleSearchCallback(searchData: any) {
    const results = searchData.results;
    const keyword = searchData.keyword;
    this.filterCategory = searchData.keyword;

    if (keyword == '') this.test();
    this.filterProducts = results;
    this.doFeatured();
    this.cdr.detectChanges();
  }

  async handleFilterCallback(filterData: any) {
    this.cdr.detectChanges();
  }

  test() {
    this.service.shop.getProducts(this.service.shop.client).then((products) => {
      this.products = products;
      this.filterProducts = products;
    });
  }
}
