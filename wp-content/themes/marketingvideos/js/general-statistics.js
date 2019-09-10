import DataMethods from './data-methods.js';
import PageStatistics from './page-statistics.js';
import TabulatorMethods from './tabulator-methods.js';
import ChartMethods from './charts-methods.js';
import PieMethods from './pie-methods.js';

window.GeneralStatistics = class {
  constructor(rawData) {
    this.rawData = rawData;
    this.pagesTableData = [];
    this.pagesMostViewedData = [];
  }

  // Method: Parse the global raw data from
  parseGlobalObject() {
    if (DataMethods.objEmpty(this.rawData)) {
      DataMethods.insertNode(document.body, 'h2', 'empty-data', 'There is no data!', true);
      return false;
    }

    Object.keys(this.rawData).map((obj, i) => {
      const pageInstance = new PageStatistics(obj, this.rawData[obj]);;

      this.pagesTableData[i] = pageInstance.generalData(['31.12.2018', '31.12.2222']);
    });
    return true;
  }

  // Method: Get most viewed page links
  getMostViewedPagesNames(arr, param, amount) {
    let sortedArr = arr.slice().sort((a, b) => {
      if (a && b) {
        if (a[param] > b[param]) return -1;
        if (a[param] < b[param]) return 1;
      }
      return 0;
    }).slice(0, amount);

    let pageLinks = [];
    sortedArr.forEach(el => pageLinks.push(`${el.pLink}`));

    return pageLinks;
  }

  // Method: Main launching method
  init() {
    if (!this.parseGlobalObject(this.rawData)) return false;

    const mostViewedPageNames = this.getMostViewedPagesNames(this.pagesTableData, 'visitors', 3); 

    this.pagesTableData.map(page => {
      if (mostViewedPageNames.includes(page['pLink']))
        this.pagesMostViewedData.push({pageLink: page['pLink'], pageDataArr: page['intervalData']});
    });

    DataMethods.logger(this.pagesTableData, 'obj');

    // DataMethods.logger(this.pagesMostViewedData, 'obj');

    const tabulator = new TabulatorMethods(this.pagesTableData, '#table-wrapper');
    const customCharts = new ChartMethods(this.pagesMostViewedData, '#view-chart');
    const pieMethods = new PieMethods(this.pagesTableData, 'progress-stopped', 'progress-failed');
    tabulator.init();
    customCharts.init();
    pieMethods.init();
  }
};

