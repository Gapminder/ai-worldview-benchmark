
import DDFCsvReader from "@vizabi/reader-ddfcsv";
import {FrontendFileReader} from "@vizabi/reader-ddfcsv/lib-web/src/index-web.js"

const readerInstance = new DDFCsvReader.prepareDDFCsvReaderObject(new FrontendFileReader)();
readerInstance.init({path: "https://github.com/open-numbers/ddf--gapminder--ai_worldview_benchmark.git"})

export {readerInstance};