import {html} from "npm:htl";
import * as d3 from "npm:d3"; 

const axis = (xScale, width) => {
  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", 25)
  svg.append("g")
    .call(d3.axisBottom(xScale).tickFormat(n => n + "%"));
  return svg.node();
}

const explanation = (questionMap) => html`<h1>AI Worldview Benchmark</h1>
  <p class="intro">We are testing if the chat bots suffer from the same misconceptions as humans. Here are the results from the ${questionMap.size} fact-questions that humans are generally wrong about.</p>
  <p class="hoverHint">Hover circles to see which question they represent →</p>`

const explanationTopics = () => html`<p class="hoverHint">Or browse questions by topics ↓</p>`


export {axis, explanation, explanationTopics}