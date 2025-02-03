import {html} from "htl";
import * as d3 from "d3"; 

export default function QuestionsCatalog({
    sdgicons,
    sdgcolors,
    question,
}){
    const questionGroups = d3.create("div");
  
    questionGroups 
      .attr("class", "question-icon-container")
      .selectAll("div")
      .data(sdgicons)
      .join("div")
      .attr("class", "question-icon")
      .append(d => d.image)
  
    // const questionPiles = d3.create("div");
  
    // questionPiles 
    //   .attr("class", "question-pile-container")
    //   .selectAll("div")
    //   .data(sdgicons)
    //   .join("div")
    //   .attr("class", "question-pile")
    //   .each(function(d){
    //     const view = d3.select(this)
    //     view.selectAll("div")
    //       .data(question.filter(f => f.sdg_world_topics === d.goal))
    //       .join("div")
    //       .attr("class", "question-rect")
    //       .style("background-color", sdgcolors[d.goal])
    //   })
  
    return html`
      ${questionGroups.node()}
      `
      //${questionPiles.node()}
  }