import * as d3 from "npm:d3";
  

export default function interactivity({app, tracks, sdgcolors, questionMap, shortQNamesMap, sdgGoalText, selectedModels, sdgicons, promptsPopup, isMobile}){

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
          const question = event?.detail?.question || null;
          if (question) {
            track.tooltip.show(event.detail);
            trackNode.style("z-index", 1);
          } else {
            track.tooltip.hide();
          }
          highlight({question})
        })
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
  
      tracks.forEach(track => track.chart.render(spec));
  
      if(spec && spec.question){
        DOM.qRects
          .style("opacity", q => q.question === spec.question ? 1 : 0.1)
      }
      
      if (!spec || spec.goal) {
        DOM.qRects.style("opacity", 1)
      }
  
      if(spec && spec.goal) {
        const text = sdgGoalText[spec.goal];
        const UPGRADER_LINK = "https://upgrader.gapminder.org/t/";

        DOM.qDetails.html(`
          <div class="info-image"></div>
          <h2>${text.title}</h2>
          <h1>${toSentenceCase(text.objective)}</h1>
          <p>${text.description}</p>
          <p><a src="${UPGRADER_LINK}" target="_blank">See topic on Upgrader app</a></p>
        `);
        DOM.qDetails.select(".info-image").html(`<img crossorigin="anonymous" src=${sdgicons.find(f => f.goal===spec.goal).image.src}>`)
        DOM.qDetails.select("h2").style("color", sdgcolors[spec.goal]);
        DOM.hints.style("display", "none");
        DOM.intro.style("display", "none");
        DOM.video.style("display", "none");
      }
      if(spec && spec.question) {
        const questionProps = questionMap.get(spec.question);
        const shortText = shortQNamesMap.get(spec.question);
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
        DOM.qDetails.html(`
          <p>${sdgGoalText[goal].title}, Question ${spec.question}</p>
          <h2>${shortText}</h2>
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