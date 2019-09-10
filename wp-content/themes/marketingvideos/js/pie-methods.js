import DataMethods from './data-methods.js';

export default window.PieMethods = class {
  constructor(data, pieStopped, pieFailed){
    this.data = data;
    this.pieStopped = pieStopped;
    this.pieFailed = pieFailed;
  }

  pieCalculation(element, percent) {
    const radius = 78;
    const circumference = 2 * Math.PI * radius;
    let progress = percent / 100;
    let offset = circumference * (1 - progress);

    element.style.strokeDashoffset = offset;
    element.style.strokeDasharray = circumference;
    this.legendBuild(element, percent);
  }

  pieBuild() {
    const failedArr = [], stoppedArr = [];
    let failed = 0, stopped = 0;
    this.data.map( e => { failedArr.push(e.failed); stoppedArr.push(e.stopped);});
    failed = DataMethods.avgAmount(failedArr);
    stopped = DataMethods.avgAmount(stoppedArr);
    this.pieCalculation(document.getElementById(this.pieStopped), stopped);
    this.pieCalculation(document.getElementById(this.pieFailed), failed);
  }

  legendBuild(el, val) {
      el.parentElement.parentElement.previousElementSibling
        .closest('ul').children[0].children[0].innerHTML = val;
  }

  init(){
    this.pieBuild();
  }
}