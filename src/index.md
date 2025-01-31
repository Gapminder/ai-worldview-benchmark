---
title: AI Worldview Benchmark
toc: false
sidebar: false
pager: false
style: style.css
---

```js IMAGE IMPORTS
// see components/references.js
[
  FileAttachment("./assets/sdgicons/GOAL_1.svg"),
  FileAttachment("./assets/sdgicons/GOAL_2.svg"),
  FileAttachment("./assets/sdgicons/GOAL_3.svg"),
  FileAttachment("./assets/sdgicons/GOAL_4.svg"),
  FileAttachment("./assets/sdgicons/GOAL_5.svg"),
  FileAttachment("./assets/sdgicons/GOAL_6.svg"),
  FileAttachment("./assets/sdgicons/GOAL_7.svg"),
  FileAttachment("./assets/sdgicons/GOAL_8.svg"),
  FileAttachment("./assets/sdgicons/GOAL_9.svg"),
  FileAttachment("./assets/sdgicons/GOAL_10.svg"),
  FileAttachment("./assets/sdgicons/GOAL_11.svg"),
  FileAttachment("./assets/sdgicons/GOAL_12.svg"),
  FileAttachment("./assets/sdgicons/GOAL_13.svg"),
  FileAttachment("./assets/sdgicons/GOAL_14.svg"),
  FileAttachment("./assets/sdgicons/GOAL_15.svg"),
  FileAttachment("./assets/sdgicons/GOAL_16.svg"),
  FileAttachment("./assets/sdgicons/GOAL_17.svg"),
  FileAttachment("./assets/sdgicons/GOAL_other.svg"),

  FileAttachment("./assets/botlogos/anthropic.png"),
  FileAttachment("./assets/botlogos/openai.png"),
  FileAttachment("./assets/botlogos/google.png"),
  FileAttachment("./assets/botlogos/alibaba.png"),
  FileAttachment("./assets/botlogos/human.png"),
  FileAttachment("./assets/botlogos/meta.png"),
  FileAttachment("./assets/botlogos/xai.png"),
  FileAttachment("./assets/botlogos/chimp.png")
];
```
```js
import {runForceSimulation} from "./components/forceLayout.js"
import OneChartCanvas from "./components/oneChartCanvas.js"
import BotHeader from "./components/BotHeader.js"
import QuestionsCatalog from "./components/QuestionsCatalog.js"
import {botLogos, sdgGoalText, sdgcolors, sdgicons} from "./components/references.js"
```

```js 
const concepts = FileAttachment("data/concepts.csv").csv({typed: true});
const datapoints_correct_rate = await FileAttachment("data/datapoints-rates.csv").csv({typed: true});
const question = await FileAttachment("data/entities-questions.csv").csv({typed: true});
const human = question.map(m => ({question: m.question, model_configuration: "human", correct_rate: 100-(+m.human_wrong_percentage)}))
const datapoints_ratesWithHuman = datapoints_correct_rate.concat(human);
```
```js
const dataWithPrecomputedForceLayoutXY = d3.rollup(
  datapoints_ratesWithHuman,
  v => runForceSimulation({dataset: v, x: (d) => d.correct_rate, xScale, ticks: 10}),
  (d) => d.model_configuration
);
```


```js
function getChartWidth(){
  return Math.min(width * 4 /5, 2000*4/5);
}
```
```js
const margin = {right: 20, left: 20, bottom: 100, top: 0};
const xScale = d3.scaleLinear([0, 100], [margin.left, getChartWidth() - margin.right - margin.left]);
const chartHeight = ({
    canvasHeight: (innerHeight-200)/7 +100,
    singleChartHeight: (innerHeight-200)/7,
    headerShiftHeight: 30
});
```




```js 
const model_configurationWithHuman = await FileAttachment("data/entities-mdlconfigs.csv").csv({typed: true});
```
```js 
const rollup = d3.rollups(model_configurationWithHuman, v=>v.find(f => f["is--latest_model"])?.model_configuration, d => d.vendor)
  .filter(([_, f]) => dataWithPrecomputedForceLayoutXY.has(f));
const selectedModels = Object.fromEntries(rollup);
```

```js 
function getSections(){
  const height = chartHeight.canvasHeight;
  const width = getChartWidth();
  const marginTop = 0;
  const marginBottom = chartHeight.canvasHeight - chartHeight.singleChartHeight;
  function getData(vendor) {
    return dataWithPrecomputedForceLayoutXY.get(selectedModels[vendor])
  }

  const fill = (d) => sdgcolors[questionMap.get(d.question).sdg_world_topics]
  return [
    {fill, xScale, vendor: "OpenAI", data: getData("OpenAI"), height, width, marginTop: margin.top, marginBottom},
    {fill, xScale, vendor: "Anthropic", data: getData("Anthropic"), height, width, marginTop, marginBottom},
    {fill, xScale, vendor: "Google", data: getData("Google"), height, width, marginTop, marginBottom},
    {fill, xScale, vendor: "Alibaba", data: getData("Alibaba"), height, width, marginTop, marginBottom},
    {fill, xScale, vendor: "Meta", data: getData("Meta"), height, width, marginTop, marginBottom},
    {fill, xScale, vendor: "XAI", data: getData("XAI"), height, width, marginTop, marginBottom},
    {fill, xScale, vendor: "Human", data: getData("Human"), height, width, marginTop, marginBottom: margin.bottom}
  ]
}
const sections = getSections()
```

```js
const questionMap = d3.rollup(question, v=>v[0], d=>d.question)

```

```js
const charts = sections.map(config => ({
  config, 
  header: BotHeader({
      botLogos, 
      selectedModels, 
      model_configurationWithHuman, 
      dataWithPrecomputedForceLayoutXY, 
      top: chartHeight.headerShiftHeight, 
      left: margin.left, 
      ...config
    }), 
      chart: OneChartCanvas(config)
  }))
```

```js
const explanation = html`<h1>AI Worldview Benchmark</h1>
<p class="intro">We are testing if the chat bots suffer from the same misconceptions as humans. Here are the results from the ${questionMap.size} fact-questions that humans are generally wrong about.</p>
<p class="hoverHint">Hover circles to see which question they represent →</p>`

```

```js
const explanationTopics = html`<p class="hoverHint">Or browse questions by topics ↓</p>`
```

```js
  const svg = d3.create("svg")
    .attr("width", getChartWidth())
    .attr("height", 25)
  svg.append("g")
      .call(d3.axisBottom(xScale).tickFormat(n => n + "%"));
    const axis = svg.node();

```


```js
  const app = html`
  
  <div class="app-container" lang="en">
    <div class="info-section" style="max-height: ${chartHeight.singleChartHeight * sections.length}px;"> 
      ${explanation}
      <div class="info-question-details"></div>
    </div>
    <div class="info-hint-topics">${explanationTopics}</div>
    <div class="chart-section">
      ${charts.map(m => html.fragment`<div class="one-chart" style="height: ${chartHeight.singleChartHeight}px;">${m.header}${m.chart.canvas}</div>`)}
      <img style="position:absolute; top:-10px; left:35%; width:60px" src="${botLogos["Chimp"].src}"/>
      <div style="position:absolute; top:5px; left:calc(35% + 70px); color:orange">Chimp level (answering by random)</div>
      <div class="axis">${axis}</div>
    </div>
    <div class="questions-section">
      ${QuestionsCatalog({sdgicons, question, sdgcolors})}
    </div>
    <div class="prompts-popup-flexbox"><div class="prompts-popup"></div></div>
  </div>
  `

  console.log("APP")
  //interactivity(app, charts);
  //return app;
```


```js
display(app)
```
