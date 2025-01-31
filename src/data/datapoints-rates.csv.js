
import {csvFormat} from "d3-dsv";
import { readerInstance } from "./reader-instance.js";

const datapoints_correct_rate = await readerInstance.read({
    from: "datapoints",
    language: "en",
    select: {key: ["question", "model_configuration"], value: ["correct_rate"]},
    where: {}
  })

process.stdout.write(csvFormat(datapoints_correct_rate))



