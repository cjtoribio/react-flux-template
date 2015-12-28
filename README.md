# cjtoribio/react-flux-template

Starter template for react and flux. Forked from react-starter.

## Features

* Compilation with webpack
* React and jsx
* react-router
* Stylesheets can be CSS, LESS, SASS, Stylus or mixed
* Embedded resources like images or fonts use DataUrls if appropriate
* A simple flag loads a react component (and dependencies) on demand.
* Development
  * Development server
  * Hot React Development
  * Uses SourceUrl for performance, but you may switch to SourceMaps easily
* Production
  * Server example for prerendering for React components
  * Initial data inlined in page
  * Long Term Caching through file hashes enabled
  * Generate separate css file to avoid FOUC
  * Minimized CSS and javascript
* Also supports coffee-script files if you are more a coffee-script person.
* You can also require markdown or text files for your content.

## Local Installation

Install [node.js](https://nodejs.org) or [io.js](https://iojs.org)

Just clone this repo and change the `origin` git remote.

``` text
npm install
```



## Development server

### Hot Static Server

```
# Start webpack server
npm run dev-server
```

### App Server

```
# Start node.js server in development mode
npm run start-dev
```




## Production compilation and server

``` text
# build the client bundle and the prerendering bundle
npm run build

# start the node.js server in production mode
npm run start

# open this url in your browser
http://localhost:8080/
```

The configuration is `webpack-production.config.js`.

The server is at `lib/server.js`

The production setting builds two configurations: one for the client (`build/public`) and one for the serverside prerendering (`build/prerender`).


## Legacy static assets

Assets in `public` are also served.


## Build visualization

Used by `server.js` to prerender source paths

After a production build you may want to visualize your modules and chunks tree.


## Common changes to the configuration

### Add more entry points

(for a multi page app)

1. Add an entry point to `make-webpack-config.js` (`var entry`).
2. Add a new top-level react component in `app` (`xxxRoutes.js`, `xxxStoreDescriptions.js`, `xxxStores.js`).
3. (Optional) Enable `commonsChunk` in `webpack-production.config.js` and add `<script src="COMMONS_URL"></script>` to `app/prerender.html`.
4. Modify the server code to require, serve and prerender the other entry point.
5. Restart compilation.

### SourceMaps

Change `devtool` property in `webpack-dev-server.config.js` to:
* `eval` for fastest compilation but ugly sources.
* `eval-source-maps` for fast compilation but ugly file names. i.e. app?23
* `source-maps` for slow compilation but original file and name.
SourceMaps have a performance impact on compilation.
