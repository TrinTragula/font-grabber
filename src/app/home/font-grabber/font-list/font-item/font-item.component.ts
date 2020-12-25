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

  constructor() { }

  ngOnInit() {

  }

  async ngAfterViewInit(): Promise<void> {
    this.fixCanvas();
    const ctx = this.canvas.nativeElement.getContext('2d');
    this.resolvedFont.font.draw(ctx!, 'The quick brown fox jumps over the lazy dog', 0, 32, 33);
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
