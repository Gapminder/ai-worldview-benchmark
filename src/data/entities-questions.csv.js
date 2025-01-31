
import {csvFormat} from "d3-dsv";
import { readerInstance } from "./reader-instance.js";

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

process.stdout.write(csvFormat(questions))