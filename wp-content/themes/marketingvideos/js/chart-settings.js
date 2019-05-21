
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
  };

  parseData(data){
    this.logger('Data from chart class: ', '#2bfc07', data);
    const object = data.date;
    const pageName = document.getElementById('title');
    pageName.innerHTML = data.name;
    object
      .map(el => {
        this.chartData.users.push(el.uid[0].id);
        this.logger('UID: ', 'orange', this.chartData.users);
        return el.uid
      })
      .map(uid => uid[0].events)
      .map(events => {
        this.logger('EVENTS: ', 'red', events);
        for(event of events){
          this.logger('EVENT: ', 'green', event);
          this.chartData.avgPlayTime.push(event.videoTime);
        }
        return events;
      });
    this.renderCharts();
  };

  renderCharts(){
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






