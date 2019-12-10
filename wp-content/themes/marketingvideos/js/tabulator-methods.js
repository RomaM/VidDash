import DataMethods from './data-methods.js';

export default window.TabulatorMethods = class {
  constructor(pagesData, tableWrapper){
    this.pagesData = pagesData;
    this.tableWrapper = tableWrapper;
    //DataMethods.logger(this.pagesData, 'obj')
  };

  // config table columns
  static generateColumns(){

    const nullFormatter = (cell) => {
      const formattedCell = cell.getValue() == 0 ? DataMethods.toTime(cell.getValue()) : cell.getValue();
      const row = cell.getRow();
      row.update();
      return formattedCell;
    };

    return [
      {title:"", field:"pDomain", headerFilter: 'input',
        resizable: false, headerFilterPlaceholder:"Domain name"},
      {title:"", field:"pName", headerFilter: true,
        resizable: false, headerFilterPlaceholder:"Page name"},
      {title:"Links", field:"pLink", align:"left", width: 80, formatter:"link",
        formatterParams:{label:"link", target:"_blank",}, resizable: false},
      {title:"Avg. watch", field:"avgWatchTime", align:"left", width: 110, resizable: false},
      {title:"Viewers", field:"viewers", width: 88, align:"left", resizable: false},
      {title:"Visitors", field:"visitors", width: 88, align:"left", resizable: false},
      {title:"Vrt./Hor.", field:"orientations", width: 90, align:"left", resizable: false,
        formatter: (cell) => {
          return cell.getValue().split(",")[0] + "% " + "/" + cell.getValue().split(",")[1] + "%"
        }
      },
      {title:"Mute", field: "muted", align:"left", width: 80, resizable: false,
        formatter: (cell) => {
          return cell.getValue().split(",")[0] + "%"
        }
      },
      {title:"Active view", field:"avgActiveView", align:"left", width: 120, resizable: false},
      {title:"Scrolling", field:"avgScrollTime", align:"left", width: 110, resizable: false,
        formatter: cell => nullFormatter(cell)
      },
      {title:"Converted", field:"avgConvertedTime", align:"left", width: 110, resizable: false,
        formatter: cell => nullFormatter(cell)
      },
      {title:"Avg. aband.", field:"avgAbandonmentTime", width: 120, resizable: false},
    ];
  }

  configTable(){
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