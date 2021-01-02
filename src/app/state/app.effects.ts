import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { FontResolverService } from '../services/font-resolver.service';
import * as AppActions from './app.actions';
import { map, catchError, switchMap } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';

@Injectable()
export class AppEffects {
  constructor(private actions$: Actions, private fontResolverSvc: FontResolverService) { }

  resolveFonts$ = createEffect(() => this.actions$.pipe(
    ofType(AppActions.loadFontsFromUrl, AppActions.stopSearching),
    switchMap(action => {
      if ('url' in action) {
        return this.fontResolverSvc.resolve(action.url)
          .pipe(
            map(
              font => AppActions.fontFound({ resolvedFont: font })
            ),
            catchError((err: Error) => of(AppActions.loadFontsFromUrlError({ errorMessage: err.message })))
          );
      } else {
        // We just want to stop listening to the previous observable
        return EMPTY;
      }
    })
  ))
}
