var dislikeBtn = document.querySelector("#dislike");
var statusEl = document.getElementById("cityAndTemperature");
var ingredientsBtn = document.getElementById("ingredients");
var instructionsBtn = document.getElementById("instructions");
var ingrCloseModal = document.querySelector("#ingrCloseModal");
var insCloseModal = document.querySelector("#insCloseModal");
var ingredientsList = document.getElementById("ingredientsList");
var instructionsList = document.getElementById("instructionsList");
var likeBtn = document.getElementById("like");
var urRecipies = document.getElementById("urRecipies")

var mainImageEL = document.getElementById("mainImage"); //change image by api result

function gettingDishes(dishes) {
  var ingredients = [];
  var instructions = [];
  {
    var dishesIndex = Math.floor(Math.random() * dishes.length);
    console.log(dishes);
    console.log(dishesIndex);
    var tag = dishes[dishesIndex];
    console.log(tag);

    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "a1190a5613mshb896d0d8d85cd92p117dddjsn28b788dac426",
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
        console.log(index);
        console.log(data.results);
        console.log(data.results[index]);
        if (data.results.length === 0) {
          getLocation();
        }
        console.log(data.results[index].description);
        while (
          data.results[index].nutrition === undefined ||
          data.results[index].nutrition.calories === undefined
        ) {
          console.log(data.results[index]);
          console.log(index);
          index = Math.floor(Math.random() * data.results.length);
          console.log(index);
        }

        console.log(data.results[index]);
        console.log(data.results[index].sections);
        console.log(data.results[index].nutrition.calories);
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

        for (var i = 0; i < data.results[index].instructions.length; i++) {
          console.log(
            "Instructions " +
              (i + 1) +
              ": " +
              data.results[index].instructions[i].display_text
          );
          instructions.push(data.results[index].instructions[i].display_text);
        }
        console.log("Ingredients List:", ingredients);
        console.log("Instructions:", instructions);
        mainImageEL.setAttribute("src", data.results[index].thumbnail_url);
        var dishName = document.getElementById("dishName");
        var cals = document.getElementById("calories");
        var proteins = document.getElementById("proteins");
        var fats = document.getElementById("fat");
        var carbs = document.getElementById("carbs");
        var description = document.getElementById("description");
        dishName.innerHTML = "<b>Name: </b>" + data.results[index].name;
        cals.innerHTML =
          "<b>Calories: </b>" +
          data.results[index].nutrition.calories +
          "kcals";
        proteins.innerHTML =
          "<b>Proteins: </b>" + data.results[index].nutrition.protein + " g";
        fats.innerHTML =
          "<b>Fats: </b>" + data.results[index].nutrition.fat + " g";
        carbs.innerHTML =
          "<b>Carbohydrates: </b>" +
          data.results[index].nutrition.carbohydrates +
          " g";
        description.innerHTML = data.results[index].description;
        console.log(data.results[index].name);
        ingredientsList.innerHTML = "";
        for (var ingredient of ingredients) {
          var listItem = document.createElement("li");
          listItem.classList.add("flex");
          listItem.classList.add("items-start");
          listItem.innerHTML = `<div class="flex-shrink-0"> <svg class="h-6 w-6 flex-shrink-0 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none"           viewBox="0 0 24 24"           stroke-width="1.5"           stroke="currentColor"           aria-hidden="true"         >           <path             stroke-linecap="round"             stroke-linejoin="round"             d="M4.5 12.75l6 6 9-13.5"           />         </svg>       </div>       <p class="ml-3 text-base font-medium text-gray-500">         ${ingredient}       </p>`;
          ingredientsList.append(listItem);
        }

        instructionsList.innerHTML = "";
        for (var instruction of instructions) {
          var listItem = document.createElement("li");
          listItem.classList.add("flex");
          listItem.classList.add("items-start");
          listItem.innerHTML = `<div class="flex-shrink-0"> <svg class="h-6 w-6 flex-shrink-0 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none"           viewBox="0 0 24 24"           stroke-width="1.5"           stroke="currentColor"           aria-hidden="true"         >           <path             stroke-linecap="round"             stroke-linejoin="round"             d="M4.5 12.75l6 6 9-13.5"           />         </svg>       </div>       <p class="ml-3 text-base font-medium text-gray-500">         ${instruction}       </p>`;
          instructionsList.append(listItem);
        }

        likeBtn.addEventListener("click", function () {
          console.log("image",  data.results[index].thumbnail_url)
          console.log("name: ",data.results[index].name);
          console.log("calories: ", data.results[index].nutrition.calories);
          console.log("carbs: ", data.results[index].nutrition.carbohydrates);
          console.log("proteins: ", data.results[index].nutrition.protein);
          console.log("fats: ", data.results[index].nutrition.fat);
          console.log("description: ", data.results[index].description);
          console.log("ings: ",ingredients);
          console.log("ins: ",instructions);
        });
      });
  }
}

function showIngredientsHandler() {
  var ingModal = document.getElementById("ingredientsModal");
  ingModal.classList.toggle("hidden");
}

function showInstructionsHandler() {
  var insModal = document.getElementById("instructionsModal");
  insModal.classList.toggle("hidden");
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getApi, denyLocation);
  } else {
    dummyText.innerHTML = "This app requires Geolocation to function";
  }
}

function denyLocation() {
  var today = dayjs();
  var hour = today.format("HH");
  statusEl.innerHTML = today.format("DD-MMM-YYYY  hh:mm:ss A");
  if (hour >= 4 && hour <= 12) {
    var dishes = breakFasts;
  } else if (hour >= 12 && hour <= 19) {
    var dishes = lunch;
  } else {
    var dishes = dinner;
  }
  gettingDishes(dishes);
}

//TODO improvement proposal: ask manual weather or location if user denies location on device

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
      console.log(data);
      console.log(data.city.name);
      console.log(data.list[0].main.temp);
      var temperature = parseFloat(data.list[0].main.temp);
      var city = data.city.name;
      var country = data.city.country;
      if (temperature > 20) {
        var emoji = "☀️";
      } else {
        var emoji = "🥶";
      }
      statusEl.innerHTML =
        city + ", " + country + " | " + temperature + " C° " + emoji;
      getFood(temperature, city);
    });
}

function getFood(temperature, city) {
  if (temperature < 10) {
    var dishes = coldDays;
  } else if (temperature >= 10 && temperature < 25) {
    var dishes = coolDays;
  } else if (temperature >= 25 && temperature < 35) {
    var dishes = warmDays;
  } else {
    var dishes = hotDays;
  }
  gettingDishes(dishes);
}
getLocation();
dislikeBtn.addEventListener("click", getLocation);
ingredientsBtn.addEventListener("click", showIngredientsHandler);
instructionsBtn.addEventListener("click", showInstructionsHandler);
ingrCloseModal.addEventListener("click", showIngredientsHandler);
insCloseModal.addEventListener("click", showInstructionsHandler);
// TODO safe to local storage past recipies
