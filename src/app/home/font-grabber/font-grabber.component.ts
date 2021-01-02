import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as Actions from 'src/app/state/app.actions';
import { State } from 'src/app/state/app.reducer';
import { getErrorMessage, getLoading } from 'src/app/state/app.selectors';

@Component({
  selector: 'app-font-grabber',
  templateUrl: './font-grabber.component.html',
  styleUrls: ['./font-grabber.component.css']
})
export class FontGrabberComponent implements OnInit {
  url: string = '';
  errorMessage$!: Observable<string>;
  loading$!: Observable<boolean>;


  constructor(private store: Store<State>) { }

  ngOnInit(): void {
    this.errorMessage$ = this.store.select(getErrorMessage);
    this.loading$ = this.store.select(getLoading);
  }

  stopFetching() {
    this.store.dispatch(Actions.stopSearching());
  }

  async getFonts() {
    this.stopFetching();

    this.store.dispatch(Actions.clearResolvedFonts());
    this.store.dispatch(Actions.loadFontsFromUrl({
      url: this.url
    }));
  }
}
