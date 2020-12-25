import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ResolvedFont } from '../shared/ResolvedFont';

import { load as openTypeFontLoad } from 'opentype.js';

const FILES_REGEX: RegExp = /(?:https?\:\/\/){0,1}(?:[A-Za-z0-9\-]+\.)*(?:[A-Za-z0-9\-\_\.]+\/)+([A-Za-z0-9\-\_\.]+)\.(\w+)/gim;
const FONT_EXTENSIONS: string[] = ['ttf', 'otf', 'woff']; //, 'woff2', 'eot'];
const INTERESTING_FILES_EXTENSIONS: string[] = ['css', 'js'];

@Injectable({
  providedIn: 'root'
})
export class FontResolverService {
  private base_url = 'https://cors-anywhere.herokuapp.com/'
  private alreadyDone: string[] = [];
  private resolvedFontsInternal: string[] = [];
  private stop: boolean = false;
  resolvedFont: Subject<ResolvedFont> = new Subject<ResolvedFont>();

  constructor() { }

  stopFetching() {
    this.stop = true;
  }

  /**
   * Resolves fonts at the provided URL.
   * Returns a string with an error message, if present
   * @param url The URL to get fonts from
   */
  async resolve(url: string): Promise<string | null> {
    this.stop = false;
    this.alreadyDone = [];
    this.resolvedFontsInternal = [];
    await this.extractFonts(url);

    return null;
  }

  private async extractFonts(url: string, depth: number = 0): Promise<any> {
    // TODO:
    // - Gestire path locali
    // - Gestire ricursione massima
    // - Appena trovi un font aggiugnerlo ad un'array osservabile così da far aggiornare subito la UI
    // - Renderlo fire and forget con gestione di race condition nell'aggiunere font all'array

    if (this.stop) return; // Process was stopped
    if (this.alreadyDone.includes(url)) return;
    if (depth > 3) return; // Don't venture too deep

    try {
      console.log("Fetching: ", url);
      this.alreadyDone.push(url);
      const response = await fetch(this.base_url + url);
      const text = await response.text();
      if (this.stop) return;

      let regexResult = null;
      let promises: Promise<void>[] = [];
      do {
        regexResult = FILES_REGEX.exec(text);
        if (regexResult && regexResult.length >= 3) {
          const newUrl = (new URL(regexResult[0], url)).href;
          const extension = regexResult[2].toLowerCase();

          if (FONT_EXTENSIONS.includes(extension)) {
            // Don't add it again if it already exists
            if (!this.resolvedFontsInternal.find(u => u === newUrl)) {
              this.resolvedFontsInternal.push(newUrl);
              this.tryAddFont(newUrl, extension);
            }
          } else if (INTERESTING_FILES_EXTENSIONS.includes(extension)) {
            promises.push(this.extractFonts(newUrl, depth + 1));
          }
        }
      } while (regexResult);

      return Promise.all(promises);
    } catch {

    }

    return;
  }

  private async tryAddFont(url: string, extension: string) {
    if (this.stop) return;
    const proxied_url = this.base_url + url;

    try {
      const font = await openTypeFontLoad(proxied_url);

      if (font?.names?.fontFamily) {
        const resolvedFont = new ResolvedFont(
          url,
          font.names.fullName ? font.names.fullName["en"] : '',
          extension as 'ttf' | 'otf' | 'woff' | 'woff2' | 'eot',
          font,
          font.names.fontFamily ? font.names.fontFamily["en"] : '',
          font.names.fontSubfamily ? font.names.fontSubfamily["en"] : '',
          font.names.version ? font.names.version["en"] : '',
          font.names.licenseURL ? font.names.licenseURL["en"] : ''
        );

        this.resolvedFont.next(resolvedFont);
      }
    } catch (err) {

    }
  }
}
