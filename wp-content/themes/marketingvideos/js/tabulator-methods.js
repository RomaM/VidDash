import DataMethods from './data-methods.js';

export default window.TabulatorMethods = class {
  constructor(pagesData, tableWrapper){
    this.pagesData = pagesData;
    this.tableWrapper = tableWrapper;
  };

  //TODO remove methods and place values from library side
  static getMutedPercentage(data){
    data.map(e => {e.mutedPercents = `${e.muted[0]}%`});
    return data
  };
  static getVisitorsPercentage(data){
    data.map(e => {
      let percents = (e.viewers/e.visitors) * 100;
      e.viewersPercents = `${e.viewers}/${e.visitors} (${percents}%)`;
    });
    return data
  };
  //**//

  // config table columns
  static generateColumns(){
    return [
      {title:"", field:"pDomain", headerFilter: 'input',
        resizable: false, headerFilterPlaceholder:"Domain name"},
      {title:"", field:"pName", headerFilter: true,
        resizable: false, headerFilterPlaceholder:"Page name"},
      {title:"Links", field:"pLink", align:"left", width: 80, formatter:"link",
        formatterParams:{label:"link", target:"_blank",}, resizable: false},
      {title:"Avg. watch time", field:"avgWatchTime", align:"left", width: 150, resizable: false},
      {title:"Views/Visitors", field:"viewersPercents", width: 140, align:"left", resizable: false},
      /*{title:"Visitors", field:"visitors", width: 90, align:"left", resizable: false},*/
      {title:"Mute", field:"mutedPercents", align:"left", width: 80, resizable: false},
      {title:"Active view", field:"avgActiveView", align:"left", width: 120, resizable: false},
      {title:"Scrolling", field:"avgScrollTime", align:"left", width: 110, resizable: false},
      /*{title:"Orientation", field:"orientation", align:"left"},*/
      {title:"Converted", field:"avgConvertedTime", align:"left", width: 110, resizable: false},
      {title:"Avg. abandonement", field:"avgAbandonmentTime", width: 170, resizable: false},
    ];
  }

  configTable(){
    TabulatorMethods.getMutedPercentage(this.pagesData);
    TabulatorMethods.getVisitorsPercentage(this.pagesData);
    return {
      data: this.pagesData,
      layout: 'fitColumns',
      layoutColumnsOnNewData:true,
      columns: TabulatorMethods.generateColumns()
    }
  }

  init(){
    new Tabulator(this.tableWrapper, this.configTable());
  }
}