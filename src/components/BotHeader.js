
import * as d3 from "npm:d3";

const dateFormatter = d3.utcFormat("%b %Y");

export default function BotHeader({vendor, botLogos, model_configurationWithHuman, setSelectedModel, selectedModels, modelConfigsThatHaveDatapoints, left=0, top=0}){
    function getModelOptions(vendor) {
      return model_configurationWithHuman
        .filter(f => f.vendor === vendor && modelConfigsThatHaveDatapoints.includes(f.model_configuration))
        .toSorted((b,a) => a.model_publish_date - b.model_publish_date);
    }
    
    const div = d3.create("div")
      .attr("class", "header")
      .style("top", `${top}px`)
      .style("left", `${left-5}px`)
    
    div.append("div").attr("class", "logo")
      .append(() => botLogos[vendor])
      //.style("width", "50px")
      .style("height", "100%")
  
    div.append("div").attr("class", "title")
      .text(vendor)
      .style("font-size", "2em")
  
    const modelOptions = getModelOptions(vendor);
  
    if (vendor !== "Humans") {
    
      const select = div.append("div").attr("class", "input").append("select")
        .attr("name", "options")
        .attr("id", vendor)
  
        
      select.selectAll("option")
        .data(modelOptions)
        .join("option")
        .attr("value", d => d.model_configuration)
        .text(d => `${d.model_name} of ${dateFormatter(d.model_publish_date)}`)
    
      select.property('value', selectedModels[vendor]);
      select.on("change", event => {
        const setOption = d3.select(event.target).property("value");
        setSelectedModel(vendor, setOption);
      })
    }

    function show(){
      div.select("select").style("opacity",1);
    }
    function hide(){
      div.select("select").style("opacity",0.5);
    }
    
    return {node: div.node(), show, hide};
  }