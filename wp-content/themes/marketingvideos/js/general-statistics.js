import DataMethods from './data-methods.js';
import PageStatistics from './page-statistics.js';
import TabulatorMethods from './tabulator-methods.js';

window.GeneralStatistics = class {
  constructor(rawData) {
    this.rawData = rawData;
    this.generalStatistics = {
      locations: [{}],
      devices: [{}],
      browsers: [{}],
      failed: [{}],
      stalled: [{}]
    }
    this.pagesData = [];
  }

  // Method: Parse the global raw data from
  parseGlobalObject(data) {
    if (DataMethods.objEmpty(data)) {
      DataMethods.insertNode(document.body, 'h2', 'empty-data', 'There is no data!', true);
      return false;
    }

    Object.keys(data).map((obj, i) => {
      const pageInstance = new PageStatistics(obj, data[obj]);
      const pageResult = pageInstance.init();
      this.pagesData[i] = {
        name: pageResult.name,
        link: pageResult.link,
        //-//-//-//-//-//
      }
    });
    return true;
  }

  // Method: Main launching method
  init() {
    if (!this.parseGlobalObject(this.rawData)) return false;

    const tabulator = new TabulatorMethods();
    tabulator.init();
    /*  */
  }
}