import * as d3 from "npm:d3";

const cache = {};
const getCacheKey = (mc, scale) => mc + scale.range()[0] + scale.range()[1];

function forceLayout({
    data,
    x = (d) => d.x,
    y = () => Math.random() * 10 - 5,
    r = (d) => d.r || 3,
    xScale = d3.scaleLinear([0, 100], [0, 500]),
    gap = 1,
    xStrength = 0.8,
    yStrength = 0.02,
  }) {
    
    const nodes = data.map((d) => ({
      ...d,
      x: xScale(x(d)),
      y: y(d),
      r: r(d),
    }));
  
    const simulation = d3
      .forceSimulation(nodes)
      .force("x", d3.forceX((d) => d.x).strength(xStrength))
      .force("y", d3.forceY((d) => d.y).strength(yStrength))
      .force("collide", d3.forceCollide().radius((d) => d.r + gap).iterations(3))
      .stop();
  
    return {simulation, nodes};
  }

  function runForceSimulation({data, x, xScale, ticks = 10}){

    const forceLayoutInstance = forceLayout({data, x, xScale});
    
    for (let i = 0; i < ticks; i++) {
      forceLayoutInstance.simulation.tick();
    }
    return forceLayoutInstance.nodes;
  }

  function getCachedForceLayout({dataset, modelConfig, x, xScale, ticks}){
    const cacheKey = getCacheKey(modelConfig, xScale);
    if (cache[cacheKey]) return cache[cacheKey];

    const layoutToCache = runForceSimulation({data: dataset.get(modelConfig), x, xScale, ticks});
    cache[cacheKey] = layoutToCache;

    return layoutToCache;
  }


  export {runForceSimulation, forceLayout, getCachedForceLayout};