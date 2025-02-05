
import * as d3 from "npm:d3";
  

export default function BotHeader({vendor, botLogos, model_configurationWithHuman, setSelectedModel, selectedModels, dataWithPrecomputedForceLayoutXY, left=0, top=0}){
    function getModelOptions(vendor) {
      return model_configurationWithHuman
        .filter(f => f.vendor === vendor && dataWithPrecomputedForceLayoutXY.has(f.model_configuration))
    }
    
    const div = d3.create("div")
      .attr("class", "header")
      .style("top", `${top}px`)
      .style("left", `${left-5}px`)
    
    div.append("div").attr("class", "logo").append("img")
      .attr("src", botLogos[vendor].src)
      //.style("width", "50px")
      .style("height", "100%")
  
    div.append("div").attr("class", "title")
      .text(vendor)
      .style("font-size", "2em")
  
    const modelOptions = getModelOptions(vendor);
  
    if (vendor !== "Human") {
    
      const select = div.append("div").attr("class", "input").append("select")
        .attr("name", "options")
        .attr("id", vendor)
  
        
      select.selectAll("option")
        .data(modelOptions)
        .join("option")
        .attr("value", d => d.model_configuration)
        .text(d => d.model_name)
    
      select.property('value', selectedModels[vendor]);
      select.on("change", event => {
        const setOption = d3.select(event.target).property("value");
        setSelectedModel(vendor, setOption);
      })
    }
    
    return div.node();
  }