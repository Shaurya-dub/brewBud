// User types in location into input
// on form submit, capture user input, make API call
// API call uses parameter selected by user (city,postal code etc)
// When we get the information back, we loop through it
// Append information to li
// Append li to ul on page

// namespace
const app = {};
// namespace variable
app.form = document.querySelector("form");
app.button = document.querySelector("button");

const ul = document.querySelector("ul");
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
    })
    .catch((err) => {
      app.errorHandlingFunc(err);
    });
};

// append result from API to the page
app.displayFunction = (str) => {
  const li = document.createElement("li");
  li.setAttribute("tabindex", 0);
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
    <p class="phone"> ${phone}</p> <a href="${site}">${site}</a>`;

  ul.appendChild(li);
};

// When user selects "postal code", we capture user input
// make geoCodeConverter API call using that postal code
// goCodeConverter returns us lat and longitude coordinates
// we use the latitude and longitude coordinates to make API call to brewery API
const geoCodeUrl = (zip) => {
  const geoUrl = new URL("https://api.geocod.io/v1.6/geocode");
  geoUrl.search = new URLSearchParams({
    api_key: config.api_key,
    postal_code: zip,
  });

  fetch(geoUrl)
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
