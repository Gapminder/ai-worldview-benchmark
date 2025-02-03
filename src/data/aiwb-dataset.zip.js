
import {csvFormat} from "d3-dsv";
import { readerInstance } from "./reader-instance.js";
import JSZip from "jszip";

const questions = await readerInstance.read({
  from: "entities",
  language: "en",
  select: {
    key: ["question"],
    value:[
      "language",
      "published_version_of_question",
      "contentful_id",
      "human_wrong_percentage",
      "topic_list","sdg_world_topics",
      "other_topics",
      "option_a", "option_b", "option_c", "option_a_correctness", "option_b_correctness", "option_c_correctness",
    ]},
  where: {}
}).then(
  r => r.map(m => ({...m, sdg_world_topics: m.sdg_world_topics || "other"}))
)


const prompt_variations = await readerInstance.read({
  from: "entities",
  language: "en",
  select: {key: ["prompt_variation"], value: ["language","question_template","question_prompt_template"]},
  where: {}
})


const model_configuration = await readerInstance.read({
  from: "entities",
  language: "en",
  select: {key: ["model_configuration"], value: ["model_id","model_name", "vendor", "is--latest_model"]},
  where: {}
})

const model_configurationWithHuman = model_configuration.concat({
  model_configuration: "human",
  model_id: "human",
  model_name: "Human",
  vendor: "Human",
  "is--latest_model": true
})





const datapoints_prompts = await readerInstance.read({
    from: "datapoints",
    language: "en",
    select: {key: ["question", "model_configuration", "prompt_variation"], value: ["evaluation_result"]},
    where: {}
  })

const datapoints_correct_rate = await readerInstance.read({
  from: "datapoints",
  language: "en",
  select: {key: ["question", "model_configuration"], value: ["correct_rate"]},
  where: {}
})


const zip = new JSZip();
zip.file("entities-questions.csv", csvFormat(questions));
zip.file("entities-promptvars.csv", csvFormat(prompt_variations));
zip.file("entities-mdlconfigs.csv", csvFormat(model_configurationWithHuman));
zip.file("datapoints-rates.csv", csvFormat(datapoints_correct_rate));
zip.file("datapoints-prompts.csv", csvFormat(datapoints_prompts));
zip.generateNodeStream({ 
  streamFiles: true, 
  compression: "DEFLATE",  // Enable compression
  compressionOptions: { level: 9 }  // Set max compression level
}).pipe(process.stdout);

