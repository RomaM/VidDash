
class ChartData{
  constructor(generalData){
    this.generalData = generalData;
  }

  init(){
    this.parseData(this.generalData);
  };

  filtersData = {
    filterDomain: document.getElementById('domainFilter'),
    filterPage: document.getElementById('pageFilter'),
    filterVideo: document.getElementById('videoFilter'),
    // filterDateFrom: document.getElementById('dateFromFilter'),
    // filterDateTo: document.getElementById('dateToFilter'),
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
    ctxAvgTime: document.getElementById('avgTime').getContext('2d'),
    ctxUsersPerDay: document.getElementById('usersPerDay').getContext('2d'),
  };

  parseData(data){

    /*if (filterDomain.length && filterPage.length) {
      const fullName =  + '|' +filterPage;

      let dates = [];
      let uids = [];
      this.generalData.fullName.map( date => {
        date.uids.map(uid => {
          if (uid in uids) {
            uids.uid.events
          } else {
            uids.push()
          }
        });
        dates.push(date);
      });
    }*/

    this.logger('Data from chart class: ', '#2bfc07', data);
    const pageName = document.getElementById('title');

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
        this.filtersData.pageSet.add(singlePage[1]);

        if(this.chartData.currentPage[1] == singlePage[1]) {
          this.filtersData.videoSet.add(singlePage[2]);

          if (this.chartData.currentPage[2] == singlePage[2]) {
            const pageObj = data[page];
            const dates = pageObj.date;
            pageName.innerHTML = pageObj.pageName;
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

    // Fill out Domains filter
    this.filtersData.domainSet.forEach(el => {
      let newOption = document.createElement('option');
      newOption.innerHTML = el;
      this.filtersData.filterDomain.appendChild(newOption);
    });
    this.filtersData.filterDomain.value = this.chartData.currentPage[0];

    // Fill out pages filter
    this.filtersData.pageSet.forEach(el => {
      let newOption = document.createElement('option');
      newOption.innerHTML = el;
      this.filtersData.filterPage.appendChild(newOption);
    });
    this.filtersData.filterPage.value = this.chartData.currentPage[1];

    // Fill out videos filter
    this.filtersData.videoSet.forEach(el => {
      let newOption = document.createElement('option');
      newOption.innerHTML = el;
      this.filtersData.filterVideo.appendChild(newOption);
    });
    this.filtersData.filterVideo.value = this.chartData.currentPage[2];

    console.log('Video Set', this.filtersData.videoSet);

    this.logger('total events array: ', 'orchid', this.chartData.eventsArray);
    this.renderCharts(this.chartData.eventsArray);
  };

  renderCharts(eventsArray){
    eventsArray.map((ev, i) => {
      let playEventsMax = ev.filter(single => single.event === 'play');
      let userLeaveEvents = ev.filter(single => single.event === 'userLeave');
      console.log('PLAYEVNTS ', userLeaveEvents[0]);
      this.chartData.viewedArr.push(userLeaveEvents[0]);
      this.chartData.eventsArray[i] = [];

      userLeaveEvents.map((avgTime, j) => {
        this.chartData.eventsArray[i].push(avgTime.videoTime);
      });
    });

    this.chartData.viewedArr.map((viewed) => {
      this.chartData.splittedDateArr.push(viewed.date);
    });

    this.chartData.dates.map((element) => {
      this.chartData.usersCountForDateArr
        .push(this.getOccurrence(this.chartData.splittedDateArr, element));
    });


    console.log(this.chartData.usersCountForDateArr);

    this.chartData.eventsArray.map((el) => {
      this.chartData.avgPlayTime.push(
        Math.max(...el)
        /*(el.reduce((a, b) => a+b, 0)) / el.length*/
      );
    });

    this.logger('Parsed values: ', 'skyblue', this.chartData.eventsArray);

    this.chartBuildLinear('maxPlayTime', this.chartData.ctxAvgTime, this.chartData.avgPlayTime,
      'line', `max play time from ${this.chartData.users.length} users`);
    /*this.chartBuildLinear('avgScrollInChart', this.chartData.ctxScrollIn, this.chartData.avgScrollInPosition,
      'line', `scroll in position from ${this.chartData.users.length} users`);*/
    this.chartBuildBar('avgUsersPerDay', this.chartData.ctxUsersPerDay, this.chartData.usersCountForDateArr,
      'bar', `viewed users count per day`, this.chartData.dates);

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
            'rgba(255, 99, 132, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
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
          backgroundColor: this.colorize(dataY, 'rgba(48, 255, 0, 0.2)')
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

  /*userCountry = new Chart(this.chartData.ctxUserCountry, {
    type: 'doughnut',
    data: {
      labels: ['Russia', 'Spain', 'Italy', 'Sweden', 'UAE'],
      datasets: [{
        label: 'user countries',
        data: this.chartData.userCountry,
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
  });*/


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
}






