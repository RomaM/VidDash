import DataMethods from './data-methods.js';

// Model: A model for a single date with necessary data
class ProcessedData {
  constructor(date, viewers, visitors, locations, device, browser, orientation, muted, failed, stopped, avgActiveView, avgWatchTime, avgScrollTime, avgConvertedTime, avgAbandonmentTime) {
    this.date = date;
    this.viewers = viewers;
    this.visitors = visitors;
    this.locations = locations;
    this.device = device;
    this.browser = browser;
    this.orientation = orientation;
    this.muted = muted;
    this.failed = failed;
    this.stopped = stopped;
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

  // Method: Parse list of events for a single UID
  parseEvents(events) {
    const processed = {
      watchTime: 0,
      muted: [false, 0],
      activeView: 0,
      scrolling: [false, 0],
      vertical: false,
      horizontal: false,
      converted: [false, 0],
      abandonment: 0,
      devices: new Set(),
      failed: false,
      stopped: false
    };

    events.map(single => {
      processed.devices.add(single['device']);

      switch (single['event']) {
        case ('play'):
          break;
        case ('pause'):
          break;
        case ('userLeave'):
          if (processed.activeView == 0) processed.activeView = single['videoTime'];
          processed.watchTime = single['videoTime'];
          processed.abandonment = single['timestamp'];
          break;
        case ('muted'):
          if (processed.muted[0] == false) processed.muted = [true, single['videoTime']]
          break;
        case ('unmuted'):
          break;
        case ('formfocus'):
          if (processed.activeView == 0) processed.activeView = single['videoTime'];
          break;
        case ('ScrollOut'):
          if (processed.activeView == 0) processed.activeView = single['videoTime'];
          if (processed.scrolling[0] == false) processed.scrolling = [true, single['videoTime']];
          break;
        case ('submit'):
          if (processed.activeView == 0) processed.activeView = single['videoTime'];
          processed.watchTime = single['videoTime'];
          processed.converted = [true, single['videoTime']];
          processed.abandonment = single['timestamp'];
          break;
        case ('error'):
          if (processed.failed == false) processed.failed = true;
        case ('abort'):
        case ('emptied'):
        case ('stalled'):
          if (processed.stopped == false) processed.stopped = true;
          break;
        default:
          break;
      }
    });

    // DataMethods.logger(processed.devices, 'obj');

    processed.abandonment = processed.abandonment / 1000;
    return processed;
  }

  // Method: Get main page info
  pageInfo(rawString) {
    let data = rawString.split('|');
    [this.pageStatistics.pDomain, this.pageStatistics.pName, this.pageStatistics.pVideo, this.pageStatistics.pLink] = [data[0], data[1], data[2], `https://${data[0]}/${data[1]}`];
  }

  // Method: Parse raw info about single page
  pageData(rawData) {
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
      if (obj == 'duration' && this.pageStatistics.vDuration == 0) {
        this.pageStatistics.vDuration = DataMethods.toTime(rawData[obj]);
      } else if (obj == 'date') {
        Object.keys(rawData[obj]).map(currDate => {
          localProcessedData = new ProcessedData('', 0, 0, {'unknownLocation': 0}, [], [], [], [], 0, 0, 0, 0, 0, 0, 0);
          localProcessedData.date = currDate;

          Object.keys(rawData[obj][currDate]['uids']).map((currUser) => {
            let currLocation = rawData[obj][currDate]['uids'][currUser]['location'];

            /* Get events statistic per a user*/
            processedEvents = this.parseEvents(rawData[obj][currDate]['uids'][currUser]['events']);

            localProcessedData.visitors++;
            if (processedEvents.watchTime > 0) {
              localProcessedData.viewers++;
              timeArrs.watchTimeArr.push(processedEvents.watchTime);
            }

            if (currLocation == null || currLocation == 'unknownLocation') {
              localProcessedData.locations['unknownLocation']++;
            } else if (localProcessedData.locations.hasOwnProperty(currLocation)) {
              localProcessedData.locations[currLocation]++;
            } else {
              localProcessedData.locations[currLocation] = 1;
            }



            if (processedEvents.muted[0]) localProcessedData.muted.push(processedEvents.muted);

            if (processedEvents.failed == true) localProcessedData.failed++;

            if (processedEvents.stopped == true) localProcessedData.stopped++;

            if (processedEvents.scrolling[0]) timeArrs.scrollTimeArr.push(processedEvents.scrolling[1]);

            if (processedEvents.converted[0]) timeArrs.convertedTimeArr.push(processedEvents.converted[1]);

            if (processedEvents.activeView > 0) timeArrs.activeView.push(processedEvents.activeView);

            timeArrs.abandonmentTimeArr.push(processedEvents.abandonment);

            localProcessedData.failed += processedEvents.failed;
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

  // Method: Summarize by filter dates
  recalculateByFilters(processedData, filterDates = ['31.1.2000', '31.12.2222']) {
    let summarizedData = new ProcessedData([], 0, 0, {}, [], [], [], [0, 0], 0, 0, 0, 0, 0, 0, 0);
    if (!DataMethods.objEmpty(processedData) && filterDates.length === 2) {
      const dFrom = DataMethods.toDate(filterDates[0]);
      const dTo = DataMethods.toDate(filterDates[1]);

      processedData['dates'].map(el => {
        let elDate = DataMethods.toDate(el.date);

        if(elDate >= dFrom && elDate <= dTo) {

          summarizedData.date.push(el.date);
          summarizedData.viewers += el.viewers;
          summarizedData.visitors += el.visitors;

          Object.keys(el.locations).map(location => {
            if(summarizedData.locations.hasOwnProperty(location)) summarizedData.locations[location] += el.locations[location];
            else summarizedData.locations[location] = 1
          });

          el.muted.map(singleMute => {
            summarizedData.muted['0']++; // Amount of muted users
            summarizedData.muted['1'] += singleMute['1']; // Average of muted time
          });

          summarizedData.stopped += el.stopped;
          summarizedData.failed += el.failed;
          summarizedData.avgWatchTime += el.avgWatchTime;
          summarizedData.avgScrollTime += el.avgScrollTime;
          summarizedData.avgActiveView += el.avgActiveView;
          summarizedData.avgConvertedTime += el.avgConvertedTime;
          summarizedData.avgAbandonmentTime += el.avgAbandonmentTime;
        }
      });

      if (summarizedData.date.length > 0) {
        if (summarizedData.muted[0] > 0) {
          // Percentage of visitors to muted users
          summarizedData.muted['0'] = DataMethods.toPercent(summarizedData.muted['0'], summarizedData.viewers);
          // Average viewed time before muted
          summarizedData.muted['1'] = DataMethods.toTime(summarizedData.muted['1'] / summarizedData.muted['0']);
        }

        if (summarizedData.stopped > 0) {summarizedData.stopped = DataMethods.toPercent(summarizedData.stopped, summarizedData.visitors)};
        if (summarizedData.failed > 0) {summarizedData.failed = DataMethods.toPercent(summarizedData.failed, summarizedData.visitors)};

        summarizedData.avgWatchTime = DataMethods.toTime(summarizedData.avgWatchTime / summarizedData.date.length);
        summarizedData.avgScrollTime = DataMethods.toTime(summarizedData.avgScrollTime / summarizedData.date.length);
        summarizedData.avgActiveView = DataMethods.toTime(summarizedData.avgActiveView / summarizedData.date.length);
        summarizedData.avgConvertedTime = DataMethods.toTime(summarizedData.avgConvertedTime / summarizedData.date.length);
        summarizedData.avgAbandonmentTime = DataMethods.toTime(summarizedData.avgAbandonmentTime / summarizedData.date.length);
      }
    }
    summarizedData.pDomain = processedData.pDomain;
    summarizedData.pName = processedData.pName;
    summarizedData.pVideo = processedData.pVideo;
    summarizedData.pLink = processedData.pLink;
    summarizedData.vDuration = processedData.vDuration;
    return (summarizedData.date.length > 0) ? summarizedData : null;
  }

  // Method: Main launching method
  init() {
    this.pageInfo(this.videoPage);
    return this.recalculateByFilters(this.pageData(this.videoPageData));
  }
}