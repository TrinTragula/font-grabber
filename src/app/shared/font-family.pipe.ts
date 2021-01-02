import { Pipe, PipeTransform } from '@angular/core';
import { ResolvedFont } from './ResolvedFont';

/**
 * Displays the family and sub family of a font in a nice formatted way
 */
@Pipe({
  name: 'fontFamily'
})
export class FontFamilyPipe implements PipeTransform {

  transform(value: ResolvedFont): string {
    if (value && value.family) {
      let text = value.family;
      if (value.subFamily) {
        text += ` (${value.subFamily})`
      }
      return text;
    }

    return '-';
  }

}
