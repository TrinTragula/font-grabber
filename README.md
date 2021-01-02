# FontGrabber

An angular app that lets you save fonts used (or just imported) in web pages.
As of now, it simply analyzes the static content of the web page and the referenced css or js files used in the provided url.

## Features to add

This is a list of features that I'd like to add in the future:

- [x] Be able to stop searching fonts for a website that is taking too long
- [ ] Private CORS proxy or a better workaround
- [ ] Download system fonts in case a website is using a font available through the browser
- [ ] Better detection of local file (stuff like `../../font.woff`)
