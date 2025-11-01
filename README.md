# Ai Worldview Benchmark

This is an [Observable Framework](https://observablehq.com/framework/) app. To install the required dependencies, run:
```
npm install
```

Then, to start the local preview server, run:
```
npm run dev
```

Then visit <http://localhost:3000> to preview the app. For more, see [the docs](https://observablehq.com/framework/getting-started).

## Deploy instructions
⚠️ This is unusual: data is bundled with the app, so the app won't automatically show the new data when data updates on [github repo](https://github.com/open-numbers/ddf--gapminder--ai_worldview_benchmark.git). App needs to be redeployed. Waffle server is not used in this app, it's fully self-contained.

The app is deployed on Gapminder Cloudflare pages, which is connected to this GitHub repo. Pushing to `master` branch here will trigger the redeploy.

## Project structure

**`src/index.md`** - Observable framework uses Markdown instead of HTML. This is the home page.

**`src/data`** - Data loaders fetch data from [github repo](https://github.com/open-numbers/ddf--gapminder--ai_worldview_benchmark.git) using DDFCSV reader. This happens during build time. App must be rebuilt and redeployed if data changes.

**`src/components`** - JS logic and stuff

**`observablehq.config.js`** - This is the [app configuration](https://observablehq.com/framework/config) file.

## Command reference

| Command           | Description                                              |
| ----------------- | -------------------------------------------------------- |
| `npm install`        | Install or reinstall dependencies                        |
| `npm run dev`        | Start local preview server                               |
| `npm run build`      | Build your static site, generating `./dist`              |
| ~npm run deploy~     | Deploy your app to Observable (not used now)             |
| `npm run clean`      | Clear the local data loader cache                        |
| `npm run observable` | Run commands like `observable help`                      |
