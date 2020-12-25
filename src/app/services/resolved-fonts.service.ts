import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ResolvedFont } from '../shared/ResolvedFont';
import { FontResolverService } from './font-resolver.service';

@Injectable({
  providedIn: 'root'
})
export class ResolvedFontsService {
  private resolvedFonts: ResolvedFont[] | null = null;
  private observableResolvedFonts = new BehaviorSubject<ResolvedFont[] | null>(null);

  constructor(private fontSvc: FontResolverService) {
    this.fontSvc.resolvedFont.subscribe((font) => {
      if (!this.resolvedFonts) this.resolvedFonts = [];
      this.resolvedFonts.push(font);
      this.observableResolvedFonts.next(this.resolvedFonts);
    });
  }

  clear() {
    this.resolvedFonts = null;
    this.observableResolvedFonts.next(this.resolvedFonts);
  }

  get fonts(): Observable<ResolvedFont[] | null> {
    return this.observableResolvedFonts.asObservable();
  }

}
