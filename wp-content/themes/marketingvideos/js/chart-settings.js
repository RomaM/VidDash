
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
    ctxScrollOut: document.getElementById('scrollOut').getContext('2d'),
    ctxUserCountry: document.getElementById('userCountry').getContext('2d'),
    users: [],
    eventsArray: [],
    dates: [],
    eventStrings: []
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
      const pageObj = object[page];
      const dates = pageObj.date;
      pageName.innerHTML = pageObj.pageName;

      Object.keys(dates).map((id) => {
        const uidsObj = dates[id].uids;
        this.logger('UIDs: ', 'red', uidsObj);

        for(let uid in uidsObj){
          this.logger('UID array: ', 'lawngreen', uidsObj[uid].events);

          this.chartData.users.push(uid);
          this.chartData.eventsArray.push(uidsObj[uid].events);

          this.logger('UID strings: ', 'lawngreen', this.chartData.users);
          this.logger('events: ', 'green', this.chartData.eventsArray);
        }

        this.logger('single UID events example: ', 'cyan', uidsObj);

        /*Object.keys(uidsObj).map((events, i) => {
          const eventObj = uidsObj[events];
          this.chartData.eventsArray.push(eventObj);
          this.logger('events: ', 'green', eventObj);
        })*/

      });

      this.logger('Dates: ', 'orange', dates);
      for(let date in dates){
        this.chartData.dates.push(date);
      }

      this.logger('Separate page', 'lightgreen', pageObj);
      this.logger('Page name: ', 'yellow', pageObj.pageName)
    });

    this.logger('total events array: ', 'orchid', this.chartData.eventsArray);
    this.renderCharts(this.chartData.eventsArray);
  };

  renderCharts(eventsArray){
    eventsArray.map((ev, i) => {
      let result = ev.filter(part => part.event === 'play');
      this.chartData.eventsArray[i] = [];

      result.map((avgTime, j) => {
        this.chartData.eventsArray[i].push(avgTime.videoTime);
        console.log('TEMP',this.chartData.eventsArray);
      });
    });

    console.log('EV Strings', this.chartData.eventStrings);

    this.chartBuild('avgPlayTime', this.chartData.ctxAvgTime, this.chartData.avgPlayTime,
      'line', `avg. play time from ${this.chartData.users.length} users`);
    this.chartBuild('avgScrollInChart', this.chartData.ctxScrollIn, this.chartData.avgScrollInPosition,
      'line', `scroll in position from ${this.chartData.users.length} users`);
  }



  chartBuild(chartName, wrapper, dataY, type, label){
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

  avgScrollOutChart = new Chart(this.chartData.ctxScrollOut, {
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
  });

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

  logger(text, color, variable){
    console.log(`%c${text}`,`color: ${color}` ,variable);
  }
}






