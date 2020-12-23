import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ResolvedFont } from 'src/app/shared/ResolvedFont';
import { load as openTypeFontLoad } from 'opentype.js';

@Component({
  selector: 'app-font-item',
  templateUrl: './font-item.component.html',
  styleUrls: ['./font-item.component.css']
})
export class FontItemComponent implements OnInit {
  @Input() font!: ResolvedFont;
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  constructor() { }

  ngOnInit(): void {
    const url = this.font.url.startsWith('http')
      ? 'https://cors-anywhere.herokuapp.com/' + this.font.url
      : 'https://cors-anywhere.herokuapp.com/' + 'http://' + this.font.url;

    openTypeFontLoad(url, (err, font) => {
      if (err) {
        console.log('Font could not be loaded: ' + err);
      } else {
        console.log('Font LOADED');
        // Now let's display it on a canvas with id "canvas"
        const ctx = this.canvas.nativeElement.getContext('2d');

        // Construct a Path object containing the letter shapes of the given text.
        // The other parameters are x, y and fontSize.
        // Note that y is the position of the baseline.
        const path = font!.getPath('The quick brown fox jumps over the lazy dog', 0, 50, 50);

        // If you just want to draw the text you can also use font.draw(ctx, text, x, y, fontSize).
        path.draw(ctx!);
      }
    });
  }

}
