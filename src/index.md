---
toc: false
sidebar: false
pager: false
style: style.css
---

```js IMAGE IMPORTS
// see components/references.js
[
  FileAttachment("./assets/sdgicons/GOAL_01.png"),
  FileAttachment("./assets/sdgicons/GOAL_02.png"),
  FileAttachment("./assets/sdgicons/GOAL_03.png"),
  FileAttachment("./assets/sdgicons/GOAL_04.png"),
  FileAttachment("./assets/sdgicons/GOAL_05.png"),
  FileAttachment("./assets/sdgicons/GOAL_06.png"),
  FileAttachment("./assets/sdgicons/GOAL_07.png"),
  FileAttachment("./assets/sdgicons/GOAL_08.png"),
  FileAttachment("./assets/sdgicons/GOAL_09.png"),
  FileAttachment("./assets/sdgicons/GOAL_10.png"),
  FileAttachment("./assets/sdgicons/GOAL_11.png"),
  FileAttachment("./assets/sdgicons/GOAL_12.png"),
  FileAttachment("./assets/sdgicons/GOAL_13.png"),
  FileAttachment("./assets/sdgicons/GOAL_14.png"),
  FileAttachment("./assets/sdgicons/GOAL_15.png"),
  FileAttachment("./assets/sdgicons/GOAL_16.png"),
  FileAttachment("./assets/sdgicons/GOAL_17.png"),
  FileAttachment("./assets/sdgicons/GOAL_other.png"),

  FileAttachment("./assets/botlogos/anthropic.png"),
  FileAttachment("./assets/botlogos/openai.png"),
  FileAttachment("./assets/botlogos/google.png"),
  FileAttachment("./assets/botlogos/alibaba.png"),
  FileAttachment("./assets/botlogos/human.png"),
  FileAttachment("./assets/botlogos/meta.png"),
  FileAttachment("./assets/botlogos/xai.png"),
  FileAttachment("./assets/botlogos/deepseek.png"),
  FileAttachment("./assets/botlogos/chimp.png"),

  FileAttachment("./assets/intro-video-thumbnail.png"),
  FileAttachment("./assets/question.svg"),
  FileAttachment("./assets/info.svg"),
];
```
```js
import {runForceSimulation} from "./components/forceLayout.js"
import OneChartCanvas from "./components/oneChartCanvas.js"
import BotHeader from "./components/BotHeader.js"
import Tooltip from "./components/Tooltip.js"
import QuestionsCatalog from "./components/QuestionsCatalog.js"
import {axis, explanation, explanationTopics, infoMenu} from "./components/Misc.js"
import {botLogos, sdgGoalText, sdgcolors, sdgicons, introVideoPng, questionSvg, infoSvg} from "./components/references.js"
import interactivity from "./components/interactivity.js"
import promptsPopup from "./components/PropmptsPopup.js"
```

```js DATA
const dsinfo = await FileAttachment("data/dataset-info.json").json();

const zip1 = await FileAttachment("data/aiwb-dataset.zip").zip();
const question = await zip1.file("entities-questions.csv").csv({typed: true});
const model_configurationWithHuman = await zip1.file("entities-mdlconfigs.csv").csv({typed: true});
const datapoints_correct_rate = await zip1.file("datapoints-rates.csv").csv({typed: true});

const model_configurationWithHumanMap = d3.rollup(model_configurationWithHuman, v=>v[0], d=>d.model_configuration)
const human = question.map(m => ({question: m.question, model_configuration: "humans", correct_rate: 100-(+m.human_wrong_percentage)}))
const datapoints_ratesWithHuman = datapoints_correct_rate.concat(human);
const questionMap = d3.rollup(question, v=>v[0], d=>d.question);

```

```js
const zip2 = await FileAttachment("data/aiwb-promptvars.zip").zip();
const datapoints_prompts = await zip2.file("datapoints-prompts.csv").csv({typed: true});
const prompt_variations = await zip2.file("entities-promptvars.csv").csv({typed: true});
const promptsMap = d3.rollup(prompt_variations, v=>v[0].question_prompt_template, d=>d.prompt_variation);
const datapoints_prompt_variationMap = d3.group(datapoints_prompts, d => d.model_configuration, d=>d.question)
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
  if (isSmallScreen)
    return width;
  if (width / 5 <= 250)
    return width - 250;
  return Math.min(width * 4 /5, 2000*4/5);
}
```

```js
const isSmallScreen = (width <= 768) || (window.innerHeight <= 768);
const isTouchDevice =  isSmallScreen//('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
const isMobile = isSmallScreen && isTouchDevice;
```

```js
const nLanes = 8;
const paddingTop = 20;
const margin = {right: isSmallScreen ? 5:40, left: 20, top: 20, axis: 25};
const xScale = d3.scaleLinear([0, 100], [margin.left, getChartWidth() - margin.right - margin.left]);
const canvasOverflow = 50;
const singleChartHeight = isSmallScreen ? 200 : (window.innerHeight - margin.axis - margin.top - paddingTop)/nLanes - 1;
const headerShiftHeight = -10;
```

```js
const rollup = d3.rollups(model_configurationWithHuman, v=>v.find(f => f["is--latest_model"])?.model_configuration, d => d.vendor)
  .filter(([_, f]) => dataWithPrecomputedForceLayoutXY.has(f));
const initialOverallCorrect = getInitialOverallCorrect(rollup.map(([vendor, model]) => model));
const selectedModels = Mutable(Object.fromEntries(rollup));
const setSelectedModel = (vendor, model)=>{
  const newSelectedModels = Object.assign({}, selectedModels.value, {[vendor]: model});
  selectedModels.value = newSelectedModels;
}
```

