// src/app/content-editable.directive.ts

import {
  Input,
  Output,
  EventEmitter,
  Directive,
  ElementRef,
  HostListener,
  AfterViewInit,
  SimpleChanges,
  OnChanges,
} from '@angular/core';

@Directive({
  selector: '[contenteditableModel]',
  /*host: {
    '(keyup)': 'onKeyup()',
  },*/
})
export class ContentEditableDirective implements OnChanges {
  @Input('contenteditableModel') model!: string;
  @Output('contenteditableModelChange') update = new EventEmitter<string>();

  private lastViewModel = '';
  private range: Range | null = null;
  private cursorPosition: { node: Node; offset: number } | null = null;

  constructor(private el: ElementRef) {}

  @HostListener('input') onInput() {
    this.removeEmptyBr();
    this.saveCursorPosition();
    const value = this.el.nativeElement.innerHTML;
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

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['model'] &&
      changes['model'].currentValue !== this.lastViewModel
    ) {
      this.refreshView();
    }
  }

  private saveCursorPosition() {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      this.cursorPosition = {
        node: range.startContainer,
        offset: range.startOffset,
      };
    }
  }

  private restoreCursorPosition() {
    if (this.cursorPosition) {
      const selection = window.getSelection();
      const range = document.createRange();
      //const node = this.cursorPosition.node;
      const node = this.el.nativeElement.firstChild;
      const offset = this.cursorPosition.offset;

      // Check if the node is still valid and if the offset is within bounds
      if (node.nodeType === Node.TEXT_NODE && node.textContent) {
        const textLength = node.textContent.length;
        const validOffset = Math.min(offset, textLength);

        range.setStart(node, validOffset);
        range.collapse(true);

        selection?.removeAllRanges();
        selection?.addRange(range);

        // Ensure the contenteditable div is focused
        (this.el.nativeElement as HTMLElement).focus();
      } else {
        console.error('Invalid node or offset');
      }
    }
  }

  private refreshView() {
    const cursorPosition = this.cursorPosition;
    this.el.nativeElement.innerHTML = this.model;
    // Ensure the contenteditable div is focused before restoring cursor
    (this.el.nativeElement as HTMLElement).focus();
    this.restoreCursorPosition();
  }
}
