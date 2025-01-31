
export default function OneChartCanvas({
    marginBottom = 0, marginTop=0, height = 200, width = 800,
    data,
    xScale,
    fill = () => "#ba11ad",
    highres = true,
  }) {
    const canvas = document.createElement("canvas");
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
  
      const distances = data.map((d, i)=>{
         const dx = mouseX - d.x;
         const dy = mouseY - height/2 - d.y;
         return {index: i, distance: Math.sqrt(dx * dx + dy * dy)};
      }).toSorted((a,b) => a.distance - b.distance);
  
      return distances[0].index;
    }
    
    render();
  
    return {canvas, render};
  }