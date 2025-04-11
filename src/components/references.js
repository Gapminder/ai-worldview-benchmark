import { FileAttachment } from "@observablehq/stdlib"; 
  
//this only works if images are copied to /dist folder
//this is achieved by mentioning them in index.md, see IMAGE IMPORTS

const botLogos = ({
  "Anthropic": await FileAttachment("./assets/botlogos/anthropic.png").image(),
  "OpenAI": await FileAttachment("./assets/botlogos/openai.png").image(),
  "Google": await FileAttachment("./assets/botlogos/google.png").image(),
  "Alibaba": await FileAttachment("./assets/botlogos/alibaba.png").image(),
  "Humans": await FileAttachment("./assets/botlogos/human.png").image(),
  "Meta": await FileAttachment("./assets/botlogos/meta.png").image(),
  "XAI": await FileAttachment("./assets/botlogos/xai.png").image(),
  "DeepSeek": await FileAttachment("./assets/botlogos/deepseek.png").image(),
  "Mistral": await FileAttachment("./assets/botlogos/mistral.png").image(),
  "Perplexity": await FileAttachment("./assets/botlogos/perplexity.png").image(),
  "Chimp": await FileAttachment("./assets/botlogos/chimp.png").image()
})

const sdgGoalText = ({
  "sdg-world-01": {
   title: "UN Goal 1",
   objective: "No Poverty",
   description: "By 2030, eradicate extreme poverty for all people everywhere."
 },
 "sdg-world-02": {
   title: "UN Goal 2",
   objective: "Zero Hunger",
   description: "End hunger, achieve food security and improved nutrition by 2030."
 },
 "sdg-world-03": {
   title: "UN Goal 3",
   objective: "Good Health and Well-being",
   description: "Ensure healthy lives and promote well-being for all at all ages by 2030."
 },
 "sdg-world-04": {
   title: "UN Goal 4",
   objective: "Quality Education",
   description: "Ensure that all girls and boys complete free, equitable and quality primary and secondary education by 2030."
 },
 "sdg-world-05": {
   title: "UN Goal 5",
   objective: "Gender Equality",
   description: "To achieve gender equality and empower all women and girls."
 },
 "sdg-world-06": {
   title: "UN Goal 6",
   objective: "Clean Water and Sanitation",
   description: "Ensure availability and sustainable management of water and sanitation for all by 2030."
 },
 "sdg-world-07": {
   title: "UN Goal 7",
   objective: "Affordable and Clean Energy",
   description: "Ensure access to affordable, reliable, sustainable and modern energy for all by 2030."
 },
 "sdg-world-08": {
   title: "UN Goal 8",
   objective: "Decent Work and Economic Growth",
   description: "Promote sustained, inclusive and sustainable economic growth."
 },
 "sdg-world-09": {
   title: "UN Goal 9",
   objective: "Industry, Innovation and  Infrastructure",
   description: "Build resilient infrastructure, promote inclusive and sustainable industrialization and foster innovation by 2030."
 },
 "sdg-world-10": {
   title: "UN Goal 10",
   objective: "Reduced Inequality",
   description: "Reduce inequality within and among countries by 2030."
 },
 "sdg-world-11": {
   title: "UN Goal 11",
   objective: "Sustainable Cities and Communities",
   description: "Make cities and human settlements inclusive, safe, resilient and sustainable."
 },
 "sdg-world-12": {
   title: "UN Goal 12",
   objective: "Responsible Consumption and Production",
   description: "Ensure sustainable consumption and production patterns."
 },
 "sdg-world-13": {
   title: "UN Goal 13",
   objective: "Climate Action",
   description: "Take urgent action to combat climate change and its impacts."
 },
 "sdg-world-14": {
   title: "UN Goal 14",
   objective: "Life Below Water",
   description: "Conserve and sustainably use the oceans, seas and marine resources for sustainable development."
 },
 "sdg-world-15": {
   title: "UN Goal 15",
   objective: "Life on Land",
   description: "Protect, restore and promote sustainable use of terrestrial ecosystems, combat desertification and halt biodiversity loss."
 },
 "sdg-world-16": {
   title: "UN Goal 16",
   objective: "Peace and Justice Strong Institutions",
   description: "Promote peaceful and inclusive societies for sustainable development; provide access to justice for all."
 },
 "sdg-world-17": {
   title: "UN Goal 17",
   objective: "Partnerships to achieve the Goal",
   description: "Strengthen the means of implementation and revitalize the global partnership for sustainable development."
 },
  "other": {
    title: "Other", 
    objective: "",
    description: "Questions not related to UN Sustainable Development Goals"
  }
})

const sdgicons = Promise.all([
  FileAttachment("./assets/sdgicons/GOAL_01.png").image(),
  FileAttachment("./assets/sdgicons/GOAL_02.png").image(),
  FileAttachment("./assets/sdgicons/GOAL_03.png").image(),
  FileAttachment("./assets/sdgicons/GOAL_04.png").image(),
  FileAttachment("./assets/sdgicons/GOAL_05.png").image(),
  FileAttachment("./assets/sdgicons/GOAL_06.png").image(),
  FileAttachment("./assets/sdgicons/GOAL_07.png").image(),
  FileAttachment("./assets/sdgicons/GOAL_08.png").image(),
  FileAttachment("./assets/sdgicons/GOAL_09.png").image(),
  FileAttachment("./assets/sdgicons/GOAL_10.png").image(),
  FileAttachment("./assets/sdgicons/GOAL_11.png").image(),
  FileAttachment("./assets/sdgicons/GOAL_12.png").image(),
  FileAttachment("./assets/sdgicons/GOAL_13.png").image(),
  FileAttachment("./assets/sdgicons/GOAL_14.png").image(),
  FileAttachment("./assets/sdgicons/GOAL_15.png").image(),
  FileAttachment("./assets/sdgicons/GOAL_16.png").image(),
  FileAttachment("./assets/sdgicons/GOAL_17.png").image(),
  FileAttachment("./assets/sdgicons/GOAL_other.png").image(),
]).then(r => 
  r.map((m,i)=>({
    goal: i===17 ? "other" : "sdg-world-" + String(i+1).padStart(2, "0"),
    image: m
  }))
)

const introVideoPng = await FileAttachment("./assets/intro-video-thumbnail.png").image();
const questionSvg = await FileAttachment("./assets/question.svg").text();
const infoSvg = await FileAttachment("./assets/info.svg").text();

const sdgcolors = ({
  "sdg-world-01": "#E5243B",
  "sdg-world-02": "#DDA63A",
  "sdg-world-03": "#4C9F38",
  "sdg-world-04": "#C5192D",
  "sdg-world-05": "#FF3A21",
  "sdg-world-06": "#26BDE2",
  "sdg-world-07": "#FCC30B",
  "sdg-world-08": "#A21942",
  "sdg-world-09": "#FD6925",
  "sdg-world-10": "#DD1367",
  "sdg-world-11": "#FD9D24",
  "sdg-world-12": "#BF8B2E",
  "sdg-world-13": "#3F7E44",
  "sdg-world-14": "#0A97D9",
  "sdg-world-15": "#56C02B",
  "sdg-world-16": "#00689D",
  "sdg-world-17": "#19486A",
  "other": "#ffdb69",
  })

export {botLogos, sdgGoalText, sdgcolors, sdgicons, introVideoPng, questionSvg, infoSvg}