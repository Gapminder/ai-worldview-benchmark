
import {csvFormat} from "d3-dsv";
import { readerInstance } from "./reader-instance.js";

const prompt_variations = await readerInstance.read({
    from: "entities",
    language: "en",
    select: {key: ["prompt_variation"], value: ["language","question_template","question_prompt_template"]},
    where: {}
  })

process.stdout.write(csvFormat(prompt_variations))