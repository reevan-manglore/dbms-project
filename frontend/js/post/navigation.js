let tabs = document.querySelector(".tabs");

M.Tabs.init(tabs, {
  duration: 400,
});

tab1 = {
  symptomArray: [],
  symptomCount: 0,
  lastCreatedForm: null,
  creatSymptomsInputType: function (eName, id, required) {
    let outer = document.createElement("div");
    outer.classList.add("input-field");
    let textBox = document.createElement("input");
    textBox.setAttribute("type", "text");
    textBox.setAttribute("id", `${eName}-${id}`);
    if (required == true) {
      textBox.setAttribute("required", "");
    }
    textBox.setAttribute("autocomplete", "off");
    textBox.classList.add("autocomplete");
    outer.appendChild(textBox);
    let label = document.createElement("label");
    label.setAttribute("for", `${eName}-${id}`);
    label.appendChild(document.createTextNode(`${eName}`));
    outer.appendChild(label);
    return outer;
  },

  createSymptomsForm: function () {
    this.symptomCount++;
    let outer = document.createElement("div");
    outer.classList.add(
      "symptoms-inner-container",
      "z-depth-2",
      "row",
      `symptom-${this.symptomCount}`,
      "valign-wrapper",
      "scale-transition"
    );
    let sName = document.createElement("div");
    sName.classList.add("symptom-name", "col", "s5");
    sName.appendChild(
      this.creatSymptomsInputType("symptom-name", this.symptomCount, true)
    );

    let sType = document.createElement("div");
    sType.classList.add("symptom-type", "col", "s5");
    sType.appendChild(
      this.creatSymptomsInputType("symptom-type", this.symptomCount, false)
    );

    let sDelete = document.createElement("div");
    sDelete.classList.add("symptom-delete", "col", "s2");
    let a = document.createElement("a");
    a.classList.add("waves-effect", "waves-light", "btn", "red", "lighten-1");
    a.setAttribute("data-symptom", this.symptomCount);
    let i = document.createElement("i");
    i.classList.add("material-icons");
    i.appendChild(document.createTextNode("delete"));
    a.appendChild(i);
    sDelete.appendChild(a);

    outer.appendChild(sName);
    outer.appendChild(sType);
    outer.appendChild(sDelete);

    return outer;
  },

  renderForm: function (cssClass) {
    let item = this.createSymptomsForm();
    document.querySelector(cssClass).appendChild(item);
    autoComplete("symptoms", `#symptom-name-${this.symptomCount}`);
    this.lastCreatedForm = document.querySelector(
      `.symptom-${this.symptomCount}`
    );
    this.symptomArray.push(this.symptomCount);
    console.log(this.symptomArray);
    this.lastCreatedForm.classList.add("on-create-item");
    let containerBottom = document.querySelector(".symptoms-input");
    containerBottom.scrollTop = containerBottom.scrollHeight; //to automatically scroll to bottom

    this.makeDeletable(this.lastCreatedForm);
  },
  makeDeletable: function (element) {
    console.log(`argument is ${element.classList}`);
    let deleteButton = element.querySelector(".symptom-delete a");
    console.log(`delete button is ${deleteButton}`);
    deleteButton.addEventListener("click", (e) => {
      e.preventDefault();
      symptomNumDeleted = parseInt(deleteButton.dataset.symptom);
      let index = tab1.symptomArray.indexOf(symptomNumDeleted);
      this.symptomArray.splice(index, 1);
      if (this.symptomArray.length != 0) {
        //if some items are present in the array ie if elements in view is not null
        this.symptomCount = this.symptomArray[this.symptomArray.length - 1];
        this.lastCreatedForm = document.querySelector(
          `.symptom-${this.symptomCount}`
        );
      } else {
        this.symptomArray = [];
        // this.symptomCount = 0;//dont this this will host a whole new set of problems becuase of collisons of ids
        this.lastCreatedForm = null;
      }
      element.classList.remove("on-create-item"); //in order to remove this class which is added when new item is created
      element.classList.add("on-remove-item");
      element.addEventListener("animationend", () => {
        element.remove();
        if (
          document.querySelectorAll(".symptoms-inner-container").length == 0
        ) {
          tab1.renderForm(".symptoms-input"); //in case if all containers aare deleted
        }
      });
    });
  },

  checkForBlankField: function () {
    let dName = document.querySelector("#tab1-disease-name");
    if (dName.value.trim() == "") {
      M.toast({
        html: `disease name is left out blank`,
        classes: "red lighten-1",
      });
      return true;
    }
    let blankField = 0;
    for (const iterator of this.symptomArray) {
      let ele = document.querySelector(`.symptom-${iterator}`);
      ele = ele.querySelector(`#symptom-name-${iterator}`);
      if (ele.value.trim() == "") {
        blankField++;
      }
    }
    if (blankField > 0) {
      M.toast({
        html: `${blankField} fields are left out blank`,
        classes: "red lighten-1",
      });
      return true;
    }
    return false;
  },
  getFormData: function () {
    data = {
      disease: {},
      symptoms: {},
    };
    let dName = document.querySelector("#tab1-disease-name");
    dName = dName.value.trim();
    data["disease"]["name"] = dName;
    let dType = document.querySelector("#tab1-disease-type").value.trim();
    if (dType == "") {
      dType = "undefined";
    }
    data["disease"]["type"] = dType;
    let symptoms = [];
    for (const iterator of this.symptomArray) {
      //add extra code here for pre processing of the data ;
      symptoms.push(
        document.querySelector(`#symptom-name-${iterator}`).value.trim()
      );
    }
    data["symptoms"]["names"] = symptoms;
    let sParts = [];
    for (const iterator of this.symptomArray) {
      let part = document
        .querySelector(`#symptom-type-${iterator}`)
        .value.trim();
      if (part == "") {
        part = "undefined";
      }
      sParts.push(part);
    }
    data["symptoms"]["parts"] = sParts;
    return data;
  },
  resetForm: function () {
    let form = document.querySelector("#win-1 form");
    for (const iterator of this.symptomArray) {
      let ele = document.querySelector(`.symptom-${iterator}`);
      ele.remove();
    }
    this.symptomArray = [];
    form.reset();
    tab1.renderForm(".symptoms-input");
  },

  submitForm:async function (){
  if(tab1.checkForBlankField() == true){
    return;
  }
  let data = tab1.getFormData();
  try{
    let res = await axios.post("http://127.0.0.1:5000/post/add-disease/",data);
    M.toast({
      html: res.data.message,
      classes: "green lighten-1",
    });
   tab1.resetForm();
  }
  catch(error){
    M.toast({
      html: error.data.message,
      classes: "red lighten-1",
    });
  }
}
};

