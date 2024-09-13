import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  public title: string =
    'Obscura Solutions - Your solution for a healthier lifestyle';
  public description: string =
    'Providing innovative, holistic and natural health solutions for the mind, body and the environment.';
  public keywords: string =
    'mind, body, health, natural, holistic, supplements, environment, nature, obscura, solutions';
  public image: string = 'http://obscura.solutions/assets/images/generic1.webp';

  constructor(
    private meta: Meta,
    private titleService: Title,
  ) {}

  updateTitle(title: string) {
    this.titleService.setTitle(title);
  }

  updateMetaTags(
    tags: { name?: string; property?: string; content: string }[],
  ) {
    tags.forEach((tag) => {
      if (tag.name) {
        this.meta.updateTag({ name: tag.name, content: tag.content });
      }
      if (tag.property) {
        this.meta.updateTag({ property: tag.property, content: tag.content });
      }
    });
  }

  doMeta(meta: any = false) {
    const metaTitle = meta ? meta.title + ' - ' + this.title : this.title;
    const metaDescription = meta ? meta.description : this.description;
    const metaKeywords = meta ? meta.keywords : this.keywords;
    const metaImage = meta ? meta.image : this.image;

    this.updateTitle(metaTitle);
    this.updateMetaTags([
      { name: 'description', content: metaDescription },
      { name: 'keywords', content: metaKeywords },
      { property: 'og:title', content: metaTitle },
      {
        property: 'og:description',
        content: metaDescription,
      },
      {
        property: 'og:image',
        content: metaImage,
      },
      { property: 'og:url', content: 'https://obscura.solutions/' },
      { property: 'og:type', content: 'website' },
    ]);
  }

  stripHtml(html: string): string {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  }

  getMetaDescription(description: string, maxLength: number = 160): string {
    const strippedDescription = this.stripHtml(description);
    const firstParagraph = strippedDescription
      .split('\n')
      .filter((paragraph) => paragraph.trim() !== '')[0];
    if (firstParagraph.length <= maxLength) {
      return firstParagraph;
    } else {
      return firstParagraph.substring(0, maxLength).trim() + '...';
    }
  }

  doKeywords(value: string) {
    return value
      .toLowerCase()
      .split(/[\s-]+/)
      .join(', ');
  }
}
