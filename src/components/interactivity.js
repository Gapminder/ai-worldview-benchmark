import * as d3 from "npm:d3";
  
const UPGRADER_LINK = "https://upgrader.gapminder.org/t/";

export default function interactivity({tracks, sdgcolors, questionMap, sdgGoalText, selectedModels, sdgicons, promptsPopup, isTouchDevice, isSmallScreen}){

    function toSentenceCase(str) {
      if (!str) return str; // Handle empty or null strings
      const hyphenTuned = str.replace("nfrastructure", "nfra&shy;structure").replace("nnovation", "nno&shy;vation");
      return hyphenTuned.charAt(0).toUpperCase() + hyphenTuned.slice(1).toLowerCase();
    }
  
    
    const DOM = {};
    DOM.container = d3.select(".app-container");
    DOM.questionsSection = DOM.container.select(".questions-section");
    DOM.qIconContainer = DOM.container.select(".question-icon-container");
    DOM.qPileContainer = DOM.container.select(".question-pile-container");
    DOM.qIcons = DOM.qIconContainer.selectAll(".question-icon");
    DOM.qPiles = DOM.qPileContainer.selectAll(".question-pile");
    DOM.qRects = DOM.qPileContainer.selectAll(".question-rect");
    DOM.qDetails = DOM.container.select(".info-question-details");
    DOM.sdgDetails = DOM.container.select(".info-sdg-details");
    DOM.hints = DOM.container.selectAll(".hoverHint");
    DOM.intro = DOM.container.selectAll(".intro");
    DOM.video = DOM.container.selectAll(".video");
    DOM.promptsPopup = DOM.container.select(".prompts-popup");
  
    DOM.questionsSection
      .on("mouseleave", (event, d) => {
        if (isTouchDevice) return;
        highlight(null)
      });
    DOM.qIcons
      .on("mouseenter", (event, d) => highlight({goal: d.goal}))
      .on("click", (event, d) => {
        if (isTouchDevice || d.goal === "other") return;
        window.open(UPGRADER_LINK + d.goal, '_blank').focus();
      });
    // DOM.qRects
    //   .on("mouseenter", (event, d) => highlight({question: d.question}))
    //   .on("click", (event, d) => {
    //     const defaultModel = Object.values(selectedModels)[0];
    
    //     promptsPopup.update({
    //      view: DOM.promptsPopup, 
    //       question: d.question,
    //       model: promptsPopup.getState.model || defaultModel,
    //         })
    //   });

  
    tracks.forEach(track => {
      
      const trackNode = d3.select(track.node);
      trackNode.on("mouseleave", function(event, d) {
        highlight(null);
        track.header.hide();
        track.tooltip.hide();
        trackNode.style("z-index", 0);
      })
      trackNode.on("mouseenter", function(event, d) {
        track.header.show();
        
      });

      d3.select(track.chart.node)
        .on("circlehover", (event, i) => {
          if (isTouchDevice) return;
          const question = event?.detail?.question || null;
          
          if (question) {
            track.tooltip.show(event.detail);
            trackNode.style("z-index", 1);
          } else {
            track.tooltip.hide();
          }
          highlight({question});

        })
        .on("circleclick", event => {
          updatePropmptsPopup(event?.detail);
        })
        .on("circletouch", event => {
          const question = event?.detail?.question || null;
          if (question) {
            track.tooltip.show(event.detail);
            trackNode.style("z-index", 1);
            track.tooltip.clickToMore(()=>{
              updatePropmptsPopup(event.detail);              
            })
          } else {
            track.tooltip.hide();
          }          
          
        });

      function updatePropmptsPopup(detail){
        if (!detail?.question || !detail?.model_configuration) return;
        promptsPopup.update({
          view: DOM.promptsPopup, 
          question: detail.question, 
          model: detail.model_configuration
        })
      }
    })
  
    
    function highlight(spec){
  
      tracks.forEach(track => track.chart.render(spec));
      
      if (!spec || spec.goal) {
        DOM.qRects.style("opacity", 1)
      }
  
      if(spec && spec.goal) {
        buildSdgDetails(spec.goal);
        showHideTitleAndHint(false);
        DOM.qDetails.style("display", "none").text("");
      }
      if(spec && spec.question) {
        DOM.qRects.style("opacity", q => q.question === spec.question ? 1 : 0.1)
        buildQuestionDetails(spec.question);
        showHideTitleAndHint(false);
        DOM.sdgDetails.style("display", "none").text("");
      }
      if(!spec) {
        showHideTitleAndHint(true);
        DOM.qDetails.style("display", "block").text("");
        DOM.sdgDetails.style("display", "none").text("");
      }
    }



    function buildSdgDetails(goal){
      const sdgProps = sdgGoalText[goal];

      DOM.sdgDetails.style("display", "block").html(`
        <div class="info-image"></div>
        <h2>${sdgProps.title}</h2>
        <h1>${toSentenceCase(sdgProps.objective)}</h1>
        <p>${sdgProps.description}</p>
      `);

      if (isTouchDevice && goal !== "other")
        DOM.sdgDetails.append("p").append("a")
          .attr("href", UPGRADER_LINK + goal)
          .attr("target", "_blank")
          .text("See topic on Upgrader app");

      DOM.sdgDetails.select(".info-image").append(() => sdgicons.find(f => f.goal===goal).image);
      DOM.sdgDetails.select("h2").style("color", sdgcolors[goal]);
      
    }

    function buildQuestionDetails(question){
      const questionProps = questionMap.get(question);
      const goal = questionProps.sdg_world_topics;
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
      DOM.qDetails.style("display", "block").html(`
        <p>${sdgGoalText[goal].title}, Question ${question}</p>
        <h2>${questionProps.short_title}</h2>
        <p>${questionProps.published_version_of_question || "The question probably had images in it, this app doesn't support it yet"}</p>
        <p><span class="${getCorrectnessClassName(questionProps.option_a_correctness)}">
          ${getCorrectnessText(questionProps.option_a_correctness)}
        </span><br/>A. ${questionProps.option_a}</p>
        <p><span class="${getCorrectnessClassName(questionProps.option_b_correctness)}">
          ${getCorrectnessText(questionProps.option_b_correctness)}
        </span><br/>B. ${questionProps.option_b}</p>
        <p><span class="${getCorrectnessClassName(questionProps.option_c_correctness)}">
          ${getCorrectnessText(questionProps.option_c_correctness)}
        </span><br/>C. ${questionProps.option_c}</p>
      `);
      //DOM.qDetails.select(".info-image").html(`<img crossorigin="anonymous" src=${sdgicons.find(f => f.goal===goal).image.src}>`)
      DOM.qDetails.select("h2").style("color", sdgcolors[goal]);
    }

    function showHideTitleAndHint(show){
      DOM.hints.style("display", show || isSmallScreen ? "block" : "none");
      DOM.intro.style("display", show || isSmallScreen ? "inline-block" : "none");
      DOM.video.style("display", show || isSmallScreen ? "inline-block" : "none");
    }
  
    //highlight(null);
  }