tab1.renderForm(".symptoms-input");

addBtn = document.querySelector(".symptoms-add-btn");

addBtn.addEventListener("click", (e) => {
  e.preventDefault();

  let valueOfPrevTextBox = tab1.lastCreatedForm.querySelector(
    `#symptom-name-${tab1.symptomCount}`
  ).value;

  valueOfPrevTextBox = valueOfPrevTextBox.trim();
  if (valueOfPrevTextBox != "") {
    tab1.renderForm(".symptoms-input");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  autoComplete("disease", ".disease-name");
});

async function autoComplete(type, to) {
  let obj = {};
  let disease = await axios.get("http://127.0.0.1:5000/search/" + type);
  let data = disease.data;
  console.log(data);
  let ele;
  if (to.includes("#")) {
    ele = document.querySelector(to);
  } else {
    ele = document.querySelectorAll(`${to} .autocomplete`);
  }

  console.log(ele);
  data.forEach((element) => {
    obj[element] = null;
  });
  var instances = M.Autocomplete.init(ele, {
    data: obj,
  });
}



document.querySelector("#win-1 .submit").addEventListener("click",e=>{
  e.preventDefault();
  tab1.submitForm();
})

document.querySelector("#win-1 .reset").addEventListener("click",e=>{
  console.log("clicked")
  e.preventDefault();
  tab1.resetForm();
})