```js
function getInitialOverallCorrect(models){
  const everyModelCorrectness = models
    .filter(f => f !== "humans")
    .map((model) => d3.mean( dataWithPrecomputedForceLayoutXY.get(model), d => d.correct_rate) );
  return d3.mean(everyModelCorrectness);
}
```

```js 
function getTracksConfig(){
  const height = singleChartHeight;
  const width = getChartWidth();
  function getData(vendor) {
    return dataWithPrecomputedForceLayoutXY.get(selectedModels[vendor])
  }

  const fill = (d) => sdgcolors[questionMap.get(d.question).sdg_world_topics];
  return [
    {fill, xScale, width, canvasOverflow, vendor: "Humans", data: getData("Humans"), averageMarkColor: "#333",
      chimpLine: true,
      height: height + margin.axis + margin.top, marginTop: margin.top, marginBottom: margin.axis
    },
    {fill, xScale, width, canvasOverflow, vendor: "Anthropic", data: getData("Anthropic"), height, spellOutAverage: true},
    {fill, xScale, width, canvasOverflow, vendor: "OpenAI", data: getData("OpenAI"), height},
    {fill, xScale, width, canvasOverflow, vendor: "Google", data: getData("Google"), height},
    {fill, xScale, width, canvasOverflow, vendor: "DeepSeek", data: getData("DeepSeek"), height},
    {fill, xScale, width, canvasOverflow, vendor: "Meta", data: getData("Meta"), height},
    {fill, xScale, width, canvasOverflow, vendor: "Alibaba", data: getData("Alibaba"), height},
    {fill, xScale, width, canvasOverflow, vendor: "XAI", data: getData("XAI"), height},
  ]
}
const tracksConfig = getTracksConfig()
```


```js
const tracks = tracksConfig.map(config => {
  const tooltip = Tooltip({
    questionMap,
    shortQNamesMap,
    margin,
    sdgcolors,
    sdgicons,
    isTouchDevice,
    ...config
  });
  const header = BotHeader({
    botLogos, 
    selectedModels, 
    setSelectedModel,
    model_configurationWithHuman, 
    dataWithPrecomputedForceLayoutXY, 
    top: headerShiftHeight, 
    left: margin.left, 
    ...config
  });
  const chart = OneChartCanvas({questionMap, ...config});

  const div = d3.create("div")
    .attr("class", "track")
    .attr("id", config.vendor)
    .style("height", config.height + "px")

  div.append(() => chart.node);
  div.append(() => header.node);
  div.append(() => tooltip.node);

  return {config, tooltip, header, chart, node: div.node()};
  
})
```

```js
const docid = "1tR6y3LW1wDXqOK1ZK5teBY0c6XIhJOYhfLud4Hgk69M";
const sheet = "Sheet2";
const shortQuestionNames = await d3.csv(`https://docs.google.com/spreadsheets/d/${docid}/gviz/tq?tqx=out:csv&sheet=${sheet}&cache=${new Date()}`)
const shortQNamesMap = new Map(shortQuestionNames.map(m => ([+m.id, m["short_title"]])));

```


```js
  const chimpText = "Monkeys would score 33% on our ABC questions, and humans do worse"
  const app = html`
  
  <div class="app-container" lang="en">

    <div class="sidebar sidebar-top"> 
      <div class="info-static">${explanation({dsinfo, introVideoPng, initialOverallCorrect})}</div>
    </div>

    <div class="chart-section">
      <div style="position:absolute; top:${singleChartHeight + paddingTop}px; left:0;" class="xaxis">${axis(xScale, getChartWidth())}</div>
      <div style="position:absolute; top:${singleChartHeight}px; right:${margin.right}px;" class="xaxistext">CORRECT ANSWERS</div>
      ${tracks.map(track => track.node)}
      
      <img style="position:absolute; top:${isSmallScreen ? 0 : paddingTop - 10}px; left:calc(35% + ${isSmallScreen ? "70px" : "0px"}); width:60px" src="${botLogos["Chimp"].src}"/>
      <div style="position:absolute; top:${isSmallScreen ? paddingTop + 30 : paddingTop}px; left:calc(35% + 70px); color:#FFCB34">${chimpText}</div>
    </div>

    <div class="sidebar sidebar-bottom"> 
      ${!isSmallScreen ? html.fragment`<div class="info-sdg-details"></div>` : ``}
      <div class="info-question-details"></div>
      
      <div class="info-hint-topics">${explanationTopics()}</div>
      <div class="questions-section">${QuestionsCatalog({sdgicons, question, sdgcolors})}</div>

      ${isSmallScreen ? html.fragment`<div class="info-sdg-details"></div>` : ``}
      <div class="info-menu">${infoMenu({questionSvg, infoSvg})}</div>
    </div>

    <div class="prompts-popup-flexbox"><div class="prompts-popup"></div></div>

  </div>
  `
```


```js
  const pp = promptsPopup({sdgcolors, sdgGoalText, sdgicons, botLogos, model_configurationWithHumanMap, questionMap, datapoints_prompt_variationMap, model_configurationWithHuman, selectedModels, promptsMap})
  interactivity({app, tracks,  sdgcolors, questionMap, shortQNamesMap, sdgicons, sdgGoalText, selectedModels, promptsPopup: pp, isTouchDevice, isSmallScreen});
```


```js
display(app)
```
