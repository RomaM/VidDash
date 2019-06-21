export default class DataMethods {
  constructor() {}

  // Method: Logger for the console
  static logger(msg, type = '') {
    switch (type) {
      case 'err':
        console.log('%c%s', 'color: red;', `Error: ${msg}`);
        break;
      case 'warn':
        console.log('%c%s', 'color: orange;', `Warning: ${msg}`);
        break;
      case 'obj':
        console.log(msg);
        break;
      default:
        console.log('%c%s', 'color: yellow;', `LOGGER: ${msg}`);
        break;
    }
  }

  // Method: Check object emptiness
  static objEmpty(obj) {
    if ((typeof obj) !== 'object' || Object.getOwnPropertyNames(obj).length === 0 ) { return true; }
    return false;
  }

  // Method: Calculate an average data from an array
  static avgAmount(arrToAvg) {
    (arrToAvg.length > 0) ? arrToAvg : arrToAvg = [0];
    let sum = arrToAvg.reduce((acc, el) => {return acc + parseInt(el, 10)}, 0);
    return sum / arrToAvg.length;
  }

  // Method: Add a node element to a parrent
  static insertNode(parent, tagName, className = '', nodeData = '', clear = false) {
    clear ? parent.innerHTML = '' : '';
    const newNode = parent.appendChild(document.createElement(tagName));
    className ? newNode.className = className : '';
    nodeData ? newNode.innerHTML = nodeData : '';
  }

  // Method: Round seconds and convert to time
  static toTime(number = 0) {
    let measuredTime = new Date(null);
    measuredTime.setSeconds(Math.round(number));
    return measuredTime.toISOString().substr(11, 8);

  }

  static toDate(string = '1.1.1111') {
    let formatted = string.split('.');
    formatted = new Date(formatted[2], formatted[1]-1, formatted[0]);
    return formatted;
  }

}