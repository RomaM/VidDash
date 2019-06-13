export default class DataMethods {
  constructor() {}

  static logger(msg) {
    console.log('%c%s', 'color: orange;', `LOGGER: ${msg}`);
  }

  static avgAmount(arrToSum) {
    let sum;
    sum = arrToSum.reduce((acc, el) => {return acc + parseInt(el, 10)}, 0);
    return sum / arrToSum.length;
  }
}