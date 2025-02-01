import * as d3 from "d3"; 

const turkoise = "#1fa0a9";

export default function OneChartCanvas({
    vendor,
    questionMap,
    marginBottom = 0, marginTop=0, height = 200, width = 800,
    data,
    xScale,
    fill = () => "#ba11ad",
    highres = true,
  }) {
    const canvas = document.createElement("canvas");
    canvas.id = vendor;
    const context = canvas.getContext("2d");
    const ratio = window.devicePixelRatio || 1;
  
    if (highres) {
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.scale(ratio, ratio);
    } else {
      canvas.width = width;
      canvas.height = height;
    }
  
    
  
    function render(highlightSpec) {
      console.log(data)
      context.clearRect(0, 0, width, height);
      for (const node of data) {
        const highlighted = 
          highlightSpec && highlightSpec.goal === questionMap.get(node.question).sdg_world_topics 
          || highlightSpec && highlightSpec.question === node.question;
  
        context.beginPath();
        context.arc(node.x, node.y + height/2, highlighted ? 7 : node.r, 0, 2 * Math.PI);
        context.fillStyle = fill(node);
        context.globalAlpha = highlightSpec && !highlighted ? 0.1 : 1; // Change opacity if highlighted
        context.fill();
  
        // Add a stroke
        if (highlighted) {
          context.lineWidth = 2; // Adjust the stroke width
          context.strokeStyle = "white"; // Stroke color
          context.stroke();
        }
        
        context.globalAlpha = 1; // Reset opacity
      }
      // Draw the average rectangle
      const average = d3.mean(data, d => d.correct_rate);
      drawDownTriangle(context, xScale(average), height/3, 15, turkoise);

      // Draw middle-anchored text at (200, 200)
      drawCenteredText(context, Math.round(average) + "%", xScale(average) + 2, height/3 - 22, "16px Arial", turkoise);

      // Draw the line
      context.strokeStyle = "orange"; // Line color
      context.lineWidth = 3; // Line width
      context.beginPath();
      context.moveTo(xScale(33.3), marginTop); // Starting point (x1, y1)
      context.lineTo(xScale(33.3), height - marginBottom - marginTop); // Ending point (x2, y2)
      context.stroke(); // Render the line
    }
  
      // Add interactivity
    let lastHoveredIndex = null;
    canvas.addEventListener("mousemove", (event) => {
      const hoveredIndex = getNearestIndex(event);
  
      if (hoveredIndex !== lastHoveredIndex)
      canvas.dispatchEvent(new CustomEvent("circlehover", { detail: data[hoveredIndex] }));
      lastHoveredIndex = hoveredIndex;
    });
  
    canvas.addEventListener("click", (event) => {
      const hoveredIndex = getNearestIndex(event);
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
  
    return {canvas, render};
  }



  function drawCenteredText(ctx, text, x, y, font = "20px Arial", color = "black") {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = "center";   // Horizontally center the text at (x)
    ctx.textBaseline = "middle"; // Vertically center the text at (y)
  
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