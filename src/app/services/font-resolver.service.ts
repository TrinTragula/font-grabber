import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ResolvedFont } from '../shared/ResolvedFont';

const FILES_REGEX: RegExp = /(?:https?\:\/\/){0,1}(?:[A-Za-z0-9\-]+\.)+(?:[A-Za-z0-9\-\_\.]+\/)+([A-Za-z0-9\-\_\.]+)\.(\w+)/gim;
const FONT_EXTENSIONS: string[] = ['ttf', 'otf', 'woff', 'woff2', 'eot'];
const INTERESTING_FILES_EXTENSIONS: string[] = ['css', 'js'];

interface RegexResult {
  full: string,
  fileName: string,
  extension: 'ttf' | 'otf' | 'woff' | 'woff2' | 'eot'
}


@Injectable({
  providedIn: 'root'
})
export class FontResolverService {
  private base_url = 'https://cors-anywhere.herokuapp.com/'
  private alreadyDone: string[] = [];
  resolvedFonts: Subject<ResolvedFont[]> = new Subject<ResolvedFont[]>();

  constructor() { }

  /**
   * Resolves fonts at the provided URL.
   * Returns a string with an error message, if present
   * @param url The URL to get fonts from
   */
  async resolve(url: string): Promise<string | null> {
    this.alreadyDone = [];
    const fonts = await this.extractFonts(url);
    let result = fonts.map(f => new ResolvedFont(f.full, f.fileName, f.extension))
    
    // TODO
    // RIMUVOERE
    result = result.filter(f => f.extension !== 'eot');

    this.resolvedFonts.next(result);

    return null;
  }

  private async extractFonts(url: string): Promise<RegexResult[]> {
    // TODO:
    // - Gestire path locali
    // - Gestire ricursione massima
    // - Appena trovi un font aggiugnerlo ad una rray osservabile così da far aggiornare subito la UI

    if (this.alreadyDone.includes(url)) return [];

    let fonts: RegexResult[] = [];
    try {
      const response = await fetch(this.base_url + url);
      const text = await response.text();
      this.alreadyDone.push(url);

      const regexResults: RegexResult[] = [];
      let regexResult = null;
      do {
        regexResult = FILES_REGEX.exec(text);
        if (regexResult && regexResult.length >= 3) regexResults.push({
          full: regexResult[0],
          fileName: regexResult[1],
          extension: regexResult[2].toLowerCase() as 'ttf' | 'otf' | 'woff' | 'woff2' | 'eot'
        });
      } while (regexResult);

      fonts = regexResults.filter(f => FONT_EXTENSIONS.includes(f.extension));
      let interestingFiles = regexResults.filter(f => INTERESTING_FILES_EXTENSIONS.includes(f.extension));

      console.log(url, fonts.length);

      for (let interestingFile of interestingFiles) {
        var childFonts = await this.extractFonts(interestingFile.full);
        fonts.push(...childFonts);
      }
    } catch {

    }

    return fonts;
  }
}
