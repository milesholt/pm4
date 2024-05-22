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
    all: {
      product: 'Health Products',
      slides: [
        {
          title: 'Time for a healthier you.',
          description:
            'Discover a wide range of health products designed to enhance your well-being.',
          image: 'http://obscura.solutions/assets/images/generic2.webp',
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
          image: 'http://obscura.solutions/assets/images/fitness.webp',
          template: 'col-2',
        },
        {
          title: 'Natural Supplements',
          content:
            '<p>Boost your health with our natural supplements, formulated to provide essential nutrients and support overall well-being.</p>',
          image:
            'http://obscura.solutions/assets/images/dhaka_flower_ayervedic.webp',
          template: 'col-2',
        },
        {
          title: 'Vegan',
          content:
            '<p>Discover our range of vegan products, free from animal ingredients and perfect for a plant-based lifestyle.</p>',
          image: 'http://obscura.solutions/assets/images/vegan1.webp',
          template: 'col-2',
        },
        {
          title: 'Organic',
          content:
            '<p>Choose from our selection of organic products, made without synthetic chemicals or GMOs, for a natural approach to health.</p>',
          image: 'http://obscura.solutions/assets/images/organic2.webp',
          template: 'col-2',
        },
        {
          title: 'Ayurvedic',
          content:
            '<p>Explore our Ayurvedic products, inspired by traditional Indian medicine and designed to promote balance and holistic health.</p>',
          image:
            'http://obscura.solutions/assets/images/ayurvedic_medicine.webp',
          template: 'col-2',
        },
        {
          title: 'Coffee',
          content:
            '<p>Enjoy our premium coffee selection, sourced from the finest plantations and roasted to perfection for rich, flavorful experiences.</p>',
          image: 'http://obscura.solutions/assets/images/coffee.webp',
          template: 'col-2',
        },
        {
          title: 'Anti-Ageing',
          content:
            '<p>Rejuvenate your skin with our anti-ageing products, formulated with advanced ingredients to reduce signs of ageing and promote youthful radiance.</p>',
          image: 'http://obscura.solutions/assets/images/skincare.webp',
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
              image: 'http://obscura.solutions/assets/icons/bio.png',
              classes: 'icon',
            },
            {
              title: 'High Quality',
              subtitle: 'Premium Standards',
              content:
                'We prioritize quality in all our products, using only the best ingredients and manufacturing processes.',
              image:
                'http://obscura.solutions/assets/icons/premium-quality.png',
              classes: 'icon',
            },
            {
              title: 'Natural Ingredients',
              subtitle: 'Chemical-Free',
              content:
                'Our health products are made from natural ingredients, free from synthetic chemicals and additives.',
              image: 'http://obscura.solutions/assets/icons/herbal.png',
              classes: 'icon',
            },
            {
              title: 'Sustainability',
              subtitle: 'Eco-Friendly',
              content:
                'We are committed to sustainability, sourcing our products responsibly and minimizing environmental impact.',
              image: 'http://obscura.solutions/assets/icons/flower.png',
              classes: 'icon',
            },
            {
              title: 'Vegan & Organic Options',
              subtitle: 'Ethical Choices',
              content:
                'Our range includes vegan and organic products, catering to ethical and health-conscious consumers.',
              image: 'http://obscura.solutions/assets/icons/vegan.png',
              classes: 'icon',
            },
            {
              title: 'Holistic Health',
              subtitle: 'Mind & Body',
              content:
                'Promote holistic health with products that support both physical and mental well-being.',
              image: 'http://obscura.solutions/assets/icons/mortar.png',
              classes: 'icon',
            },
            {
              title: 'Enhanced Vitality',
              subtitle: 'Energy & Wellness',
              content:
                'Our supplements and health products enhance vitality, helping you feel more energetic and vibrant.',
              image: 'http://obscura.solutions/assets/icons/pharmacy.png',
              classes: 'icon',
            },
            {
              title: 'Expertly Formulated',
              subtitle: 'Science-Based',
              content:
                'Our products are formulated based on scientific research and traditional wisdom, ensuring effectiveness and safety.',
              image: 'http://obscura.solutions/assets/icons/pills.png',
              classes: 'icon',
            },
            {
              title: 'Community Support',
              subtitle: 'Giving Back',
              content:
                'By choosing our products, you support communities and initiatives that promote health and sustainability.',
              image: 'http://obscura.solutions/assets/icons/customer.png',
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
      slides: [
        {
          title: 'Premium Coffee Selection',
          description:
            'Enjoy the rich and diverse flavors of our premium coffee.',
          image: 'http://obscura.solutions/assets/images/coffee.webp',
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
          image: 'http://obscura.solutions/assets/images/coffee2.webp',
          template: 'col-2',
        },
        {
          title: 'Our Coffee Varieties',
          content:
            '<p>Explore our range of coffee products, from single-origin beans to unique blends, each crafted to provide a distinct and enjoyable experience.</p>',
          image: 'http://obscura.solutions/assets/images/lionsmane.webp',
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
              image: 'http://obscura.solutions/assets/icons/leaf.png',
              classes: 'icon',
            },
            {
              title: 'Sustainable Sourcing',
              subtitle: 'Ethically Sourced',
              content:
                'We source our coffee beans from sustainable farms, ensuring ethical practices and fair trade.',
              image: 'http://obscura.solutions/assets/icons/natural.png',
              classes: 'icon',
            },
            {
              title: 'High Quality',
              subtitle: 'Top Grade Beans',
              content:
                'Our beans are carefully selected and roasted to bring out their best qualities, ensuring a superior coffee experience.',
              image: 'http://obscura.solutions/assets/icons/coffee-beans.png',
              classes: 'icon',
            },
            {
              title: 'Boosts Energy',
              subtitle: 'Stay Alert',
              content:
                'Enjoy the natural energy boost from our premium coffee, helping you stay alert and focused throughout the day.',
              image: 'http://obscura.solutions/assets/icons/energy.png',
              classes: 'icon',
            },
            {
              title: 'Antioxidants',
              subtitle: 'Health Benefits',
              content:
                'Coffee is rich in antioxidants, which can help protect your cells and support overall health.',
              image: 'http://obscura.solutions/assets/icons/molecule.png',
              classes: 'icon',
            },
            {
              title: 'Versatility',
              subtitle: 'Various Brew Methods',
              content:
                'Our coffee can be enjoyed in various ways, from espresso to cold brew, providing flexibility in how you savor your cup.',
              image: 'http://obscura.solutions/assets/icons/coffee-cup.png',
              classes: 'icon',
            },
            {
              title: 'Community Support',
              subtitle: 'Supporting Farmers',
              content:
                'By choosing our coffee, you are supporting farmers and communities who are committed to sustainable practices.',
              image: 'http://obscura.solutions/assets/icons/customer.png',
              classes: 'icon',
            },
            {
              title: 'Freshness',
              subtitle: 'Always Fresh',
              content:
                'We ensure our coffee is roasted and delivered fresh, preserving its rich flavors and aroma.',
              image: 'http://obscura.solutions/assets/icons/flower.png',
              classes: 'icon',
            },
            {
              title: 'Custom Blends',
              subtitle: 'Unique Flavors',
              content:
                'Our custom blends offer unique flavor profiles, allowing you to discover new and exciting coffee experiences.',
              image: 'http://obscura.solutions/assets/icons/fungi.png',
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
      slides: [
        {
          title: 'Boost Your Health Naturally',
          description:
            'Discover the power of our natural Supplements to enhance your well-being.',
          image: 'http://obscura.solutions/assets/images/generic1.webp',
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
          image: 'http://obscura.solutions/assets/images/generic2.webp',
          template: 'col-2',
        },
        {
          title: 'Proven Benefits',
          content:
            '<p>Our supplement is backed by scientific research and proven to support various aspects of health, including immune function, energy levels, and overall vitality.</p>',
          image: 'http://obscura.solutions/assets/images/organic1.webp',
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
              image: 'http://obscura.solutions/assets/icons/immune.png',
              classes: 'icon',
            },
            {
              title: 'Increased Energy',
              subtitle: 'Boost Your Vitality',
              content:
                '<p>Experience a natural increase in energy levels, allowing you to stay active and productive throughout the day.</p>',
              image: 'http://obscura.solutions/assets/icons/energy.png',
              classes: 'icon',
            },
            {
              title: 'Improved Digestion',
              subtitle: 'Support Digestive Health',
              content:
                '<p>Natural supplements can promote better digestion, reducing discomfort and improving nutrient absorption.</p>',
              image: 'http://obscura.solutions/assets/icons/bacteria.png',
              classes: 'icon',
            },
            {
              title: 'Better Sleep',
              subtitle: 'Restful Nights',
              content:
                "<p>Many natural supplements help regulate sleep patterns, ensuring you get a restful night's sleep and wake up refreshed.</p>",
              image: 'http://obscura.solutions/assets/icons/yoga.png',
              classes: 'icon',
            },
            {
              title: 'Mental Clarity',
              subtitle: 'Sharpen Your Mind',
              content:
                '<p>Support cognitive function and mental clarity with natural ingredients that enhance brain health.</p>',
              image: 'http://obscura.solutions/assets/icons/mental-health.png',
              classes: 'icon',
            },
            {
              title: 'Healthy Skin',
              subtitle: 'Radiant Complexion',
              content:
                '<p>Natural supplements can improve skin health, giving you a radiant and youthful complexion.</p>',
              image: 'http://obscura.solutions/assets/icons/molecule.png',
              classes: 'icon',
            },
            {
              title: 'Stress Relief',
              subtitle: 'Calm and Relaxation',
              content:
                '<p>Many natural supplements have calming properties that help reduce stress and promote relaxation.</p>',
              image: 'http://obscura.solutions/assets/icons/lotus.png',
              classes: 'icon',
            },
            {
              title: 'Joint Health',
              subtitle: 'Support Joint Function',
              content:
                '<p>Support joint health and reduce discomfort with natural supplements that promote flexibility and mobility.</p>',
              image: 'http://obscura.solutions/assets/icons/neuron.png',
              classes: 'icon',
            },
            {
              title: 'Weight Management',
              subtitle: 'Healthy Weight',
              content:
                '<p>Natural supplements can support your weight management goals, helping you maintain a healthy weight.</p>',
              image: 'http://obscura.solutions/assets/icons/vitamin.png',
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
      slides: [
        {
          title: 'Premium Vegan Products',
          description:
            'Embrace a healthy lifestyle with our exclusive vegan products.',
          image: 'http://obscura.solutions/assets/images/vegan1.webp',
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
          image: 'http://obscura.solutions/assets/images/organic2.webp',
          template: 'col-2',
        },
        {
          title: 'Our Vegan Range',
          content:
            '<p>Discover our extensive selection of vegan products, from nutritional supplements to skincare, all designed to enhance your health and well-being.</p>',
          image: 'http://obscura.solutions/assets/images/reishi_mushroom2.webp',
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
              image: 'http://obscura.solutions/assets/icons/nutrient.png',
              classes: 'icon',
            },
            {
              title: 'Cruelty-Free',
              subtitle: 'Ethical Choices',
              content:
                'All our products are 100% cruelty-free, aligning with your values of compassion and ethical living.',
              image: 'http://obscura.solutions/assets/icons/bee.png',
              classes: 'icon',
            },
            {
              title: 'Environmental Sustainability',
              subtitle: 'Eco-Friendly',
              content:
                'Choosing vegan products helps reduce your environmental footprint, promoting a healthier planet.',
              image: 'http://obscura.solutions/assets/icons/bio.png',
              classes: 'icon',
            },
            {
              title: 'Digestive Health',
              subtitle: 'Gut-Friendly',
              content:
                'Vegan diets are rich in fiber, aiding in digestive health and regularity.',
              image: 'http://obscura.solutions/assets/icons/intestine.png',
              classes: 'icon',
            },
            {
              title: 'Weight Management',
              subtitle: 'Healthy Weight',
              content:
                'Our vegan products support healthy weight management through balanced nutrition.',
              image: 'http://obscura.solutions/assets/icons/body.png',
              classes: 'icon',
            },
            {
              title: 'Skin Health',
              subtitle: 'Glowing Skin',
              content:
                'Achieve radiant skin with our plant-based skincare and supplements.',
              image: 'http://obscura.solutions/assets/icons/skincare.png',
              classes: 'icon',
            },
            {
              title: 'Energy Boost',
              subtitle: 'Stay Energized',
              content:
                'Feel more energetic with our vegan products that are designed to boost your vitality.',
              image: 'http://obscura.solutions/assets/icons/energy.png',
              classes: 'icon',
            },
            {
              title: 'Heart Health',
              subtitle: 'Cardiovascular Support',
              content:
                'Support your heart health with our cholesterol-free vegan products.',
              image: 'http://obscura.solutions/assets/icons/vitality.png',
              classes: 'icon',
            },
            {
              title: 'Bone Health',
              subtitle: 'Strong Bones',
              content:
                'Ensure strong bones with our calcium and vitamin D fortified vegan products.',
              image: 'http://obscura.solutions/assets/icons/joint.png',
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
      featuredProducts: [],
    },
    organic: {
      product: 'Organic',
      slides: [
        {
          title: 'Pure & Organic Products',
          description:
            'Experience the best of nature with our organic products.',
          image: 'http://obscura.solutions/assets/images/organic1.webp',
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
          image: 'http://obscura.solutions/assets/images/organic2.webp',
          template: 'col-2',
        },
        {
          title: 'Our Organic Range',
          content:
            '<p>Explore our wide range of organic products, from food items to personal care, all designed to enhance your health naturally.</p>',
          image: 'http://obscura.solutions/assets/images/reishi_mushroom.webp',
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
              image: '',
              classes: 'icon',
            },
            {
              title: 'Nutrient-Rich',
              subtitle: 'High Nutrition',
              content:
                'Organic products are often richer in nutrients, providing you with more vitamins, minerals, and antioxidants.',
              image: 'http://obscura.solutions/assets/icons/nutrient.png',
              classes: 'icon',
            },
            {
              title: 'Eco-Friendly',
              subtitle: 'Sustainable Farming',
              content:
                'Supporting organic products means promoting sustainable farming practices that protect the environment.',
              image: 'http://obscura.solutions/assets/icons/leaf.png',
              classes: 'icon',
            },
            {
              title: 'Better Taste',
              subtitle: 'Natural Flavor',
              content:
                'Many people find that organic products have a better, more natural taste compared to non-organic alternatives.',
              image: 'http://obscura.solutions/assets/icons/herbal2.png',
              classes: 'icon',
            },
            {
              title: 'No GMOs',
              subtitle: 'Non-GMO',
              content:
                'Our organic products are free from genetically modified organisms, ensuring natural purity.',
              image: 'http://obscura.solutions/assets/icons/nitrates-free.png',
              classes: 'icon',
            },
            {
              title: 'Supports Biodiversity',
              subtitle: 'Healthy Ecosystems',
              content:
                'Organic farming supports biodiversity and helps maintain healthy ecosystems.',
              image: 'http://obscura.solutions/assets/icons/seed.png',
              classes: 'icon',
            },
            {
              title: 'Hormone-Free',
              subtitle: 'Natural Growth',
              content:
                'Organic products are free from growth hormones and antibiotics, ensuring natural growth processes.',
              image: 'http://obscura.solutions/assets/icons/body.png',
              classes: 'icon',
            },
            {
              title: 'Animal Welfare',
              subtitle: 'Humane Practices',
              content:
                'Organic farming practices often include higher standards of animal welfare.',
              image: 'http://obscura.solutions/assets/icons/bee.png',
              classes: 'icon',
            },
            {
              title: 'Supports Local Farmers',
              subtitle: 'Community Support',
              content:
                'Buying organic products often supports local farmers and their communities.',
              image: 'http://obscura.solutions/assets/icons/customer.png',
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
      featuredProducts: [],
    },

    ayurvedic: {
      product: 'Ayurvedic',
      slides: [
        {
          title: 'Authentic Ayurvedic Products',
          description:
            'Balance your body and mind with our traditional Ayurvedic products.',
          image:
            'http://obscura.solutions/assets/images/dhaka_flower_ayervedic.webp',
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
          image: 'http://obscura.solutions/assets/images/ashwagandha.webp',
          template: 'col-2',
        },
        {
          title: 'Our Ayurvedic Range',
          content:
            '<p>Discover our range of Ayurvedic products, including herbal supplements, oils, and teas, designed to support your health and wellness naturally.</p>',
          image:
            'http://obscura.solutions/assets/images/ayurvedic_medicine.webp',
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
              image: 'http://obscura.solutions/assets/icons/back.png',
              classes: 'icon',
            },
            {
              title: 'Natural Ingredients',
              subtitle: 'Herbal Remedies',
              content:
                'Our products are made from natural herbs and ingredients, ensuring purity and effectiveness.',
              image: 'http://obscura.solutions/assets/icons/herbal.png',
              classes: 'icon',
            },
            {
              title: 'Detoxification',
              subtitle: 'Cleanse & Purify',
              content:
                'Ayurvedic remedies help detoxify the body, removing toxins and promoting internal cleansing.',
              image: 'http://obscura.solutions/assets/icons/inflammation.png',
              classes: 'icon',
            },
            {
              title: 'Improved Digestion',
              subtitle: 'Digestive Health',
              content:
                'Support your digestive health with Ayurvedic herbs known for their digestive benefits.',
              image: 'http://obscura.solutions/assets/icons/intestine.png',
              classes: 'icon',
            },
            {
              title: 'Stress Relief',
              subtitle: 'Calm & Relax',
              content:
                'Ayurvedic products help reduce stress and promote relaxation through natural means.',
              image: 'http://obscura.solutions/assets/icons/yoga.png',
              classes: 'icon',
            },
            {
              title: 'Enhanced Immunity',
              subtitle: 'Immune Support',
              content:
                'Boost your immune system with powerful Ayurvedic herbs and formulations.',
              image: 'http://obscura.solutions/assets/icons/immune.png',
              classes: 'icon',
            },
            {
              title: 'Skin Health',
              subtitle: 'Radiant Skin',
              content:
                'Achieve healthy, glowing skin with Ayurvedic skincare products.',
              image: 'http://obscura.solutions/assets/icons/skincare.png',
              classes: 'icon',
            },
            {
              title: 'Joint Health',
              subtitle: 'Flexible & Strong',
              content:
                'Support joint health and flexibility with Ayurvedic oils and supplements.',
              image: 'http://obscura.solutions/assets/icons/joint.png',
              classes: 'icon',
            },
            {
              title: 'Mental Clarity',
              subtitle: 'Focus & Memory',
              content:
                'Enhance mental clarity and memory with Ayurvedic herbs traditionally used for cognitive support.',
              image: 'http://obscura.solutions/assets/icons/mental-health.png',
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
      slides: [
        {
          title: 'Advanced Anti-Ageing Solutions',
          description:
            'Rejuvenate your skin and reduce the signs of ageing with our advanced products.',
          image: 'http://obscura.solutions/assets/images/skincare.webp',
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
          image: 'http://obscura.solutions/assets/images/skincare2.webp',
          template: 'col-2',
        },
        {
          title: 'Our Anti-Ageing Range',
          content:
            '<p>Discover our range of anti-ageing products, including serums, creams, and supplements, designed to rejuvenate your skin and enhance its natural beauty.</p>',
          image: 'http://obscura.solutions/assets/images/generic1.webp',
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
              image: 'http://obscura.solutions/assets/icons/skincare.png',
              classes: 'icon',
            },
            {
              title: 'Improves Elasticity',
              subtitle: 'Firm & Tight',
              content:
                "Enhance your skin's elasticity and firmness with our advanced formulations.",
              image: 'http://obscura.solutions/assets/icons/muscle.png',
              classes: 'icon',
            },
            {
              title: 'Hydration',
              subtitle: 'Moisturize & Nourish',
              content:
                'Keep your skin hydrated and nourished to maintain a healthy glow and prevent dryness.',
              image: 'http://obscura.solutions/assets/icons/moisturizer.png',
              classes: 'icon',
            },
            {
              title: 'Boosts Collagen',
              subtitle: 'Youthful Skin',
              content:
                'Stimulate collagen production to support skin structure and reduce signs of ageing.',
              image: 'http://obscura.solutions/assets/icons/molecule.png',
              classes: 'icon',
            },
            {
              title: 'Fights Free Radicals',
              subtitle: 'Antioxidant Protection',
              content:
                'Protect your skin from environmental damage with powerful antioxidants.',
              image: 'http://obscura.solutions/assets/icons/immune.png',
              classes: 'icon',
            },
            {
              title: 'Evens Skin Tone',
              subtitle: 'Radiant Complexion',
              content:
                'Achieve a more even skin tone and reduce dark spots for a radiant complexion.',
              image: 'http://obscura.solutions/assets/icons/body.png',
              classes: 'icon',
            },
            {
              title: 'Reduces Puffiness',
              subtitle: 'Refresh & Revitalize',
              content:
                'Our products help reduce puffiness and dark circles, giving your eyes a refreshed look.',
              image: 'http://obscura.solutions/assets/icons/eyes-mask.png',
              classes: 'icon',
            },
            {
              title: 'Improves Texture',
              subtitle: 'Smooth & Soft',
              content:
                "Enhance your skin's texture, making it smoother and softer to the touch.",
              image: 'http://obscura.solutions/assets/icons/pore.png',
              classes: 'icon',
            },
            {
              title: 'Long-Lasting Results',
              subtitle: 'Sustained Youthfulness',
              content:
                'Enjoy long-lasting anti-ageing benefits with consistent use of our products.',
              image: 'http://obscura.solutions/assets/icons/lotion.png',
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
          image: 'http://obscura.solutions/assets/images/product.webp',
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
    this.filterCategory =
      this.filterCategory !== ''
        ? this.library.alias(this.filterCategory)
        : 'all';
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
    this.filterCategory =
      searchData.keyword !== ''
        ? this.library.alias(searchData.keyword)
        : 'all';

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
