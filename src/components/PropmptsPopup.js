import * as d3 from "npm:d3";
  

export default function promptsPopup({sdgcolors, sdgGoalText, sdgicons, botLogos, model_configurationWithHumanMap, model_configurationWithHuman, selectedModels, questionMap, datapoints_prompt_variationMap, promptsMap}){
    let inner_question;
    let inner_model;
    let inner_view;
  
    const getState = function(){return {question: inner_question, model: inner_model}};
    const update = function({view = inner_view, question = inner_question, model = inner_model}){
      
      if(model === "humans") return;
    
      inner_model = model;
      inner_question = question;
      inner_view = view;
    
      view.html("");
      
      view.style("display", "block");
      view.append("div")
        .attr("class", "close-cross")
        .text("X")
        .on("click", () => {
            view.style("display", "none");
        });
      
      
      
      const questionProps = questionMap.get(question);
      const goal = questionProps.sdg_world_topics;
      
      function emphasizeWords(keywords, text) {
        // Define a list of common prepositions and articles to exclude
        const excludeWords = ['a', 'as', 'the', 'in', 'on', 'at', 'of', 'to', 'and', 'for', 'with', 'by', 'from'];
      
        // Extract the words between underscores in the first string
        const wordsToEmphasize = keywords
          .split('_')
          .filter(word => word && !excludeWords.includes(word.toLowerCase())); // Exclude common words
      
        // Create a regex pattern to match any of the words in the list, including optional apostrophes
        const regex = new RegExp(`\\b(${wordsToEmphasize.map(word => word.replace(/'/g, "\\'")).join('|')})\\b`, 'gi');
      
        // Replace matching words with the <em> tags
        const emphasizedText = text.replace(regex, '<em>$1</em>');
      
        return emphasizedText;
      }
    
      
      const cscale = d3.scaleOrdinal()
        .domain(["correct","wrong", "very_wrong", "fail", "n/a"])
        .range(["darkgreen", "#dd8757", "#ff2626", "grey", "blue"])
  
      const cOptionScale = d3.scaleOrdinal()
        .domain(["1","2", "3", "fail", "n/a"])
        .range(["darkgreen", "#dd8757", "#ff2626", "grey", "blue"])
    
      const tscale = d3.scaleOrdinal()
        .domain(["correct","wrong", "very_wrong", "fail", "n/a"])
        .range(["Correct","Wrong", "Very wrong", "Failed", "n/a"])
      
      const escale = d3.scaleOrdinal()
        .domain(["correct","wrong", "very_wrong", "fail", "n/a"])
        .range(["🟢","🟠", "🔴", "⚪️", "🔵"])
    
      
      function getCorrectnessClassName(num){
        if (num == 1) return "correct";
        if (num == 2) return "wrong";
        if (num == 3) return "verywrong";
      }
      function getCorrectnessText(num){
        if (num == 1) return "Correct";
        if (num == 2) return "Wrong";
        if (num == 3) return "Very wrong";
      }
    
      
      
      const results = datapoints_prompt_variationMap.get(model).get(question)
        .toSorted((a,b) => cscale.domain().indexOf(a.evaluation_result) - cscale.domain().indexOf(b.evaluation_result));
    
    
      view.append("h1").text("Question variations");
      
      view.append("p").style("width", "100%").text(`Chatbots change their mind when we ask the same question with slight variations or provide differnt context. We made ${results.length} prompt variations for this question to see if bots would answer differently`);
    
    
    
      
      
    
      const vendor = model_configurationWithHumanMap.get(model).vendor;
      const modelName = model_configurationWithHumanMap.get(model).model_name;
      view.append("img").attr("src", botLogos[vendor].src)
        .style("width", "40px")
        .style("height", "40px")
        .style("position", "relative")
        .style("top", "9px")
        .style("margin-right", "5px")
        .style("display", "inline-block");
      view.append("h1").style("display", "inline-block").text(modelName.split(" ")[0]);
    
      view.append("h1").style("display", "inline-block").style("margin-right", "10px").style("margin-left", "10px").text("–vs–");
      
      view.append("img").attr("src", sdgicons.find(f => f.goal===goal).image.src)
        .style("width", "40px")
        .style("height", "40px")
        .style("position", "relative")
        .style("top", "9px")
        .style("margin-right", "5px")
        .style("display", "inline-block");
        
    
      view.append("h1")
        .style("display", "inline-block")
        .style("padding-left", "5px")
        .style("padding-right", "10px")
        .style("color", "white")
        .style("background-color", sdgcolors[goal])
        .html(`<span class="info-goal">${sdgGoalText[goal].title}</span> Question ${question}`)
      view.append("p").text("Model configuration: " + modelName);
    
    
      
    
    
      
      
    
      function computeCorrectnessStats(results){
        if (!results) return null;
        const resultsByCorrectness = d3.group(results, d => d.evaluation_result);
        const resultsSummary = cscale.domain().map(correctness => {
          const total = (resultsByCorrectness.get(correctness) || []).length;
          return {correctness, total, rate: total / results.length }
        })
        return resultsSummary;
      }
    
      const currentModelResultsSummary = computeCorrectnessStats(results);
      
      
      view.append("div").attr("class", "text-stats")
        .selectAll("span")
        .data(currentModelResultsSummary)
        .join("span")
        .style("color", d => cscale(d.correctness))
        .text((d, i) => `${tscale(d.correctness)}: ${d.total} ${i === 0 ? "prompt variations" : ""} (${Math.round(d.rate * 100)}%)`)
    
      const bar = view.append("div")
        .style("width", "95%")
        .on("mouseleave", (event, e) => highlightPrompt());
      bar.selectAll("div")
        .data(currentModelResultsSummary)
        .join("span")
        .style("display", "inline-block")
        .each(function(d){
          const view = d3.select(this)
            .style("width", (d.rate * 100) + "%")
            .style("height", "40px");
          
          view.selectAll("span")
            .data(results.filter(f => f.evaluation_result === d.correctness))
            .join("span")
            .attr("class", "prompt-hover")
            .attr("id", d => "span-"+d.prompt_variation)
            .style("display", "inline-block")
            .style("background", f => cscale(f.evaluation_result))
            
            .style("box-sizing", "border-box")
            .style("cursor", "pointer")
            .style("width", 100/d.total+"%")
            .style("border-right", "1px solid white")
            
            .on("mouseenter", (event, e) => highlightPrompt(e));
            
        })
    
    
      const otherBots = []
        .concat(model_configurationWithHuman.filter(f => f.vendor === vendor).map(m => m.model_configuration))
        .concat(Object.values(selectedModels))
        .filter(f => f !== "humans" && f !== model)
    
      const otherBotsData = otherBots
        .map(mc => ({mc, prompts: datapoints_prompt_variationMap.get(mc)?.get(question)}))
        .map(({mc, prompts}) => ({mc, stats: computeCorrectnessStats(prompts)}))
        .filter(f => f.stats)
    
      view.append("div").text("For context, here is what other bots reply:")
    
      view.append("div")
        .style("width", "95%")
        .selectAll("div")
        .data(otherBotsData)
        .join("div")
        .each(function(d){
          const view = d3.select(this)
            .style("line-height", "0.6em")
            .style("margin-top", "0.3em")
            .style("position","relative")
            .attr("class", "other-bot");
          view.append("div")
            .style("font-size", "0.7em")
            .text(model_configurationWithHumanMap.get(d.mc).vendor + " " + model_configurationWithHumanMap.get(d.mc).model_name)
            .on("click", (event, d)=>{
              update({model: d.mc})
            })
          view
            .selectAll("span")
            .data(d.stats)
            .join("span")
            .style("display", "inline-block")
            .style("background", e => cscale(e.correctness))
            .style("height", "5px")
            .style("font-size", "0.1em")
            .style("width", e => (e.rate * 100) + "%");
          
          
        })
      
      
    
      const promptContainer = view.append("div").attr("class", "prompt");
      function highlightPrompt(prompt){
        promptContainer.html("");
    
        
        const promptText = prompt && promptsMap.get(prompt.prompt_variation).replaceAll("\n"," ");
        const promptTextWithEm = promptText && emphasizeWords(prompt.prompt_variation, promptText);
        const questionText = questionProps.published_version_of_question 
          || "The question probably had images in it, this app doesn't support it yet";
        const compoundText = promptTextWithEm 
          ? promptTextWithEm.replace("{question}", `<span class="info-question">“${questionText.trim()}”</span>`)
          : `<span class="info-question">${questionText}</span>`;
    
        promptContainer.append("div")
          .style("font-size", "1.5em")
          .html(compoundText)
          .select("span.info-question")
          .style("color", "white")
          .style("background-color", sdgcolors[goal])
          
    
        promptContainer.append("div")
          .style("font-size", "0.7em")
          .html(`
            <span style="color: ${cOptionScale(questionProps.option_a_correctness)}">
              A (${getCorrectnessText(questionProps.option_a_correctness)}). ${questionProps.option_a}
            </span>,     
            <span style="color: ${cOptionScale(questionProps.option_b_correctness)}">
              B (${getCorrectnessText(questionProps.option_b_correctness)}). ${questionProps.option_b}
            </span>,
            <span style="color: ${cOptionScale(questionProps.option_c_correctness)}">
              C (${getCorrectnessText(questionProps.option_c_correctness)}). ${questionProps.option_c}
            </span>.
          `)
    
        promptContainer.append("div")
          .attr("class", "clip-effect")
          .text(prompt ?
            `${escale(prompt.evaluation_result)} Bot answered this variation ${tscale(prompt.evaluation_result)}`
              :
               "Hover some of the items above see how the bot answered")
          .style("color", prompt && cscale(prompt.evaluation_result))
          .style("font-size", "1.5em")
          .style("margin-top", "20px");
        
    
    
      }
  
      // let i = 0;
      // const interval = setInterval(()=>{
      //   console.log("i", i, results[i])
      //   highlightPrompt(results[i]); 
      //   bar.select(".prompt-hover#span-"+results[i].prompt_variation).style("height", "40px");
      //   if (i>0) bar.select(".prompt-hover#span-"+results[i-1].prompt_variation).style("height", "30px");
        
      //   i++;
      //   if (i >= results.length) {
      //     clearInterval(interval);
      //     highlightPrompt();
      //   }
      // }, 20)
      
      highlightPrompt();
    } 
    return {getState, update};
  }