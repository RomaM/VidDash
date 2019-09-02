export default window.ChartMethods = class {
  constructor(pagesData, viewsWrapper) {
    this.pagesData = pagesData;
    this.viewsWrapper = viewsWrapper;
  }

  renderVideoViews() {
    const wrapper = document.querySelector(this.viewsWrapper);
    const wrapElement = document.createElement('DIV');

    this.pagesData.map(e => {
      let linkUrl = e.pageLink.split('/')[e.pageLink.split('/').length - 1];
      wrapElement.insertAdjacentHTML('beforeend', `
        <div>
          <div class="charts__views-block">
            <div class="charts__views-title">
              <a href="${e.pageLink}">${linkUrl}</a>
            </div>
            ${e.pageDataArr.map(data => `
              <div class="charts__views-step 
                ${data.viewers === 0 ? '' : 'viewed'}"
              >
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

  init() {
    this.renderVideoViews();
  }
}