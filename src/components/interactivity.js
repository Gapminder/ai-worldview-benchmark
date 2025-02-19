import * as d3 from "npm:d3";
  

export default function interactivity({app, sections, sdgcolors, questionMap, shortQNamesMap, sdgGoalText, selectedModels, sdgicons, promptsPopup, isMobile}){

    function toSentenceCase(str) {
      if (!str) return str; // Handle empty or null strings
      const hyphenTuned = str.replace("nfrastructure", "nfra&shy;structure").replace("nnovation", "nno&shy;vation");
      return hyphenTuned.charAt(0).toUpperCase() + hyphenTuned.slice(1).toLowerCase();
    }
  
    
    const DOM = {};
    DOM.container = d3.select(app);
    DOM.questionsSection = DOM.container.select(".questions-section");
    DOM.qIconContainer = DOM.container.select(".question-icon-container");
    DOM.qPileContainer = DOM.container.select(".question-pile-container");
    DOM.qIcons = DOM.qIconContainer.selectAll(".question-icon");
    DOM.qPiles = DOM.qPileContainer.selectAll(".question-pile");
    DOM.qRects = DOM.qPileContainer.selectAll(".question-rect");
    DOM.qDetails = DOM.container.select(".info-question-details");
    DOM.hints = DOM.container.selectAll(".hoverHint");
    DOM.intro = DOM.container.selectAll(".intro");
    DOM.video = DOM.container.selectAll(".video");
    DOM.promptsPopup = DOM.container.select(".prompts-popup");
    DOM.charts = DOM.container.selectAll(".one-chart");
  
    DOM.questionsSection
      .on("mouseleave", (event, d) => highlight(null));
    DOM.qIcons
      .on("mouseenter", (event, d) => highlight({goal: d.goal}));
    DOM.qRects
      .on("mouseenter", (event, d) => highlight({question: d.question}))
      .on("click", (event, d) => {
        const defaultModel = Object.values(selectedModels)[0];
    
        promptsPopup.update({
         view: DOM.promptsPopup, 
          show: true, 
          question: d.question,
          model: promptsPopup.getState.model || defaultModel,
            })
      });

    DOM.charts
      .on("mouseleave", function(event, d) {
        highlight(null);
        d3.select(this).select("select").style("opacity",0.5);
      })
      .on("mouseenter", function(event, d) {
        d3.select(this).select("select").style("opacity",1);
      });
  
    sections.forEach(section => {
      const data = section.config.data;
      d3.selection.chart
      d3.select(section.chart.canvas)
        .on("circlehover", (event, i) => highlight( event?.detail?.question ? {question: event.detail.question} : null ))
        .on("circleclick", (event, i) => {

          if (!event?.detail) return;
          if (isMobile()) return;

          promptsPopup.update({
            view: DOM.promptsPopup, 
            show: true, 
            question: event?.detail?.question, 
            model: event?.detail?.model_configuration
            })
          
        });
    })
  
    
    function highlight(spec){
  
      sections.forEach(section => section.chart.render(spec));
  
      if(spec && spec.question){
        DOM.qRects
          .style("opacity", q => q.question === spec.question ? 1 : 0.1)
      }
      
      if (!spec || spec.goal) {
        DOM.qRects.style("opacity", 1)
      }
  
      if(spec && spec.goal) {
        const text = sdgGoalText[spec.goal];
        DOM.qDetails.html(`
          <div class="info-image"></div>
          <h2>${text.title}</h2>
          <h1>${toSentenceCase(text.objective)}</h1>
          <p>${text.description}</p>
        `);
        DOM.qDetails.select(".info-image").html(`<img crossorigin="anonymous" src=${sdgicons.find(f => f.goal===spec.goal).image.src}>`)
        DOM.qDetails.select("h2").style("color", sdgcolors[spec.goal]);
        DOM.hints.style("display", "none");
        DOM.intro.style("display", "none");
        DOM.video.style("display", "none");
      }
      if(spec && spec.question) {
        const text = questionMap.get(spec.question);
        const shortText = shortQNamesMap.get(spec.question);
        const goal = text.sdg_world_topics;
        function getCorrectnessClassName(num){
          if (num == 1) return "correct";
          if (num == 2) return "wrong";
          if (num == 3) return "verywrong";
        }
        function getCorrectnessText(num){
          if (num == 1) return "Correct answer:";
          if (num == 2) return "Wrong answer:";
          if (num == 3) return "Very wrong answer:";
        }
        //<div class="info-image"></div>
        DOM.qDetails.html(`
          <p>${sdgGoalText[goal].title}, Question ${spec.question}</p>
          <h2>${shortText}</h2>
          <p>${text.published_version_of_question || "The question probably had images in it, this app doesn't support it yet"}</p>
          <p><span class="${getCorrectnessClassName(text.option_a_correctness)}">
            ${getCorrectnessText(text.option_a_correctness)}
          </span><br/>A. ${text.option_a}</p>
          <p><span class="${getCorrectnessClassName(text.option_b_correctness)}">
            ${getCorrectnessText(text.option_b_correctness)}
          </span><br/>B. ${text.option_b}</p>
          <p><span class="${getCorrectnessClassName(text.option_c_correctness)}">
            ${getCorrectnessText(text.option_c_correctness)}
          </span><br/>C. ${text.option_c}</p>
        `);
        //DOM.qDetails.select(".info-image").html(`<img crossorigin="anonymous" src=${sdgicons.find(f => f.goal===goal).image.src}>`)
        DOM.qDetails.select("h2").style("color", sdgcolors[goal]);
        DOM.hints.style("display", "none");
        DOM.intro.style("display", "none");
        DOM.video.style("display", "none");
      }
      if(!spec) {
        DOM.hints.style("display", "block");
        DOM.intro.style("display", "block");
        DOM.video.style("display", "block");
        DOM.qDetails.text("");
      }
    }
  
    //highlight(null);
  }