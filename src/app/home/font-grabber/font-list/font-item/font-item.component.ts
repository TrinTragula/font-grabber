import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ResolvedFont } from 'src/app/shared/ResolvedFont';

@Component({
  selector: 'app-font-item',
  templateUrl: './font-item.component.html',
  styleUrls: ['./font-item.component.css']
})
export class FontItemComponent implements OnInit, AfterViewInit {
  @Input("font") resolvedFont!: ResolvedFont;
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  @Input() sampleText: string = 'The quick brown fox jumps over the lazy dog'
  private fontName: string = '';

  constructor() { }

  ngOnInit() {
    this.fontName = this.resolvedFont.name + Math.floor(Math.random() * 100000);
  }

  fontStyle() {
    return `font-family: '${this.fontName}', Fallback, sans-serif; font-size: 33px;`;
  }

  async ngAfterViewInit(): Promise<void> {
    let style = document.createElement('style');
    style.innerText = `
      @font-face {
        font-family: '${this.fontName}';
        src: url('${this.resolvedFont.url}');
      };
    `;
    document.head.appendChild(style);
  }

}
