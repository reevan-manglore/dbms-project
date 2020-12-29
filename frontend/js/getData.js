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

function FetchData(what, queryName) {
  this.toUrl = what;
  this.qName = queryName;
  this.qArg = "";
  this.data = null;
  this.createTable =   function (head1, head2, data) {
    let table = document.createElement("table");
    table.classList.add("striped");
    let tabelHead = document.createElement("thead");
    let tr = document.createElement("tr");
    let th = document.createElement("th");
    let text = document.createTextNode(head1);
    th.appendChild(text);
    tr.appendChild(th);
    th = document.createElement("th");
    text = document.createTextNode(head2);
    th.appendChild(text);
    tr.appendChild(th);
    tabelHead.appendChild(tr);
    let tBody = document.createElement("tbody");
    data.forEach((element) => {
      let tr = document.createElement("tr");
      let td = document.createElement("td");
      let text = document.createTextNode(element[0]);
      td.appendChild(text);
      text = document.createTextNode(element[1]);
      td.appendChild(text);
      tr.appendChild(td);
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
    url = "http://127.0.0.1:5000/";
    parameters = {};
    parameters["params"] = {};
    parameters["params"][this.qName] = this.qArg;
    let res = await axios.get("http://127.0.0.1:5000/" + what, parameters);
    console.log(res.data);
    this.data = res.data;
    return res.data;
  };

  this.submitTable = async function (head1, head2,window) {
    let val = document.querySelector(`${window} input`).value;
    console.log(val);
    this.qArg = val;
    let data = await this.startFetch();
    console.log(data);
    let table = this.createTable(head1, head2, data);
    let cont = document.querySelector(`${window} .output`);
    cont.appendChild(table);
  };

  this.submitCollection = async function (head1,window) {
    let val = document.querySelector(`${window} input`).value;
    console.log(val);
    this.qArg = val;
    let data = await this.startFetch();
    console.log(data);
    let collection =  this.createCollection(head1, data);
    let cont = document.querySelector(`${window} .output`);
    cont.appendChild(collection);
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

tab2 = FetchData("symptoms","disease");

document.querySelector(".tab-2 .submit").addEventListener("click",(e)=>{
    e.preventDefault();
    tab2.submitCollection("symptoms","#win-2");
});

document.querySelector(".tab-2 .reset").addEventListener("click",(e)=>{
    e.preventDefault();
    tab2.reset("#win-2")
    
});

 

 