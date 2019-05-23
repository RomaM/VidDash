
class ChartData{
  constructor(generalData){
    this.generalData = generalData;
  }

  init(){
    this.parseData(this.generalData);
  };

  chartData = {
    avgPlayTime: [],
    avgScrollOutPosition: [1.26, 5.33, 8.5, 9.54, 7, 8.2, 7.7, 4.8],
    avgScrollInPosition: [3.29, 6.55, 8.54, 10.33, 7.5, 10.2, 9.5, 12.3 ],
    userCountry: [55, 578, 115, 20, 240],
    ctxAvgTime: document.getElementById('avgTime').getContext('2d'),
    ctxScrollIn: document.getElementById('scrollIn').getContext('2d'),
    ctxUsersPerDay: document.getElementById('usersPerDay').getContext('2d'),
    ctxUserCountry: document.getElementById('userCountry').getContext('2d'),
    currentPage: 'Test-Page-Name',
    users: [],
    eventsArray: [],
    dateEventsArray: [],
    dates: [],
    eventStrings: [],
    splittedDateArr: [],
    viewedArr: [],
    usersCountForDateArr: []


  };

  parseData(data){

    /*if (filterDomain.length && filterPage.length) {
      const fullName = filterDomain + '|' +filterPage;

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
    const object = data;
    const pageName = document.getElementById('title');


    Object.keys(object).map((page) => {

      if(this.chartData.currentPage === object[page].pageName) {

          const pageObj = object[page];
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

          /*this.chartData.dateEventsArray.map((el) => {
            Object.keys(el[0]).map((users) => {
              console.log('EL ',el[0][users]);
            });
          });
          console.log(this.chartData.dateEventsArray);*/


          this.logger('Separate page', 'lightgreen', pageObj);
          this.logger('Page name: ', 'yellow', pageObj.pageName)
      }

    });

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
    this.chartBuildLinear('avgScrollInChart', this.chartData.ctxScrollIn, this.chartData.avgScrollInPosition,
      'line', `scroll in position from ${this.chartData.users.length} users`);
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
          backgroundColor: this.colorize(this.chartData.avgScrollOutPosition, 'rgba(48, 255, 0, 0.2)')
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

  /*avgScrollOutChart = new Chart(this.chartData.ctxScrollOut, {
    type: 'bar',
    data: {
      labels: this.labelsNullify(this.chartData.avgScrollOutPosition),
      datasets: [{
        label: 'scroll out position',
        data: this.chartData.avgScrollOutPosition,
        backgroundColor: this.colorize(this.chartData.avgScrollOutPosition, 'rgba(48, 255, 0, 0.2)')
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
  });*/

  userCountry = new Chart(this.chartData.ctxUserCountry, {
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
  });


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






