// for window-1 i.e tab-1
var tab1 = {
  // for reseting the container of tab-1
  getSymptoms: async function () {
    let ele = document.querySelector(".tab-1 .chips");
    let instance = M.Chips.getInstance(ele);
    let symptoms = instance.chipsData;
    console.log(symptoms);
    let data = [];
    symptoms.forEach((element) => {
      data.push(element.tag);
    });
    console.log(`data is  = ${data.toString()}`);
    return data;
  },

  getDisease: async function () {
    let symptoms = await this.getSymptoms();
    if (symptoms == 0) {
      return null;
    }
    let data = "";
    symptoms.forEach((e, j) => {
      if (j != 0) data += `,"${e}"`;
      else data += `"${e}"`;
    });

    console.log(`modified data is = ${data}`);
    var val = await axios.get("http://127.0.0.1:5000/disease", {
      params: {
        symptoms: data,
      },
    });
    console.log(val);
    val = val.data;
    let disease = [];
    val.forEach((element) => {
      disease.push(element[0]);
    });
    console.log(disease);
    return disease;
  },

  createCollection: function (title, data) {
    let div = document.createElement("div");
    let ul = document.createElement("ul");
    ul.classList.add("collection");
    ul.classList.add("with-header");
    let headdingLi = document.createElement("li");
    headdingLi.classList.add("collection-header");
    headdingLi.classList.add("center-align");
    let headding = document.createElement("h4");
    let text = document.createTextNode(title);
    headding.appendChild(text);
    headdingLi.appendChild(headding);
    ul.appendChild(headdingLi);
    data.forEach((ele) => {
      let li = document.createElement("li");
      li.classList.add("collection-item");
      let text = document.createTextNode(ele);
      li.appendChild(text);
      ul.appendChild(li);
    });
    div.appendChild(ul);
    return div;
  },

  submit: function () {
    win1Submit = document.querySelector("#win-1 .submit");
    win1Submit.addEventListener("click", async (e) => {
      e.preventDefault();
      let disease = await this.getDisease();
      if (disease != null) {
        let collection = this.createCollection("Diseases", disease);
        let win1 = document.querySelector("#win-1 .output");
        {
          let ele = win1.querySelector(".collection");
          if (ele != null) ele.remove();
        }
        win1.appendChild(collection);
      }
    });
  },

  reset: function () {
    (win1Reset = document.querySelector("#win-1 .reset")),
      win1Reset.addEventListener("click", () => {
        let chips = document.querySelector(".tab-1 .chips");
        let instance = M.Chips.getInstance(chips);
        let len = instance.chipsData.length;
        for (let i = len; i >= 0; i--) {
          instance.deleteChip(i);
        }
        let collection = document.querySelector("#win-1 .output .collection");
        if (collection != null) {
          collection.remove();
        }
      });
  },
};

tab1.submit();
tab1.reset();

