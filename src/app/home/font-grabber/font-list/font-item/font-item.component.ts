import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ResolvedFont } from 'src/app/shared/ResolvedFont';
import * as FontFaceObserver from 'fontfaceobserver';

@Component({
  selector: 'app-font-item',
  templateUrl: './font-item.component.html',
  styleUrls: ['./font-item.component.css']
})
export class FontItemComponent implements OnInit {
  @Input("font") resolvedFont!: ResolvedFont;
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  @Input() sampleText: string = 'The quick brown fox jumps over the lazy dog'
  showSampleText: boolean = false;
  private fontName: string = '';

  constructor() { }

  ngOnInit() {
    // We assign a random name to avoid collision
    this.fontName = this.resolvedFont.name + Math.floor(Math.random() * 100000);

    // We dinamycally append to the HTML page a style block to dynamically load the font-face
    let style = document.createElement('style');
    style.innerText = `
      @font-face {
        font-family: '${this.fontName}';
        src: url('${this.resolvedFont.url}');
        font-display: block;
      };
    `;
    document.head.appendChild(style);

    var font = new FontFaceObserver(this.fontName);
    font.load().then(() => {
      // OK
      this.showSampleText = true;
    }, () => {
      // Font doesn't load properly
      this.showSampleText = false;
    });
  }

  fontStyle() {
    return `font-family: '${this.fontName}'; font-size: 33px;`;
  }

}
