import { createFeatureSelector, createSelector } from "@ngrx/store";
import { State } from "./app.reducer";

const featureSelector = createFeatureSelector<State>('state');

export const getErrorMessage = createSelector(
    featureSelector,
    (state) => state.errorMessage
);

export const getLoading = createSelector(
    featureSelector,
    (state) => state.loading
);

export const getResolvedFonts = createSelector(
    featureSelector,
    (state) => state.resolvedFonts
);

export const getSearchedUrl = createSelector(
    featureSelector,
    (state) => state.searchedUrl
);