function Data(urlEndPoint, queryParameterName) {
  this.toUrl = urlEndPoint;
  this.qName = queryParameterName;
  this.qArg = "";
  this.data = null;
  this.createTable = function (head1, head2, data) {
    let table = document.createElement("table");
    table.classList.add("striped");
    let tabelHead = document.createElement("thead");
    let tr = document.createElement("tr");
    let th = document.createElement("th");
    th.classList.add("center-align");
    let text = document.createTextNode(head1);
    th.appendChild(text);
    tr.appendChild(th);
    th = document.createElement("th");
    th.classList.add("center-align");
    text = document.createTextNode(head2);
    th.appendChild(text);
    tr.appendChild(th);
    tabelHead.appendChild(tr);
    let tBody = document.createElement("tbody");
    
    data.forEach((element) => {
      let tr = document.createElement("tr");
      let td1 = document.createElement("td");
      td1.classList.add("center-align");
      let text = document.createTextNode(element[0]);
      td1.appendChild(text);
      let td2 = document.createElement("td");
      td2.classList.add("center-align");
      text = document.createTextNode(element[1]);
      td2.appendChild(text);
      tr.appendChild(td1);
      tr.appendChild(td2);
      tBody.appendChild(tr);
    });
    table.appendChild(tabelHead);
    table.appendChild(tBody);
    return table;
  };

  this.createCollection = function (head, data) {
    let ul = document.createElement("ul");
    ul.classList.add("collection");
    ul.classList.add("with-header");
    let headding = document.createElement("li");
    headding.classList.add("collection-header");
    let h4 = document.createElement("h4");
    h4.appendChild(document.createTextNode(head));
    headding.appendChild(h4);
    ul.appendChild(headding);
    data.forEach((ele) => {
      let li = document.createElement("li");
      li.classList.add("collection-item");
      let text = document.createTextNode(ele);
      li.appendChild(text);
      ul.appendChild(li);
    });
    return ul;
  };

  this.startFetch = async function () {
    console.log(this.toUrl)
    url = "http://127.0.0.1:5000/";
    parameters = {};
    parameters["params"] = {};
    parameters["params"][this.qName] = this.qArg;
    let res = await axios.get("http://127.0.0.1:5000/" + this.toUrl, parameters);
    console.log(res.data);
    this.data = res.data;
    return res.data;
  };

  this.newTable = async function (head1, head2, window) {
    let val = document.querySelector(`${window} input`).value;
    console.log(val);
    this.qArg = val;
    let data = await this.startFetch();
    console.log(data);
    let table = this.createTable(head1, head2, data);
    let cont = document.querySelector(`${window} .output`);
    if (cont.querySelector("table") != null) {
      cont.querySelector("table").remove();
    }
    cont.querySelector(".preloader-wrapper").style.display = "block";
    setTimeout(() => {
        cont.querySelector(".preloader-wrapper").style.display = "none";
        cont.appendChild(table);
    }, 500);
   // cont.appendChild(table);
  };

  this.newCollection = async function (head1, window) {
    let val = document.querySelector(`${window} input`).value;
    console.log(val);
    this.qArg = val;
    let data = await this.startFetch();
    console.log(data);
    let collection = this.createCollection(head1, data);
    let cont = document.querySelector(`${window} .output`);
    if (cont.querySelector(".collection") != null) {
      cont.querySelector(".collection").remove();
    }
    cont.querySelector(".preloader-wrapper").style.display = "block";
    setTimeout(() => {
        cont.querySelector(".preloader-wrapper").style.display = "none";
        cont.appendChild(collection);
    }, 500);
    // cont.appendChild(collection);
  };

  this.reset = function (from) {
    document.querySelector(`${from} form`).reset();
    let table = document.querySelector(`${from} table`);
    if (table != null) {
      table.remove();
    } else {
      let collection = document.querySelector(`${from} .collection`);
      if (collection != null) collection.remove();
    }
  };
  return this;
}

function getData(tab, winId, head1, head2 = null) {
  document.querySelector(`${winId} .submit`).addEventListener("click", (e) => {
    e.preventDefault();
    if(document.querySelector(`${winId} input`).value == ""){
        return;
    }
    if (head2 == null) {
      tab.newCollection(head1, winId);
    } else {
      tab.newTable(head1, head2, winId);
    }
  });
  document.querySelector(`${winId} .reset`).addEventListener("click", (e) => {
    e.preventDefault();
    tab2.reset(winId);
  });
}

tab2 = new Data("symptoms", "disease");
getData(tab2, "#win-2", "symptoms");



tab3 = new Data("symptoms-and-parts","disease");
getData(tab3,"#win-3","symptoms","parts");



tab4 = new Data("medicines","disease");
getData(tab4,"#win-4","Medicine","Mode Of Admistration");



tab5 = new Data("similar-medicines","medicine");
getData(tab5,"#win-5","Medicine","Mode Of Admistration");



tab6 = new Data("show-chemicals","medicine");
getData(tab6,"#win-6","Salts");




tab7 = new Data("medicine-with-chemical","chemical");
getData(tab7,"#win-7","Medicine Names");