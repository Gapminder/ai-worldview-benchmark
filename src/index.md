---
title: AI Worldview Benchmark
toc: false
sidebar: false
pager: false
---


```js
import forceLayout from "./forceLayout.js"
```

```js
const concepts = FileAttachment("data/concepts.csv").csv({typed: true});
```


```js 
const datapoints_correct_rate = await FileAttachment("data/datapoints-rates.csv").csv({typed: true});
const question = await FileAttachment("data/entities-questions.csv").csv({typed: true});
const human = question.map(m => ({question: m.question, model_configuration: "human", correct_rate: 100-(+m.human_wrong_percentage)}))
const datapoints_ratesWithHuman = datapoints_correct_rate.concat(human);
const dataWithPrecomputedForceLayoutXY = d3.rollup(
    datapoints_ratesWithHuman,
    v => runForceSimulation({dataset: v, x: (d) => d.correct_rate, ticks: 50}),
    (d) => d.model_configuration
  );
```


```js 
function runForceSimulation({dataset, x, ticks = 10}){

  const forceLayoutInstance = forceLayout({data: dataset, x, xScale});
  
  for (let i = 0; i < ticks; i++) {
    forceLayoutInstance.simulation.tick();
  }
  return forceLayoutInstance.nodes;
}
```


```js
function getChartWidth(){
  return Math.min(width * 4 /5, 2000*4/5);
}
```
```js
const margin = ({right: 20, left: 20, bottom: 40, top: 0});
const xScale = d3.scaleLinear([0, 100], [margin.left, getChartWidth() - margin.right - margin.left]);
const chartHeight = ({
      canvasHeight: 200,
      singleChartHeight: 140,
      headerShiftHeight: 30
    }
);
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
  return [
    {vendor: "OpenAI", data: getData("OpenAI"), height, width, marginTop: margin.top, marginBottom},
    {vendor: "Anthropic", data: getData("Anthropic"), height, width, marginTop, marginBottom},
    {vendor: "Google", data: getData("Google"), height, width, marginTop, marginBottom},
    {vendor: "Alibaba", data: getData("Alibaba"), height, width, marginTop, marginBottom},
    {vendor: "Meta", data: getData("Meta"), height, width, marginTop, marginBottom},
    {vendor: "XAI", data: getData("XAI"), height, width, marginTop, marginBottom},
    {vendor: "Human", data: getData("Human"), height, width, marginTop, marginBottom: margin.bottom}
  ]
}
const sections = getSections()
```

```js
const questionMap = d3.rollup(question, v=>v[0], d=>d.question)

```

```js
const charts = sections.map(config => ({config, header: null /* BotHeader(config)*/, chart: OneChartCanvas(config)}) )

```

```js
const sdgcolors = ({
"sdg-world-01": "#E5243B",
"sdg-world-02": "#DDA63A",
"sdg-world-03": "#4C9F38",
"sdg-world-04": "#C5192D",
"sdg-world-05": "#FF3A21",
"sdg-world-06": "#26BDE2",
"sdg-world-07": "#FCC30B",
"sdg-world-08": "#A21942",
"sdg-world-09": "#FD6925",
"sdg-world-10": "#DD1367",
"sdg-world-11": "#FD9D24",
"sdg-world-12": "#BF8B2E",
"sdg-world-13": "#3F7E44",
"sdg-world-14": "#0A97D9",
"sdg-world-15": "#56C02B",
"sdg-world-16": "#00689D",
"sdg-world-17": "#19486A",
"other": "#555",
})
```


```js
function OneChartCanvas({
  vendor, axis=null, marginBottom = 0, marginTop=0, height = 200,
  width = 800,
  data,
  fill = (d) => sdgcolors[questionMap.get(d.question).sdg_world_topics],
  highres = true,
}) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const ratio = window.devicePixelRatio || 1;

  if (highres) {
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.scale(ratio, ratio);
  } else {
    canvas.width = width;
    canvas.height = height;
  }

  

  function render(highlightSpec) {
    context.clearRect(0, 0, width, height);
    for (const node of data) {
      const highlighted = 
        highlightSpec && highlightSpec.goal === questionMap.get(node.question).sdg_world_topics 
        || highlightSpec && highlightSpec.question === node.question;

      context.beginPath();
      context.arc(node.x, node.y + height/2, highlighted ? 7 : node.r, 0, 2 * Math.PI);
      context.fillStyle = fill(node);
      context.globalAlpha = highlightSpec && !highlighted ? 0.1 : 1; // Change opacity if highlighted
      context.fill();

      // Add a stroke
      if (highlighted) {
        context.lineWidth = 2; // Adjust the stroke width
        context.strokeStyle = "white"; // Stroke color
        context.stroke();
      }
      
      context.globalAlpha = 1; // Reset opacity
    }
    // Draw the line
    context.strokeStyle = "orange"; // Line color
    context.lineWidth = 3; // Line width
    context.beginPath();
    context.moveTo(xScale(33.3), marginTop); // Starting point (x1, y1)
    context.lineTo(xScale(33.3), height - marginBottom - marginTop); // Ending point (x2, y2)
    context.stroke(); // Render the line
  }

    // Add interactivity
  let lastHoveredIndex = null;
  canvas.addEventListener("mousemove", (event) => {
    const hoveredIndex = getNearestIndex(event);

    if (hoveredIndex !== lastHoveredIndex)
      canvas.dispatchEvent(new CustomEvent("circlehover", { detail: data[hoveredIndex] }));
    lastHoveredIndex = hoveredIndex;
  });

  canvas.addEventListener("click", (event) => {
    const hoveredIndex = getNearestIndex(event);
    canvas.dispatchEvent(new CustomEvent("circleclick", { detail: data[hoveredIndex] }));
  });

  function getNearestIndex(event){
    const rect = canvas.getBoundingClientRect();
    const mouseX = (event.clientX - rect.left);
    const mouseY = (event.clientY - rect.top);

    const distances = data.map((d, i)=>{
       const dx = mouseX - d.x;
       const dy = mouseY - height/2 - d.y;
       return {index: i, distance: Math.sqrt(dx * dx + dy * dy)};
    }).toSorted((a,b) => a.distance - b.distance);

    return distances[0].index;
  }
  
  render();

  return {canvas, render};
}


```




```js
  //${styles}
  //${explanation}
  //${explanationTopics}
  //${QuestionsCatalog}
  //src="${botLogos["Chimp"].src}"
  //${axis}
  const app = html`
  
  <div class="app-container" lang="en">
    <div class="info-section"> 
      
      <div class="info-question-details"></div>
    </div>
    <div class="info-hint-topics"></div>
    <div class="chart-section">
      ${charts.map(m => html.fragment`<div class="one-chart">${m.header}${m.chart.canvas}</div>`)}
      <img style="position:absolute; top:-10px; left:35%; width:60px" />
      <div style="position:absolute; top:5px; left:calc(35% + 70px); color:orange">Chimp level (answering by random)</div>
      <div class="axis"></div>
    </div>
    <div class="questions-section">
      
    </div>
    <div class="prompts-popup-flexbox"><div class="prompts-popup"></div></div>
  </div>
  `
  //interactivity(app, charts);
  //return app;
```
```js
display(app)
```
