export default window.TabulatorMethods = class {
  constructor(){

  }


  tabledata(){
    let data = [
      { name:"Oli Bob", age:"12", col:"red", dob:""},
      { name:"Mary May", age:"1", col:"blue", dob:"14/05/1982"},
      { name:"Christine Lobowski", age:"42", col:"green", dob:"22/05/1982"},
      { name:"Brendon Philips", age:"125", col:"orange", dob:"01/08/1980"},
      { name:"Margret Marmajuke", age:"16", col:"yellow", dob:"31/01/1999"},
    ];
    return data
  }

  columns(){
    let data = [
      {title:"Name", field:"name", width:250, headerFilter: true },
      {title:"Age", field:"age", align:"left", formatter:"progress"},
      {title:"Favourite Color", field:"col"},
      {title:"Date Of Birth", field:"dob", sorter:"date", align:"center"},
    ];
    return data
  }

  createTable(){
    const table = new Tabulator("#table-wrapper", {
      data: this.tabledata(),
      layout: 'fitDataFill',
      columns: this.columns()
    });
    return table
  }

  init(){
    this.createTable();
    console.log('Tables init')
  }
}