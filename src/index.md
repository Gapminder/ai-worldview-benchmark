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
import {axis, explanation, explanationTopics} from "./components/Misc.js"
import {botLogos, sdgGoalText, sdgcolors, sdgicons} from "./components/references.js"
import interactivity from "./components/interactivity.js"
import promptsPopup from "./components/PropmptsPopup.js"
```

```js DATA
const concepts = FileAttachment("data/concepts.csv").csv({typed: true});
const datapoints_correct_rate = await FileAttachment("data/datapoints-rates.csv").csv({typed: true});
const question = await FileAttachment("data/entities-questions.csv").csv({typed: true});
const model_configurationWithHuman = await FileAttachment("data/entities-mdlconfigs.csv").csv({typed: true});
const datapoints_prompts = await FileAttachment("data/datapoints-prompts.csv").csv({typed: true});
const prompt_variations = await FileAttachment("data/entities-promptvars.csv").csv({typed: true});
const promptsMap = d3.rollup(prompt_variations, v=>v[0].question_prompt_template, d=>d.prompt_variation);

const datapoints_prompt_variationMap = d3.group(datapoints_prompts, d => d.model_configuration, d=>d.question)

const model_configurationWithHumanMap = d3.rollup(model_configurationWithHuman, v=>v[0], d=>d.model_configuration)
const human = question.map(m => ({question: m.question, model_configuration: "human", correct_rate: 100-(+m.human_wrong_percentage)}))
const datapoints_ratesWithHuman = datapoints_correct_rate.concat(human);
const questionMap = d3.rollup(question, v=>v[0], d=>d.question);
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
width;
const margin = {right: 20, left: 20, bottom: 100, top: 0};
const xScale = d3.scaleLinear([0, 100], [margin.left, getChartWidth() - margin.right - margin.left]);
const chartHeight = ({
    canvasHeight: (innerHeight-200)/7 + 50,
    singleChartHeight: (innerHeight-200)/7,
    headerShiftHeight: 30
});
```





```js 
const rollup = d3.rollups(model_configurationWithHuman, v=>v.find(f => f["is--latest_model"])?.model_configuration, d => d.vendor)
  .filter(([_, f]) => dataWithPrecomputedForceLayoutXY.has(f));
```
```js
const selectedModels = Mutable(Object.fromEntries(rollup));
const setSelectedModel = (vendor, model)=>{
  const newSelectedModels = Object.assign({}, selectedModels.value, {[vendor]: model});
  selectedModels.value = newSelectedModels;
}
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
const charts = sections.map(config => ({
  config, 
  header: BotHeader({
      botLogos, 
      selectedModels, 
      setSelectedModel,
      model_configurationWithHuman, 
      dataWithPrecomputedForceLayoutXY, 
      top: chartHeight.headerShiftHeight, 
      left: margin.left, 
      ...config
    }), 
      chart: OneChartCanvas({questionMap, ...config})
  }))
```



```js
  const app = html`
  
  <div class="app-container" lang="en">
    <div class="info-section" style="max-height: ${chartHeight.singleChartHeight * sections.length}px;"> 
      ${explanation(questionMap)}
      <div class="info-question-details"></div>
    </div>
    <div class="info-hint-topics">${explanationTopics()}</div>
    <div class="chart-section">
      ${charts.map(m => html.fragment`
        <div class="one-chart" id="${m.config.vendor}" style="height: ${chartHeight.singleChartHeight}px;">
          ${m.header}${m.chart.canvas}
        </div>
      `)}
      <img style="position:absolute; top:-10px; left:35%; width:60px" src="${botLogos["Chimp"].src}"/>
      <div style="position:absolute; top:5px; left:calc(35% + 70px); color:orange">Chimp level (answering by random)</div>
      <div class="axis">${axis(xScale, getChartWidth())}</div>
    </div>
    <div class="questions-section">
      ${QuestionsCatalog({sdgicons, question, sdgcolors})}
    </div>
    <div class="prompts-popup-flexbox"><div class="prompts-popup"></div></div>
  </div>
  `

  console.log("APP")
  const pp = promptsPopup({sdgcolors, sdgGoalText, sdgicons, botLogos, model_configurationWithHumanMap, questionMap, datapoints_prompt_variationMap, model_configurationWithHuman, selectedModels, promptsMap})
  interactivity({app, sections:charts,  sdgcolors, questionMap, sdgicons, sdgGoalText, selectedModels, promptsPopup: pp});
```


```js
display(app)
```
