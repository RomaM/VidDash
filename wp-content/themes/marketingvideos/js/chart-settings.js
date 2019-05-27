
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


  resetProperties(){
    this.chartData.avgPlayTime = [];
    this.chartData.users = [];
    this.chartData.eventsArray = [];
    this.chartData.dateEventsArray = [];
    this.chartData.dates = [];
    this.chartData.eventStrings = [];
    this.chartData.splittedDateArr = [];
    this.chartData.viewedArr = [];
    this.chartData.usersCountForDateArr = [];
  }


  parseData(data){
    this.logger('Data from chart class: ', '#2bfc07', data);
    const pageName = document.getElementById('title');

    if(Object.keys(data).length === 0 && data.constructor === Object){
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
            pageName.innerHTML = singlePage[1];
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


  noEntriesMessage(){
    let bodyElement = document.querySelector('body');
    bodyElement.innerHTML = '';
    let message = document.createElement('p');
    message.className = "no-entries";
    message.innerHTML = `There are no entries yet`;
    bodyElement.appendChild(message);
  }

  statisticRender(videoName, viewsNumber, playTimeAvg){
    const table = document.getElementById('tableBody');
    const tableWrapper = document.createElement('section');
    const statisticHtml = `
      <div class="table__col table__body-videoname">${videoName}</div>
      <div class="table__col table__body-views">${viewsNumber}</div>
      <div class="table__col table__body-avgtime">${playTimeAvg} s.</div>
    `;
    tableWrapper.innerHTML = statisticHtml;
    table.appendChild(tableWrapper);
  }


  renderCharts(eventsArray) {
    let avgTimeTotal;
    let avgWatchTime = [];
    /*let deviceNameArr = new Set();
    let deviceOrientationArr = new Set();*/
    let deviceNameArrCount = [];
    let deviceOrientationArrCount = [];

    let deviceObj = {};
    let orientationObj = {};

    let deviceNumbers = [];
    let deviceTypes = [];

    let orientationNumbers = [];
    let orientationTypes = [];

    eventsArray.map((ev, i) => {
      let playEventsMax = ev.filter(single => single.event === 'play');
      let userLeaveEvents = ev.filter(single => single.event === 'userLeave');
      this.chartData.viewedArr.push(userLeaveEvents[0]);
      this.chartData.eventsArray[i] = [];

      console.log("EVENTS MAPPED", ev);
      /*deviceNameArr.add((JSON.parse(ev[0].device)).name);
      deviceOrientationArr.add((JSON.parse(ev[0].device)).orientation);*/

      deviceNameArrCount.push((JSON.parse(ev[0].device)).name);
      deviceOrientationArrCount.push((JSON.parse(ev[0].device)).orientation);

      playEventsMax.map((avgTime) => {
        avgWatchTime.push(avgTime.videoTime);
      });

      userLeaveEvents.map((userLeave, j) => {
        this.chartData.eventsArray[i].push(userLeave.videoTime);
      });
    });

    deviceNameArrCount.forEach((x) => {
      deviceObj[x] = (deviceObj[x] || 0) + 1
    });

    deviceOrientationArrCount.forEach((x) => {
      orientationObj[x] = (orientationObj[x] || 0) + 1
    });

    console.log('DEVICES-arr', deviceNameArrCount);
    console.log('ORIENTATION-arr', deviceOrientationArrCount);
    console.log('DEVICES', deviceObj);
    console.log('ORIENTATION', orientationObj);

    avgTimeTotal = ((avgWatchTime.reduce((a, b) => a + b)) / avgWatchTime.length).toFixed(2);


    Object.keys(deviceObj).map(deviceName => {
      deviceNumbers.push(deviceObj[deviceName]);
      deviceTypes.push(deviceName);
    });

    Object.keys(orientationObj).map(orientationName => {
      orientationNumbers.push(orientationObj[orientationName]);
      orientationTypes.push(orientationName);
    });

    console.log('DEVICE NUMS', deviceNumbers);
    console.log('DEVICE TYPES', deviceTypes);

    console.log('ORIENT NUMS', orientationNumbers);
    console.log('ORIENT TYPES', orientationTypes);

    this.chartData.viewedArr.map((viewed) => {
      if (viewed !== undefined) {
        this.chartData.splittedDateArr.push(viewed.date);
      }
    });

    this.chartData.dates.map((element) => {
      this.chartData.usersCountForDateArr
        .push(this.getOccurrence(this.chartData.splittedDateArr, element));
    });

    this.chartData.totalUsersCount = this.chartData.usersCountForDateArr
      .reduce((a, b) => a + b, 0);


    this.chartData.eventsArray.map((el) => {
      this.chartData.avgPlayTime.push(
        Math.max(...el)
        /*(el.reduce((a, b) => a+b, 0)) / el.length*/
      );
    });

    this.statisticRender(this.chartData.currentPage[2], this.chartData.totalUsersCount, avgTimeTotal);

    this.logger('Parsed values: ', 'skyblue', this.chartData.eventsArray);

    this.chartBuildLinear('maxPlayTime', this.chartData.ctxAvgTime, this.chartData.avgPlayTime,
      'line', `max play time from ${this.chartData.users.length} users`);
    /*this.chartBuildLinear('avgScrollInChart', this.chartData.ctxScrollIn, this.chartData.avgScrollInPosition,
      'line', `scroll in position from ${this.chartData.users.length} users`);*/
    this.chartBuildBar('avgUsersPerDay', this.chartData.ctxUsersPerDay, this.chartData.usersCountForDateArr,
      'bar', `viewed users count per day`, this.chartData.dates);

    this.chartBuidCircle('totalDevices', this.chartData.ctxDeviceName, 'device type', 'doughnut',
      deviceTypes, deviceNumbers);

    this.chartBuidCircle('orientations', this.chartData.ctxOrientation, 'orientation type', 'doughnut',
      orientationTypes, orientationNumbers)
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

  chartBuildBar(chartName, wrapper, dataY, type, label, dataX){
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
              labelString: 'users per day'
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



  /*helpers*/
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

  logger(text, color, variable){
    console.log(`%c${text}`,`color: ${color}` ,variable);
  }

  init(){
    this.parseData(this.generalData);

    // Fill out Domains filter
    this.filtersData.domainSet.forEach(el => {
      let newOption = document.createElement('option');
      newOption.innerHTML = el;
      newOption.value = el;
      this.filtersData.filterDomain.appendChild(newOption);
    });
    this.filtersData.filterDomain.value = this.chartData.currentPage[0];


    // Fill out pages filter
    this.filtersData.pageSet.forEach(el => {
      let newOption = document.createElement('option');
      newOption.innerHTML = el;
      newOption.value = el;
      this.filtersData.filterPage.appendChild(newOption);
    });
    this.filtersData.filterPage.value = this.chartData.currentPage[1];

    // Fill out video filter
    this.filtersData.videoSet.forEach(el => {
      let newOption = document.createElement('option');
      newOption.innerHTML = el;
      newOption.value = el;
      this.filtersData.filterVideo.appendChild(newOption);
    });
    this.filtersData.filterVideo.value = this.chartData.currentPage[2];



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






