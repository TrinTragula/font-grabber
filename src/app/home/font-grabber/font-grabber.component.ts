import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import * as Actions from 'src/app/state/app.actions';
import { State } from 'src/app/state/app.reducer';
import { getErrorMessage, getLoading, getSearchedUrl } from 'src/app/state/app.selectors';

@Component({
  selector: 'app-font-grabber',
  templateUrl: './font-grabber.component.html',
  styleUrls: ['./font-grabber.component.css']
})
export class FontGrabberComponent implements OnInit, OnDestroy {
  private sub!: Subscription;
  url: string = '';
  errorMessage$!: Observable<string>;
  loading$!: Observable<boolean>;

  constructor(private store: Store<State>) { }

  ngOnInit(): void {
    this.errorMessage$ = this.store.select(getErrorMessage);
    this.loading$ = this.store.select(getLoading);
    this.sub = this.store.select(getSearchedUrl).subscribe(
      (searchedURL) => this.url = searchedURL
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  stopFetching() {
    this.store.dispatch(Actions.stopSearching());
  }

  getFonts() {
    this.stopFetching();
    this.store.dispatch(Actions.clearResolvedFonts());
    this.store.dispatch(Actions.loadFontsFromUrl({
      url: this.url
    }));
  }
}
