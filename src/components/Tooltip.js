
import * as d3 from "npm:d3";
  
const dx = 50;
const h = 50;

export default function Tooltip({shortQNamesMap, questionMap, sdgcolors, sdgicons, isTouchDevice, margin, width, height, promptsPopup, canvasOverflow, activatePromptPopup}){
  
  const div = d3.create("div")
    .attr("class", "tooltip")
    .style("max-height", height + "px")
    .style("top", 0 + "px")

  const title = div.append("div")
    .attr("class", "title")
  const icon = div.append("div")
    .attr("class", "icon")
    .append("img")
    .attr("crossorigin", "anonymous");
  const correctText = div.append("div")
    .attr("class", "correct-text")
    .text("correct answers")
  const correctPercent = div.append("div")
    .attr("class", "correct-percent")
  const linkToMore = div.append("div")
    .attr("class", "link-to-more")
    .text("Explore variations")
    .style("display", isTouchDevice ? "block" : "none" )
  
  function show({x, question, model_configuration, correct_rate}){
    const shortTitile = shortQNamesMap.get(question);
    const questionProps = questionMap.get(question);
    const goal = questionProps.sdg_world_topics;

    div
      .style("display", "grid")

    document.documentElement.style.setProperty('--shadow-color', sdgcolors[goal]);

    
    if (x < width / 2) 
      div.style("right", null)
      .style("left", (x + dx) + "px")
        .style("max-width", (width - x - dx) + "px")
        .classed("rtl", false);
        
    else
      div.style("left", null)
        .style("right", (width - x - margin.left + dx) + "px")
        .style("max-width", (x - dx) + "px")
        .classed("rtl", true);

    icon.attr("src", sdgicons.find(f => f.goal===goal).image.src);
    title
      .style("color", sdgcolors[goal])
      .text(shortTitile);
    correctPercent.text(Math.round(correct_rate) + "%");
    
  }
  function hide(){
    div.style("display", "none")
  }

  function clickToMore(callback){
    linkToMore.on("click", () => {
      callback()
    })
  }

  return {show, hide, clickToMore, node: div.node()};
}