import DataMethods from './data-methods.js';

// Model: A model for a single date with necessary data
class ProcessedData {
  constructor(date, viewers, visitors, locations, avgActiveView, avgWatchTime, avgScrollTime, avgConvertedTime, avgAbandonmentTime) {
    this.date = date;
    this.viewers = viewers;
    this.visitors = visitors;
    this.locations = locations;
    this.avgActiveView = avgActiveView;
    this.avgWatchTime = avgWatchTime;
    this.avgScrollTime = avgScrollTime;
    this.avgConvertedTime = avgConvertedTime;
    this.avgAbandonmentTime = avgAbandonmentTime;
  }
}

// Class: Basic class for a page statistics
export default window.PageStatistics = class {
  constructor(videoPage, videoPageData) {
    this.videoPage = videoPage;
    this.videoPageData = videoPageData;
    this.pageStatistics = {
      pDomain: '',
      pName: '',
      pVideo: '',
      pLink: '',
      vDuration: 0,
      dates: []
    }
  }

  // Method: Get main page info
  pageInfo(rawString) {
    let data = rawString.split('|');
    [this.pageStatistics.pDomain, this.pageStatistics.pName, this.pageStatistics.pVideo, this.pageStatistics.pLink] = [data[0], data[1], data[2], `https://${data[0]}/${data[1]}`];
  }

  // Method: Parse raw info about single page
  pageData(rawData, filterDates = []) {
    let localProcessedData = {};
    let processedEvents = {};
    let timeArrs = {
      activeView: [],
      watchTimeArr: [],
      scrollTimeArr: [],
      convertedTimeArr: [],
      abandonmentTimeArr: []
    };

    Object.keys(rawData).map(obj => {
      if (obj == 'duration' && this.pageStatistics.vDuration.length === 0) {
        this.pageStatistics.vDuration = DataMethods.toTime(rawData[obj]);
      } else if (obj == 'date') {
        Object.keys(rawData[obj]).map(currDate => {
          localProcessedData = new ProcessedData('', 0, 0, {'unknownLocation': 0}, 0, 0, 0, 0, 0);
          localProcessedData.date = currDate;

          Object.keys(rawData[obj][currDate]['uids']).map((currUser, i) => {
            let currLocation = rawData[obj][currDate]['uids'][currUser]['location'];

            if (currLocation == null || currLocation == 'unknownLocation') {
              localProcessedData.locations['unknownLocation']++;
            } else if (localProcessedData.locations.hasOwnProperty(currLocation)) {
              localProcessedData.locations[currLocation]++;
            } else {
              localProcessedData.locations[currLocation] = 1;
            }

            processedEvents = this.parseEvents(rawData[obj][currDate]['uids'][currUser]['events']);

            localProcessedData.visitors++;

            if (processedEvents.watchTime > 0) {
              localProcessedData.viewers++;
              timeArrs.watchTimeArr.push(processedEvents.watchTime);
            }

            if (processedEvents.scrolling[0]) timeArrs.scrollTimeArr.push(processedEvents.scrolling[1]);

            if (processedEvents.converted[0]) timeArrs.convertedTimeArr.push(processedEvents.converted[1]);

            if (processedEvents.activeView > 0) timeArrs.activeView.push(processedEvents.activeView);

            timeArrs.abandonmentTimeArr.push(processedEvents.abandonment);
          });

          localProcessedData.avgActiveView = DataMethods.avgAmount(timeArrs.activeView);
          localProcessedData.avgWatchTime = DataMethods.avgAmount(timeArrs.watchTimeArr);
          localProcessedData.avgScrollTime = DataMethods.avgAmount(timeArrs.scrollTimeArr);
          localProcessedData.avgConvertedTime = DataMethods.avgAmount(timeArrs.convertedTimeArr);
          localProcessedData.avgAbandonmentTime = DataMethods.avgAmount(timeArrs.abandonmentTimeArr);

          this.pageStatistics.dates.push(localProcessedData);
        });
      }
    });

    return this.pageStatistics;
  }

  // Method: Parse list of events for a single UID
  parseEvents(events) {
    const processed = {
      watchTime: 0,
      soundMute: [false, 0],
      activeView: 0,
      scrolling: [false, 0],
      vertical: false,
      horizontal: false,
      converted: [false, 0],
      abandonment: 0,
      devices: new Set()
    };

    events.map(single => {
      processed.devices.add(single['device']);
      switch (single['event']) {
        case ('play'):
          break;
        case ('pause'):
          break;
        case ('userLeave'):
          if (processed.activeView == 0) {
            processed.activeView = single['videoTime'];
          }
          processed.watchTime = single['videoTime'];
          processed.abandonment = single['timestamp'];
          break;
        case ('muted'):
          if (processed.soundMute[0] == false) {
            processed.soundMute = [true, single['videoTime']]
          }
          break;
        case ('unmuted'):
          break;
        case ('formfocus'):
          if (processed.activeView == 0) {
            processed.activeView = single['videoTime'];
          }
          break;
        case ('ScrollOut'):
          if (processed.activeView == 0) {
            processed.activeView = single['videoTime'];
          }
          if (processed.scrolling[0] == false) {
            processed.scrolling = [true, single['videoTime']];
          }
          break;
        case ('submit'):
          if (processed.activeView == 0) {
            processed.activeView = single['videoTime'];
          }
          processed.watchTime = single['videoTime'];
          processed.converted = [true, single['videoTime']];
          processed.abandonment = single['timestamp'];
          break;
        default:
          break;
      }
    });

    processed.abandonment = processed.abandonment / 1000;
    return processed;
  }

  // Method: Summarize by filter dates
  recalculateByFilters(processedData, filterDates = ['31.1.2000', '31.12.2222']) {
    let summarizedData = new ProcessedData([], 0, 0, {}, 0, 0, 0, 0, 0);
    if (!DataMethods.objEmpty(processedData) && filterDates.length === 2) {
      const dFrom = DataMethods.toDate(filterDates[0]);
      const dTo = DataMethods.toDate(filterDates[1]);

      processedData['dates'].map(el => {
        let elDate = DataMethods.toDate(el.date);

        DataMethods.logger(elDate >= dFrom && elDate <= dTo);

        if(elDate >= dFrom && elDate <= dTo) {

          summarizedData.date.push(el.date);
          summarizedData.viewers += el.viewers;
          summarizedData.visitors += el.visitors;

          Object.keys(el.locations).map(location => {
            if(summarizedData.locations.hasOwnProperty(location)) summarizedData.locations[location] += el.locations[location];
            else summarizedData.locations[location] = 1
          });

          summarizedData.avgWatchTime += el.avgWatchTime;
          summarizedData.avgScrollTime += el.avgScrollTime;
          summarizedData.avgActiveView += el.avgActiveView;
          summarizedData.avgConvertedTime += el.avgConvertedTime;
          summarizedData.avgAbandonmentTime += el.avgAbandonmentTime;
        }
      });

      if (summarizedData.date.length > 0) {
        summarizedData.avgWatchTime = DataMethods.toTime(summarizedData.avgWatchTime / summarizedData.date.length);
        summarizedData.avgScrollTime = DataMethods.toTime(summarizedData.avgScrollTime / summarizedData.date.length);
        summarizedData.avgActiveView = DataMethods.toTime(summarizedData.avgActiveView / summarizedData.date.length);
        summarizedData.avgConvertedTime = DataMethods.toTime(summarizedData.avgConvertedTime / summarizedData.date.length);
        summarizedData.avgAbandonmentTime = DataMethods.toTime(summarizedData.avgAbandonmentTime / summarizedData.date.length);
      }
    }
    return (summarizedData.date.length > 0) ? summarizedData : null;
  }

  // Method: Main launching method
  init() {
    this.pageInfo(this.videoPage);
    return this.recalculateByFilters(this.pageData(this.videoPageData));
  }
}