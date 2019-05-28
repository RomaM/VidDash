
class ChartData{
  constructor(generalData){
    this.generalData = generalData;
  }

  filtersData = {
    filterDomain: document.getElementById('domainFilter'),
    filterPage: document.getElementById('pageFilter'),
    filterVideo: document.getElementById('videoFilter'),
    filterButton: document.getElementById('button'),
    domainSet: new Set(),
    pageSet: new Set(),
    videoSet: new Set(),
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
  };


  /*resetProperties(){
    this.chartData.avgPlayTime = [];
    this.chartData.users = [];
    this.chartData.eventsArray = [];
    this.chartData.dateEventsArray = [];
    this.chartData.dates = [];
    this.chartData.eventStrings = [];
    this.chartData.splittedDateArr = [];
    this.chartData.viewedArr = [];
    this.chartData.usersCountForDateArr = [];
  }*/


  parseData(data){
    this.logger('Data from chart class: ', '#2bfc07', data);
    const pageName = document.getElementById('title');
    const domainName = document.getElementById('domain');
    const videoName = document.getElementById('video');

    if(data.length === 0){
      this.noEntriesMessage();
      return false
    }
    
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

          // if (!this.chartData.currentPage[2].length) {
          //   this.chartData.currentPage[2] = singlePage[2];
          // }

          this.filtersData.videoSet.add(singlePage[2]);

          if (this.chartData.currentPage[2] == singlePage[2]) {
            const pageObj = data[page];
            const dates = pageObj.date;

            domainName.innerHTML = `Domain: <b>${singlePage[0]}</b>;&nbsp;&nbsp;`;
            pageName.innerHTML = `Page name: <b>${singlePage[1]}</b>;&nbsp;&nbsp;`;
            videoName.innerHTML = `Video name: <b>${singlePage[2]}</b>;`;

            this.logger('Dates: ', 'orange', dates);
            for (let date in dates) {
              this.chartData.dates.push(date);
            }

            Object.keys(dates).map((id, i) => {

              this.chartData.dateEventsArray[i] = [];
              this.chartData.dateEventsArray[i].push(dates[id].uids);

              const uidsObj = dates[id].uids;
              this.logger('UIDs: ', 'red', uidsObj);

              for (let uid in uidsObj) {
                this.chartData.users.push(uid);
                this.chartData.eventsArray.push(uidsObj[uid].events);
                this.logger('UID strings: ', 'lawngreen', this.chartData.users);
                this.logger('events: ', 'green', this.chartData.eventsArray);
              }
              this.logger('single UID events example: ', 'cyan', uidsObj);
            });
            this.logger('Separate page', 'lightgreen', pageObj);
            this.logger('Page name: ', 'yellow', pageObj.pageName)
          }
        }
      }
    });

    console.log('Video Set', this.filtersData.videoSet);
    this.logger('total events array: ', 'orchid', this.chartData.eventsArray);
    this.renderCharts(this.chartData.eventsArray);
  };

  renderCharts(eventsArray) {
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

      console.log("EVENTS MAPPED", ev);

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

    console.log('DEVICE NUMS', deviceNumbers);
    console.log('DEVICE TYPES', deviceTypes);
    console.log('ORIENT NUMS', orientationNumbers);
    console.log('ORIENT TYPES', orientationTypes);

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

    this.logger('Parsed values: ', 'skyblue', this.chartData.eventsArray);

    //charts build
    /*this.chartBuildLinear('maxPlayTime', this.chartData.ctxAvgTime, this.chartData.avgPlayTime,
      'line', `max play time from ${this.chartData.users.length} users`);*/
    this.chartBuildBar('maxPlayTime', this.chartData.ctxAvgTime, this.chartData.avgPlayTime,
      'bar', `max play time from user`, this.iterator(this.chartData.avgPlayTime), 'time, s');
    this.chartBuildBar('avgUsersPerDay', this.chartData.ctxUsersPerDay, this.chartData.usersCountForDateArr,
      'bar', `viewed users count per day`, this.chartData.dates, 'users per day');
    this.chartBuidCircle('totalDevices', this.chartData.ctxDeviceName, 'device type', 'doughnut',
      deviceTypes, deviceNumbers);
    this.chartBuidCircle('browserData', this.chartData.ctxOrientation, 'Browsers', 'doughnut',
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

  chartBuildBar(chartName, wrapper, dataY, type, label, dataX, labelNameY){
    chartName = new Chart(wrapper, {
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
  };

  chartBuidCircle(chartName, wrapper, label, type, labels, data){
    chartName = new Chart(wrapper, {
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

  filterFillOut(set, selectElement, titlePart){
    set.forEach(el => {
      let newOption = document.createElement('option');
      newOption.innerHTML = el;
      newOption.value = el;
      selectElement.appendChild(newOption);
    });
    selectElement.value = titlePart;
  }
  //end helpers


  init(){
    this.parseData(this.generalData);

    // Fill out Domains filter
    this.filterFillOut(this.filtersData.domainSet, this.filtersData.filterDomain, this.chartData.currentPage[0]);

    // Fill out pages filter
    this.filterFillOut(this.filtersData.pageSet, this.filtersData.filterPage, this.chartData.currentPage[1]);

    // Fill out video filter
    this.filterFillOut(this.filtersData.videoSet, this.filtersData.filterVideo, this.chartData.currentPage[2]);

    // this.filtersData.filterDomain.addEventListener('change', () => {
    //   this.filtersData.pageSet.clear();
    //
    //   console.log(this.filtersData.pageSet);
    //
    //   this.chartData.currentPage[0] = this.filtersData.filterDomain.value;
    //
    //   this.parseData(this.generalData);
    //
    //   // Fill out pages filter
    //   this.filtersData.pageSet.forEach(el => {
    //     let newOption = document.createElement('option');
    //     newOption.innerHTML = el;
    //     newOption.value = el;
    //     this.filtersData.filterPage.appendChild(newOption);
    //   });
    //   this.filtersData.filterPage.value = this.chartData.currentPage[1];
    // });

    // this.filtersData.filterButton.addEventListener('click', (e) => {
    //   console.log(e);
    //   this.resetProperties();
    //   this.parseData(this.generalData);
    // });

  };
}






