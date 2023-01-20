var locBtn = document.querySelector(".location");
var dummyText = document.getElementById("dummy");
const key = "628d57f32262d7f6c272be5df6242e8e"


function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getApi, denyLocation);
  } else {
    dummyText.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function denyLocation() {
  alert("We need your location");
}
//TODO ask manual weather if user denies location on device


function getApi(position) {
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;
  console.log(latitude, longitude);
  var requestUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${key}`;

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data.city.name);
      console.log(data.list[0].main.temp);
      var temperature = parseFloat(data.list[0].main.temp);
      var city = data.city.name;

      getFood(temperature, city);
    });
}

function getFood(temperature, city) {
  var ingredients = [];
  var instructions = []
  if (temperature < 10) {
    var dishes = coldDays;
  } else if (temperature >= 10 && temperature < 25) {
    var dishes = coolDays;
  } else if (temperature >= 25 && temperature < 35) {
    var dishes = warmDays;
  } else {
    var dishes = hotDays;
  }
  var dishesIndex = Math.floor(Math.random() * dishes.length);
  console.log(dishesIndex);
  var tag = noLocation[dishesIndex];
  console.log(tag);

  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "0dfac9f714msh5befe054fe1ee58p1daa65jsn112fdff89b93",
      "X-RapidAPI-Host": "tasty.p.rapidapi.com",
    },
  };

  fetch(
    `https://tasty.p.rapidapi.com/recipes/list?from=0&size=20&tags=${tag}`,
    //"https://tasty.p.rapidapi.com/tags/list",
    options
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var index = Math.floor(Math.random() * data.results.length);
      console.log(data.results[index]);
      console.log("components", data.results[index].sections[0].components);
      for (var i = 0; i < data.results[index].sections.length; i++) {
        console.log("section " + data.results[index].sections[i].name);
        for (
          var j = 0;
          j < data.results[index].sections[i].components.length;
          j++
        ) {
          ingredients.push(
            data.results[index].sections[i].components[j].raw_text
          );
        }
      }
      

      console.log(data.results[index].instructions);
      for (var i = 0; i < data.results[index].instructions.length; i++) {
        console.log(
          "Instructions " + (i + 1) + ": " + data.results[index].instructions[i].display_text
        );
        instructions.push(
          data.results[index].instructions[i].display_text
        );
      }
      console.log("Ingredients List:", ingredients);
      console.log("Instructions:", instructions);
      dummyText.innerHTML = `<b>City: </b> ${city}<br>
      <b>Temperature: </b> ${temperature} C°<br>
      <b>Suggested Dish: </b> ${data.results[index].name}<br>
      <b>Dish Description: </b> ${data.results[index].description}<br>
      <img src=${data.results[index].thumbnail_url} width=500px height=500px><br>
      <h2><u>Ingredients</u></h2>
      <ul id="ingredientsList">
      </ul>
      <h2><u>Instructions</u></h2>
      <ol id="instructionList">
      </ol>`;
      var ingredientsList = document.getElementById("ingredientsList")
      for (var ingredient of ingredients) {
        var listItem = document.createElement("li")
        listItem.textContent = ingredient
        console.log(listItem)
        ingredientsList.append(listItem)
      }

      var instructionList = document.getElementById("instructionList")
      for (var instruction of instructions) {
        var listItem = document.createElement("li")
        listItem.textContent = instruction
        console.log(listItem)
        instructionList.append(listItem)
      }
    });
}

locBtn.addEventListener("click", getLocation);
// TODO safe to local storage past recipies