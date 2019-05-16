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
    const obj = {
      events: [],
      rawEvents: []
    };

    if (Array.isArray(data)) {
      data.forEach((element) => {
        this.renderTemplate(templateWrapper, element);
        if(this.isJson(element.content._raw)){
          obj.events.push(JSON.parse(element.content._raw));
        }
      });
    } else {
      this.renderTemplate(templateWrapper, data)
    }

    obj.events.map((e) => {
      obj.rawEvents.push(e)
    });

    wrapper.appendChild(templateWrapper);
  }

  renderTemplate(wrapper, element) {
    let DOM = `
        <pre class="element_${element.id}">${element.content._raw}</pre>
      `;
    if (this.isJson(element.content._raw)) {
      let dataObject = JSON.parse(element.content._raw).length > 0 ? JSON.parse(element.content._raw) : '';

      console.log(dataObject);

      if (Array.isArray(dataObject)) {
        dataObject.map((e) => {
          console.log("Separate object", e);
        });
      }
      wrapper.insertAdjacentHTML('afterbegin', DOM);
    }
  }

}









