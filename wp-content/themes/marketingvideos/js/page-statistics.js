import DataMethods from './data-methods.js';

class ProcessedData {
  constructor(date, viewers, visitors, avgWatchTime, avgScrollTime, avgConvertedTime, avgAbandonmentTime) {
    this.date = date;
    this.viewers = viewers;
    this.visitors = visitors;
    this.avgWatchTime = avgWatchTime;
    this.avgScrollTime = avgScrollTime;
    this.avgConvertedTime = avgConvertedTime;
    this.avgAbandonmentTime = avgAbandonmentTime;
  }
}

export default window.PageStatistics = class {
  constructor(videoPage, videoPageData) {
    this.videoPage = videoPage;
    this.videoPageData = videoPageData;
    this.pageStatistics = {
      pDomain: '',
      pName: '',
      pVideo: '',
      pLink: '',
      dates: []
    }
  }

  pageInfo(rawString) {
    let data = rawString.split('|');
    [this.pageStatistics.pDomain, this.pageStatistics.pName, this.pageStatistics.pVideo, this.pageStatistics.pLink] = [data[0], data[1], data[2], `https://${data[0]}/${data[1]}`];
  }

  pageData(rawData) {
    let date;
    let visitors;

    Object.keys(rawData).map((obj, i) => {
      DataMethods.logger(obj);
    })
  }

  // Method: Main launching method
  init() {
    this.pageInfo(this.videoPage);
    this.pageData(this.videoPageData);

    return this.pageStatistics;
  }
}