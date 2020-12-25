import { Component, OnInit } from '@angular/core';
import { FontResolverService } from 'src/app/services/font-resolver.service';
import { ResolvedFontsService } from 'src/app/services/resolved-fonts.service';

@Component({
  selector: 'app-font-grabber',
  templateUrl: './font-grabber.component.html',
  styleUrls: ['./font-grabber.component.css']
})
export class FontGrabberComponent implements OnInit {
  url: string | null = null;
  errorMessage: string | null = null;
  loading: boolean = false;

  constructor(private fontSvc: FontResolverService, private resolvedFontSvc: ResolvedFontsService) { }

  ngOnInit(): void {

  }

  stopFetching() {
    this.fontSvc.stopFetching();
  }

  async getFonts() {
    this.stopFetching();
    this.errorMessage = null;
    this.loading = true;
    this.resolvedFontSvc.clear();

    if (this.url && this.isValidHttpUrl(this.url)) {
      this.errorMessage = await this.fontSvc.resolve(this.url);
    } else {
      this.errorMessage = 'Please provide a valid URL';
    }

    this.loading = false;
  }

  /**
   * Gets if a string is a valid URL
   * @param urlStr 
   */
  private isValidHttpUrl(urlStr: string) {
    let url: URL;
    try {
      url = new URL(urlStr);
    }
    catch {
      return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
  }
}
