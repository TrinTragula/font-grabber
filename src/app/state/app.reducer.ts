import { Action, createReducer, on } from "@ngrx/store";
import { ResolvedFont } from "../shared/ResolvedFont";
import * as Actions from "./app.actions";

export interface State {
    resolvedFonts: ResolvedFont[] | null,
    loading: boolean,
    errorMessage: string,
    searchedUrl: string
}

const initialState: State = {
    resolvedFonts: null,
    loading: false,
    errorMessage: '',
    searchedUrl: ''
};

const fontReducer = createReducer<State>(
    initialState,
    on(Actions.clearResolvedFonts, (state): State => {
        return {
            ...state,
            resolvedFonts: null
        };
    }),
    on(Actions.loadFontsFromUrl, (state, action): State => {
        return {
            ...state,
            errorMessage: '',
            loading: true,
            searchedUrl: action.url
        }
    }),
    on(Actions.fontFound, (state, action): State => {
        const resolvedFonts = state.resolvedFonts ? [...state.resolvedFonts] : [];
        resolvedFonts.push(action.resolvedFont);
        return {
            ...state,
            errorMessage: '',
            resolvedFonts: resolvedFonts
        };
    }),
    on(Actions.loadFontsFromUrlError, (state, action): State => {
        return {
            ...state,
            resolvedFonts: null,
            loading: false,
            errorMessage: action.errorMessage
        };
    }),
    on(Actions.stopSearching, (state): State => {
        return {
            ...state,
            loading: false,
            resolvedFonts: state.resolvedFonts ? state.resolvedFonts : []
        }
    })
);

export function reducer(state: State | undefined, action: Action) {
    return fontReducer(state, action);
}