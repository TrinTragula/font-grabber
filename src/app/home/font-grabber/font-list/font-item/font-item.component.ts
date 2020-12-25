import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ResolvedFont } from 'src/app/shared/ResolvedFont';
import { load as openTypeFontLoad } from 'opentype.js';

@Component({
  selector: 'app-font-item',
  templateUrl: './font-item.component.html',
  styleUrls: ['./font-item.component.css']
})
export class FontItemComponent implements OnInit, AfterViewInit {
  @Input() font!: ResolvedFont;
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  constructor() { }

  ngOnInit() {

  }

  async ngAfterViewInit(): Promise<void> {
    const url = this.font.url.startsWith('http')
      ? 'https://cors-anywhere.herokuapp.com/' + this.font.url
      : 'https://cors-anywhere.herokuapp.com/' + 'http://' + this.font.url;

    try {
      this.fixCanvas();
      const font = await openTypeFontLoad(url);
      const ctx = this.canvas.nativeElement.getContext('2d');
      font.draw(ctx!, 'The quick brown fox jumps over the lazy dog', 0, 32, 33);
    } catch (err) {
      console.log('Font could not be loaded: ' + err);
    }
  }

  fixCanvas() {
    var pixelRatio = window.devicePixelRatio || 1;
    if (pixelRatio === 1) return;
    var oldWidth = this.canvas.nativeElement.width;
    var oldHeight = this.canvas.nativeElement.height;
    this.canvas.nativeElement.width = oldWidth * pixelRatio;
    this.canvas.nativeElement.height = oldHeight * pixelRatio;
    this.canvas.nativeElement.style.width = oldWidth + 'px';
    this.canvas.nativeElement.style.height = oldHeight + 'px';
    this.canvas.nativeElement.getContext('2d')!.scale(pixelRatio, pixelRatio);
  }

}
