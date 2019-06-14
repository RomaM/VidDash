class Data {
  constructor(generalData){
    this.generalData = generalData;
  }

  statistics = {
    pageDomains: [],
    pageNames: [],
    eventArr: [],
    datesEventArr: [],
    separateEvents: [],
    mergedEvents: [],
    viewedArray: [],
    inactiveUsers: [],
    totalUsers: [],
    userLocations: [],
    userLocationsCounts: [],
    stalledUsers: [],
    stalledPercentage: 0,
    userErrors: [],
    userErrorsPercenatge: 0
  };

  globalEvents = {
    playEvents: [],
    userleaveEvents: [],
    mutedEvents: [],
    unmutedEvents: [],
    pauseEvents: [],
    formfocusEvents: [],
    scrollOutEvents: [],
    convertedEvents: []
  };

  devices = {
    name: [],
    browser: [],
    orientation: [],
    nameType: [],
    nameCount: [],
    browserType: [],
    browserCount: [],
    orientationType: [],
    orientationCount: [],
  };

  chartData = {
    userLocationNumbers: [],
    userLocationCountries: [],
    userLocationPercentage: []
  };

  totalData = {};

  //main object parsing
  parseGlobalObject(data){
    Object.keys(data).map((obj, i) => {
      if(data.length === 0){
        this.noEntriesMessage();
        return false
      }
      this.statistics.eventArr[i] = [];
      let pageDomain = obj.split('|')[0];
      let pageName = obj.split('|')[1];

      this.statistics.pageDomains.push(pageDomain);
      this.statistics.pageNames.push(pageName);
      this.statistics.eventArr[i].push(data[obj].date);


    });
  };

  parseData() {
    let merged = [];
    let userEvents = [];
    let viewedUsers = [];
    let inactiveUsers = [];
    let userLocations = [];
    let userLocationsObj = {};
    let totalUsers = [];
    let stalledUsers = [];
    let usersWithError = [];


    this.statistics.eventArr.map((el, i) => {
      let datesObj = el[0];
      this.statistics.datesEventArr[i] = [];
      Object.keys(datesObj).map((date) => {
        this.statistics.datesEventArr[i].push(datesObj[date].uids);
      });
    });

    this.statistics.datesEventArr.map((el, i) => {
      this.statistics.separateEvents[i] = [];
      viewedUsers[i] = [];
      inactiveUsers[i] = [];
      totalUsers[i] = [];
      stalledUsers[i] = [];
      usersWithError[i] = [];

      el.map((separate) => {
        Object.keys(separate).map((event) => {
          userEvents = separate[event].events;

          userEvents.map((ev) => {
            totalUsers[i].push(event);
            if(ev.event === 'stalled'){
              stalledUsers[i].push(event);
            }
            if(ev.event === 'error'){
              usersWithError[i].push(event);
            }
            if(ev.videoTime >= 0 && ev.event === 'play'){
              viewedUsers[i].push(event);
            }
            if(ev.videoTime >= 5 && ev.event === 'pause' ||
              ev.videoTime >= 5 && ev.event === 'formfocus' ||
              ev.videoTime >= 5 && ev.event === 'userLeave' ||
              ev.videoTime >= 5 && ev.event === 'ScrollOut' ||
              ev.videoTime >= 5 && ev.event === 'stalled'
            ){
              inactiveUsers[i].push(event);
            }
          });

          userLocations.push(separate[event].location);
          this.statistics.separateEvents[i].push(userEvents);
        });
      })
    });

    this.statistics.separateEvents.map((el, i) => {
      merged[i] = [];
      merged[i].push(this.mergeArrays(el))
    });

    merged.map((el) => {
      this.statistics.mergedEvents.push(el[0])
    });
    viewedUsers.map((el, i) => {
      this.statistics.viewedArray[i] = [];
      this.statistics.viewedArray[i] = this.removeDuplicates(el);
    });
    inactiveUsers.map((el, i) => {
      this.statistics.inactiveUsers[i] = [];
      this.statistics.inactiveUsers[i] = this.removeDuplicates(el);
    });
    totalUsers.map((el, i) => {
      this.statistics.totalUsers[i] = [];
      this.statistics.totalUsers[i] = this.removeDuplicates(el);
    });
    stalledUsers.map((el, i) => {
      this.statistics.stalledUsers[i] = [];
      this.statistics.stalledUsers[i] = this.removeDuplicates(el);
    });
    usersWithError.map((el, i) => {
      this.statistics.userErrors[i] = [];
      this.statistics.userErrors[i] = this.removeDuplicates(el);
    });

    userLocations.forEach((el) => {
      userLocationsObj[el] = (userLocationsObj[el] || 0) + 1
    });

    this.statistics.userErrorsPercenatge =
      (this.mergeArrays(this.statistics.userErrors).length /
        this.mergeArrays(this.statistics.totalUsers).length) * 100 || 0;

    this.statistics.stalledPercentage =
      (this.mergeArrays(this.statistics.stalledUsers).length /
        this.mergeArrays(this.statistics.totalUsers).length) * 100 || 0;


    this.objParseToArrays(userLocationsObj, this.chartData.userLocationNumbers, this.chartData.userLocationCountries);
    this.percentageCalculation(this.chartData.userLocationNumbers, this.chartData.userLocationPercentage);
  };

  //mapping events for separate page
  eventsMapping(data){
    data.map((el, i) => {
      this.globalEvents.playEvents[i] = [];
      this.globalEvents.userleaveEvents[i] = [];
      this.globalEvents.mutedEvents[i] = [];
      this.globalEvents.unmutedEvents[i] = [];
      this.globalEvents.pauseEvents[i] = [];
      this.globalEvents.formfocusEvents[i] = [];
      this.globalEvents.scrollOutEvents[i] = [];
      this.globalEvents.convertedEvents[i] = [];
      this.devices.name[i] = [];
      this.devices.browser[i] = [];
      this.devices.orientation[i] = [];

      el.map((single) => {
        this.devices.name[i].push(JSON.parse(single.device).name);
        this.devices.browser[i].push(JSON.parse(single.device).browser);
        this.devices.orientation[i].push(JSON.parse(single.device).orientation);

        switch (single.event){
          case ('play'):
            this.globalEvents.playEvents[i].push(single.videoTime);
            break;
          case ('pause'):
            this.globalEvents.pauseEvents[i].push(single.videoTime);
            break;
          case ('userLeave'):
            this.globalEvents.userleaveEvents[i].push(single.videoTime);
            break;
          case ('muted'):
            this.globalEvents.mutedEvents[i].push(single.videoTime);
            break;
          case ('unmuted'):
            this.globalEvents.unmutedEvents[i].push(single.videoTime);
            break;
          case ('formfocus'):
            this.globalEvents.formfocusEvents[i].push(single.videoTime);
            break;
          case ('ScrollOut'):
            this.globalEvents.scrollOutEvents[i].push(single.videoTime);
            break;
          case ('submit'):
            this.globalEvents.convertedEvents[i].push(single.videoTime);
            break;
        }
      });
    });
  }

  //calculate data for statistic
  calculation(play, userLeave, mute, unmute, pause, formfocus, views, incativeViews, scroll, converted){
    let avgWatchTime = [];
    let numberOfViews = [];
    let isActiveView = [];
    let sound = [];
    let scrolling = [];
    let avgAbandone = [];
    let inactiveViewsNumber = [];
    let scrollOut = [];
    let convertedEvents = [];

    mute.map((el) => {
      if(el.length){
        sound.push('On')
      }else{
        sound.push('Off')
      }
    });

    views.map((el) => {
      numberOfViews.push(el.length);
    });
    incativeViews.map((el) => {
      inactiveViewsNumber.push(el.length);
    });

    //active view calculation (average value if user watched video more than 5 seconds)
    for(let i = 0; i < numberOfViews.length; i++){
      for(let j = i; j < inactiveViewsNumber.length; j++){
        isActiveView.push(
          ((inactiveViewsNumber[j] / numberOfViews[j]) * 100) < 50 ? 'Yes' : "No"
        );
        break;
      }
    }

    this.averageValuePush(scroll, scrollOut);
    this.averageValuePush(formfocus, scrolling);
    this.averageValuePush(pause, avgWatchTime);
    this.averageValuePush(userLeave, avgAbandone);
    this.averageValuePush(converted, convertedEvents);

    this.deviceParsing();

    this.dataTransform(this.statistics.pageDomains, this.statistics.pageNames,
      avgWatchTime, numberOfViews, sound, isActiveView, scrolling, avgAbandone, scrollOut, convertedEvents);
  };

  //parcing device events
  deviceParsing(){
    const nameObj = {};
    const browserObj = {};
    const orientationObj = {};
    let nameArr = [];
    let browserArr = [];
    let orientationArr = [];

    this.devices.name.map((el, i) => {
      nameArr.push(this.removeDuplicates(el))
    });
    this.devices.browser.map((el, i) => {
      browserArr.push(this.removeDuplicates(el))
    });
    this.devices.orientation.map((el, i) => {
      orientationArr.push(this.removeDuplicates(el))
    });

    nameArr = this.mergeArrays(nameArr);
    browserArr = this.mergeArrays(browserArr);
    orientationArr = this.mergeArrays(orientationArr);

    nameArr.forEach((el) => {
      nameObj[el] = (nameObj[el] || 0) + 1
    });
    browserArr.forEach((el) => {
      browserObj[el] = (browserObj[el] || 0) + 1
    });
    orientationArr.forEach((el) => {
      orientationObj[el] = (orientationObj[el] || 0) + 1
    });

    this.objParseToArrays(nameObj, this.devices.nameCount, this.devices.nameType);
    this.objParseToArrays(browserObj, this.devices.browserCount, this.devices.browserType);
    this.objParseToArrays(orientationObj, this.devices.orientationCount, this.devices.orientationType);

    this.renderDevice(this.devices.nameType, this.devices.nameCount, document.getElementById('deviceTable'));
    this.renderDevice(this.devices.browserType, this.devices.browserCount, document.getElementById('browserTable'));
    this.renderDevice(this.devices.orientationType, this.devices.orientationCount, document.getElementById('orientationTable'));
  }


  //transform events to one object
  dataTransform(domain, pageName, avgWatchTime, numberOfViews,
                sound, activeView, scrolling, avgAbandone, scrollOut, converted){

    this.totalData = domain.map((s,i) => ({
      domain : s,
      pageName : pageName[i],
      averageWatchTime: avgWatchTime[i],
      numberViews: numberOfViews[i],
      muted: sound[i],
      isActiveView: activeView[i],
      formFocus: scrolling[i],
      averageAbandone: avgAbandone[i],
      scrollOut: scrollOut[i],
      converted: converted[i]
    }));
  };

  //render device tables
  renderDevice(nameArr, numberArr, wrapper){
    const domElement = document.createElement('TBODY');
    nameArr.forEach((el, i) => {
      domElement.insertAdjacentHTML('beforeEnd',
        `
          <tr>
            <th scope="col">${el}</th>
            <th scope="col">${numberArr[i]}</th>
          </tr>
        `
      )
    });
    //wrapper.appendChild(domElement);
  }

  //render bottom table
  renderStatistics(dataArr){
    const table = document.getElementById('dataTable');
    const domElement = document.createElement('TBODY');

    dataArr.forEach((el) => {
      domElement.insertAdjacentHTML('beforeEnd',
        //TODO place link in library
        `
          <tr>
            <th scope="col">${el.domain}</th>
            <th scope="col">${el.pageName}</th>
            <th scope="col">
                <a href="https://${el.domain}/${el.pageName}">Link</a>
            </th> 
            <th scope="col">${this.toMinutes(el.averageWatchTime)}</th>
            <th scope="col">${el.numberViews}</th>
            <th scope="col">${el.muted}</th>
            <th scope="col">${el.isActiveView}</th>
            <th scope="col">${this.toMinutes(el.scrollOut)}</th>
            <th scope="col">${this.toMinutes(el.converted)}</th>
            <th scope="col">${this.toMinutes(el.averageAbandone)}</th>
          </tr>
        `
      )
    });
    //table.appendChild(domElement);
  };


  renderGlobalPercentage(data, dom){
    const domElement = document.createElement('DIV');
    domElement.insertAdjacentHTML('beforeEnd', `${data.toFixed(0)}<span>%</span>`);
    //dom.appendChild(domElement);
  };

  //render locations table
  renderLocations(countriesArr, percentsArr){
    const tableLocations = document.getElementById('locationTable');
    const domElementLocations = document.createElement('TBODY');

    countriesArr.forEach((el, i) => {
      console.log('Location: ',el);
      if(el !== null && el !== 'null' && el !== 'unknownLocation'){
        domElementLocations.insertAdjacentHTML('beforeEnd',
          `
          <tr>
              <th scope="col">${el}</th>
              <th scope="col">${percentsArr[i].toFixed(0)}%</th>
          </tr>
        `);
      }
    });

    //tableLocations.appendChild(domElementLocations);
  };

  /**HELPERS**/
  mergeArrays(array){
    return [].concat.apply([], array);
  };

  averageValue(array){
    return (array.reduce((a,b) => a+b, 0)) / array.length;
  };

  removeDuplicates(array){
    return array.reduce((a,b) => {
      if (a.indexOf(b) < 0 ) a.push(b);
      return a;
    },[]);
  };

  timeLeftPart(string, pad, length){
    return (new Array(length + 1).join(pad) + string).slice(-length);
  };

  toMinutes(seconds){
    const avgWatchMinutes = Math.floor(seconds / 60);
    const avgWatchSeconds = Math.floor(seconds - avgWatchMinutes * 60);
    return this.timeLeftPart(avgWatchMinutes, '0', 2)+'m. '
      +' : '+this.timeLeftPart(avgWatchSeconds, '0', 2)+'s.';
  };

  averageValuePush(mapArr, targetArr){
    mapArr.map((el) => {
      if(el.length){
        targetArr.push(this.averageValue(el));
      }else{
        targetArr.push(0)
      }
    });
  };

  objParseToArrays(obj, numbersArray, typesArray){
    Object.keys(obj).map(el => {
      numbersArray.push(obj[el]);
      typesArray.push(el);
    });
  };

  percentageCalculation(numberArr, percentArr){
    let total = numberArr.reduce((a,b) => a + b, 0);
    numberArr.map((el) => {
      percentArr.push(
        ((parseInt(el) / total) * 100)
      )
    })
  };

  noEntriesMessage(){
    let bodyElement = document.querySelector('body');
    bodyElement.innerHTML = '';
    let message = document.createElement('p');
    message.className = "no-entries";
    message.innerHTML = `There are no entries yet`;
    bodyElement.appendChild(message);
  }
  /**HELPERS END**/


  /*CHARTS*/
  chartBuidCircle(chart, wrapper, label, type, labels, data){
    if ( Object.keys(chart).length > 0 ) {
      chart.destroy();
    }

    chart = new Chart(wrapper, {
      type: type,
      data: {
        labels: labels,
        datasets: [{
          label: label,
          data: data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(49, 255, 41, 0.2)',
            'rgba(47, 255, 247, 0.2)',
            'rgba(189, 14, 157, 0.2)',
            'rgba(255, 179, 0, 0.2)',
          ]
        }]
      },
      options: {
        showDatasetLabels : true,
        cutoutPercentage: 41,
        legend: {
          display: true,
          position:'bottom',
          labels: {
              fontFamily: "Arial",
              boxWidth: 15,
              boxHeight: 2,
          },
        },
        scales: {
          yAxes: [{
            display: false
          }],
          xAxes: [{
            display: false
          }]
        }
      }
    });
    return chart;
  }
  /*CHARTS END*/

  init(){
    this.parseGlobalObject(this.generalData);
    this.parseData();
    this.eventsMapping(this.statistics.mergedEvents);
    this.calculation(this.globalEvents.playEvents, this.globalEvents.userleaveEvents, this.globalEvents.mutedEvents,
      this.globalEvents.unmutedEvents, this.globalEvents.pauseEvents, this.globalEvents.formfocusEvents,
      this.statistics.viewedArray, this.statistics.inactiveUsers,
      this.globalEvents.scrollOutEvents, this.globalEvents.convertedEvents);
    this.renderStatistics(this.totalData);

    /*this.chartData.locationChart = this.chartBuidCircle(this.chartData.locationChart, this.chartData.ctxLocation,
      'location', 'doughnut', this.chartData.userLocationCountries, this.chartData.userLocationNumbers);*/
    this.renderLocations(this.chartData.userLocationCountries, this.chartData.userLocationPercentage);

    this.renderGlobalPercentage(this.statistics.userErrorsPercenatge, document.getElementById('error'));
    this.renderGlobalPercentage(this.statistics.stalledPercentage, document.getElementById('stalled'));

    //console.log('%cDATA: ', 'color: #00FF00', this.generalData);
  };
}