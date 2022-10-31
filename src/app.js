// User types in location into input
// on form submit, capture user input, make API call
// API call uses parameter selected by user (city,postal code etc)
// When we get the information back, we loop through it
// Append information to li
// Append li to ul on page
// import { config } from "dotenv";
// namespace
const app = {};
// namespace variable
app.form = document.querySelector("form");
app.button = document.querySelector("button");
app.body = document.querySelector("body");
// app.menuButton = document.querySelector(".seeMenu");

const ul = document.querySelector(".breweryList");
// select the select element on html
// capture the value
// add the value to the endpoint

// Check for values from API call return null
app.nullChecker = (val, term) => {
  if (!val) {
    return `${term} is unavailable`;
  } else {
    return `${val}`;
  }
};

// error handling display's gif when error is encountered
app.errorHandlingFunc = (e) => {
  ul.innerHTML = `<div class="errorBox"> <img src = "media/wasted.gif"/> <p> Sorry, your search didn't return any results, try searching when you're sober</p></div>`;
};

// Make API call get brewery result based on parameters provided by user
app.getCity = (selectInput, userInput) => {
  const body = document.body;
  document.querySelector(".loadingScreen").style.display = "block";
  const url = new URL(
    `https://api.openbrewerydb.org/breweries?${selectInput}=${userInput}`
  );

  fetch(url)
    .then(function (res) {
      return res.json();
    })
    .then(function (brewery) {
      // throw error if API return empty result
      if (brewery.length < 1) {
        throw new Error();
      }
      brewery.forEach((result) => {
        app.displayFunction(result);
      });
      // Functionality to display Menu of brewery. Complete later*********************************
      // const menuButtons = document.querySelectorAll(".seeMenu");
      // menuButtons.forEach((button) => {
      //   button.addEventListener("click", function (e) {
      //     e.preventDefault();
      //     const breweryAddress = this.parentElement.children[1].innerText;
      //     const brewInfo = this.parentElement;

      //     app.getMenu(breweryAddress, body);
      //   });
      // });
      document.querySelector(".loadingScreen").style.display = "none";
    })
    .catch((err) => {
      app.errorHandlingFunc(err);
      document.querySelector(".loadingScreen").style.display = "none";
    });
};

// append result from API to the page
app.displayFunction = (str) => {
  const li = document.createElement("li");
  li.setAttribute("tabindex", 0);
  li.classList.add("breweryCard");
  const h2 = document.createElement("h2");
  h2.append(str.name);
  li.appendChild(h2);
  setTimeout((e) => {
    li.classList.add("fade");
  }, 50);
  const street = app.nullChecker(str.street, "Street address");
  const city = app.nullChecker(str.city, "City info");
  const state = app.nullChecker(str.state, "State info");
  const postalCode = app.nullChecker(str.postal_code, "Postal Code");
  const phone = app.nullChecker(str.phone, "Phone Number");
  const site = app.nullChecker(str.website_url, "Website");

  li.innerHTML = `<h2>${str.name}</h2>
    <p>${street}, ${city} ${postalCode}, ${state}</p>
    <p class="phone"> ${phone}</p> <a href="${site}">${site}</a> <button class='listButton'><i class="fa-thin fa-plus"></i></button>`;

  ul.appendChild(li);
};

// Netlify function to hide API Key
// Function sends zipcode entered by user to a geocoding API to turn into lat/long coordinates
//Originally, brewery API would only return breweries AT a zip code (as opposed to near a zipcode)
// Using Geocoding bypasses this issue
const geoCodeUrl = (zip) => {
  fetch(`/.netlify/functions/fetch-coordinates?postal_code=${zip}`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      const coordinates = data.results[0].location;
      const { lat, lng } = coordinates;
      const latAndLng = `${lat.toFixed(4)},${lng.toFixed(4)}`;
      console.log(latAndLng);
      app.getCity("by_dist", latAndLng);
    })
    .catch((err) => {
      app.errorHandlingFunc(err);
    });
};


// eventLister that calls function that make API call
app.form.addEventListener("submit", function (e) {
  e.preventDefault();
  const selectValue = document.querySelector("select").value;
  const inputValue = document.querySelector('input[type="text"]').value;
  ul.innerHTML = "";
  // original API will only search brewery at the exact zipcode provided by user
  // instead of showing brewery nearby so zipcode must be converted to coordinate by making additinal API call
  // when user search by zipcode
  if (selectValue === "by_postal") {
    geoCodeUrl(inputValue);
  } else {
    app.getCity(selectValue, inputValue);
  }
});
// Functionality to display Menu of brewery. Complete later*********************************

// app.getMenu = async (name, parent) => {
//   const menuUrl = new URL(
//     `https://api.documenu.com/v2/restaurants/search/fields?key=a053ac434fb058d22c3615a5990b829b&address=${name}`
//     // `https://api.documenu.com/v2/restaurant/4072702673999819?X-API-KEY="a053ac434fb058d22c3615a5990b829b"`
//   );
//   await fetch(menuUrl)
//     .then((res) => {
//       return res.json();
//     })
//     .then(async (dataSet) => {
//       const restaurantCard = document
//         .createElement("div")
//         .classList.add("restaurantDisplay");
//       const restaurantList = document
//         .createElement("ul")
//         .classList.add("restaurantIndex");
//       await restaurantCard.append(restaurantList);
//       for (let data of dataSet.data) {
//         showRestaurants(data, restaurantList);
//       }
//       parent.append(restaurantCard);
//       // console.log(dataSet);
//     });
// };

const showRestaurants = (dataSet, ul) => {
  const restaurantInfo = document.createElement("li");
  // .classList.add("restaurantIndex");
  const restaurantName = app.nullChecker(
    dataSet.restaurant_name,
    "Restaurant Name"
  );
  const restaurantAddress = app.nullChecker(
    dataSet.address.formatted,
    "Address"
  );
  const restaurantPhone = app.nullChecker(
    dataSet.restaurant_phone,
    "Phone Number"
  );
  const restaurantSite = app.nullChecker(dataSet.restaurant_website, "Website");
  const restaurantPrice = app.nullChecker(dataSet.price_range, "Price Range");

  restaurantInfo.innerHTML = `<h3> ${restaurantName}</h3>
    <p>${restaurantAddress}</p>
    <p class="phone"> ${restaurantPhone}</p> <a href="${restaurantSite}">${restaurantSite}</a>
    <p>${restaurantPrice}</p>;`
  ul.append(restaurantInfo);
};
