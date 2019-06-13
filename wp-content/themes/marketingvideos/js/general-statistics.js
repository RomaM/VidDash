import DataMethods from './data-methods.js';

export default window.GeneralStatistics = class {
  constructor(rawData) {
    this.rawData = rawData;
    this.generalData = {

    };
  }

  init() {
    DataMethods.logger('General Statistics');
  }
}