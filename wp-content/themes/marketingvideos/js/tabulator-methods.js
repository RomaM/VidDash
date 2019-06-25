import DataMethods from './data-methods.js';

export default window.TabulatorMethods = class {
  constructor(pagesData){
    this.pagesData = pagesData;
  };

  tabledata(){
    console.log('TABLE-DATA',this.pagesData[0].avgAbandonmentTime);

    /*let data = [
      { name:"test-page", links:`https://xxxx`, avgWatchTime: '05:44m', views:12,
        mute: 40, activeView: '22:44m', scrolling: "01: 15s", orientation: 'Vertical',
        converted: '05:14s', avgAbandonement:'03:11m'},
      { name:"test-page2", links:"https://xxxx", avgWatchTime: '07:44m', views:10,
        mute: 70, activeView: '22:44m', scrolling: "09: 15s", orientation: 'Vertical',
        converted: '05:14s', avgAbandonement:'03:11m'},
      { name:"test-page3", links:"https://xxxx", avgWatchTime: '08:44m', views:1,
        mute: 55, activeView: '22:44m', scrolling: "01: 18s", orientation: 'Vertical',
        converted: '08:14s', avgAbandonement:'07:11m'},
      { name:"test-page4", links:"https://xxxx", avgWatchTime: '10:44m', views:7,
        mute: 12, activeView: '22:44m', scrolling: "01: 15s", orientation: 'Vertical',
        converted: '05:14s', avgAbandonement:'08:11m'},
      { name:"test-page5", links:"https://xxxx", avgWatchTime: '12:40m', views:8,
        mute: 11, activeView: '22:44m', scrolling: "05: 15s", orientation: 'Vertical',
        converted: '09:14s', avgAbandonement:'05:11m'},
      { name:"test-page6", links:"https://xxxx", avgWatchTime: '15:42m', views:11,
        mute: 15, activeView: '22:44m', scrolling: "01: 15s", orientation: 'Vertical',
        converted: '08:14s', avgAbandonement:'02:11m'},
    ];*/

    /*avgAbandonmentTime: "00:00:38"
    avgActiveView: "00:00:26"
    avgConvertedTime: "00:00:32"
    avgScrollTime: "00:00:27"
    avgWatchTime: "00:00:32"
    date: ["7.6.2019"]
    failed: 0
    locations: {unknownLocation: 1, Ukraine: 1}
    muted: (2) [100, "00:00:00"]
    stopped: 0
    viewers: 1
    visitors: 1*/

    return data
  }

  columns(){
    let data = [
      {title:"Page name", field:"name", width:250, /*headerFilter: true*/ },
      {title:"Links", field:"links", align:"left", formatter:"link", formatterParams:{label:"link"}},
      {title:"Avg. watch time", field:"avgWatchTime", align:"left"},
      {title:"Views", field:"viewers", align:"left"},
      {title:"Visitors", field:"visitors", align:"left"},
      {title:"Mute", field:"muted", align:"left"},
      {title:"Active view", field:"avgActiveView", align:"left"},
      {title:"Scrolling", field:"avgScrollTime", align:"left"},
      /*{title:"Orientation", field:"orientation", align:"left"},*/
      {title:"Converted", field:"avgConvertedTime", align:"left"},
      {title:"Avg. abandonement", field:"avgAbandonmentTime"},
    ];
    return data
  }

  createTable(){
    const table = new Tabulator("#table-wrapper", {
      data: this.pagesData,
      layout: 'fitColumns',
      layoutColumnsOnNewData:true,
      columns: this.columns()
    });
    return table
  }

  init(){
    this.createTable();
  }
}