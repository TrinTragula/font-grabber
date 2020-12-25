import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FontResolverService } from 'src/app/services/font-resolver.service';
import { ResolvedFontsService } from 'src/app/services/resolved-fonts.service';
import { ResolvedFont } from 'src/app/shared/ResolvedFont';

@Component({
  selector: 'app-font-list',
  templateUrl: './font-list.component.html',
  styleUrls: ['./font-list.component.css']
})
export class FontListComponent implements OnInit, OnDestroy {
  private subscription!: Subscription;
  fonts: ResolvedFont[] = [];

  constructor(private resFontSvc: ResolvedFontsService) { }

  ngOnInit(): void {
    this.subscription = this.resFontSvc.fonts.subscribe((newFontsList) => {
      this.fonts = newFontsList;
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
