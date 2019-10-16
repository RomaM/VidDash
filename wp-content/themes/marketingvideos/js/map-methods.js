
export default window.MapMethods = class {
  constructor(pagesData, wrapper){
    this.pagesData = pagesData;
    this.wrapper = wrapper;
  }

  mapDataCalculation(data){
    const locationsArr = [];
    const locations = {};

    data.map((e) => {
      locationsArr.push(e.locations);
    });

    locationsArr.map(e => {
      for(const [key, val] of Object.entries(e)){
        if(!locations.hasOwnProperty(key) && key !== 'unknownLocation'){
          locations[key] = val;
        }else if(key !== 'unknownLocation'){
          locations[key] = +locations[key] + +val;
        }
      }
    });

    for(const [key, val] of Object.entries(locations)){
      locations[key] = {number: val};

      if(val >= 0 && val < 50){
        locations[key].fillKey = 'LOW'
      } else if(val >=50 && val < 200) {
        locations[key].fillKey = 'MEDIUM'
      } else{
        locations[key].fillKey = 'HIGH'
      }

    }

    this.renderMap(locations);
  };

  renderMap(dataObj){
    const options = {
      element: document.getElementById(this.wrapper),
      fills: {
        HIGH: '#662c91',
        LOW: '#b295c8',
        MEDIUM: '#9c77b8',
        UNKNOWN: 'orange',
        defaultFill: '#e0d5e9'
      },
      data: dataObj,
      geographyConfig: {
        popupTemplate: (geo, data) => {
          return `
            <div class="map__popup">
                <p>${geo.properties.name}</p>
                <p>Users: <b>${data.number}</b></p>
            </div>
          `
        }
      }
    };
    const map = new Datamap(options);
  }

  init(){
    this.mapDataCalculation(this.pagesData);
  }
}