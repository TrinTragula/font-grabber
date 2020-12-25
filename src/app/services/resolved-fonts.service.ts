import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ResolvedFont } from '../shared/ResolvedFont';
import { FontResolverService } from './font-resolver.service';

@Injectable({
  providedIn: 'root'
})
export class ResolvedFontsService {
  private resolvedFonts: ResolvedFont[] = []
  private observableResolvedFonts = new BehaviorSubject<ResolvedFont[]>([]);

  constructor(private fontSvc: FontResolverService) {
    this.fontSvc.resolvedFont.subscribe((font) => {
      this.resolvedFonts.push(font);
      this.observableResolvedFonts.next(this.resolvedFonts);
    });
  }

  clear() {
    this.resolvedFonts = [];
    this.observableResolvedFonts.next(this.resolvedFonts);
  }

  get fonts(): Observable<ResolvedFont[]> {
    return this.observableResolvedFonts.asObservable()
  }

}
