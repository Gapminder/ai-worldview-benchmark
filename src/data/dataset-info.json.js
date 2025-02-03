import { readerInstance } from "./reader-instance.js";

const dsinfo = await readerInstance.getDatasetInfo();

process.stdout.write(JSON.stringify(dsinfo));