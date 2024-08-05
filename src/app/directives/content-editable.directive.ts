// src/app/content-editable.directive.ts

import {
  Input,
  Output,
  EventEmitter,
  Directive,
  ElementRef,
  HostListener,
  AfterViewInit,
} from '@angular/core';

@Directive({
  selector: '[contenteditableModel]',
})
export class ContentEditableDirective implements AfterViewInit {
  @Input('contenteditableModel') model!: string;
  @Output('contenteditableModelChange') update = new EventEmitter<string>();

  private lastViewModel = '';
  private range: Range | null = null;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    this.refreshView();
  }

  @HostListener('input') onInput() {
    this.removeEmptyBr();
    const value = this.el.nativeElement.innerHTML;
    this.lastViewModel = value;
    this.update.emit(value);
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

  /*private saveCursorPosition(): number {
    const selection = window.getSelection();
    return selection?.focusOffset || 0;
  }

  private restoreCursorPosition(position: number) {
    const selection = window.getSelection();
    if (selection) {
      const range = document.createRange();
      range.setStart(
        this.el.nativeElement.firstChild || this.el.nativeElement,
        position
      );
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
*/
  private saveCursorPosition(): void {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      this.range = selection.getRangeAt(0);
    }
  }

  private restoreCursorPosition() {
    if (this.range) {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(this.range);
      }
    }
  }

  private refreshView() {
    this.saveCursorPosition();
    this.el.nativeElement.innerHTML = this.model;
    this.restoreCursorPosition();
  }

  ngOnChanges() {
    if (this.model !== this.lastViewModel) {
      this.refreshView();
    }
  }
}
