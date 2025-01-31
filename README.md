# Ai Worldview Benchmark
This is an [Observable Framework](https://observablehq.com/framework/) app. To install the required dependencies, run:
```
npm install
```

Then, to start the local preview server, run:
```
npm run dev
```

Then visit <http://localhost:3000> to preview the app.
For more, see <https://observablehq.com/framework/getting-started>.

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
| `npm run deploy`     | Deploy your app to Observable                            |
| `npm run clean`      | Clear the local data loader cache                        |
| `npm run observable` | Run commands like `observable help`                      |
