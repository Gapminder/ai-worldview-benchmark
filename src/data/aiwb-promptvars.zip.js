
import {csvFormat} from "d3-dsv";
import { readerInstance } from "./reader-instance.js";
import JSZip from "jszip";

const prompt_variations = await readerInstance.read({
  from: "entities",
  language: "en",
  select: {key: ["prompt_variation"], value: ["language","question_template","question_prompt_template"]},
  where: {}
})

const datapoints_prompts = await readerInstance.read({
  from: "datapoints",
  language: "en",
  select: {key: ["question", "model_configuration", "prompt_variation"], value: ["evaluation_result"]},
  where: {}
})

const zip = new JSZip();
zip.file("entities-promptvars.csv", csvFormat(prompt_variations));
zip.file("datapoints-prompts.csv", csvFormat(datapoints_prompts));
zip.generateNodeStream({ 
  streamFiles: true, 
  compression: "DEFLATE",  // Enable compression
  compressionOptions: { level: 9 }  // Set max compression level
}).pipe(process.stdout);

