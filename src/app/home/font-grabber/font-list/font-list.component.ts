import { Component, OnInit } from '@angular/core';
import { FontResolverService } from 'src/app/services/font-resolver.service';
import { ResolvedFont } from 'src/app/shared/ResolvedFont';

@Component({
  selector: 'app-font-list',
  templateUrl: './font-list.component.html',
  styleUrls: ['./font-list.component.css']
})
export class FontListComponent implements OnInit {
  fonts: ResolvedFont[] = [];

  constructor(private fontSvc: FontResolverService) { }

  ngOnInit(): void {
    this.fontSvc.resolvedFonts.subscribe((fonts) => {
      this.fonts = fonts;
    });
  }
}
