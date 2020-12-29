// for creating tabs inside web page
let tab = document.querySelector(".tabs");
var instance = M.Tabs.init(tab, {
  duration: 300,
  swipeable: true,
});

//for auto completion
function forTab1(params) {
  document.addEventListener("DOMContentLoaded", async function () {
    let obj = {};
    let val = await axios.get("http://127.0.0.1:5000/search/symptoms");
    val = await val.data;
    console.log(val);
    val.forEach((element) => {
      obj[element] = null;
    });
    options = {
      placeholder: "Symptoms",
      secondaryPlaceholder: "more symptoms",
      limit: 20,
      autocompleteOptions: {
        data: obj,
      },
    };
    let elem = document.querySelectorAll(".tab-1 .chips");
    let instances = M.Chips.init(elem, options);
  });
}

function autoComplete(type,toClass){
  document.addEventListener("DOMContentLoaded",async function(){
    let obj = {};

    let disease = await axios.get("http://127.0.0.1:5000/search/"+type);
    let data = disease.data;
    let ele = document.querySelector(toClass);
    data.forEach(element => {
      obj[element] = null;
    });
    var instances = M.Autocomplete.init(ele, {
      data:obj
    });
  })
}

autoComplete("disease",".tab-2 .autocomplete");