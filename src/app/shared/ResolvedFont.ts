import { Font } from "opentype.js";

export class ResolvedFont {
    constructor(
        public url: string,
        public name: string,
        public extension: 'ttf' | 'otf' | 'woff' | 'woff2' | 'eot',
        public font: Font | null,
        public family: string | null,
        public subFamily: string | null,
        public version: string | null,
        public licenseURL: string | null,
    ) { }
}