export default window.ChartMethods = class {
  constructor(pagesData, viewsWrapper) {
    this.pagesData = pagesData;
    this.viewsWrapper = viewsWrapper;
  }

  renderVideoViews() {
    const wrapper = document.querySelector(this.viewsWrapper);
    const wrapElement = document.createElement('DIV');
    wrapElement.classList.add('charts__views-wrapper');

    this.pagesData.map((e) => {
      let linkUrl = e.pageLink.split('/')[e.pageLink.split('/').length - 1];
      console.log('DATA restr', this.dataRestruct(e));
      wrapElement.insertAdjacentHTML('beforeend', `
        <div>
          <div class="charts__views-block">
            <div class="charts__views-title">
              <a target="_blank" href="${e.pageLink}">${linkUrl}</a>
            </div>
            ${this.dataRestruct(e).map((data) => `
              <div class="charts__views-step ${data.viewers ? '' : 'noviews'}">
                <div class="charts__views-popup">
                  <ul>
                    <li>viewers: ${data.viewers}</li>
                    <li>abandone: ${data.abandonment}</li>
                    <li>converted: ${data.converted} </li>
                  </ul>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `);
    });
    wrapper.appendChild(wrapElement);
  }

  //TODO: refactor
  dataRestruct(data){
    const structuredArray = [];
    const elements = [];
    const twoElements = [];
    const fourElements = [];
    /**data.pageDataArr.map((e, i) => {
      if(i < 3){
        structuredArray.push(e)
      }else if(i === 3 || i === 4){
        twoElements.push(e);
      }else if(i > 4 && i <9){
        fourElements.push(e);
      }else if(i >= 9){
        elements.push(e);
      }
    });*/

    data.pageDataArr.map((e, i) => {
      if(i < 3){
        structuredArray.push(e)
      }else if(i === 4){
        twoElements.push(e);
      }else if(i === 8){
        fourElements.push(e);
      }else if(i === 9){
        elements.push(e);
      }
    });

    console.log('STRUC ARR', structuredArray);
    console.log('ELEMENTS', elements);
    console.log('TWO ELEMENTS', twoElements);


    structuredArray.push(this.objectSum(twoElements));
    structuredArray.push(this.objectSum(fourElements));
    structuredArray.push(this.objectSum(elements));


    console.log('STRUC ARR AFTER', structuredArray);
    return structuredArray;
  }

  objectSum(obj) {
    const sumVievers = obj.reduce((a, {viewers}) => a + viewers, 0);
    const sumAband = obj.reduce((a, {abandonment}) => a + abandonment, 0);
    const sumConvert = obj.reduce((a, {converted}) => a + converted, 0);
    return {
      viewers: sumVievers,
      abandonment: sumAband,
      converted: sumConvert
    };
  }

  init() {
    this.renderVideoViews();
  }
}