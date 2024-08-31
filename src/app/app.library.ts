//import {Platform} from "@ionic/angular";
import { Injectable } from '@angular/core';

/******************LIBRARY FUNCTIONS**********************/

@Injectable()
export class Library {
  test() {
    return 'test';
  }

  alias(value: string) {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
  }

  capitalise(value: string) {
    return value.replace(/\b\w/g, (char: any) => char.toUpperCase());
  }

  title(value: string) {
    return value
      .replace(/\b\w/g, (char: any) => char.toUpperCase())
      .replace('-', ' ');
  }

  //prepare data that needs to be modified by user
  //converts data and binds it to structure in Definitions
  //any values that match keys are bound, otherwise value is blank
  prepareData(pri: any = [], sec: any) {
    console.log(sec);
    let obj: any = {};
    Object.keys(pri).forEach((field) => {
      console.log(field);
      if (sec.hasOwnProperty(field)) obj[field] = this.deepCopy(pri[field]);
      if (Object.keys(sec).includes(field)) obj[field].value = sec[field];
    });
    console.log(obj);
    return obj;
  }

  //compile data back to server friendly structure { key : value }
  compileData(data: any = false) {
    if (!data) return;
    let obj: any = {};
    Object.keys(data).forEach((field) => {
      obj[field] = this.deepCopy(data[field].value);
    });
    return obj;
  }

  //returns length of keys in object
  objLength(object: any) {
    return Object.keys(object).length;
  }

  //returns keys in object
  objKeys(object: any) {
    if (!this.isObject(object)) return [];
    return Object.keys(object);
  }

  //returns if object is empty, the one above is 10 times slower if there are properties
  isEmpty(obj: any): boolean {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) return false;
    }

    return true;
  }

  //create a new instance of an object, avoids duplicate objects carrying same value
  newObj(object: any = {}) {
    return Object.assign({}, object);
  }

  mergeObjects(object1: any, object2: any) {
    const mergedObject = { ...object1 }; // Start with a copy of object1
    for (const key in object1) {
      if (object2.hasOwnProperty(key)) {
        mergedObject[key] = object2[key]; // Update with values from object2 if key exists
      }
    }
    return mergedObject;
  }

  //duplicates a new instance of an array
  duplicateArray(array: any = []) {
    let arr: any = [];
    array.forEach((x: number) => {
      arr.push(Object.assign({}, x));
    });
    return arr;
  }

  //merge two arrays, keeping only unique values
  mergeArray(array1: any = [], array2: any = []) {
    let arr: any = [];
    arr = [...new Set(array1.concat(array2))];
    return arr;
  }

  //delete index from array
  delete(index: number, array: any = []) {
    return array.splice(index, 1);
  }

  //in case the above don't work, this is the solution for a deep copy, but is apparently quite slow?
  deepCopy(origObj: any) {
    var newObj = origObj;
    if (origObj && typeof origObj === 'object') {
      newObj =
        Object.prototype.toString.call(origObj) === '[object Array]' ? [] : {};
      for (var i in origObj) {
        newObj[i] = this.deepCopy(origObj[i]);
      }
    }
    return newObj;
  }

  deepCopy2(obj: any): any {
    return JSON.parse(JSON.stringify(obj));
  }

  //returns true if it is an array
  isArray(value: any) {
    return Array.isArray(value) && value.constructor === Array;
  }

  //returns true if it is an object
  isObject(value: any) {
    return typeof value === 'object' && value.constructor !== Array;
  }

  //returns if objects has property
  isProperty(obj: any, prop: any) {
    return obj.hasOwnProperty(prop);
  }

  //returns true if defined
  isDefined(object: any) {
    if (typeof object === undefined || !object) {
      return false;
    } else {
      return true;
    }
  }

  //get target element
  getTargetElement(event: any) {
    return event.target.localName;
  }

  //get target (should work for all browsers)
  getTarget(obj: any) {
    var targ;
    var e = obj;
    if (e.target) targ = e.target;
    else if (e.srcElement) targ = e.srcElement;
    if (targ.nodeType == 3)
      // defeat Safari bug
      targ = targ.parentNode;
    return targ;
  }

  getArrayIndex(array: any = [], value: any, key: any = null) {
    /*if (key === null) {
      if (this.isObject(array)) return Object.keys(array).indexOf(value);
      return array.indexOf(value);
    }*/
    return array.findIndex((x: any) => x[key] === value);
  }

  decodeHtmlEntity(encodedUrl: string): string {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = encodedUrl;
    return textArea.value;
  }

  getBase64ImageFromUrl(imageUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      fetch(imageUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.blob();
        })
        .then((blob) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = reader.result as string;
            resolve(base64data);
          };
          reader.onerror = () => {
            reject(new Error('Failed to convert blob to base64'));
          };
          reader.readAsDataURL(blob);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // Utility functions for saving and restoring cursor position

  saveCursorPosition(
    editableDiv: HTMLElement
  ): { node: Node; offset: number } | null {
    const selection = window.getSelection();
    if (!selection!.rangeCount) {
      return null;
    }
    const range = selection!.getRangeAt(0);
    const preSelectionRange = range.cloneRange();
    preSelectionRange.selectNodeContents(editableDiv);
    preSelectionRange.setEnd(range.startContainer, range.startOffset);
    const start = preSelectionRange.toString().length;

    return {
      node: range.startContainer,
      offset: range.startOffset,
    };
  }

  restoreCursorPosition(
    editableDiv: HTMLElement,
    savedPosition: { node: Node; offset: number } | null
  ) {
    if (!savedPosition) {
      return;
    }
    const selection = window.getSelection();
    const range = document.createRange();
    range.setStart(savedPosition.node, savedPosition.offset);
    range.collapse(true);
    selection!.removeAllRanges();
    selection!.addRange(range);
    editableDiv.focus();
  }

  findPath(obj: any, target: any, path: string[] = []): string | null {
    console.log(obj);
    console.log(target);

    if (obj === target) {
      return path.join('.');
    }

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const result = this.findPath(obj[key], target, [...path, key]);
        if (result) {
          return result;
        }
      }
    }

    return null;
  }

  base64Url(str: string): string {
    try {
      if (this.isBase64(str)) {
        return str;
      } else {
        return btoa(str);
      }
    } catch (err) {
      console.error('Error encoding to Base64:', err);
      return ''; // Handle the error appropriately
    }
  }

  isBase64(str: string): boolean {
    try {
      // Check if the string is Base64 encoded
      return btoa(atob(str)) === str;
    } catch (err) {
      // If an error occurs, it's not a valid Base64 string
      return false;
    }
  }
}
