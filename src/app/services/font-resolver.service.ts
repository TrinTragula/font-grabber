import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ResolvedFont } from '../shared/ResolvedFont';


const FILES_REGEX: RegExp = /(?:https?\:\/\/){0,1}(?:[A-Za-z0-9\-]+\.)+(?:[A-Za-z0-9\-\_\.]+\/)+([A-Za-z0-9\-\_\.]+)\.(\w+)/gim;
const FONT_EXTENSIONS: string[] = ['ttf', 'otf', 'woff']; //, 'woff2', 'eot'];
const INTERESTING_FILES_EXTENSIONS: string[] = ['css', 'js'];

@Injectable({
  providedIn: 'root'
})
export class FontResolverService {
  private base_url = 'https://cors-anywhere.herokuapp.com/'
  private alreadyDone: string[] = [];
  private resolvedFontsInternal: ResolvedFont[] = [];
  resolvedFont: Subject<ResolvedFont> = new Subject<ResolvedFont>();

  constructor() { }

  /**
   * Resolves fonts at the provided URL.
   * Returns a string with an error message, if present
   * @param url The URL to get fonts from
   */
  async resolve(url: string): Promise<string | null> {
    this.alreadyDone = [];
    this.resolvedFontsInternal = [];
    await this.extractFonts(url);
    console.log('DONE');

    return null;
  }

  private async extractFonts(url: string): Promise<void> {
    // TODO:
    // - Gestire path locali
    // - Gestire ricursione massima
    // - Appena trovi un font aggiugnerlo ad un'array osservabile così da far aggiornare subito la UI
    // - Renderlo fire and forget con gestione di race condition nell'aggiunere font all'array

    if (this.alreadyDone.includes(url)) return;

    console.log('Fetching:', url);

    try {
      const response = await fetch(this.base_url + url);
      const text = await response.text();
      this.alreadyDone.push(url);

      let regexResult = null;
      do {
        regexResult = FILES_REGEX.exec(text);
        if (regexResult && regexResult.length >= 3) {
          const url = regexResult[0];
          const extension = regexResult[2].toLowerCase();

          if (FONT_EXTENSIONS.includes(extension)) {
            // Don't add it again if it already exists
            if (!this.resolvedFontsInternal.find(f => f.url === url)) {
              var font = new ResolvedFont(
                url,
                regexResult[1],
                extension as 'ttf' | 'otf' | 'woff' | 'woff2' | 'eot'
              );
              this.resolvedFontsInternal.push(font);
              this.resolvedFont.next(font);
            }
          } else if (INTERESTING_FILES_EXTENSIONS.includes(extension)) {
            await this.extractFonts(url);
          }
        }
      } while (regexResult);
    } catch {
      console.log("Errore");
    }
    return;
  }
}
