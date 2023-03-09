// User types in location into input
// on form submit, capture user input, make API call
// API call uses parameter selected by user (city,postal code etc)
// When we get the information back, we loop through it
// Append information to li
// Append li to ul on page
// import { config } from "dotenv";
// namespace
const app = {};
import { fireBaseApp, db, ref, set, remove, onValue } from "./firebase.js";
import { initMap, calcRoute } from "./maps.js";

// Import the functions you need from the SDKs you need
// import { initializeApp } from "./node_modules/firebase/app";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-analytics.js";
// import {
//   getDatabase,
//   ref,
//   set,
//   push,
//   onValue,
// } from "./node_modules/firebase/database";
// import firebaseApp from "./firebase";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// const firebaseConfig = {
//   apiKey: "AIzaSyBOTN-ktAaGhBMYKy67ANjNF9MFPRLQeIY",
//   authDomain: "brewbud-80fd3.firebaseapp.com",
//   databaseURL: "https://brewbud-80fd3-default-rtdb.firebaseio.com",
//   projectId: "brewbud-80fd3",
//   storageBucket: "brewbud-80fd3.appspot.com",
//   messagingSenderId: "303106774801",
//   appId: "1:303106774801:web:6da98e2516b0eedb7a9eb0",
//   measurementId: "G-QBZKLD2Z1K",
// };

// Initialize Firebase
// const fireBaseApp = initializeApp(firebaseConfig);
// const analytics = getAnalytics(fireBaseApp);
// const db = getDatabase(fireBaseApp);
// let refObj = {}

// namespace variables
app.form = document.querySelector("form");
app.button = document.querySelector("button");
app.body = document.querySelector("body");
app.roadTripBtn = document.querySelector(".roadTripBtn");
app.clearListBtn = document.querySelector(".clearListBtn");
// app.menuButton = document.querySelector(".seeMenu");

const ul = document.querySelector(".breweryList");
const savedBreweries = document.querySelector(".savedBreweries");

// const calcRoute = (waypointArr) => {
//   let map = new google.maps.Map(document.getElementById("map"), mapOptions);
//   let directionsService = new google.maps.DirectionsService();
//   let directionsRenderer = new google.maps.DirectionsRenderer();
//   let start = "9114 Oak Pride Court, Tampa, FL";
//   let end = "9114 Oak Pride Court, Tampa, FL";
//   let request = {
//     origin: start,
//     destination: end,
//     travelMode: "DRIVING",
//     waypoints: waypointArr,
//   };
//   directionsService.route(request, function (result, status) {
//     if (status == "OK") {
//       directionsRenderer.setDirections(result);
//     }
//   });
// };
const removeBreweryFromDatabase = async (e) => {
  // let postListRef;
  // let brewName;
  if (e) {
    const brewName = e.target.attributes[0].value;
    console.log("e", e.target.attributes);
    const postListRef = ref(db, `setofBreweries/${brewName}`);
    // .then(() => {
    //   app.addedBreweryChecker
    // })
    await remove(postListRef).catch((err) => {
      console.error("something went wrong", err);
    });
    console.log("remove response", setofBreweries);
    app.addedBreweryChecker(brewName);
  }
  // else {
  //   postListRef = ref(db, `setofBreweries`);
  // }
};

