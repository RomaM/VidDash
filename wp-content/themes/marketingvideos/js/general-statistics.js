import DataMethods from './data-methods.js';

window.GeneralStatistics = class {
  constructor(rawData) {
    this.rawData = rawData;
    this.generalData = {

    };
  }

  init() {
    DataMethods.logger('General Statistics');
    DataMethods.logger(DataMethods.avgAmount(['1', '2', '3', 4, 5]));
  }
}