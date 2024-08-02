// src/app/content-editable.directive.ts

import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appContentEditable]',
})
export class ContentEditableDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input') onInput() {
    this.removeEmptyBr();
  }

  @HostListener('blur') onBlur() {
    this.removeEmptyBr();
  }

  private removeEmptyBr() {
    const element = this.el.nativeElement;
    if (element.innerHTML === '<br>') {
      element.innerHTML = '';
    }
  }
}
