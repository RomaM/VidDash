import DataMethods from './data-methods.js';
import PageStatistics from './page-statistics.js';
import TabulatorMethods from './tabulator-methods.js';

window.GeneralStatistics = class {
  constructor(rawData) {
    this.rawData = rawData;
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
      const pageResult = pageInstance.init(['22.07.2019', '31.12.2222']);

      this.pagesData[i] = pageResult;
    });
    return true;
  }

  // Method: Sorting array of objects by a param
  sortingByParam(arr, param) {
    return arr.sort((a, b) => {
      if (a && b) {
        if (a[param] > b[param]) return 1;
        if (a[param] < b[param]) return -1;
      }
      return 0;
    });
  }

  // Method: Main launching method
  init() {
    if (!this.parseGlobalObject(this.rawData)) return false;

    this.sortingByParam(this.pagesData, 'visitors');

    DataMethods.logger(this.pagesData, 'obj');
    const tabulator = new TabulatorMethods(this.pagesData, '#table-wrapper');
    tabulator.init();
    /*  */
  }

};