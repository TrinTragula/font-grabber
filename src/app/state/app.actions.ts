import { createAction, props } from "@ngrx/store";
import { ResolvedFont } from "../shared/ResolvedFont";

export const clearResolvedFonts = createAction(
    '[Font resolver] Clear all resolved fonts',
);

export const loadFontsFromUrl = createAction(
    '[Font resolver] Load fonts from url',
    props<{ url: string }>()
);

export const fontFound = createAction(
    '[Font resolver] Font found',
    props<{ resolvedFont: ResolvedFont }>()
);

export const loadFontsFromUrlError = createAction(
    '[Font resolver] Error while loading fonts from URL',
    props<{ errorMessage: string }>()
);

export const stopSearching = createAction(
    '[Font resolver] Stop searching',
)
