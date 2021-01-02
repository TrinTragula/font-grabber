import { Injectable } from '@angular/core';
import { EMPTY, Observable, Subject, Subscription } from 'rxjs';
import { ResolvedFont } from '../shared/ResolvedFont';
import { HttpClient } from '@angular/common/http'

import { load as openTypeFontLoad } from 'opentype.js';
import { catchError, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { stopSearching } from '../state/app.actions';

const FILES_REGEX: RegExp = /(?:https?\:\/\/)?(?:[A-Za-z0-9\-]+\.)*(?:[A-Za-z0-9\-\_\.]+\/)+([A-Za-z0-9\-\_\.]+)\.(\w+)/gim;
const GOOGLE_FONTS_REGEX: RegExp = /http(s)?\:\/\/fonts\.googleapis\.com\/css[^"'\(\)]*/gim;
const IFRAME_REGEX: RegExp = /<iframe.*src\=['"]+(.*)['"]+.*<\/iframe>/gim;
const FONT_EXTENSIONS: string[] = ['ttf', 'otf', 'woff', 'woff2']; //, 'eot'];
const OPENTYPE_SUPPORTED_EXTENSIONS: string[] = ['ttf', 'otf', 'woff'];
const INTERESTING_FILES_EXTENSIONS: string[] = ['css', 'js'];
const RELATIVE_URL_REGEX = /^(?:[a-z]+:)?\/\//i;

@Injectable({
  providedIn: 'root'
})
export class FontResolverService {
  private base_url = 'https://api.allorigins.win/raw?url=' // 'https://cors-anywhere.herokuapp.com/'
  private alreadyDone: string[] = [];
  private resolvedFontsInternal: string[] = [];
  private resolvedFont: Subject<ResolvedFont> = new Subject<ResolvedFont>();
  private requestCounter = 0;

  constructor(private http: HttpClient, private store: Store) { }

  /**
   * Resolves fonts at the provided URL.
   * Returns a string with an error message, if present
   * @param url The URL to get fonts from
   */
  resolve(url: string): Observable<ResolvedFont> {
    this.alreadyDone = [];
    this.resolvedFontsInternal = [];
    this.requestCounter = 0;
    if (this.resolvedFont) this.resolvedFont.complete();
    this.resolvedFont = new Subject<ResolvedFont>();

    this.extractFonts(url);

    return this.resolvedFont;
  }

  /**
   * Gets if a string is a valid URL
   * @param urlStr 
   */
  private isValidHttpUrl(urlStr: string): boolean {
    let url: URL;
    try {
      url = new URL(urlStr);
    }
    catch {
      return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
  }

  private decrementIndex() {
    this.requestCounter = Math.max(this.requestCounter - 1, 0);
    if (this.requestCounter === 0) {
      this.store.dispatch(stopSearching());
    }
  }

  private extractFonts(url: string, depth: number = 0): void {
    if (url && !url.startsWith('http')) {
      url = `http://${url}`;
    }

    // Check if the starting url is valid
    if (depth == 0 && !this.isValidHttpUrl(url)) {
      this.resolvedFont.error(new Error('Please provide a valide URL'));
      return;
    }

    if (this.alreadyDone.includes(url)) return;
    if (depth > 2) return; // Don't venture too deep

    // console.log("Fetching: ", url);
    this.requestCounter++;
    this.alreadyDone.push(url);
    this.http.get(this.base_url + url, { responseType: 'text' })
      .pipe(
        take(1),
        catchError(() => {
          this.decrementIndex();
          console.log('Error while fetching: ' + url);
          return EMPTY;
        }),
      )
      .subscribe(text => {
        this.getFontsFromHTML(url, text, depth);
        this.decrementIndex();
      });

    return;
  }

  private isURLRelative(url: string): boolean {
    return RELATIVE_URL_REGEX.test(url);
  }

  private getFontsFromHTML(url: string, text: string, depth: number) {
    let regexResult = null;

    // Files
    do {
      regexResult = FILES_REGEX.exec(text);
      if (regexResult && regexResult.length >= 3) {
        const newUrl = this.isURLRelative(regexResult[0])
          ? (new URL(regexResult[0], url)).href
          : regexResult[0];
        const extension = regexResult[2].toLowerCase();

        if (FONT_EXTENSIONS.includes(extension)) {
          // Don't add it again if it already exists
          if (!this.resolvedFontsInternal.find(u => u === newUrl)) {
            this.resolvedFontsInternal.push(newUrl);
            this.tryAddFont(newUrl, regexResult[1], extension);
          }
        } else if (INTERESTING_FILES_EXTENSIONS.includes(extension)) {
          this.extractFonts(newUrl, depth + 1);
        }
      }
    } while (regexResult);

    // Google fonts
    do {
      regexResult = GOOGLE_FONTS_REGEX.exec(text);
      if (regexResult) {
        const newUrl = this.isURLRelative(regexResult[0])
          ? (new URL(regexResult[0], url)).href
          : regexResult[0];
        this.extractFonts(newUrl, depth + 1);
      }
    } while (regexResult);

    //Iframes
    do {
      regexResult = IFRAME_REGEX.exec(text);
      if (regexResult) {
        const newUrl = this.isURLRelative(regexResult[1])
          ? (new URL(regexResult[1], url)).href
          : regexResult[0];
        this.extractFonts(newUrl, depth + 1);
      }
    } while (regexResult);
  }

  private async tryAddFont(url: string, fallbackName: string, extension: string) {
    if (!url.includes('http')) {
      url = 'https://' + url;
    }
    if (url.includes('http') && !url.includes('https')) {
      url = url.replace('http', 'https');
    }

    const proxied_url = this.base_url + url;

    try {
      if (OPENTYPE_SUPPORTED_EXTENSIONS.includes(extension)) {
        const font = await openTypeFontLoad(proxied_url);

        if (font?.names?.fontFamily) {
          const resolvedFont = new ResolvedFont(
            url,
            font.names.fullName ? font.names.fullName["en"] : fallbackName,
            extension as 'ttf' | 'otf' | 'woff' | 'woff2' | 'eot',
            font.names.fontFamily ? font.names.fontFamily["en"] : null,
            font.names.fontSubfamily ? font.names.fontSubfamily["en"] : null,
            font.names.version ? font.names.version["en"] : null,
            font.names.licenseURL ? font.names.licenseURL["en"] : null
          );

          this.resolvedFont.next(resolvedFont);
        }

      } else {
        const resolvedFont = new ResolvedFont(
          url,
          fallbackName,
          extension as 'ttf' | 'otf' | 'woff' | 'woff2' | 'eot',
          null,
          null,
          null,
          null,
        );

        this.resolvedFont.next(resolvedFont);
      }
    } catch (err) {

    }
  }
}
