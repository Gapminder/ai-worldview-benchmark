
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
      "short_title",
    ]},
  where: {}
}).then(
  r => r.map(m => ({...m, sdg_world_topics: m.sdg_world_topics || "other"}))
)

const model_configuration = await readerInstance.read({
  from: "entities",
  language: "en",
  select: {key: ["model_configuration"], value: ["model_id","model_name","model_publish_date","vendor", "is--latest_model"]},
  where: {}
})

const model_configurationWithHuman = model_configuration.concat({
  model_configuration: "humans",
  model_id: "humans",
  model_name: "Humans",
  vendor: "Humans",
  "is--latest_model": true
})

const datapoints_correct_rate = await readerInstance.read({
  from: "datapoints",
  language: "en",
  select: {key: ["question", "model_configuration"], value: ["correct_rate"]},
  where: {}
})


const zip = new JSZip();
zip.file("entities-questions.csv", csvFormat(questions));
zip.file("entities-mdlconfigs.csv", csvFormat(model_configurationWithHuman));
zip.file("datapoints-rates.csv", csvFormat(datapoints_correct_rate));
zip.generateNodeStream({ 
  streamFiles: true, 
  compression: "DEFLATE",  // Enable compression
  compressionOptions: { level: 9 }  // Set max compression level
}).pipe(process.stdout);

