import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ResolvedFont } from 'src/app/shared/ResolvedFont';
import { getResolvedFonts } from 'src/app/state/app.selectors';

@Component({
  selector: 'app-font-list',
  templateUrl: './font-list.component.html',
  styleUrls: ['./font-list.component.css']
})
export class FontListComponent implements OnInit {
  @Input() sampleText: string = 'The quick brown fox jumps over the lazy dog';
  fonts$!: Observable<ResolvedFont[] | null>;

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.fonts$ = this.store.select(getResolvedFonts);
  }
}
