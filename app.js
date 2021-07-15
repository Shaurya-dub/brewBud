// test
const app = {};

app.form = document.querySelector("form");
app.button = document.querySelector("button");
// User types in location into input
// on form submit, capture user input, make API call
// API call uses parameter selected by user (city,postal code etc)
// When we get the information back, we loop through it
// Append information to li
// Append li to ul on page
//
const ul = document.querySelector("ul");
// select the select element on html
// capture the value
// add the value to the endpoint
app.getCity = () => {
  const inputValue = document.querySelector('input[type="text"]').value;
  const selectValue = document.querySelector("select").value;
  const url = new URL(
    `https://api.openbrewerydb.org/breweries?${selectValue}=${inputValue}`
  );

  fetch(url)
    .then(function (res) {
      return res.json();
      // console.log(res.json());
    })
    .then(function (brewery) {
      brewery.forEach((result) => {
        app.displayFunction(result);
        // console.log(result);
      });
    })
    .catch((err) => {});
};

app.displayFunction = (str) => {
  const li = document.createElement("li");
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

  li.innerHTML = `<h2>${str.name}</h2>
    <p>${street}, ${city} ${postalCode}, ${state}</p>
    <p class="phone"> ${phone}</p>`;

  ul.appendChild(li);
};
app.getCity = (selectInput, userInput) => {
  const url = new URL(
    `https://api.openbrewerydb.org/breweries?${selectInput}=${userInput}`
  );

  console.log(url);
  fetch(url)
    .then(function (res) {
      return res.json();
    })
    .then(function (brewery) {
      brewery.forEach((result) => {
        app.displayFunction(result);
        // console.log(result);
      });
    });
};

// make a request to the map-quest endpoint
// use zip-code as parameter
// console.log result
const geoCodeUrl = (zip) => {
  const geoUrl = new URL("https://api.geocod.io/v1.6/geocode");
  geoUrl.search = new URLSearchParams({
    api_key: "f5f6a3963e8e7f855add9ab39beb6d800080009",
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
    });
};

app.nullChecker = (val, term) => {
  if (!val) {
    return `${term} is unavailable`;
  } else {
    return `${val}`;
  }
};
app.form.addEventListener("submit", function (e) {
  e.preventDefault();
  const selectValue = document.querySelector("select").value;
  const inputValue = document.querySelector('input[type="text"]').value;
  ul.innerHTML = "";
  if (selectValue === "by_postal") {
    geoCodeUrl(inputValue);
  } else {
    app.getCity(selectValue, inputValue);
  }
});

app.init = () => {};

app.init();

// When user selects "postal code", we capture user input
// make geoCodeConverter API call using that postal code
// goCodeConverter returns us lat and longitude coordinates
// we use the latitude and longitude coordinates to make API call to brewery API
