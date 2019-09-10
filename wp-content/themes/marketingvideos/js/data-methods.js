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
    return ((typeof obj) !== 'object' || Object.getOwnPropertyNames(obj).length === 0);
  }

  // Method: Calculate an average data from an array
  static avgAmount(arrToAvg) {
    (arrToAvg.length > 0) ? arrToAvg : arrToAvg = [0];
    let sum = arrToAvg.reduce((acc, el) => {return acc + el}, 0);
    return Math.round(sum / arrToAvg.length);
  }

  // Method: Add a node element to a parrent
  static insertNode(parent, tagName, className = '', nodeData = '', clear = false) {
    clear ? parent.innerHTML = '' : '';
    const newNode = parent.appendChild(document.createElement(tagName));
    className ? newNode.className = className : '';
    nodeData ? newNode.innerHTML = nodeData : '';
  }

  static repeatedFields(obj, key, nullValue) {
    if (!key || key === nullValue) obj[nullValue] += 1;
    else if (obj.hasOwnProperty(key)) obj[key] += 1;
    else obj[key] = 1;
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

  static toPercent(amount, quantity) {
    const percentage = Math.round((amount / quantity) * 100);
    return percentage;
  }
}