let setofBreweries = {};
app.brewDirectionArray = [];
// look at later (do we really need this refObj?)
app.breweryRefObj = {};
// select the select element on html
// capture the value
// add the value to the endpoint
app.initSnapshot = async () => {
  console.log("initSnap");
  await onValue(ref(db), (snapshot) => {
    setofBreweries = {};
    app.brewDirectionArray = [];
    app.breweryRefObj = {};
    const data = snapshot.val();
    console.log("snapshot", data);
    console.log("set after snapshot", setofBreweries);
    // look at later (maybe make more efficient)
    savedBreweries.innerHTML = "";
    if (data) {
      document.querySelector(".roadTripList").style.display = "block";
    } else {
      // console.log("none");
      document.querySelector(".roadTripList").style.display = "none";
    }
    if (data) {
      for (let brewery in data.setofBreweries) {
        let savedBreweryCard = document.createElement("li");
        savedBreweryCard.innerHTML = `<h3 class="savedBrewCard">${data.setofBreweries[brewery].Name}</h3>`;
        let removeButton = document.createElement("button");
        removeButton.innerText = "X";
        removeButton.setAttribute(
          "data-reference",
          data.setofBreweries[brewery].id
        );
        removeButton.addEventListener("click", removeBreweryFromDatabase);

        savedBreweryCard.append(removeButton);
        app.breweryRefObj[data.setofBreweries[brewery].id] =
          data.setofBreweries[brewery].Name;
        // console.log("saved", savedBreweryCard);

        savedBreweries.append(savedBreweryCard);
        // let objectForSet = {};
        // objectForSet[data.setofBreweries[brewery].Name] = data.setofBreweries[brewery];
        // setofBreweries.add(objectForSet);
        // look at later (readability)
        setofBreweries[data.setofBreweries[brewery].id] =
          data.setofBreweries[brewery];
        let directionObj = {
          location: data.setofBreweries[brewery].Address,
          stopover: true,
        };
        console.log("set of breweries after adding", setofBreweries);

        app.brewDirectionArray.push(directionObj);
        if (
          document.querySelector(
            `[data-brewery="${data.setofBreweries[brewery].id}"]`
          )
        ) {
          app.addedBreweryChecker(data.setofBreweries[brewery].id);
        }
      }
    } else {
      document.querySelectorAll(".listButton").forEach((btn) => {
        btn.innerHTML = `+`;
      });
    }
    // console.log("snap", app.breweryRefObj);
    // calcRoute(app.brewDirectionArray);
  });

  // calcRoute(app.brewDirectionArray);
  // loader.load().then(() => {
  //   let map = new google.maps.Map(document.getElementById("map"), {
  //     center: { lat: -34.397, lng: 150.644 },
  //     zoom: 8,
  //   });
  //   calcRoute(app.brewDirectionArray);
  // })
  // await initMap();
};

app.initSnapshot();

// Check for values from API call return null
app.nullChecker = (val, term) => {
  if (!val) {
    return `${term} is unavailable`;
  } else {
    return `${val}`;
  }
};

// Disable "add" button for breweries already in database

