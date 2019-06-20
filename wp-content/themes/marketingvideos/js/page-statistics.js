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
  constructor(videoPage, videoPageData) {// todo: Add a parameter (an array [from, to]) to parsing by dates
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
  pageData(rawData) { // todo: Include parsing dates parameter
    let localProcessedData = {};
    let processedEvents = {};
    let timeArrs = {
      activeView: [0],
      watchTimeArr: [0],
      scrollTimeArr: [0],
      convertedTimeArr: [0],
      abandonmentTimeArr: [0]
    }

    Object.keys(rawData).map((obj, i) => {
      if (obj == 'duration' && this.pageStatistics.vDuration.length === 0) {
        this.pageStatistics.vDuration = DataMethods.toTime(rawData[obj]);
      } else if (obj == 'date') {
        Object.keys(rawData[obj]).map((currDate, i) => {
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

          localProcessedData.avgActiveView = DataMethods.toTime(DataMethods.avgAmount(timeArrs.activeView));
          localProcessedData.avgWatchTime = DataMethods.toTime(DataMethods.avgAmount(timeArrs.watchTimeArr));
          localProcessedData.avgScrollTime = DataMethods.toTime(DataMethods.avgAmount(timeArrs.scrollTimeArr));
          localProcessedData.avgConvertedTime = DataMethods.toTime(DataMethods.avgAmount(timeArrs.convertedTimeArr));
          localProcessedData.avgAbandonmentTime = DataMethods.toTime(DataMethods.avgAmount(timeArrs.abandonmentTimeArr));


          this.pageStatistics.dates.push(localProcessedData);
        });

        DataMethods.logger(this.pageStatistics, 'obj');
      }
    });
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

  // Method: Main launching method
  init() {
    this.pageInfo(this.videoPage);
    this.pageData(this.videoPageData);

    return this.pageStatistics;
  }
}