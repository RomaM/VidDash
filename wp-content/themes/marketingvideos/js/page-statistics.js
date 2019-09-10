import DataMethods from './data-methods.js';

// Model: A model for a single date with necessary data
class ProcessedData {
  constructor(date, viewers, visitors, locations, devices, browsers, orientations, muted, failed, stopped, avgActiveView, avgWatchTime, avgScrollTime, avgConvertedTime, avgAbandonmentTime) {
    this.date = date;
    this.viewers = viewers;
    this.visitors = visitors;
    this.locations = locations;
    this.devices = devices;
    this.browsers = browsers;
    this.orientations = orientations;
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
  constructor(videoPageInfo, videoPageData) {
    this.videoPageInfo = videoPageInfo;
    this.videoPageData = videoPageData;
    this.detailedInfo = {
      pDomain: '',
      pName: '',
      pVideo: '',
      pLink: '',
      vDuration: 0,
      dates: [],
      intervalData: []
    }
  }

  // Method: Parse list of events for a single user and return larges values of all sessions
  parseEvents(events) {
    const processed = {
      watchTime: 0,
      muted: [false, 0],
      activeView: 0,
      scrolling: [false, 0],
      converted: [false, 0],
      abandonment: 0,
      devices: new Set(),
      failed: [false, 'empty', 0],
      stopped: [false, 'empty', 0],
      canPlay: false
    };

    events.map(single => {
      processed.devices.add(single['device']);

      switch (single['event']) {
        case ('play'):
          break;
        case ('pause'):
          break;
        case ('userLeave'):
        case ('mobileTouch'):
        case ('submit'):
          processed.watchTime = processed.watchTime < single['videoTime'] ? single['videoTime'] : processed.watchTime;
          processed.abandonment = processed.abandonment < single['timestamp'] ? single['timestamp'] : processed.abandonment;
          if (single['event'] != 'mobileTouch') {
            processed.activeView = processed.activeView < single['videoTime'] ? single['videoTime'] : processed.activeView;
          }

          if (single['event'] == 'submit') {
            processed.converted = [true, processed.converted[1] < single['videoTime'] ? single['videoTime'] : processed.converted[1]];
          }

          if (single['videoTime'] > 0) processed.failed = [false, 'error'];
          break;
        case ('muted'):
          if (processed.muted[0] == false) {
            processed.muted = [true, processed.muted[1] < single['videoTime'] ? single['videoTime'] : processed.muted[1]];
          }
          break;
        case ('unmuted'):
          processed.muted[0] = false;
          break;
        case ('formfocus'):
          if (processed.activeView == 0) processed.activeView = single['videoTime'];
          break;
        case ('ScrollOut'):
          if (processed.activeView == 0) processed.activeView = single['videoTime'];
          if (processed.scrolling[0] == false) processed.scrolling = [true, single['videoTime']];
          break;
        case ('stalled'):
          if (processed.failed[1] == 'empty') processed.failed = [true, 'stalled'];
          if (processed.stopped[0] == false) processed.stopped = [true, 'stalled', single['videoTime']];
          break;
        case ('error'):
        case ('abort'):
        case ('emptied'):
          if (processed.failed[1] == 'empty' || processed.failed[1] == 'stalled') processed.failed = [true, 'error'];
          if (processed.stopped[0] == false || processed.stopped[1] == 'stalled') processed.stopped = [true, 'stopped'];
          break;
        case ('canplay'):
          processed.canPlay = true;
          processed.failed = [false, 'error'];
          if (processed.stopped[1] == 'stalled') {
            processed.stopped = [false, 'stopped'];
          }
          break;
        default:
          break;
      }
    });

    if (processed.watchTime > processed.stopped[2] && processed.stopped[1] == 'stalled' ) {
      processed.stopped[0] = false;
    }

    processed.abandonment = processed.abandonment / 1000;
    return processed;
  }

  // Method: Parse raw data of a single page by dates
  parseDataByDates(rawData, filterDates) {
    let localProcessedData = {};
    let processedEvents = {};
    let timeArrs = {
      activeView: [],
      watchTimeArr: [],
      scrollTimeArr: [],
      convertedTimeArr: [],
      abandonmentTimeArr: []
    };

    /* Get static info about a page */
    let data = this.videoPageInfo.split('|');
    [this.detailedInfo.pDomain, this.detailedInfo.pName, this.detailedInfo.pVideo, this.detailedInfo.pLink] = [data[0], data[1], data[2], `https://${data[0]}/${data[1]}`];

    Object.keys(rawData).map(obj => {

      if (obj == 'duration' && this.detailedInfo.vDuration == 0) {
        this.detailedInfo.vDuration = DataMethods.toTime(rawData[obj]);
        // Creating array of intervals for the Video by 5 second steps
        let intervals = Math.ceil(+rawData[obj] * .2);
        this.detailedInfo.intervalData = Array(intervals);

        for(let i=0; i<intervals; i++) {
          this.detailedInfo.intervalData[i] = {viewers: 0, abandonment: 0, converted: 0};
        }

      } else if (obj == 'date' && filterDates.length === 2) {
        const dFrom = DataMethods.toDate(filterDates[0]);
        const dTo = DataMethods.toDate(filterDates[1]);

        Object.keys(rawData[obj]).map(currDate => {

          let elDate = DataMethods.toDate(currDate);

          if(elDate >= dFrom && elDate <= dTo) {

            localProcessedData =
              new ProcessedData('', 0, 0, {'unknownLocation': 0}, {'unknownDevice': 0}, {'unknownBrowser': 0}, [0, 0], [], 0, 0, 0, 0, 0, 0, 0);
            localProcessedData.date = currDate;

            Object.keys(rawData[obj][currDate]['uids']).map((currUser) => {
              let currLocation = rawData[obj][currDate]['uids'][currUser]['location'];

              /* Get events statistic per a user*/
              processedEvents = this.parseEvents(rawData[obj][currDate]['uids'][currUser]['events']);
              const currDevices = Array.from(processedEvents.devices);
              const initialDevice = JSON.parse(currDevices[0]);

              localProcessedData.visitors++;

              DataMethods.repeatedFields(localProcessedData.locations, currLocation, 'unknownLocation');
              DataMethods.repeatedFields(localProcessedData.devices, initialDevice['name'], 'unknownDevice');
              DataMethods.repeatedFields(localProcessedData.browsers, initialDevice['browser'], 'unknownBrowser');

              /* Amount of Vertical/Horizontal viewing for mobile devices */
              if (initialDevice['name'] != 'Desktop') {
                currDevices.map(device => {
                  let orientation = JSON.parse(device)['orientation'];
                  if (orientation == 'portrait') localProcessedData.orientations['0']++; // Portrait
                  else localProcessedData.orientations['1']++; // Landscape
                });
              }

              if (processedEvents.muted[0]) localProcessedData.muted.push(processedEvents.muted);

              if (processedEvents.failed[0] == true) localProcessedData.failed++;

              if (processedEvents.stopped[0] == true) localProcessedData.stopped++;

              if (processedEvents.scrolling[0]) timeArrs.scrollTimeArr.push(processedEvents.scrolling[1]);

              if (processedEvents.converted[0]) timeArrs.convertedTimeArr.push(processedEvents.converted[1]);

              if (processedEvents.activeView > 0) timeArrs.activeView.push(processedEvents.activeView);

              timeArrs.abandonmentTimeArr.push(processedEvents.abandonment);

              if (processedEvents.watchTime > 0) {
                localProcessedData.viewers++;
                timeArrs.watchTimeArr.push(processedEvents.watchTime);

                // Setting data of Viewers/Abandonment/Converted for video by 5 second intervals
                let intervalViewers = Math.ceil(processedEvents.watchTime / 5);

                for(let i = 0; i < intervalViewers; i++) this.detailedInfo.intervalData[i].viewers++;

                if (processedEvents.abandonment && processedEvents.watchTime > 0)
                  this.detailedInfo.intervalData[intervalViewers].abandonment++;

                if (processedEvents.converted[0] && processedEvents.watchTime > 0)
                  this.detailedInfo.intervalData[intervalViewers].converted++;
              }
            });

            localProcessedData.avgActiveView = DataMethods.avgAmount(timeArrs.activeView);
            localProcessedData.avgWatchTime = DataMethods.avgAmount(timeArrs.watchTimeArr);
            localProcessedData.avgScrollTime = DataMethods.avgAmount(timeArrs.scrollTimeArr);
            localProcessedData.avgConvertedTime = DataMethods.avgAmount(timeArrs.convertedTimeArr);
            localProcessedData.avgAbandonmentTime = DataMethods.avgAmount(timeArrs.abandonmentTimeArr);

            this.detailedInfo.dates.push(localProcessedData);
          }
        });
      }
    });

    return this.detailedInfo;
  }

  // Method: Summarizing processed data and convert to required format
  generalFormRecords(processedData) {
    let summarizedData = new ProcessedData([], 0, 0, {}, {}, {}, [0, 0], [0, 0], 0, 0, 0, 0, 0, 0, 0);
    if (!DataMethods.objEmpty(processedData)) {

      processedData['dates'].map(el => {
          summarizedData.date.push(el.date);
          summarizedData.viewers += el.viewers;
          summarizedData.visitors += el.visitors;

          Object.keys(el.locations).map(location => {
            if(summarizedData.locations.hasOwnProperty(location)) summarizedData.locations[location] += el.locations[location];
            else summarizedData.locations[location] = el.locations[location];
          });

          Object.keys(el.devices).map(device => {
            if(summarizedData.devices.hasOwnProperty(device)) summarizedData.devices[device] += el.devices[device];
            else summarizedData.devices[device] = el.devices[device];
          });

          Object.keys(el.browsers).map(browser => {
            if(summarizedData.browsers.hasOwnProperty(browser)) summarizedData.browsers[browser] += el.browsers[browser];
            else summarizedData.browsers[browser] = el.browsers[browser];
          });

          summarizedData.orientations['0'] += el.orientations['0']; // Portrait
          summarizedData.orientations['1'] += el.orientations['1']; // Landscape

          el.muted.map(singleMute => {
            summarizedData.muted['0']++; /* Amount of muted users */
            summarizedData.muted['1'] += singleMute['1']; /* Average of muted time */
          });

          summarizedData.stopped += el.stopped;
          summarizedData.failed += el.failed;
          summarizedData.avgWatchTime += el.avgWatchTime;
          summarizedData.avgScrollTime += el.avgScrollTime;
          summarizedData.avgActiveView += el.avgActiveView;
          summarizedData.avgConvertedTime += el.avgConvertedTime;
          summarizedData.avgAbandonmentTime += el.avgAbandonmentTime;

      });

      /* Percentage of Vertical/Horizontal viewing for mobile devices */
      if (summarizedData.orientations['0'] > 0 || summarizedData.orientations['1'] > 0) {
        const quantity = summarizedData.orientations['0'] + summarizedData.orientations['1'];
        summarizedData.orientations['0'] = DataMethods.toPercent(summarizedData.orientations['0'], quantity);
        summarizedData.orientations['1'] = DataMethods.toPercent(summarizedData.orientations['1'], quantity);
      }
      summarizedData.orientations = summarizedData.orientations.join(', ');

      if (summarizedData.date.length > 0) {
        if (summarizedData.muted[0] > 0) {
          let mutedUsers = summarizedData.muted[0];
          /* Percentage of visitors to muted users */
          summarizedData.muted[0] = DataMethods.toPercent(mutedUsers, summarizedData.viewers);

          /* Average viewed time before muted */
          summarizedData.muted[1] = DataMethods.toTime(summarizedData.muted[1] / mutedUsers);
        }
        summarizedData.muted = summarizedData.muted.join(', ');

        if (summarizedData.stopped > 0) {summarizedData.stopped = DataMethods.toPercent(summarizedData.stopped, summarizedData.visitors)};
        if (summarizedData.failed > 0) {summarizedData.failed = DataMethods.toPercent(summarizedData.failed, summarizedData.visitors)};

        summarizedData.avgWatchTime = DataMethods.toTime(summarizedData.avgWatchTime / summarizedData.date.length);
        summarizedData.avgScrollTime = DataMethods.toTime(summarizedData.avgScrollTime / summarizedData.date.length);
        summarizedData.avgActiveView = DataMethods.toTime(summarizedData.avgActiveView / summarizedData.date.length);
        summarizedData.avgConvertedTime = DataMethods.toTime(summarizedData.avgConvertedTime / summarizedData.date.length);
        summarizedData.avgAbandonmentTime = DataMethods.toTime(summarizedData.avgAbandonmentTime / summarizedData.date.length);
      }
    }

    Object.keys(processedData).map(key => {(key !== 'dates') ? summarizedData[key] = processedData[key] : '';});
    return (summarizedData.date.length > 0) ? summarizedData : null;
  }

  // Method: Collecting general data of a page for main form
  generalData(filterDates) {
    const parsedByDates = this.parseDataByDates(this.videoPageData, filterDates);
    const generalFormData = this.generalFormRecords(parsedByDates);
    return generalFormData;
  }
}