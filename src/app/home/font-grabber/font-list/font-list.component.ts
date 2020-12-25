import { Component, OnInit } from '@angular/core';
import { FontResolverService } from 'src/app/services/font-resolver.service';
import { ResolvedFontsService } from 'src/app/services/resolved-fonts.service';
import { ResolvedFont } from 'src/app/shared/ResolvedFont';

@Component({
  selector: 'app-font-list',
  templateUrl: './font-list.component.html',
  styleUrls: ['./font-list.component.css']
})
export class FontListComponent implements OnInit {
  fonts: ResolvedFont[] = [];

  constructor(private resFontSvc: ResolvedFontsService) { }

  ngOnInit(): void {
    this.resFontSvc.fonts.subscribe((newFontsList) => {
      this.fonts = newFontsList;
    })
  }
}
