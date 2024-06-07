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
import { Router, ActivatedRoute, Params } from '@angular/router';
//import { ProductComponent } from './product/product.component';

import { environment } from 'src/environments/environment';

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
  search: string | boolean = false;
  category: string = '';
  filterProducts: any = [];
  filterCategory: string = 'all';
  featuredProducts: any = [];
  private observer: IntersectionObserver | undefined;

  heroSlides: any = {
    all: {
      meta: {
        title: 'Your Source for Premium Health Products',
        description:
          'Welcome to Obscura Solutions, your one-stop shop for premium health products. Explore our diverse range of mushrooms, organic items, natural supplements, vegan products, Ayurvedic solutions, anti-ageing remedies, and gourmet coffee. Elevate your wellness journey with our expertly curated selections.',
        image: 'https://obscura.solutions/assets/images/generic1.webp',
        keywords:
          'Obscura Solutions, health products, premium health supplements, organic health products, natural wellness, vegan health solutions, Ayurvedic products, anti-ageing remedies, gourmet coffee, holistic health, wellness products',
      },
      product: 'Health Products',
      slides: [
        {
          title: 'Time for a healthier you.',
          description:
            'Discover a wide range of health products designed to enhance your well-being.',
          image: 'generic2.webp',
        },
      ],
      content: [
        {
          title: 'Your health, rebooted.',
          content:
            '<p>We offer a diverse selection of health products to support your wellness journey. From natural supplements to organic skincare, find everything you need to live a healthier life.</p>',
          template: 'col-1',
        },
        {
          title: 'Our Product Categories',
          content:
            '<p>Explore our extensive range of health products across various categories to find the perfect solutions for your needs.</p>',
          image: 'fitness.webp',
          template: 'col-2',
        },
        {
          title: 'Natural Supplements',
          content:
            '<p>Boost your health with our natural supplements, formulated to provide essential nutrients and support overall well-being.</p>',
          image: 'dhaka_flower_ayurvedic.webp',
          template: 'col-2',
        },
        {
          title: 'Vegan',
          content:
            '<p>Discover our range of vegan products, free from animal ingredients and perfect for a plant-based lifestyle.</p>',
          image: 'vegan1.webp',
          template: 'col-2',
        },
        {
          title: 'Organic',
          content:
            '<p>Choose from our selection of organic products, made without synthetic chemicals or GMOs, for a natural approach to health.</p>',
          image: 'organic2.webp',
          template: 'col-2',
        },
        {
          title: 'Ayurvedic',
          content:
            '<p>Explore our Ayurvedic products, inspired by traditional Indian medicine and designed to promote balance and holistic health.</p>',
          image: 'ayurvedic_medicine.webp',
          template: 'col-2',
        },
        {
          title: 'Coffee',
          content:
            '<p>Enjoy our premium coffee selection, sourced from the finest plantations and roasted to perfection for rich, flavorful experiences.</p>',
          image: 'coffee.webp',
          template: 'col-2',
        },
        {
          title: 'Anti-Ageing',
          content:
            '<p>Rejuvenate your skin with our anti-ageing products, formulated with advanced ingredients to reduce signs of ageing and promote youthful radiance.</p>',
          image: 'skincare.webp',
          template: 'col-2',
        },
        {
          title: 'The Benefits',
          content: [
            {
              title: 'Holistic Wellness',
              subtitle: 'Comprehensive Care',
              content:
                'Our products support all aspects of health, from nutrition to skincare, ensuring comprehensive care for your well-being.',
              image: '/assets/icons/bio.png',
              classes: 'icon',
            },
            {
              title: 'High Quality',
              subtitle: 'Premium Standards',
              content:
                'We prioritize quality in all our products, using only the best ingredients and manufacturing processes.',
              image: '/assets/icons/premium-quality.png',
              classes: 'icon',
            },
            {
              title: 'Natural Ingredients',
              subtitle: 'Chemical-Free',
              content:
                'Our health products are made from natural ingredients, free from synthetic chemicals and additives.',
              image: '/assets/icons/herbal.png',
              classes: 'icon',
            },
            {
              title: 'Sustainability',
              subtitle: 'Eco-Friendly',
              content:
                'We are committed to sustainability, sourcing our products responsibly and minimizing environmental impact.',
              image: '/assets/icons/flower.png',
              classes: 'icon',
            },
            {
              title: 'Vegan & Organic Options',
              subtitle: 'Ethical Choices',
              content:
                'Our range includes vegan and organic products, catering to ethical and health-conscious consumers.',
              image: '/assets/icons/vegan.png',
              classes: 'icon',
            },
            {
              title: 'Holistic Health',
              subtitle: 'Mind & Body',
              content:
                'Promote holistic health with products that support both physical and mental well-being.',
              image: '/assets/icons/mortar.png',
              classes: 'icon',
            },
            {
              title: 'Enhanced Vitality',
              subtitle: 'Energy & Wellness',
              content:
                'Our supplements and health products enhance vitality, helping you feel more energetic and vibrant.',
              image: '/assets/icons/pharmacy.png',
              classes: 'icon',
            },
            {
              title: 'Expertly Formulated',
              subtitle: 'Science-Based',
              content:
                'Our products are formulated based on scientific research and traditional wisdom, ensuring effectiveness and safety.',
              image: '/assets/icons/pills.png',
              classes: 'icon',
            },
            {
              title: 'Community Support',
              subtitle: 'Giving Back',
              content:
                'By choosing our products, you support communities and initiatives that promote health and sustainability.',
              image: '/assets/icons/customer.png',
              classes: 'icon',
            },
          ],
          template: 'col-3',
        },
      ],
      questions: [
        {
          title: 'What types of health products do you offer?',
          content:
            'We offer a wide range of health products including natural supplements, vegan items, organic goods, Ayurvedic products, premium coffee, and anti-ageing skincare.',
        },
        {
          title: 'Are your products high quality?',
          content:
            'Yes, all our products are made from high-quality ingredients and are carefully formulated to ensure effectiveness and safety.',
        },
        {
          title: 'How can I choose the right products for me?',
          content:
            'Explore our product categories to find the right solutions for your health needs. You can also consult our product descriptions and customer reviews to help make an informed choice.',
        },
      ],
      featuredProducts: [],
    },
    mushroom: {
      product: 'Mushroom',
      meta: {
        title: 'Premium Medicinal Mushrooms for Health and Wellness',
        description:
          'Discover the power of medicinal mushrooms with our premium range of health supplements. Boost your immune system, enhance energy levels, and support overall wellness with our organic mushroom products.',
        keywords:
          "medicinal mushrooms, mushroom supplements, health benefits of mushrooms, immune support, organic mushrooms, reishi, lion's mane, chaga, cordyceps",
        image: 'https://obscura.solutions/assets/images/mushroom.webp',
      },
      slides: [
        {
          title: 'Fungi',
          description: 'Discover the power of mushrooms',
          image: 'mushroom.webp',
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
          image: 'cordyceps.webp',
          template: 'col-2',
        },
        {
          title: "Discover Nature's Secret",
          content:
            '<p>Delve into the world of medicinal mushrooms and unlock a treasure trove of wellness. From boosting cognitive function to enhancing immune support, these extraordinary fungi offer a holistic approach to vitality.<p>',
          image: 'reishi_mushroom.webp',
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
              image: '/assets/icons/vitamin.png',
              classes: 'icon',
            },
            {
              title: 'Cognitive Enhancement',
              subtitle: 'Brain Health',
              content:
                "<p>Boost mental clarity and support brain health with mushroom extracts like Lion's Mane, renowned for promoting neural growth and memory function.</p>",
              image: '/assets/icons/brain.png',
              classes: 'icon',
            },
            {
              title: 'Energy Boost',
              subtitle: 'Energy & Vitality',
              content:
                '<p>Experience sustained energy levels and vitality with Cordyceps mushroom, an adaptogen that enhances endurance and oxygen utilization in the body.</p>',
              image: '/assets/icons/energy.png',
              classes: 'icon',
            },
            {
              title: 'Anxiety Relief',
              subtitle: '',
              content:
                '<p>Find relief from anxiety and stress with mushroom supplements, containing adaptogens that promote relaxation and emotional balance.</p>',
              image: '/assets/icons/mental-health.png',
              classes: 'icon',
            },
            {
              title: 'Natural Anti-Depressant',
              subtitle: '',
              content:
                '<p>Lift your spirits and combat depression naturally with mushroom extracts, known for their mood-regulating properties and serotonin support.</p>',
              image: '/assets/icons/lotus.png',
              classes: 'icon',
            },
            {
              title: 'Fights Infection',
              subtitle: '',
              content:
                "<p>Bolster your body's natural defenses and combat infections with mushroom extracts rich in immunomodulating compounds, offering protection against pathogens and toxins</p>",
              image: '/assets/icons/infection.png',
              classes: 'icon',
            },
            {
              title: 'Antioxidant Power',
              subtitle: '',
              content:
                '<p>Protect your cells from oxidative damage and premature aging with mushroom supplements rich in potent antioxidants, supporting overall health and longevity.</p>',
              image: '/assets/icons/molecule.png',
              classes: 'icon',
            },
            {
              title: 'Anti-Inflammatory',
              subtitle: '',
              content:
                '<p>Combat inflammation and promote joint health with mushroom extracts known for their anti-inflammatory properties, easing discomfort and promoting mobility.</p>',
              image: '/assets/icons/inflammation.png',
              classes: 'icon',
            },
            {
              title: 'Cancer Prevention',
              subtitle: '',
              content:
                "<p>Support your body's natural defense against cancer with mushroom supplements, containing bioactive compounds that inhibit tumor growth and boost immune surveillance.</p>",
              image: '/assets/icons/cancer.png',
              classes: 'icon',
            },
          ],
          template: 'col-3',
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
    coffee: {
      product: 'Coffee',
      meta: {
        title: 'Premium Coffee for Health and Wellness',
        description:
          'Enjoy the rich flavors and health benefits of our premium coffee selection. From organic beans to wellness blends, our coffee supports your health goals while providing a delightful taste experience.',
        image: 'https://obscura.solutions/assets/images/coffee.webp',
        keywords:
          'premium coffee, health benefits of coffee, organic coffee, wellness coffee, coffee blends, healthy coffee options, gourmet coffee',
      },
      slides: [
        {
          title: 'Premium Coffee Selection',
          description:
            'Enjoy the rich and diverse flavors of our premium coffee.',
          image: 'coffee.webp',
        },
      ],
      content: [
        {
          title: 'About Our Coffee',
          content:
            '<p>Our coffee is sourced from the finest plantations around the world, ensuring rich flavor and high quality in every cup.</p>',
          template: 'col-1',
        },
        {
          title: 'Why Choose Our Coffee?',
          content:
            '<p>We prioritize quality and sustainability, offering coffee that is ethically sourced and expertly roasted to perfection.</p>',
          image: 'coffee2.webp',
          template: 'col-2',
        },
        {
          title: 'Our Coffee Varieties',
          content:
            '<p>Explore our range of coffee products, from single-origin beans to unique blends, each crafted to provide a distinct and enjoyable experience.</p>',
          image: 'lionsmane.webp',
          template: 'col-2',
        },
        {
          title: 'The Benefits',
          content: [
            {
              title: 'Rich Flavor',
              subtitle: 'Exquisite Taste',
              content:
                'Our coffee offers rich, complex flavors that cater to all palates, from bold to subtle notes.',
              image: '/assets/icons/leaf.png',
              classes: 'icon',
            },
            {
              title: 'Sustainable Sourcing',
              subtitle: 'Ethically Sourced',
              content:
                'We source our coffee beans from sustainable farms, ensuring ethical practices and fair trade.',
              image: '/assets/icons/natural.png',
              classes: 'icon',
            },
            {
              title: 'High Quality',
              subtitle: 'Top Grade Beans',
              content:
                'Our beans are carefully selected and roasted to bring out their best qualities, ensuring a superior coffee experience.',
              image: '/assets/icons/coffee-beans.png',
              classes: 'icon',
            },
            {
              title: 'Boosts Energy',
              subtitle: 'Stay Alert',
              content:
                'Enjoy the natural energy boost from our premium coffee, helping you stay alert and focused throughout the day.',
              image: '/assets/icons/energy.png',
              classes: 'icon',
            },
            {
              title: 'Antioxidants',
              subtitle: 'Health Benefits',
              content:
                'Coffee is rich in antioxidants, which can help protect your cells and support overall health.',
              image: '/assets/icons/molecule.png',
              classes: 'icon',
            },
            {
              title: 'Versatility',
              subtitle: 'Various Brew Methods',
              content:
                'Our coffee can be enjoyed in various ways, from espresso to cold brew, providing flexibility in how you savor your cup.',
              image: '/assets/icons/coffee-cup.png',
              classes: 'icon',
            },
            {
              title: 'Community Support',
              subtitle: 'Supporting Farmers',
              content:
                'By choosing our coffee, you are supporting farmers and communities who are committed to sustainable practices.',
              image: '/assets/icons/customer.png',
              classes: 'icon',
            },
            {
              title: 'Freshness',
              subtitle: 'Always Fresh',
              content:
                'We ensure our coffee is roasted and delivered fresh, preserving its rich flavors and aroma.',
              image: '/assets/icons/flower.png',
              classes: 'icon',
            },
            {
              title: 'Custom Blends',
              subtitle: 'Unique Flavors',
              content:
                'Our custom blends offer unique flavor profiles, allowing you to discover new and exciting coffee experiences.',
              image: '/assets/icons/fungi.png',
              classes: 'icon',
            },
          ],
          template: 'col-3',
        },
      ],
      questions: [
        {
          title: 'What makes your coffee special?',
          content:
            'Our coffee is sourced from the finest plantations, ethically produced, and expertly roasted to deliver rich and diverse flavors in every cup.',
        },
        {
          title: 'How should I store my coffee?',
          content:
            'Store your coffee in an airtight container in a cool, dark place to maintain its freshness and flavor.',
        },
        {
          title: 'What is the best way to brew your coffee?',
          content:
            'The best brewing method depends on your personal preference. Experiment with different methods like pour-over, French press, or espresso to find what you enjoy most.',
        },
      ],
      featuredProducts: [
        'gid://shopify/Product/8945648959825',
        'gid://shopify/Product/8959008637265',
      ],
    },
    'natural-supplements': {
      product: 'Natural Supplements',
      meta: {
        title: 'Natural Supplements for Optimal Health and Vitality',
        description:
          "Boost your health with our natural supplements, crafted from the finest ingredients. Support your body's needs with vitamins, minerals, and herbs that promote wellness and vitality without synthetic additives.",
        image: 'https://obscura.solutions/assets/images/generic2.webp',
        keywords:
          'natural supplements, herbal supplements, natural vitamins, holistic health, organic supplements, natural wellness, plant-based supplements',
      },
      slides: [
        {
          title: 'Boost Your Health Naturally',
          description:
            'Discover the power of our natural Supplements to enhance your well-being.',
          image: 'generic1.webp',
        },
      ],
      content: [
        {
          title: 'Why Choose Our Natural Supplement?',
          content:
            "<p>Our Natural Supplement is crafted with the finest ingredients to provide you with optimal health benefits. It's time to embrace nature's goodness and support your body's natural functions.</p>",
          template: 'col-1',
        },
        {
          title: 'Pure Ingredients',
          content:
            '<p>We source only the highest quality natural ingredients, ensuring that you receive the purest and most effective supplement available.</p>',
          image: 'generic2.webp',
          template: 'col-2',
        },
        {
          title: 'Proven Benefits',
          content:
            '<p>Our supplement is backed by scientific research and proven to support various aspects of health, including immune function, energy levels, and overall vitality.</p>',
          image: 'organic1.webp',
          template: 'col-2',
        },
        {
          title: 'The Benefits',
          content: [
            {
              title: 'Enhanced Immunity',
              subtitle: 'Support Your Immune System',
              content:
                '<p>Natural supplements can bolster your immune system, helping you stay healthy and fight off illnesses more effectively.</p>',
              image: '/assets/icons/immune.png',
              classes: 'icon',
            },
            {
              title: 'Increased Energy',
              subtitle: 'Boost Your Vitality',
              content:
                '<p>Experience a natural increase in energy levels, allowing you to stay active and productive throughout the day.</p>',
              image: '/assets/icons/energy.png',
              classes: 'icon',
            },
            {
              title: 'Improved Digestion',
              subtitle: 'Support Digestive Health',
              content:
                '<p>Natural supplements can promote better digestion, reducing discomfort and improving nutrient absorption.</p>',
              image: '/assets/icons/bacteria.png',
              classes: 'icon',
            },
            {
              title: 'Better Sleep',
              subtitle: 'Restful Nights',
              content:
                "<p>Many natural supplements help regulate sleep patterns, ensuring you get a restful night's sleep and wake up refreshed.</p>",
              image: '/assets/icons/yoga.png',
              classes: 'icon',
            },
            {
              title: 'Mental Clarity',
              subtitle: 'Sharpen Your Mind',
              content:
                '<p>Support cognitive function and mental clarity with natural ingredients that enhance brain health.</p>',
              image: '/assets/icons/mental-health.png',
              classes: 'icon',
            },
            {
              title: 'Healthy Skin',
              subtitle: 'Radiant Complexion',
              content:
                '<p>Natural supplements can improve skin health, giving you a radiant and youthful complexion.</p>',
              image: '/assets/icons/molecule.png',
              classes: 'icon',
            },
            {
              title: 'Stress Relief',
              subtitle: 'Calm and Relaxation',
              content:
                '<p>Many natural supplements have calming properties that help reduce stress and promote relaxation.</p>',
              image: '/assets/icons/lotus.png',
              classes: 'icon',
            },
            {
              title: 'Joint Health',
              subtitle: 'Support Joint Function',
              content:
                '<p>Support joint health and reduce discomfort with natural supplements that promote flexibility and mobility.</p>',
              image: '/assets/icons/neuron.png',
              classes: 'icon',
            },
            {
              title: 'Weight Management',
              subtitle: 'Healthy Weight',
              content:
                '<p>Natural supplements can support your weight management goals, helping you maintain a healthy weight.</p>',
              image: '/assets/icons/vitamin.png',
              classes: 'icon',
            },
          ],
          template: 'col-3',
        },
      ],
      questions: [
        {
          title: 'Are there any side effects?',
          content:
            'Our supplement is made from natural ingredients and is generally safe for most people. However, if you have any specific health concerns, please consult your doctor before use.',
        },
        {
          title: 'Can I take this supplement with other medications?',
          content:
            'If you are currently taking any medications, we recommend consulting your healthcare provider before starting our supplement to ensure there are no potential interactions.',
        },
        {
          title: 'Is the supplement suitable for vegetarians/vegans?',
          content:
            'Yes, our supplement is made with plant-based ingredients and is suitable for vegetarians and vegans.',
        },
      ],
      featuredProducts: [
        'gid://shopify/Product/8959021646161',
        'gid://shopify/Product/8959048155473',
      ],
    },
    vegan: {
      product: 'Vegan',
      meta: {
        title: 'High-Quality Vegan Health Products',
        description:
          'Explore our collection of vegan health products designed to support a plant-based lifestyle. From supplements to snacks, our vegan range ensures you maintain optimal nutrition and health.',
        image: 'https://obscura.solutions/assets/images/vegan1.webp',
        keywords:
          'vegan health products, vegan supplements, plant-based nutrition, vegan vitamins, cruelty-free health products, vegan lifestyle, vegan wellness',
      },
      slides: [
        {
          title: 'Premium Vegan Products',
          description:
            'Embrace a healthy lifestyle with our exclusive vegan products.',
          image: 'vegan1.webp',
        },
      ],
      content: [
        {
          title: 'About Our Vegan Products',
          content:
            '<p>Our vegan products are crafted to provide maximum health benefits while being 100% cruelty-free and plant-based.</p>',
          template: 'col-1',
        },
        {
          title: 'Why Choose Vegan?',
          content:
            '<p>Vegan products are free from animal derivatives, promoting a compassionate and environmentally sustainable lifestyle.</p>',
          image: 'organic2.webp',
          template: 'col-2',
        },
        {
          title: 'Our Vegan Range',
          content:
            '<p>Discover our extensive selection of vegan products, from nutritional supplements to skincare, all designed to enhance your health and well-being.</p>',
          image: 'reishi_mushroom2.webp',
          template: 'col-2',
        },
        {
          title: 'The Benefits',
          content: [
            {
              title: 'Plant-Based Nutrition',
              subtitle: 'Nutrient-Rich',
              content:
                'Our vegan products are packed with essential nutrients derived from plants, ensuring optimal health.',
              image: '/assets/icons/nutrient.png',
              classes: 'icon',
            },
            {
              title: 'Cruelty-Free',
              subtitle: 'Ethical Choices',
              content:
                'All our products are 100% cruelty-free, aligning with your values of compassion and ethical living.',
              image: '/assets/icons/bee.png',
              classes: 'icon',
            },
            {
              title: 'Environmental Sustainability',
              subtitle: 'Eco-Friendly',
              content:
                'Choosing vegan products helps reduce your environmental footprint, promoting a healthier planet.',
              image: '/assets/icons/bio.png',
              classes: 'icon',
            },
            {
              title: 'Digestive Health',
              subtitle: 'Gut-Friendly',
              content:
                'Vegan diets are rich in fiber, aiding in digestive health and regularity.',
              image: '/assets/icons/intestine.png',
              classes: 'icon',
            },
            {
              title: 'Weight Management',
              subtitle: 'Healthy Weight',
              content:
                'Our vegan products support healthy weight management through balanced nutrition.',
              image: '/assets/icons/body.png',
              classes: 'icon',
            },
            {
              title: 'Skin Health',
              subtitle: 'Glowing Skin',
              content:
                'Achieve radiant skin with our plant-based skincare and supplements.',
              image: '/assets/icons/skincare.png',
              classes: 'icon',
            },
            {
              title: 'Energy Boost',
              subtitle: 'Stay Energized',
              content:
                'Feel more energetic with our vegan products that are designed to boost your vitality.',
              image: '/assets/icons/energy.png',
              classes: 'icon',
            },
            {
              title: 'Heart Health',
              subtitle: 'Cardiovascular Support',
              content:
                'Support your heart health with our cholesterol-free vegan products.',
              image: '/assets/icons/vitality.png',
              classes: 'icon',
            },
            {
              title: 'Bone Health',
              subtitle: 'Strong Bones',
              content:
                'Ensure strong bones with our calcium and vitamin D fortified vegan products.',
              image: '/assets/icons/joint.png',
              classes: 'icon',
            },
          ],
          template: 'col-3',
        },
      ],
      questions: [
        {
          title: 'What makes a product vegan?',
          content:
            'A product is considered vegan if it contains no animal ingredients or by-products and is not tested on animals.',
        },
        {
          title: 'Are vegan products healthier?',
          content:
            "Vegan products can offer health benefits as they are often lower in saturated fats and higher in essential nutrients. However, it's important to ensure a balanced diet.",
        },
        {
          title: 'How do I transition to vegan products?',
          content:
            'Start by gradually replacing animal-based products with vegan alternatives. Read labels carefully and explore a variety of vegan options to find what works best for you.',
        },
      ],
      featuredProducts: [
        'gid://shopify/Product/8945627136337',
        'gid://shopify/Product/8959063589201',
      ],
    },
    organic: {
      product: 'Organic',
      meta: {
        title: 'Organic Health Products for a Natural Lifestyle',
        description:
          'Embrace a healthier lifestyle with our range of organic health products. From supplements to food items, our organic selection ensures you receive the best nature has to offer, free from harmful chemicals.',
        image: 'https://obscura.solutions/assets/images/organic1.webp',
        keywords:
          'organic health products, organic supplements, natural organic foods, chemical-free products, organic lifestyle, organic vitamins, organic wellness',
      },
      slides: [
        {
          title: 'Pure & Organic Products',
          description:
            'Experience the best of nature with our organic products.',
          image: 'organic1.webp',
        },
      ],
      content: [
        {
          title: 'About Organic Products',
          content:
            '<p>Our organic products are made from ingredients grown without synthetic pesticides or fertilizers, ensuring purity and sustainability.</p>',
          template: 'col-1',
        },
        {
          title: 'Why Choose Organic?',
          content:
            '<p>Choosing organic products means you are supporting sustainable farming practices and reducing your exposure to harmful chemicals.</p>',
          image: 'organic2.webp',
          template: 'col-2',
        },
        {
          title: 'Our Organic Range',
          content:
            '<p>Explore our wide range of organic products, from food items to personal care, all designed to enhance your health naturally.</p>',
          image: 'reishi_mushroom.webp',
          template: 'col-2',
        },
        {
          title: 'The Benefits',
          content: [
            {
              title: 'No Pesticides',
              subtitle: 'Chemical-Free',
              content:
                'Our organic products are free from synthetic pesticides and fertilizers, ensuring they are safe and healthy.',
              image: '/assets/icons/pesticide-free.png',
              classes: 'icon',
            },
            {
              title: 'Nutrient-Rich',
              subtitle: 'High Nutrition',
              content:
                'Organic products are often richer in nutrients, providing you with more vitamins, minerals, and antioxidants.',
              image: '/assets/icons/nutrient.png',
              classes: 'icon',
            },
            {
              title: 'Eco-Friendly',
              subtitle: 'Sustainable Farming',
              content:
                'Supporting organic products means promoting sustainable farming practices that protect the environment.',
              image: '/assets/icons/leaf.png',
              classes: 'icon',
            },
            {
              title: 'Better Taste',
              subtitle: 'Natural Flavor',
              content:
                'Many people find that organic products have a better, more natural taste compared to non-organic alternatives.',
              image: '/assets/icons/herbal2.png',
              classes: 'icon',
            },
            {
              title: 'No GMOs',
              subtitle: 'Non-GMO',
              content:
                'Our organic products are free from genetically modified organisms, ensuring natural purity.',
              image: '/assets/icons/nitrates-free.png',
              classes: 'icon',
            },
            {
              title: 'Supports Biodiversity',
              subtitle: 'Healthy Ecosystems',
              content:
                'Organic farming supports biodiversity and helps maintain healthy ecosystems.',
              image: '/assets/icons/seed.png',
              classes: 'icon',
            },
            {
              title: 'Hormone-Free',
              subtitle: 'Natural Growth',
              content:
                'Organic products are free from growth hormones and antibiotics, ensuring natural growth processes.',
              image: '/assets/icons/body.png',
              classes: 'icon',
            },
            {
              title: 'Animal Welfare',
              subtitle: 'Humane Practices',
              content:
                'Organic farming practices often include higher standards of animal welfare.',
              image: '/assets/icons/bee.png',
              classes: 'icon',
            },
            {
              title: 'Supports Local Farmers',
              subtitle: 'Community Support',
              content:
                'Buying organic products often supports local farmers and their communities.',
              image: '/assets/icons/customer.png',
              classes: 'icon',
            },
          ],
          template: 'col-3',
        },
      ],
      questions: [
        {
          title: 'What defines an organic product?',
          content:
            'An organic product is made from ingredients grown without the use of synthetic pesticides, fertilizers, genetically modified organisms, or other harmful chemicals.',
        },
        {
          title: 'Are organic products healthier?',
          content:
            "Organic products can be healthier as they are free from harmful chemicals and often have higher nutrient content. However, it's important to consider overall dietary balance.",
        },
        {
          title: 'How do I know if a product is truly organic?',
          content:
            "Look for certification labels from reputable organizations that verify the organic status of the product. Reading the ingredients list can also provide insights into the product's organic nature.",
        },
      ],
      featuredProducts: [
        'gid://shopify/Product/8945588699473',
        'gid://shopify/Product/8945648959825',
      ],
    },

    ayurvedic: {
      product: 'Ayurvedic',
      meta: {
        title: 'Ayurvedic Health Solutions for Balanced Living',
        description:
          'Reconnect with ancient wisdom through our Ayurvedic health products. Our range includes traditional herbs and formulations to balance your mind, body, and spirit according to Ayurvedic principles.',
        image:
          'https://obscura.solutions/assets/images/dhaka_flower_ayurvedic.webp',
        keywords:
          'Ayurvedic health products, Ayurvedic supplements, traditional Ayurveda, herbal Ayurvedic remedies, balance and wellness, ancient health solutions, Ayurvedic lifestyle',
      },
      slides: [
        {
          title: 'Authentic Ayurvedic Products',
          description:
            'Balance your body and mind with our traditional Ayurvedic products.',
          image: 'dhaka_flower_ayurvedic.webp',
        },
      ],
      content: [
        {
          title: 'About Ayurvedic Products',
          content:
            '<p>Our Ayurvedic products are crafted based on ancient Indian medicine principles, promoting balance and holistic health.</p>',
          template: 'col-1',
        },
        {
          title: 'Why Choose Ayurveda?',
          content:
            '<p>Ayurveda focuses on natural healing and balancing the body, mind, and spirit through diet, lifestyle, and herbal remedies.</p>',
          image: 'ashwagandha.webp',
          template: 'col-2',
        },
        {
          title: 'Our Ayurvedic Range',
          content:
            '<p>Discover our range of Ayurvedic products, including herbal supplements, oils, and teas, designed to support your health and wellness naturally.</p>',
          image: 'ayurvedic_medicine.webp',
          template: 'col-2',
        },
        {
          title: 'The Benefits',
          content: [
            {
              title: 'Holistic Health',
              subtitle: 'Balance & Wellness',
              content:
                "Ayurvedic products promote holistic health by balancing the body's doshas and supporting overall wellness.",
              image: '/assets/icons/back.png',
              classes: 'icon',
            },
            {
              title: 'Natural Ingredients',
              subtitle: 'Herbal Remedies',
              content:
                'Our products are made from natural herbs and ingredients, ensuring purity and effectiveness.',
              image: '/assets/icons/herbal.png',
              classes: 'icon',
            },
            {
              title: 'Detoxification',
              subtitle: 'Cleanse & Purify',
              content:
                'Ayurvedic remedies help detoxify the body, removing toxins and promoting internal cleansing.',
              image: '/assets/icons/inflammation.png',
              classes: 'icon',
            },
            {
              title: 'Improved Digestion',
              subtitle: 'Digestive Health',
              content:
                'Support your digestive health with Ayurvedic herbs known for their digestive benefits.',
              image: '/assets/icons/intestine.png',
              classes: 'icon',
            },
            {
              title: 'Stress Relief',
              subtitle: 'Calm & Relax',
              content:
                'Ayurvedic products help reduce stress and promote relaxation through natural means.',
              image: '/assets/icons/yoga.png',
              classes: 'icon',
            },
            {
              title: 'Enhanced Immunity',
              subtitle: 'Immune Support',
              content:
                'Boost your immune system with powerful Ayurvedic herbs and formulations.',
              image: '/assets/icons/immune.png',
              classes: 'icon',
            },
            {
              title: 'Skin Health',
              subtitle: 'Radiant Skin',
              content:
                'Achieve healthy, glowing skin with Ayurvedic skincare products.',
              image: '/assets/icons/skincare.png',
              classes: 'icon',
            },
            {
              title: 'Joint Health',
              subtitle: 'Flexible & Strong',
              content:
                'Support joint health and flexibility with Ayurvedic oils and supplements.',
              image: '/assets/icons/joint.png',
              classes: 'icon',
            },
            {
              title: 'Mental Clarity',
              subtitle: 'Focus & Memory',
              content:
                'Enhance mental clarity and memory with Ayurvedic herbs traditionally used for cognitive support.',
              image: '/assets/icons/mental-health.png',
              classes: 'icon',
            },
          ],
          template: 'col-3',
        },
      ],
      questions: [
        {
          title: 'What is Ayurveda?',
          content:
            'Ayurveda is a traditional system of medicine from India that emphasizes balance in the body using diet, herbal treatment, and yogic breathing.',
        },
        {
          title: 'Are Ayurvedic products safe?',
          content:
            "Ayurvedic products are generally safe when used as directed. However, it's important to purchase from reputable sources and consult a healthcare provider if you have any health conditions.",
        },
        {
          title: 'How do I incorporate Ayurveda into my routine?',
          content:
            'Start by understanding your dosha (body type) and incorporating appropriate dietary changes, herbal supplements, and lifestyle practices. Consulting with an Ayurvedic practitioner can provide personalized guidance.',
        },
      ],
      featuredProducts: [],
    },

    'anti-ageing': {
      product: 'Anti-Ageing',
      meta: {
        title: 'Advanced Anti-Ageing Health Products',
        description:
          'Combat the signs of ageing with our advanced anti-ageing health products. Our supplements and skincare solutions help you maintain youthful energy and appearance, promoting longevity and vitality.',
        image: 'https://obscura.solutions/assets/images/skincare.webp',
        keywords:
          'anti-ageing products, anti-ageing supplements, youthful skin, longevity supplements, anti-ageing skincare, age-defying products, anti-ageing health',
      },
      slides: [
        {
          title: 'Advanced Anti-Ageing Solutions',
          description:
            'Rejuvenate your skin and reduce the signs of ageing with our advanced products.',
          image: 'skincare.webp',
        },
      ],
      content: [
        {
          title: 'About Our Anti-Ageing Products',
          content:
            '<p>Our anti-ageing products are formulated with cutting-edge ingredients to help you achieve youthful, radiant skin.</p>',
          template: 'col-1',
        },
        {
          title: 'Why Choose Anti-Ageing Products?',
          content:
            '<p>Our products target the signs of ageing, including wrinkles, fine lines, and loss of elasticity, to help you maintain a youthful appearance.</p>',
          image: 'skincare2.webp',
          template: 'col-2',
        },
        {
          title: 'Our Anti-Ageing Range',
          content:
            '<p>Discover our range of anti-ageing products, including serums, creams, and supplements, designed to rejuvenate your skin and enhance its natural beauty.</p>',
          image: 'generic1.webp',
          template: 'col-2',
        },
        {
          title: 'The Benefits',
          content: [
            {
              title: 'Reduces Wrinkles',
              subtitle: 'Smooth Skin',
              content:
                'Our products help reduce the appearance of wrinkles, giving you smoother, younger-looking skin.',
              image: '/assets/icons/skincare.png',
              classes: 'icon',
            },
            {
              title: 'Improves Elasticity',
              subtitle: 'Firm & Tight',
              content:
                "Enhance your skin's elasticity and firmness with our advanced formulations.",
              image: '/assets/icons/muscle.png',
              classes: 'icon',
            },
            {
              title: 'Hydration',
              subtitle: 'Moisturize & Nourish',
              content:
                'Keep your skin hydrated and nourished to maintain a healthy glow and prevent dryness.',
              image: '/assets/icons/moisturizer.png',
              classes: 'icon',
            },
            {
              title: 'Boosts Collagen',
              subtitle: 'Youthful Skin',
              content:
                'Stimulate collagen production to support skin structure and reduce signs of ageing.',
              image: '/assets/icons/molecule.png',
              classes: 'icon',
            },
            {
              title: 'Fights Free Radicals',
              subtitle: 'Antioxidant Protection',
              content:
                'Protect your skin from environmental damage with powerful antioxidants.',
              image: '/assets/icons/immune.png',
              classes: 'icon',
            },
            {
              title: 'Evens Skin Tone',
              subtitle: 'Radiant Complexion',
              content:
                'Achieve a more even skin tone and reduce dark spots for a radiant complexion.',
              image: '/assets/icons/body.png',
              classes: 'icon',
            },
            {
              title: 'Reduces Puffiness',
              subtitle: 'Refresh & Revitalize',
              content:
                'Our products help reduce puffiness and dark circles, giving your eyes a refreshed look.',
              image: '/assets/icons/eyes-mask.png',
              classes: 'icon',
            },
            {
              title: 'Improves Texture',
              subtitle: 'Smooth & Soft',
              content:
                "Enhance your skin's texture, making it smoother and softer to the touch.",
              image: '/assets/icons/pore.png',
              classes: 'icon',
            },
            {
              title: 'Long-Lasting Results',
              subtitle: 'Sustained Youthfulness',
              content:
                'Enjoy long-lasting anti-ageing benefits with consistent use of our products.',
              image: '/assets/icons/lotion.png',
              classes: 'icon',
            },
          ],
          template: 'col-3',
        },
      ],
      questions: [
        {
          title: 'What causes skin ageing?',
          content:
            'Skin ageing is caused by a combination of factors including genetics, environmental exposure, and lifestyle choices. Over time, these factors lead to a reduction in collagen and elastin, causing wrinkles and loss of firmness.',
        },
        {
          title: 'How often should I use anti-ageing products?',
          content:
            'For best results, use anti-ageing products as part of your daily skincare routine, typically morning and night, depending on the product instructions.',
        },
        {
          title: 'Can anti-ageing products really make a difference?',
          content:
            'Yes, high-quality anti-ageing products can help reduce the signs of ageing and improve the overall appearance and health of your skin when used consistently.',
        },
      ],
      featuredProducts: [],
    },
    Product: {
      product: 'Product',
      slides: [
        {
          title: '',
          description: '',
          image: 'https://obscura.solutions/assets/images/product.webp',
        },
      ],
      content: [
        {
          title: '',
          content: '',
          template: 'col-1',
        },
        {
          title: '',
          content: '',
          image: 'http://obscura.solutions/assets/image/product.webp',
          template: 'col-2',
        },
        {
          title: '',
          content: '',
          image: 'http://obscura.solutions/assets/image/product.webp',
          template: 'col-2',
        },
        {
          title: '',
          content: [
            {
              title: '',
              subtitle: '',
              content: '',
              image: '',
              classes: 'icon',
            },
          ],
          template: 'col-3',
        },
      ],
      questions: [
        {
          title: '',
          content: '',
        },
      ],
      featuredProducts: [],
    },
  };

  //

  @ViewChild('mainSwiper', { static: false }) mainSwiper!: ElementRef;
  @ViewChildren('item') items?: QueryList<ElementRef>;

  public url: string;
  public title: string;

  constructor(
    public service: CoreService,
    public router: Router,
    private route: ActivatedRoute,
    public library: Library,
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef,
    //public productComponent: ProductComponent,
  ) {
    this.url = environment.url;
    this.title = environment.title;
  }

  ngOnInit() {
    this.test();
    this.checkReturn();
    this.filterCategory =
      this.filterCategory !== ''
        ? this.library.alias(this.filterCategory)
        : 'all';

    this.route.queryParams.subscribe((params: Params) => {
      if (params['search']) {
        this.search = params['search'];
        const query = this.library.alias(params['search']);
        this.service.seo.doMeta(this.heroSlides[query].meta);
      }
    });

    /* this.route.url.subscribe((urlSegments) => {
      // Convert urlSegments to an array of string
      const segments = urlSegments.map((segment) => segment.path);

      // Check if 'shop' exists in the segments
      const shopIndex = segments.indexOf('shop');
      if (shopIndex !== -1) {
        // Get the last segment
        const lastSegment = segments[segments.length - 1];
        //Check if segment is a category
        //alert(lastSegment);
        if (this.heroSlides.hasOwnProperty(lastSegment)) {
          // Append the last segment to the variable
          this.search = lastSegment;
          this.filterCategory = lastSegment;
          this.service.seo.doMeta(this.heroSlides[this.search].meta);
        }
      }
    });*/

    this.route.paramMap.subscribe((params) => {
      const category = params.get('category');
      if (category && this.heroSlides.hasOwnProperty(category)) {
        // Append the category to the variable if it matches any category key
        this.filterCategory = category;
        this.search = category;
        this.service.seo.doMeta(this.heroSlides[this.search].meta);
      }
    });
  }

  ngAfterViewInit(): void {
    this.initializeObserver();
    //Ensure products grid fades in when Shop Now button is clicked
    const sliderCta = document.querySelector('#slider-cta');
    if (sliderCta) {
      sliderCta.addEventListener('click', () => {
        this.elementRef.nativeElement
          .querySelector('#productsGrid')
          .classList.add('fade-in');
      });
    }
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
      if (checkout.completedAt !== null) {
        this.service.shop.checkoutComplete = true;
        this.service.ads.google.trackConversion(
          checkout.totalPrice.amount,
          checkout.totalPrice.currencyCode,
        );
      }
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
    this.filterCategory =
      searchData.keyword !== ''
        ? this.library.alias(searchData.keyword)
        : 'all';
    if (this.filterCategory == 'featured') this.filterCategory = 'all';

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
