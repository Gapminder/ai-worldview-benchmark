import * as d3 from "npm:d3";
  
const turkoise = "#1fa0a9";
const opacityDim = 0.3;

export default function OneChartCanvas({
    vendor,
    questionMap,
    marginBottom = 0, marginTop=0, height = 200, width = 800,
    canvasOverflow,
    data,
    xScale,
    fill = () => "#ba11ad",
    averageMarkColor = turkoise,
    highres = true,
    spellOutAverage = false,
    chimpLine = false,
  }) {
    const canvas = document.createElement("canvas");
    canvas.id = vendor;
    const context = canvas.getContext("2d");
    const ratio = window.devicePixelRatio || 1;
    height = height + canvasOverflow;
    const heightMinusMargins = height - marginBottom - marginTop;
  
    if (highres) {
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      canvas.style.top = `-${canvasOverflow/2}px`;
      context.scale(ratio, ratio);
    } else {
      canvas.width = width;
      canvas.height = height;
    }
  
    
  
    function render(highlightSpec, selectedSpec) {

      context.clearRect(0, 0, width, height);

      for (const node of data) {
        const goal = questionMap.get(node.question).sdg_world_topics;
        const question = node.question;

        const highlighted = highlightSpec?.goal === goal || highlightSpec?.question === question;
        const selected = selectedSpec?.goal === goal || selectedSpec?.question === question;
        const noneHLnoneSL = !highlightSpec && !selectedSpec;
  
        const radius = (highlighted || selected) ? 7 : node.r;
        const alpha = (noneHLnoneSL || highlighted || selected) ? 1 : opacityDim;
        const shift = heightMinusMargins/2 + marginTop;

        context.beginPath();
        context.arc(node.x, node.y + shift, radius, 0, 2 * Math.PI);
        context.fillStyle = fill(node);
        context.globalAlpha = alpha
        context.fill();
  
        // Add a stroke
        if (highlighted || selected) {
          context.lineWidth = 2; // Adjust the stroke width
          context.strokeStyle = "white"; // Stroke color
          context.stroke();
        }
        
        context.globalAlpha = 1; // Reset opacity
      }

      for (const node of data) {
        const shift = heightMinusMargins/2 + marginTop;
        const question = node.question;

        if (highlightSpec?.question === question || selectedSpec?.question === question) {
          drawCenteredText(context, Math.round(node.correct_rate) + "%", xScale(node.correct_rate) + 2, node.y + shift + 20, "bold 16px Arial", "black");
        }
      }

      // Draw the average rectangle
      const average = d3.mean(data, d => d.correct_rate);
      drawDownTriangle(context, xScale(average), height/3 - marginTop, 15, averageMarkColor);

      // Draw middle-anchored text at (200, 200)
      drawCenteredText(context, Math.round(average) + "%", xScale(average) + 2, height/3 - 22 - marginTop, "bold 16px Arial", averageMarkColor);

      // Draw middle-anchored text at (200, 200)
      if (spellOutAverage)
        drawCenteredText(context, "Average", xScale(average), height/3 - 22 - marginTop - 16, "bold 16px Arial", averageMarkColor);

      // Draw the chimp line
      if (chimpLine) {
        context.strokeStyle = "#FFCB34"; // Line color
        context.lineWidth = 3; // Line width
        context.beginPath();
        context.moveTo(xScale(33.3), marginTop); // Starting point (x1, y1)
        context.lineTo(xScale(33.3), heightMinusMargins); // Ending point (x2, y2)
        context.stroke(); // Render the line
      }
    }
  
      // Add interactivity
    let lastHoveredIndex = null;
    canvas.addEventListener("mousemove", (event) => {
      if (event.pointerType === "touch") return;
      const hoveredIndex = getNearestIndex(event);
  
      if (hoveredIndex !== lastHoveredIndex)
      canvas.dispatchEvent(new CustomEvent("circlehover", { detail: data[hoveredIndex] }));
      lastHoveredIndex = hoveredIndex;
    });
  
    canvas.addEventListener("pointerup", (event) => {
      const hoveredIndex = getNearestIndex(event);
      if (event.pointerType === "touch")
        canvas.dispatchEvent(new CustomEvent("circletouch", { detail: data[hoveredIndex] }));
      else
        canvas.dispatchEvent(new CustomEvent("circleclick", { detail: data[hoveredIndex] }));
    });
  
    function getNearestIndex(event){
      const rect = canvas.getBoundingClientRect();
      const mouseX = (event.clientX - rect.left);
      const mouseY = (event.clientY - rect.top);
  
      let nearestIndex = null;
      let nearestDistance = Infinity;
      for (let i = 0; i<data.length; i++){
        const dx = mouseX - data[i].x;
        const dy = mouseY - height/2 - data[i].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < nearestDistance) {
          nearestDistance = distance; 
          nearestIndex = i
        };
      }
  
      if(nearestDistance > 10) return null;
      return nearestIndex;
    }
    
    render();
  
    return {node: canvas, render};
  }



  function drawCenteredText(ctx, text, x, y, font = "20px Arial", color = "black", strokeColor = "white", strokeWidth = 4) {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = "center";   // Horizontally center the text at (x)
    ctx.textBaseline = "middle"; // Vertically center the text at (y)
  
    // Set stroke properties
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = strokeColor;
    ctx.strokeText(text, x, y); // Draw outline

    ctx.fillText(text, x, y);
  }

  function drawDownTriangle(ctx, x, y, side, color) {
    const height = (Math.sqrt(3) / 2) * side; // Equilateral triangle height
  
    // Calculate the three vertices
    const v1 = { x: x, y: y }; // Bottom vertex
    const v2 = { x: x - side / 2, y: y - height }; // Left vertex
    const v3 = { x: x + side / 2, y: y - height }; // Right vertex
  
    // Draw the triangle
    ctx.beginPath();
    ctx.moveTo(v1.x, v1.y);
    ctx.lineTo(v2.x, v2.y);
    ctx.lineTo(v3.x, v3.y);
    ctx.closePath();
  
    // Fill and stroke
    ctx.fillStyle = color;
    ctx.fill();
    //ctx.strokeStyle = "none"; // Optional border
    //ctx.stroke();
  }