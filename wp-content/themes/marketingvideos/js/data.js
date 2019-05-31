class Data {
  constructor(generalData){
    this.generalData = generalData;
  }

  statistics = {
    pageDomains: [],
    pageNames: [],
    eventArr: [],
    datesEventArr: [],
    separateEvents: [],
    mergedEvents: [],
    viewedArray: [],
    inactiveUsers: []
  };

  globalEvents = {
    playEvents: [],
    userleaveEvents: [],
    mutedEvents: [],
    unmutedEvents: [],
    pauseEvents: [],
    formfocusEvents: [],
    submitEvents: []
  };

  totalData = {};

  parseGlobalObject(data){
    Object.keys(data).map((obj, i) => {
      this.statistics.eventArr[i] = [];
      let pageDomain = obj.split('|')[0];
      let pageName = obj.split('|')[1];

      this.statistics.pageDomains.push(pageDomain);
      this.statistics.pageNames.push(pageName);
      this.statistics.eventArr[i].push(data[obj].date);
    });
  };

  parseData() {
    let merged = [];
    let userEvents = [];
    let viewedUsers = [];
    let inactiveUsers = [];

    this.statistics.eventArr.map((el, i) => {
      let datesObj = el[0];
      this.statistics.datesEventArr[i] = [];
      Object.keys(datesObj).map((date) => {
        this.statistics.datesEventArr[i].push(datesObj[date].uids);
      });
    });

    this.statistics.datesEventArr.map((el, i) => {
      this.statistics.separateEvents[i] = [];
      viewedUsers[i] = [];
      inactiveUsers[i] = [];

      el.map((separate) => {
        Object.keys(separate).map((event) => {
          userEvents = separate[event].events;
          userEvents.map((ev) => {
            if(ev.videoTime >= 0 && ev.event === 'play'){
              viewedUsers[i].push(event);
            }
            if(ev.videoTime >= 5 && ev.event === 'pause' ||
              ev.videoTime >= 5 && ev.event === 'formfocus' ||
              ev.videoTime >= 5 && ev.event === 'userLeave' ||
              ev.videoTime >= 5 && ev.event === 'ScrollOut' ||
              ev.videoTime >= 5 && ev.event === 'stalled'
            ){
              inactiveUsers[i].push(event);
            }
          });
          this.statistics.separateEvents[i].push(userEvents);
        });
      })
    });

    this.statistics.separateEvents.map((el, i) => {
      merged[i] = [];
      merged[i].push(this.mergeArrays(el))
    });

    merged.map((el) => {
      this.statistics.mergedEvents.push(el[0])
    });

    viewedUsers.map((el, i) => {
      this.statistics.viewedArray[i] = [];
      this.statistics.viewedArray[i] = this.removeDuplicates(el);
    });

    inactiveUsers.map((el, i) => {
      this.statistics.inactiveUsers[i] = [];
      this.statistics.inactiveUsers[i] = this.removeDuplicates(el);
    });
  };

  eventsMapping(data){
    data.map((el, i) => {
      this.globalEvents.playEvents[i] = [];
      this.globalEvents.userleaveEvents[i] = [];
      this.globalEvents.mutedEvents[i] = [];
      this.globalEvents.unmutedEvents[i] = [];
      this.globalEvents.pauseEvents[i] = [];
      this.globalEvents.formfocusEvents[i] = [];

      el.map((single) => {
        switch (single.event){
          case ('play'):
            this.globalEvents.playEvents[i].push(single.videoTime);
            break;
          case ('pause'):
            this.globalEvents.pauseEvents[i].push(single.videoTime);
            break;
          case ('userLeave'):
            this.globalEvents.userleaveEvents[i].push(single.videoTime);
            break;
          case ('muted'):
            this.globalEvents.mutedEvents[i].push(single.videoTime);
            break;
          case ('unmuted'):
            this.globalEvents.unmutedEvents[i].push(single.videoTime);
            break;
          case ('formfocus'):
            this.globalEvents.formfocusEvents[i].push(single.videoTime);
            break;
        }
      });

    });
  }

  calculation(play, userLeave, mute, unmute, pause, formfocus, views, incativeViews){
    let avgWatchTime = [];
    let numberOfViews = [];
    let isActiveView = [];
    let sound = [];
    let scrolling = [];
    let avgAbandone = [];
    let inactiveViewsNumber = [];

    mute.map((el) => {
      if(el.length){
        sound.push('On')
      }else{
        sound.push('Off')
      }
    });

    views.map((el) => {
      numberOfViews.push(el.length);
    });
    incativeViews.map((el) => {
      inactiveViewsNumber.push(el.length);
    });

    for(let i = 0; i < numberOfViews.length; i++){
      for(let j = i; j < inactiveViewsNumber.length; j++){
        isActiveView.push(
          ((inactiveViewsNumber[j] / numberOfViews[j]) * 100) < 50 ? 'Yes' : "No"
        );
        break;
      }
    }

    formfocus.map((el) => {
      scrolling.push(this.averageValue(el).toFixed(0));
    });
    pause.map((el) => {
      avgWatchTime.push(this.averageValue(el).toFixed(0));
    });
    userLeave.map((el) => {
      avgAbandone.push(this.averageValue(el).toFixed(0));
    });

    /*console.log("IS ACTIVE", isActiveView);
    console.log("AVG WATCH TIME",avgWatchTime);
    console.log("NUMBER OF VIEWS",numberOfViews);
    console.log('SOUND', sound);
    console.log('FORM FOCUS', scrolling);
    console.log('AVG ABANDONE', avgAbandone);
    console.log('INACTIVE USRS', inactiveViewsNumber);*/

    this.dataTransform(this.statistics.pageDomains, this.statistics.pageNames,
      avgWatchTime, numberOfViews, sound, isActiveView, scrolling, avgAbandone);
  };

  dataTransform(domain, pageName, avgWatchTime, numberOfViews,
                sound, activeView, scrolling, avgAbandone){

    this.totalData = domain.map((s,i) => ({
      domain : s,
      pageName : pageName[i],
      averageWatchTime: avgWatchTime[i],
      numberViews: numberOfViews[i],
      muted: sound[i],
      isActiveView: activeView[i],
      formFocus: scrolling[i],
      averageAbandone: avgAbandone[i]
    }));
  };

  renderStatistics(dataArr){
    console.log('TOTAL DATA', dataArr);
    const table = document.getElementById('dataTable');
    const domElement = document.createElement('TBODY');

    dataArr.forEach((el) => {
      domElement.insertAdjacentHTML('beforeEnd',
        //TODO place link in library
        //TODO correct sound events
        `
          <tr>
            <th scope="col">${el.domain}</th>
            <th scope="col">${el.pageName}</th>
            <th scope="col">
                <a href="https://${el.domain}/${el.pageName}">Link</a>
            </th> 
            <th scope="col">${this.toMinutes(el.averageWatchTime)}</th>
            <th scope="col">${el.numberViews}</th>
            <th scope="col">${el.muted}</th>
            <th scope="col">${el.isActiveView}</th>
            <th scope="col">${this.toMinutes(el.formFocus)}</th>
            <th scope="col">${this.toMinutes(el.averageAbandone)}</th>
          </tr>
        `
      )
    });

    table.appendChild(domElement);
  };

  /**HELPERS**/
  mergeArrays(array){
    return [].concat.apply([], array);
  };

  averageValue(array){
    return (array.reduce((a,b) => a+b, 0)) / array.length;
  };

  removeDuplicates(array){
    return array.reduce((a,b) => {
      if (a.indexOf(b) < 0 ) a.push(b);
      return a;
    },[]);
  };

  timeLeftPart(string, pad, length){
    return (new Array(length + 1).join(pad) + string).slice(-length);
  };

  toMinutes(seconds){
    const avgWatchMinutes = Math.floor(seconds / 60);
    const avgWatchSeconds = Math.floor(seconds - avgWatchMinutes * 60);
    return this.timeLeftPart(avgWatchMinutes, '0', 2)+'m. '
      +' : '+this.timeLeftPart(avgWatchSeconds, '0', 2)+'s.';
  };
  /**HELPERS END**/

  init(){
    this.parseGlobalObject(this.generalData);
    this.parseData();
    this.eventsMapping(this.statistics.mergedEvents);
    this.calculation(this.globalEvents.playEvents, this.globalEvents.userleaveEvents, this.globalEvents.mutedEvents,
      this.globalEvents.unmutedEvents, this.globalEvents.pauseEvents, this.globalEvents.formfocusEvents,
      this.statistics.viewedArray, this.statistics.inactiveUsers);
    this.renderStatistics(this.totalData);

    console.log('%cDATA: ', 'color: #00FF00', this.generalData);
  };
}