import {html} from "npm:htl";
import { FileAttachment } from "@observablehq/stdlib";
import * as d3 from "npm:d3";

const axis = (xScale, width) => {
  const svg = d3.create("svg")
    .attr("width", `${width}px`)
    .attr("height", `27px`)
  svg.append("g")
    .call(d3.axisBottom(xScale).tickFormat(n => n + "%"));
  return svg.node();
}


const introVideoPng = await FileAttachment("./assets/intro-video-thumbnail.png").image();
const robotIconPng = await FileAttachment("./assets/robot-icon.png").image();
const dateFormatter = d3.utcFormat("%B %Y");

const explanation = (dsinfo = {}) => html`<h1></h1>
  <div class="title">
    <div class="icon"><img src=${robotIconPng.src}/></div>
    <div class="h3">${dateFormatter(new Date(dsinfo.created || "2025-02-16"))} Benchmark</div>
    <div class="h1">AI Worldview</div>
    <div class="h2">79.6% CORRECT</div>
  </div>
  <p class="intro">Chatbots are still <br/> suffering from some <br/> human misconceptions</p>
  <p class="video">
    <img src=${introVideoPng.src}/>
  </p> 
  <p class="hoverHint">Hover circles to see which question they represent →</p>`

const explanationTopics = () => html`<p class="colorlegend">Color: UN Goals</p>`


export {axis, explanation, explanationTopics}