app.addedBreweryChecker = (breweryId, inDisplayFunc) => {
  const i = breweryId;
  if (app.breweryRefObj[breweryId]) {
    if (inDisplayFunc) {
      return true;
    }
    try {
      document.querySelector(
        `[data-brewery="${i}"]`
      ).innerHTML = `<img class="addedCheck" src="./media/whiteCheck.png" alt="brewery added to list">`;
    } catch {
      console.error("something went wrong");
    }
  } else {
    if (inDisplayFunc) {
      return false;
    }
    document.querySelector(`[data-brewery="${i}"]`).innerHTML = `+`;
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
      // console.log("brewery", brewery);
      brewery.forEach((result) => {
        app.displayFunction(result);
        // Look at later (do we need to spread this list?)
        let buttonList = document.querySelectorAll(".listButton");
        const breweryButtons = [...buttonList];
        breweryButtons.forEach((btn) => {
          btn.addEventListener("click", app.addBreweryToList);
          // console.log("button", btn);
          // console.log("list of set", setofBreweries);
        });
      });
      // app.addedBreweryChecker();
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
  // look at later (redundant h2)
  const h2 = document.createElement("h2");
  h2.append(str.name);
  li.appendChild(h2);
  setTimeout((e) => {
    li.classList.add("fade");
  }, 50);
  const name = str.name.replace(/[^a-zA-Z0-9 ]/g, "");
  const street = app.nullChecker(str.street, "Street address");
  const city = app.nullChecker(str.city, "City info");
  const state = app.nullChecker(str.state, "State info");
  const postalCode = app.nullChecker(str.postal_code, "Postal Code");
  const phone = app.nullChecker(str.phone, "Phone Number");
  const site = app.nullChecker(str.website_url, "Website");
  const buttonChecker = app.addedBreweryChecker(str.id, true)
    ? `<img class="addedCheck" src="./media/whiteCheck.png" alt="brewery added to list">`
    : `+`;
  li.innerHTML = `<h2>${name}</h2>
    <p>${street}, ${city} ${postalCode}, ${state}</p>
    <p class="phone"> ${phone}</p> <div class='buttonLinkHolder'><a href="${site}">${site}</a> <button class='listButton' data-brewery="${str.id}">${buttonChecker}</button> </div> `;

  ul.appendChild(li);
  // app.addedBreweryChecker(str.id);
  // console.log('id is',str.id )
};

app.addBreweryToList = function (e) {
  // console.log("running", e.target.data);
  let objToSend = {};
  const keyArray = ["Name", "Address", "Phone", "Website", "id"];
  const brewCard = [...e.target.parentNode.parentNode.childNodes];
  // console.log("brewCard", this.getAttribute('data-brewery'));
  // let newArr =brewCard.filter((el) => el)
  const buttonAttribute = this.getAttribute("data-brewery");
  // app.addBreweryToList(buttonAttribute);
  const newArr = brewCard
    .map((info) => {
      return info.innerText;
      // return objToSend.push(innerText);
    })
    .filter((el) => el && el !== "+");
  newArr.push(buttonAttribute);
  // console.log('newArr is', newArr);
  // look at later (can we make this more efficient in regards to looping?)
  for (let i = 0; i < keyArray.length; i++) {
    let objKey = keyArray[i];
    objToSend[objKey] = newArr[i];
  }
  setofBreweries[objToSend.id] = objToSend;
  console.log("set", setofBreweries);

  // const filteredArr = objToSend.filter((el) => el && el !== "Button");
  // const db = getDatabase();

  const postListRef = ref(db);
  // // const newPostRef = push(postListRef);
  set(postListRef, {
    setofBreweries,
    // Name: newArr[0],
    // Address: newArr[1],
    // Phone: newArr[2],
    // Website: newArr[3],
    //  objToSend
  }).then(() => {
    // console.log("siccess");
    // app.addedBreweryChecker(buttonAttribute);
  });
  // loader.load().then(() => {
  //   let map = new google.maps.Map(document.getElementById("map"), {
  //     center: { lat: -34.397, lng: 150.644 },
  //     zoom: 8,
  //   });
  // });
};

app.breweryListDisplay = () => {};

// const removeBreweryFromDatabase = (brewName) => {
//   //   const postListRef = ref(db);
//   // remove(brewName).then((res)=>{
//   //   console.log('removed')
//   //   console.log(res)
//   // })
//   console.log('e is',brewName )
// }

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
      // console.log(latAndLng);
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
  // look at later (should probably be in display function)
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

app.roadTripBtn.addEventListener("click", (e) => {
  // e.preventDefault();
  calcRoute(app.brewDirectionArray);
});

app.clearListBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  // removeBreweryFromDatabase();
  let postListRef = ref(db, `setofBreweries`);
  await remove(postListRef).catch((e) => {
    console.error(e);
  });
  // document.querySelectorAll('.listButton').forEach((btn) => {
  //   btn.innerHTML = `+`
  // })
  // const keys = Object.keys(app.breweryRefObj);
  // keys.forEach((key) => {
  //   console.log('key',key)
  //   app.addedBreweryChecker(key);
  // });
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

// const showRestaurants = (dataSet, ul) => {
//   const restaurantInfo = document.createElement("li");
//   // .classList.add("restaurantIndex");
//   const restaurantName = app.nullChecker(
//     dataSet.restaurant_name,
//     "Restaurant Name"
//   );
//   const restaurantAddress = app.nullChecker(
//     dataSet.address.formatted,
//     "Address"
//   );
//   const restaurantPhone = app.nullChecker(
//     dataSet.restaurant_phone,
//     "Phone Number"
//   );
//   const restaurantSite = app.nullChecker(dataSet.restaurant_website, "Website");
//   const restaurantPrice = app.nullChecker(dataSet.price_range, "Price Range");

//   restaurantInfo.innerHTML = `<h3> ${restaurantName}</h3>
//     <p>${restaurantAddress}</p>
//     <p class="phone"> ${restaurantPhone}</p> <a href="${restaurantSite}">${restaurantSite}</a>
//     <p>${restaurantPrice}</p>;`;
//   ul.append(restaurantInfo);
// };
