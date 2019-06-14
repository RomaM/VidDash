export default class DataMethods {
  constructor() {}

  // Method: Logger for the console
  static logger(msg) {
    console.log('%c%s', 'color: orange;', `LOGGER: ${msg}`);
  }

  // Method: Check object emptiness
  static objEmpty(obj) {
    if ((typeof obj) !== 'object' || Object.getOwnPropertyNames(obj).length === 0 ) { return true; }
    return false;
  }

  // Method: Calculate an average data from an array
  static avgAmount(arrToAvg) {
    let sum;
    sum = arrToAvg.reduce((acc, el) => {return acc + parseInt(el, 10)}, 0);
    return sum / arrToAvg.length;
  }

  // Method: Add a node element to a parrent
  static insertNode(parent, tagName, className = '', nodeData = '', clear = false) {
    clear ? parent.innerHTML = '' : '';
    const newNode = parent.appendChild(document.createElement(tagName));
    className ? newNode.className = className : '';
    nodeData ? newNode.innerHTML = nodeData : '';
  }

}