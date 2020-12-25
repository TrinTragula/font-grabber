import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ResolvedFontsService } from 'src/app/services/resolved-fonts.service';
import { ResolvedFont } from 'src/app/shared/ResolvedFont';

@Component({
  selector: 'app-font-list',
  templateUrl: './font-list.component.html',
  styleUrls: ['./font-list.component.css']
})
export class FontListComponent implements OnInit, OnDestroy {
  @Input() sampleText: string = 'The quick brown fox jumps over the lazy dog';
  fonts: ResolvedFont[] | null = null;
  
  private subscription!: Subscription;

  constructor(private resFontSvc: ResolvedFontsService) { }

  ngOnInit(): void {
    this.subscription = this.resFontSvc.fonts.subscribe((newFontsList) => {
      this.fonts = newFontsList;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
