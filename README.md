# ext

## Prerequisites

To run this browser extension, you'll first need to have a version of [Mozilla Firefox](https://www.mozilla.org/en-US/firefox/new/) installed on your computer.

As the dev tools are dependent on `npm`, also make sure that you have a [Node](https://nodejs.org/en/) installation on your machine (the latest the better)!

## Installation

To install the extension dependencies, simply run:
```
npm install
```

This will install the only dev dependency of this project: `web-ext`, a tool provided by Mozilla to build WebExtensions.

## Running the app in development

As the publication process is quite heavy for web extensions, the best is to run it locally.

To do so, simply run:
```
npm start
```

This command should open a new Mozilla Firefox window with the browser extension installed!

> NB: in some rare cases the connection between the popup and the background script won't work, in that case simply close the Mozilla Firefox window, stop the dev server and run `npm start` again.
