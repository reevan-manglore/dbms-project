tab2 = {
  medicineArray:[],
  medicineCount: 0,
  lastCreatedForm: null,
  creatmedicinesInputType: function (eName, id,required) {
    let outer = document.createElement("div");
    outer.classList.add("input-field");
    let textBox = document.createElement("input");
    textBox.setAttribute("type", "text");
    textBox.setAttribute("id", `${eName}-${id}`);
    if(required == true){
        textBox.setAttribute("required","");
    }
    textBox.setAttribute("autocomplete","off")
    textBox.classList.add("autocomplete");
    outer.appendChild(textBox);
    let label = document.createElement("label");
    label.setAttribute("for", `${eName}-${id}`);
    label.appendChild(document.createTextNode(`${eName}`));
    outer.appendChild(label);
    return outer;
  },

  createmedicinesForm: function () {
    this.medicineCount++;
    let outer = document.createElement("div");
    outer.classList.add(
      "medicine-inner-container",
      "z-depth-2",
      `medicine-${this.medicineCount}`
    );
    let mName = document.createElement("div");
    mName.classList.add("medicine-name");
    mName.appendChild(
      this.creatmedicinesInputType("medicine-name", this.medicineCount,true)
    );

    let mType = document.createElement("div");
    mType.classList.add("medicine-type");
    mType.appendChild(
      this.creatmedicinesInputType("medicine-type", this.medicineCount,false)
    );

    let mDelete = document.createElement("div");
    mDelete.classList.add("medicine-delete");
    let a = document.createElement("a");
    a.classList.add("waves-effect", "waves-light", "btn", "red", "lighten-1");
    a.setAttribute("data-medicine", this.medicineCount);
    let i = document.createElement("i");
    i.classList.add("material-icons");
    i.appendChild(document.createTextNode("delete"));
    a.appendChild(i);
    mDelete.appendChild(a);


    let chipContainer = document.createElement("div");
    chipContainer.classList.add("input-field");
    chipContainer.setAttribute("id",`chemical-${this.medicineCount}`);
    let chips = document.createElement("div");
    chips.classList.add("chips","chips-autocomplete","chips-placeholder");
    chipContainer.appendChild(chips);
    outer.appendChild(mName);
    outer.appendChild(mType);
    outer.appendChild(mDelete);
    outer.appendChild(chipContainer);
    return outer;
  },

  renderForm: function (cssClass) {
    let item = this.createmedicinesForm();
    document.querySelector(cssClass).appendChild(item);
    this.lastCreatedForm = document.querySelector(
      `.medicine-${this.medicineCount}`
    );
    autoComplete("medicine",`#medicine-name-${this.medicineCount}`);
    chipAutoComplete("chemicals",`#chemical-${this.medicineCount}`)
    this.medicineArray.push(this.medicineCount);
    console.log(this.medicineArray)
    this.lastCreatedForm.classList.add("on-create-item");
    let containerBottom = document.querySelector(".medicines-input");
    containerBottom.scrollTop = containerBottom.scrollHeight;//to automatically scroll to bottom
    this.makeDeletable(this.lastCreatedForm);
  },
  makeDeletable: function (element) {
    console.log(`argument is ${element.classList}`);
    let deleteButton = element.querySelector(".medicine-delete a");
    console.log(`delete button is ${deleteButton}`);
    deleteButton.addEventListener("click", (e) => {
      e.preventDefault();
      medicineNumDeleted = parseInt (deleteButton.dataset.medicine);
      let index = tab2.medicineArray.indexOf(medicineNumDeleted);
      this.medicineArray.splice(index,1);
      if(this.medicineArray.length != 0){//if some items are present in the array ie if elements in view is not null
        this.medicineCount  = this.medicineArray[this.medicineArray.length - 1];
        this.lastCreatedForm = document.querySelector(`.medicine-${this.medicineCount}`);
      }
      else{
        this.medicineArray = [];
        // this.medicineCount = 0;//dont this this will host a whole new set of problems becuase of collisons of ids
        this.lastCreatedForm = null;
      }
      element.classList.remove("on-create-item");//in order to remove this class which is added when new item is created
      element.classList.add("on-remove-item");
      element.addEventListener("animationend", () => {
        element.remove();
        if(document.querySelectorAll(".medicine-inner-container").length == 0 ){
          tab2.renderForm(".medicines-input");//in case if all containers aare deleted
        }
      });
      
    });
  },
};


tab2.renderForm(".medicines-input");


mAddBtn = document.querySelector(".medicine-add-btn");

mAddBtn.addEventListener("click",(e)=>{
  e.preventDefault();
  let prevTextBoxVal = document.querySelector(`#medicine-name-${tab2.medicineCount}`).value;
   prevTextBoxVal = prevTextBoxVal.trim();
   if (prevTextBoxVal != "") {
    tab2.renderForm(".medicines-input");
  }
})


document.addEventListener("DOMContentLoaded", () => {
  // autoComplete("disease",".disease-name")
  
});




async function autoComplete(type, to) {
  let obj = {};
  let val = await axios.get("http://127.0.0.1:5000/search/" + type);
  let data = val.data;
  console.log(data);
  let ele;
  if(to.includes("#")){
    ele = document.querySelector(to);
  }
  else{
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


async function chipAutoComplete(type,to) {
  let obj = {};
  let val = await axios.get("http://127.0.0.1:5000/search/" + type);
  let data = val.data;
  let ele = document.querySelector(`${to} .chips`);
  data.forEach((element) => {
    obj[element] = null;
  });
  var instances = M.Chips.init(ele, {
    placeholder:type,
    secondaryPlaceholder:`+ more ${type}'s`,
    autocompleteOptions:{
      data:obj
    }
  });
  console.log(`the value of instances are ${instances}`)
}