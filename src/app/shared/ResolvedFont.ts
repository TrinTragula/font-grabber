export class ResolvedFont {
    constructor(
        public url: string,
        public name: string,
        public extension: 'ttf' | 'otf' | 'woff' | 'woff2' | 'eot'
    ) { }
}