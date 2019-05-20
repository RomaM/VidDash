class VideoDashboard {
  constructor(dataType, wrapper) {
    this.dataType = dataType;
    this.wrapper = wrapper;
  }

  init() {
    this.getData();
  }

  hostname = window.location.protocol + '//' + window.location.hostname;

  getData() {
    fetch(`${this.hostname}/wp-json/wp/v2/${this.dataType}/?per_page=2000`)
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        console.log('DATA: ',data);
        this.render(data);
      })
      .catch((error) => {console.log(error)})
  }

  isJson(str) {
    try {
      JSON.parse(str);
    }
    catch (e) {
      return false;
    }
    return true;
  };

  render(data) {
    const templateWrapper = document.createElement("div");

      data.forEach((element) => {
        this.renderTemplate(templateWrapper, element);
        console.log(element['meta-field'])
      });

    wrapper.appendChild(templateWrapper);
  }

  renderTemplate(wrapper, element) {
    const metaArray = element['meta-field'];
    console.log(metaArray);

    let DOM = `
        <div class="element__box">
            <p class="element__title">${element.content._raw}</p>
            <pre class="element_${element.id}">${metaArray}</pre>
        </div>
      `;
      //wrapper.insertAdjacentHTML('afterbegin', DOM);
    //}
  }

}









