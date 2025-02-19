import {html} from "npm:htl";
import * as d3 from "npm:d3";
  
const axis = (xScale, width) => {
  const svg = d3.create("svg")
    .attr("width", `${width}px`)
    .attr("height", `27px`)
  svg.append("g")
    .call(d3.axisBottom(xScale).tickFormat(n => n + "%"));
  return svg.node();
}

const dateFormatter = d3.utcFormat("%b %d %Y");

const explanation = (dsinfo = {}, introVideoPng) => html`<h1></h1>
  <svg class="title" viewBox="0 0 245 85" preserveAspectRatio="xMinYMin meet">
    <path
    style="fill:#1fa0a9;fill-opacity:1"
    d="m 11.930796,72.662349 c -2.6320879,-0.87117 -2.7342999,-1.31763 -2.7342999,-11.94331 0,-9.80462 0.140173,-8.99878 -1.5875,-9.12634 -3.857461,-0.2848 -4.321528,-1.07474 -4.321528,-7.3562 0,-6.24303 0.718347,-7.40833 4.566844,-7.40833 1.348239,0 1.342184,0.0248 1.342184,-5.48962 0,-5.24582 0.08788,-5.80144 1.0993199,-6.9505 1.297386,-1.4739 0.553951,-1.39034 13.276374,-1.49231 11.288894,-0.0905 11.288894,-0.0905 11.338794,-1.86556 0.0563,-2.00323 0.24421,-1.7204 -1.725599,-2.59755 -5.467986,-2.43488 -5.527388,-12.9197902 -0.08746,-15.4380902 0.484663,-0.22437 1.010003,-0.47669 1.167403,-0.56072 0.72095,-0.38485 3.12764,-0.58925 4.5574,-0.38705 3.44649,0.48739 5.47157,2.17135 6.77857,5.63671 0.3994,1.05895 0.39924,5.0199902 -2.4e-4,6.0782702 -0.97662,2.58722 -3.03921,4.89837 -4.37155,4.89837 -0.77814,0 -1.16502,0.69397 -1.16254,2.08537 0.004,2.40752 -1.48509,2.12316 11.43714,2.18363 12.52973,0.0586 11.89755,-0.005 13.09047,1.31519 1.17098,1.2958 1.12908,1.05208 1.19262,6.93764 0.0646,5.98698 -0.0213,5.63938 1.39462,5.64352 3.78087,0.0111 4.63274,1.37549 4.63274,7.42028 0,5.86241 -0.90324,7.39144 -4.37224,7.4015 -1.78567,0.005 -1.60003,-1.03599 -1.66191,9.32038 -0.0814,13.63075 3.71373,12.02541 -28.37719,12.0034 -22.377106,-0.0154 -24.670113,-0.0431 -25.472418,-0.30868 z m 29.721258,-7.05328 c 2.97116,-0.47374 7.34343,-2.0713 7.7505,-2.83191 0.74132,-1.38518 -0.60127,-2.09235 -2.45813,-1.29475 -0.33994,0.14602 -0.77682,0.33223 -0.97084,0.41379 -4.81132,2.02257 -12.5964,1.9826 -17.377275,-0.0892 -3.230393,-1.3999 -4.755929,0.44885 -1.638372,1.98549 1.32808,0.65462 3.088141,1.25792 3.669809,1.25792 0.15757,0 0.658594,0.1128 1.113385,0.25066 1.897353,0.57514 7.201683,0.73999 9.910923,0.30802 z m 8.73393,-12.07196 c 7.58842,-2.52062 8.49695,-14.22055 1.40112,-18.04336 -1.5467,-0.83326 -2.16039,-0.87044 -14.36839,-0.87044 -10.633465,0 -11.637743,0.0254 -12.611801,0.31869 -3.530799,1.06322 -4.996715,2.73627 -6.075254,6.93372 -1.119904,4.35843 0.984947,9.32809 4.709579,11.11957 2.00725,0.96545 24.318716,1.4141 26.944746,0.54182 z m -23.307231,-5.59017 c -3.731906,-0.57562 -3.711394,-6.95228 0.02416,-7.51246 2.92752,-0.43901 4.570723,0.92784 4.570723,3.80202 0,2.93662 -1.541496,4.1814 -4.594887,3.71044 z m 18.894831,0.006 c -3.70935,-0.6298 -3.68235,-6.96583 0.032,-7.52283 2.87166,-0.43064 4.64225,1.01836 4.64225,3.79905 0,2.8396 -1.73608,4.22265 -4.6743,3.72378 z m -6.83586,-33.62109 c 2.63045,-1.09908 2.83979,-5.5293602 0.3293,-6.9692702 -3.95777,-2.27001 -7.93042,2.6410402 -5.00292,6.1846702 0.82549,0.99923 3.2042,1.39856 4.67362,0.7846 z"
    />
    <text font-size=14px x=80 y=15>${dateFormatter(new Date(dsinfo.created || "2025-02-16"))} Benchmark</text>
    <text font-size=26px font-weight=bold x=80 y=46>AI Worldview</text>
    <text font-size=20px x=80 y=72>79.6% CORRECT</text>
  </svg>

  <svg class="intro" viewBox="0 0 245 80" preserveAspectRatio="xMinYMin meet">
    <text font-size=23px x=3 y=25>Chatbots are still</text>
    <text font-size=23px x=3 y=50>suffering from some</text>
    <text font-size=23px x=3 y=75>human misconceptions</text>
  </svg>
  <p class="video">
  </p> 
  <p class="hoverHint">Hover circles to see which question they represent →</p>`

const explanationTopics = () => html`<p class="colorlegend">Color: UN Goals</p>`


const infoMenu = ({questionSvg, infoSvg}) => {
  const parser = new DOMParser();
  const doc1 = parser.parseFromString(questionSvg, "image/svg+xml");
  const questionSvgParsed = doc1.documentElement; // <svg> root

  const doc2 = parser.parseFromString(infoSvg, "image/svg+xml");
  const infoSvgParsed = doc2.documentElement; // <svg> root


  return html`
    <div class="info-menu-item">
      ${questionSvgParsed}
      <a href="https://www.youtube.com/watch?v=xvFZjo5PgG0" target="_blank">How to use...</a>
    </div>
    <div class="info-menu-item">
      ${infoSvgParsed}
      <a href="https://www.gapminder.org/ai/method/" target="_blank">More info and method...</a>
    </div>
  `;
};

export {axis, explanation, explanationTopics, infoMenu}