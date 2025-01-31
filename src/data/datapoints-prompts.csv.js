
import {csvFormat} from "d3-dsv";
import { readerInstance } from "./reader-instance.js";

const datapoints_prompts = await readerInstance.read({
    from: "datapoints",
    language: "en",
    select: {key: ["question", "model_configuration", "prompt_variation"], value: ["evaluation_result"]},
    where: {}
  })

process.stdout.write(csvFormat(datapoints_prompts))

