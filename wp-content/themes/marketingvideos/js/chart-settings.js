class ChartData{
  constructor(generalData){
    this.generalData = generalData;
  }

  filtersData = {
    filterDomain: document.getElementById('domainFilter'),
    filterPage: document.getElementById('pageFilter'),
    filterVideo: document.getElementById('videoFilter'),
    filterApply: document.getElementById('button'),
    domainSet: new Set(),
    pageSet: new Set(),
    videoSet: new Set()
  };

  chartData = {
    avgPlayTime: [],
    currentPage: ['', '', ''],
    users: [],
    eventsArray: [],
    dateEventsArray: [],
    dates: [],
    eventStrings: [],
    splittedDateArr: [],
    viewedArr: [],
    usersCountForDateArr: [],
    totalUsersCount: 0,
    ctxAvgTime: document.getElementById('avgTime').getContext('2d'),
    ctxUsersPerDay: document.getElementById('usersPerDay').getContext('2d'),
    ctxDeviceName: document.getElementById('deviceName').getContext('2d'),
    ctxOrientation: document.getElementById('orientation').getContext('2d'),
    chartMaxPlayTime: {},
    chartDevices: {},
    chartBrowsers: {},
    chartUsers: {}
  };

  filterFillOut(set, selectElement, titlePart, filterType){
    selectElement.innerHTML = '';

    set.forEach(el => {
      let newOption = document.createElement('option');
      newOption.innerHTML = el;
      newOption.value = el;
      selectElement.appendChild(newOption);
    });
    selectElement.value = titlePart;
  }

  parseData(data){
    this.logger('Data from chart class: ', '#2bfc07', data);

    if(data.length === 0){
      this.noEntriesMessage();
      return false
    }

    this.filtersData.pageSet.clear();
    this.filtersData.videoSet.clear();
    this.chartData.eventsArray = [];
    this.chartData.dates = [];
    this.chartData.totalUsersCount = 0;
    this.chartData.splittedDateArr = [];
    this.chartData.usersCountForDateArr = [];
    this.chartData.viewedArr = [];



    Object.keys(data).map((page) => {
      let singlePage = page.split('|');

      this.filtersData.domainSet.add(singlePage[0]);

      // First time initialization
      if (!this.chartData.currentPage[0].length) {
        this.chartData.currentPage[0] = singlePage[0];
        this.chartData.currentPage[1] = singlePage[1];
        this.chartData.currentPage[2] = singlePage[2];
      }

      if (this.chartData.currentPage[0] == singlePage[0]) {

        if (!this.chartData.currentPage[1].length) {
          this.chartData.currentPage[1] = singlePage[1];
          this.chartData.currentPage[2] = singlePage[2];
        }

        this.filtersData.pageSet.add(singlePage[1]);

        if(this.chartData.currentPage[1] == singlePage[1]) {

          if (!this.chartData.currentPage[2].length) {
            this.chartData.currentPage[2] = singlePage[2];
          }

          this.filtersData.videoSet.add(singlePage[2]);

          if (this.chartData.currentPage[2] == singlePage[2]) {
            const pageObj = data[page];
            const dates = pageObj.date;

            document.getElementById('domain').innerHTML = `Domain: <b>${this.chartData.currentPage[0]}</b>;&nbsp;&nbsp;`;
            document.getElementById('title').innerHTML = `Page name: <b>${this.chartData.currentPage[1]}</b>;&nbsp;&nbsp;`;
            document.getElementById('video').innerHTML = `Video name: <b>${this.chartData.currentPage[2]}</b>;`;

            for (let date in dates) {
              this.chartData.dates.push(date);
            }

            Object.keys(dates).map((id, i) => {

              this.chartData.dateEventsArray[i] = [];
              this.chartData.dateEventsArray[i].push(dates[id].uids);

              const uidsObj = dates[id].uids;

              for (let uid in uidsObj) {
                this.chartData.users.push(uid);
                this.chartData.eventsArray.push(uidsObj[uid].events);
              }
            });
          }
        }
      }
    });

    // Fill out pages filter
    this.filterFillOut(this.filtersData.pageSet, this.filtersData.filterPage, this.chartData.currentPage[1]);
    // Fill out video filter
    this.filterFillOut(this.filtersData.videoSet, this.filtersData.filterVideo, this.chartData.currentPage[2]);
  };

  renderCharts(eventsArray) {
    this.chartData.splittedDateArr = [];

    this.chartData.avgPlayTime = [];
    let avgTimeTotal;
    let avgWatchTime = [];

    let deviceNameArrCount = [];
    let deviceOrientationArrCount = [];
    let browserArrCount = [];
    /*device data objects*/
    let deviceObj = {};
    let orientationObj = {};
    let browserObj = {};
    /*device data arrays*/
    let deviceNumbers = [];
    let deviceTypes = [];
    let browserNumbers = [];
    let browserTypes = [];
    let orientationNumbers = [];
    let orientationTypes = [];

    eventsArray.map((ev, i) => {
      //filter events for types
      let playEventsMax = ev.filter(single => single.event === 'play');
      let userLeaveEvents = ev.filter(single => single.event === 'userLeave');
      this.chartData.viewedArr.push(userLeaveEvents[0]);
      this.chartData.eventsArray[i] = [];

      //get devices info
      deviceNameArrCount.push((JSON.parse(ev[0].device)).name);
      deviceOrientationArrCount.push((JSON.parse(ev[0].device)).orientation);
      browserArrCount.push((JSON.parse(ev[0].device)).browser);

      userLeaveEvents.map((avgTime) => {
        avgWatchTime.push(avgTime.videoTime);
      });

      userLeaveEvents.map((userLeave, j) => {
        this.chartData.eventsArray[i].push(userLeave.videoTime);
      });
    });

    //mapping devices data to objects
    deviceNameArrCount.forEach((x) => {
      deviceObj[x] = (deviceObj[x] || 0) + 1
    });

    browserArrCount.forEach((x) => {
      browserObj[x] = (browserObj[x] || 0) + 1
    });

    deviceOrientationArrCount.forEach((x) => {
      orientationObj[x] = (orientationObj[x] || 0) + 1
    });
    //end

    avgTimeTotal = ((avgWatchTime.reduce((a, b) => a + b)) / avgWatchTime.length).toFixed(0);

    //mapping devices data in arrays for charts
    this.objsNumToTypesMap(deviceObj, deviceNumbers, deviceTypes);
    this.objsNumToTypesMap(browserObj, browserNumbers, browserTypes);
    this.objsNumToTypesMap(orientationObj, orientationNumbers, orientationTypes);

    //viewed count dates array
    this.chartData.viewedArr.map((viewed) => {
      if (viewed !== undefined) {
        this.chartData.splittedDateArr.push(viewed.date);
      }
    });

    //dates array
    this.chartData.dates.map((element) => {
      this.chartData.usersCountForDateArr
        .push(this.getOccurrence(this.chartData.splittedDateArr, element));
    });
    console.log("DATES", this.chartData.dates);
    console.log("SPLITTED", this.chartData.splittedDateArr);

    //user count for dates
    this.chartData.totalUsersCount = this.chartData.usersCountForDateArr
      .reduce((a, b) => a + b, 0);


    //max video played
    this.chartData.eventsArray.map((el) => {
      this.chartData.avgPlayTime.push(
        Math.max(...el).toFixed(0)
        /*(el.reduce((a, b) => a+b, 0)) / el.length*/
      );
    });

    //statistics at bottom page
    this.statisticRender(this.chartData.currentPage[0], this.chartData.currentPage[1], this.chartData.currentPage[2],
      this.chartData.totalUsersCount, avgTimeTotal);


    this.chartData.chartMaxPlayTime = this.chartBuildBar(this.chartData.chartMaxPlayTime, this.chartData.ctxAvgTime, this.chartData.avgPlayTime,
      'bar', `max play time from user`, this.iterator(this.chartData.avgPlayTime), 'time, s');

    this.chartData.chartUsers = this.chartBuildBar(this.chartData.chartUsers, this.chartData.ctxUsersPerDay, this.chartData.usersCountForDateArr,
      'bar', `viewed users count per day`, this.chartData.dates, 'users per day');
    this.chartData.chartDevices = this.chartBuidCircle(this.chartData.chartDevices, this.chartData.ctxDeviceName, 'device type', 'doughnut',
      deviceTypes, deviceNumbers);
    this.chartData.chartBrowsers = this.chartBuidCircle(this.chartData.chartBrowsers, this.chartData.ctxOrientation, 'Browsers', 'doughnut',
      browserTypes, browserNumbers);

  }

  chartBuildLinear(chartName, wrapper, dataY, type, label){
    chartName = new Chart(wrapper, {
      type: type,
      data: {
        labels: this.labelsNullify(dataY),
        datasets: [{
          label: label,
          data: dataY,
          backgroundColor: [
            'rgba(84, 0, 178, 0.2)',
          ],
          borderColor: [
            'rgba(84, 0, 178, 1)',
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'time, s'
            },
            ticks: {
              beginAtZero: true
            }
          }],
          xAxes: [{
            display: false
          }]
        }
      }
    });
  };

  chartBuildBar(chart, wrapper, dataY, type, label, dataX, labelNameY){
    if ( Object.keys(chart).length > 0 ) {
      chart.destroy();
    }

    chart = new Chart(wrapper, {
      type: type,
      data: {
        labels: dataX,
        datasets: [{
          label: label,
          data: dataY,
          backgroundColor: this.colorize(dataY, 'rgba(67, 1, 141, 0.2)')
        }]
      },
      options: {
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: labelNameY
            },
            ticks: {
              beginAtZero: true
            }
          }],
          xAxes: [{
            display: true
          }]
        }
      }
    });

    return chart;
  };

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

  noEntriesMessage(){
    let bodyElement = document.querySelector('body');
    bodyElement.innerHTML = '';
    let message = document.createElement('p');
    message.className = "no-entries";
    message.innerHTML = `There are no entries yet`;
    bodyElement.appendChild(message);
  }

  statisticRender(domainName, pageName, videoName, viewsNumber, playTimeAvg){
    const table = document.getElementById('tableBody');
    table.innerHTML = '';
    const tableWrapper = document.createElement('section');

    const minutes = Math.floor(playTimeAvg / 60);
    const seconds = Math.floor(playTimeAvg - minutes * 60);

    const timeRightPart = this.timeLeftPart(minutes, '0', 2)+':'+this.timeLeftPart(seconds, '0', 2);
    const statisticHtml = `
      <div class="table__col table__body-domainname">${domainName}</div>
      <div class="table__col table__body-pagename">${pageName}</div>
      <div class="table__col table__body-videoname">${videoName}</div>
      <div class="table__col table__col-short table__body-views">${viewsNumber}</div>
      <div class="table__col table__col-short table__body-avgtime">${timeRightPart} min.</div>
    `;
    tableWrapper.innerHTML = statisticHtml;
    table.appendChild(tableWrapper);
  }

  /*helpers*/
  objsNumToTypesMap(obj, numbersArray, typesArray){
    Object.keys(obj).map(el => {
      numbersArray.push(obj[el]);
      typesArray.push(el);
    });
  };

  iterator(data){
    const numbers = [];
    for(let i = 1; i <= data.length; i++){
      numbers.push(i)
    }
    return numbers;
  }

  labelsNullify(data){
    const labels = [];
    data.map(() => {
      labels.push('user')
    });
    return labels;
  }

  colorize(data, color){
    const colors = [];
    data.map(() => {
      colors.push(color)
    });
    return colors;
  }

  getOccurrence(array, value) {
    return array.filter((v) => (v === value)).length;
  }

  timeLeftPart(string, pad, length){
    return (new Array(length + 1).join(pad) + string).slice(-length);
  }

  logger(text, color, variable){
    console.log(`%c${text}`,`color: ${color}` ,variable);
  }

  //end helpers


  init(){
    this.parseData(this.generalData);

    if (this.chartData.eventsArray) {
      // Fill out Domains filter
      this.filterFillOut(this.filtersData.domainSet, this.filtersData.filterDomain, this.chartData.currentPage[0]);

      this.renderCharts(this.chartData.eventsArray);
    }

    let selectsArr = [this.filtersData.filterDomain, this.filtersData.filterPage, this.filtersData.filterVideo];
    selectsArr.forEach( select => {
      select.addEventListener('change', el => {
        switch(el.target) {
          case this.filtersData.filterDomain:
            this.chartData.currentPage[0] = el.target.value;
            this.chartData.currentPage[1] = '';
            this.chartData.currentPage[2] = '';
            break;
          case this.filtersData.filterPage:
            this.chartData.currentPage[1] = el.target.value;
            this.chartData.currentPage[2] = '';
            break;
          case this.filtersData.filterVideo:
            this.chartData.currentPage[2] = el.target.value;
            break;
          default: break;
        }
        this.parseData(this.generalData);
      });
    });

    this.filtersData.filterApply.addEventListener('click', btn => {
      if (this.chartData.eventsArray.length) {
        console.log(this.chartData.eventsArray);
        this.renderCharts(this.chartData.eventsArray);
      }
    });

  };
}