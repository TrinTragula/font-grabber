import { Font } from "opentype.js";

export class ResolvedFont {
    constructor(
        public url: string,
        public name: string,
        public extension: 'ttf' | 'otf' | 'woff' | 'woff2' | 'eot',
        public font: Font,
        public family: string,
        public subFamily: string,
        public version: string,
        public licenseURL: string,
    ) { }
}