
import {csvFormat} from "d3-dsv";
import { readerInstance } from "./reader-instance.js";

const concepts = await readerInstance.read({
    from: "concepts",
    language: "en",
    select: {key: ["concept"], value: ["concept_type", "name"]},
    where: {}
  })


process.stdout.write(csvFormat(concepts))