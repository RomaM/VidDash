class VideoDashboard {
  constructor(dataType, wrapper) {
    this.dataType = dataType;
    this.wrapper = wrapper;
    this.getJWT();
  }

  init() {
    this.getData();
    /*this.setData();*/
  }

  hostname = window.location.protocol + '//' + window.location.hostname;

  getData() {
    fetch(`${this.hostname}/wp-json/wp/v2/${this.dataType}/?per_page=100`)
      .then((response) => {
        return response.json()
      })
      .then((data) => {console.log('DATA: ',data);this.render(data);})
      .catch((error) => {console.log(error)})
  }

  setData() {
    const token = this.getTokenFromStorage();
    const exampleJson = JSON.stringify({
      events: 'play',
      type: 'video',
      timestamp: 2.23
    });
    const requestBody = {
      title: "VideoFromJS",
      content: {
        raw: exampleJson
      },
      status: "publish"
    };

    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify(requestBody)
    };

    fetch(`${this.hostname}/wp-json/wp/v2/${this.dataType}/`, params)
      .then((response) => {
        return response.json()
      })
      .then((data) => {console.log(data)})
      .catch((error) => {console.log(error)});
  }

  storeTokenToStorage(token) {
    localStorage.setItem('token', JSON.stringify(token))
  }

  getTokenFromStorage() {
    return JSON.parse(localStorage.getItem('token'));
  }

  getJWT() {
    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: 'Videouser',
        password: 'H2k9CR1MiOcJHQox$cNCkz)P'
      })
    };
    fetch(`${this.hostname}/wp-json/jwt-auth/v1/token`, params)
      .then((response) => {
        return response.json()
      })
      .then((data) => {this.storeTokenToStorage(data.token);})
      .catch((error) => {console.log(error)});
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
      let dataObject = JSON.parse(element.content._raw);
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









