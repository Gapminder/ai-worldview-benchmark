import {csvFormat} from "d3-dsv";
import { readerInstance } from "./reader-instance.js";

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

process.stdout.write(csvFormat(model_configurationWithHuman))


