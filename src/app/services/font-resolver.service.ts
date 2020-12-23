import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ResolvedFont } from '../shared/ResolvedFont';

@Injectable({
  providedIn: 'root'
})
export class FontResolverService {
  private base_url = "https://cors-anywhere.herokuapp.com/"
  resolvedFonts: Subject<ResolvedFont[]> = new Subject<ResolvedFont[]>();

  constructor() { }

  /**
   * Resovles fonts at the provided URL.
   * Returns a string with an error message, if present
   * @param url The URL to get fonts from
   */
  async resolve(url: string): Promise<string | null> {
    const response = await fetch(this.base_url + url);
    const text = await response.text();

    //TODO PARSE TEXT
    // https?:\/\/(?:[A-Za-z0-9\-]+\.)+(?:[A-Za-z0-9\-]+\/)+([A-Za-z0-9\-]+\.woff)[^\w]


    this.resolvedFonts.next([
      new ResolvedFont(url, 'google.com'),
      new ResolvedFont(url, 'google.com'),
      new ResolvedFont(url, 'google.com'),
      new ResolvedFont(url, 'google.com'),
    ]);

    return null;
  }
}
