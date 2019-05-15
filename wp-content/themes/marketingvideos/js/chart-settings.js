
(function(){

  const chartData = {
    avgPlayTime: [5.03, 19.07, 3.05, 5.2, 2, 3],
    avgScrollOutPosition: [1.26, 5.33, 8.5, 9.54, 7, 8.2, 7.7, 4.8],
    avgScrollInPosition: [3.29, 6.55, 8.54, 10.33, 7.5, 10.2, 9.5, 12.3 ],
    userCountry: [55, 578, 115, 20, 240],
    ctxAvgTime: document.getElementById('avgTime').getContext('2d'),
    ctxScrollIn: document.getElementById('scrollIn').getContext('2d'),
    ctxScrollOut: document.getElementById('scrollOut').getContext('2d'),
    ctxUserCountry: document.getElementById('userCountry').getContext('2d'),
  };

  function labelsNullify(data){
    const labels = [];
    data.map(() => {
      labels.push('user')
    });
    return labels;
  }

  function colorize(data, color){
    const colors = [];
    data.map(() => {
      colors.push(color)
    });
    return colors;
  }

  const avgTimeChart = new Chart(chartData.ctxAvgTime, {
    type: 'line',
    data: {
      labels: labelsNullify(chartData.avgPlayTime),
      datasets: [{
        label: 'avg. play time',
        data: chartData.avgPlayTime,
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

  const avgScrollOutChart = new Chart(chartData.ctxScrollOut, {
    type: 'bar',
    data: {
      labels: labelsNullify(chartData.avgScrollOutPosition),
      datasets: [{
        label: 'scroll out position',
        data: chartData.avgScrollOutPosition,
        backgroundColor: colorize(chartData.avgScrollOutPosition, 'rgba(48, 255, 0, 0.2)')
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

  const avgScrollInChart = new Chart(chartData.ctxScrollIn, {
    type: 'line',
    data: {
      labels: labelsNullify(chartData.avgScrollInPosition),
      datasets: [{
        label: 'scroll in position',
        data: chartData.avgScrollInPosition,
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

  const userCountry = new Chart(chartData.ctxUserCountry, {
    type: 'doughnut',
    data: {
      labels: ['Russia', 'Spain', 'Italy', 'Sweden', 'UAE'],
      datasets: [{
        label: 'user countries',
        data: chartData.userCountry,
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

})();
