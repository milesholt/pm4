import { Pipe, PipeTransform } from '@angular/core';
/*
 * Returns a verified string
 * Removes any whitespace in the string, also converts value to string.
 * This could be extended to include other formats, other than string.
 */
@Pipe({ name: 'format' })
export class FormatPipe implements PipeTransform {
  transform(value: any, format: string, params: any = []): string {
    switch (format) {
      case 'string':
        value.toString().trim();
        //console.log(value);
        break;
      case 'list':
        value.toString().split('c'); //what's with the c??
        //console.log(value);
        break;
      case 'array':
        value = value.split(',');
        break;
      case 'json':
        value = JSON.parse(value);
        //console.log(value);
        break;
      case 'json2':
        value = value;
        console.log(value);
        break;
      case 'get':
        //if(value.includes('##'+params)) value = params
        let v = value;
        value = '';
        let keys = Object.keys(params);
        keys.forEach((key) => {
          if (v.includes('##' + key)) value = params[key];
        });
        //console.log(value);
        break;
      case 'get2': //using get param with select options
        let select = params[1];
        let model = params[2];
        //console.dir(select);
        setTimeout(function () {
          for (let i = 0, len = select.length - 1; i < len; i++) {
            if (params[0] == select[i].value) {
              select.value = params[0];
              //console.log(model);
              model = params[0];
            }
          }
        }, 1000);
        break;
      case 'replaceCharacters':
        value = value.replace(/[^A-Z0-9]/gi, ' ');
        console.log(value);
        break;
      case 'eval':
        console.log(params);
        console.log(value);
        value = eval(value);
        break;

      case 'capitalise':
        value = value.replace(/\b\w/g, (char: any) => char.toUpperCase());
        break;
    }

    return value;
  }
}
