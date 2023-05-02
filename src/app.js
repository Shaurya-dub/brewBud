// User types in location into input
// on form submit, capture user input, make API call
// API call uses parameter selected by user (city,postal code etc)
// When we get the information back, we loop through it
// Append information to li
// Append li to ul on page
// import { config } from "dotenv";
// namespace
const app = {};
import { update } from "firebase/database";
import {
  fireBaseApp,
  initializeApp,
  initFirebase,
  getDatabase,
  authInit,
  ref,
  set,
  remove,
  onValue,
} from "./firebase.js";
import { calcRoute, autoCompleteInput, googleUrlGenerator } from "./maps.js";

// namespace variables
app.form = document.querySelector("form");
app.button = document.querySelector("button");
app.body = document.querySelector("body");
app.roadTripBtn = document.querySelector(".roadTripBtn");
app.clearListBtn = document.querySelector(".clearListBtn");
app.mapHolder = document.querySelector(".mapHolder");
app.mapCloseBtn = document.querySelector(".mapCloseBtn");
const breweryListCloseBtn = document.querySelector(".breweryListCloseBtn");
const roadTripList = document.querySelector(".roadTripList");
const collapsibleModalHolder = document.querySelector(
  ".collapsibleModalHolder"
);
app.startAndEndFormHolder = document.querySelector(".startAndEndFormHolder");
const startAndEndForm = document.querySelector(".startAndEndForm");
const cancelTripBtn = document.querySelector(".cancelTripBtn");
const startingPoint = document.querySelector("#startingPoint");
const endingPoint = document.querySelector("#endingPoint");
const mapDirectionsLink = document.querySelector(".mapDirectionsLink");

// autoCompleteInput(startingPoint, endingPoint).catch((e) => {
//   console.error("hi", e);
// });
const ul = document.querySelector(".breweryList");
const savedBreweries = document.querySelector(".savedBreweries");
const roadTripButtons = document.querySelector(".roadTripButtons");
let userUID;
let db;
const removeBreweryFromDatabase = async (e) => {
  // let postListRef;
  // let brewName;
  if (e) {
    const brewName = e.target.attributes[1].value;
    console.log("brewname", brewName);
    // console.log("e", e.target.attributes);
    const postListRef = ref(db, `${userUID}/setofBreweries/${brewName}`);
    await remove(postListRef).catch((e) => {
      errorHandlingFunction(e);
    });
    // console.log("remove response", setofBreweries);
    app.addedBreweryChecker(brewName, app.addBreweryToList);
  }
  // else {
  //   postListRef = ref(db, `setofBreweries`);
  // }
};

let setofBreweries = {};
app.brewDirectionArray = [];
// done (do we really need this refObj?, we could just use setofBreweries)
// app.breweryRefObj = {};
let breweryAddressAndNameArr = [];
// select the select element on html
// capture the value
// add the value to the endpoint
app.initSnapshot = async () => {
  // console.log("initSnap");
  const firebaseConfig = fetch("/.netlify/functions/fetch-firebase").then(
    (response) => {
      return response.json();
    }
  ).then((data) => {
    return data
  })
  const fireBaseApp = initializeApp(firebaseConfig);
  db = getDatabase(fireBaseApp);
  userUID = await authInit();
  await autoCompleteInput(startingPoint, endingPoint);
  // console.log("userId", userUID);
  await onValue(ref(db, userUID), (snapshot) => {
    setofBreweries = {};
    app.brewDirectionArray = [];
    // app.breweryRefObj = {};
    breweryAddressAndNameArr = [];
    const data = snapshot.val();
    // look at later (maybe make more efficient)
    savedBreweries.innerHTML = "";
    // if (data) {
    // } else {
    //   // console.log("none");
    //   document.querySelector(".roadTripList").style.display = "none";
    // }
    if (data) {
      // console.log("incoming data", data.setofBreweries);
      // setofBreweries = { ...data.setofBreweries };
      for (let brewery in data.setofBreweries) {
        setofBreweries[brewery] = data.setofBreweries[brewery];
        // Done look at later (put this in separate function for reusability)
        // let savedBreweryCard = document.createElement("li");
        // savedBreweryCard.innerHTML = `<h3 class="savedBrewCard">${data.setofBreweries[brewery].Name}</h3>`;
        // let removeButton = document.createElement("button");
        // removeButton.innerText = "X";
        // removeButton.setAttribute(
        //   "data-reference",
        //   data.setofBreweries[brewery].id
        // );
        // removeButton.addEventListener("click", removeBreweryFromDatabase);

        // savedBreweryCard.prepend(removeButton);
        const breweryName = data.setofBreweries[brewery].Name;
        const brewId = data.setofBreweries[brewery].id;
        const breweryAddress = data.setofBreweries[brewery].Address;
        const savedBreweryCard = makeRemovableListEl(
          breweryName,
          "savedBrewCard",
          removeBreweryFromDatabase,
          "remove brewery from list",
          "data-reference",
          brewId
        );
        // app.breweryRefObj[data.setofBreweries[brewery].id] =
        //   data.setofBreweries[brewery].Name;

        breweryAddressAndNameArr.push(data.setofBreweries[brewery].Name);
        // console.log("saved", savedBreweryCard);

        savedBreweries.append(savedBreweryCard);
        // let objectForSet = {};
        // objectForSet[data.setofBreweries[brewery].Name] = data.setofBreweries[brewery];
        // setofBreweries.add(objectForSet);
        // Done look at later (readability, and do we need to re-do all this when initially loading, can we just copy the object into local setofBreweries?)

        // setofBreweries[data.setofBreweries[brewery].id] =
        //   data.setofBreweries[brewery];
        let directionObj = {
          location: breweryAddress,
          stopover: true,
          // name: data.setofBreweries[brewery].Name,
        };
        // console.log("set of breweries after adding", setofBreweries);

        app.brewDirectionArray.push(directionObj);
        if (
          document.querySelector(
            `[data-brewery="${data.setofBreweries[brewery].id}"]`
          )
        ) {
          app.addedBreweryChecker(
            data.setofBreweries[brewery].id,
            app.addBreweryToList
          );
        }
      }
      // roadTripList.classList.remove("roadTripHide");
      roadTripList.style.display = "initial";
    } else {
      roadTripList.style.display = "none";
      // roadTripList.classList.remove("roadTripHide");
      // document.querySelector(".roadTripList").classList.add("roadTripHide");
      // MAKE SURE THAT BUTTONS HAVE THIS CLASSLIST, AND FIGURE OUT EVENT HANDLER SICH
      document.querySelectorAll(".listButton").forEach((btn) => {
        app.addedBreweryChecker(null, app.addBreweryToList, false, btn);
        // btn.innerHTML = `+`;
        // btn.disabled = false;
        // btn.removeAttribute("aria-disabled");
        // btn.setAttribute("aria-label", "add brewery to list");
        // btn.addEventListener("click",app.addBreweryToList)
      });
    }
    // console.log("snap", app.breweryRefObj);
  });
};

app.initSnapshot().catch((e) => {
  console.log("new err");
  errorHandlingFunction(e);
});

// Check for values from API call return null
app.nullChecker = (val, term) => {
  if (!val) {
    return `${term} is unavailable`;
  } else {
    return `${val}`;
  }
};

// Disable "add" button for breweries already in database
// Look at later (optimize)
app.addedBreweryChecker = (
  breweryId,
  eventHandler,
  inDisplayFunc,
  passedBtn
) => {
  // console.log("refObj", app.breweryRefObj);
  // console.log("setofBreweries", setofBreweries, "and i is", i);
  let addButton =
    passedBtn || document.querySelector(`[data-brewery="${breweryId}"]`);
  if (setofBreweries[breweryId]?.Name) {
    // if (inDisplayFunc) {
    //   return true;
    // }
    if (addButton) {
      addButton.innerHTML = `<img class="addedCheck" src="./media/whiteCheck.png" alt="brewery added">`;
      console.log(
        "added btn",
        document.querySelector(`[data-brewery="${breweryId}"]`)
      );
      addButton.disabled = "true";
      addButton.setAttribute("aria-disabled", "true");
      addButton.setAttribute("aria-label", "added to list");
      addButton.removeEventListener("click", eventHandler);

      console.log("disabled", addButton.getAttribute("aria-disabled"));
      if (inDisplayFunc) {
        addButton.setAttribute("data-brewery", breweryId);
        return addButton;
      }
    }
  } else {
    // if (inDisplayFunc) {
    //   return false;
    // }
    console.log("not added btn", addButton);
    if (addButton) {
      addButton.innerHTML = "+";
      addButton.disabled = false;
      addButton.removeAttribute("aria-disabled");
      addButton.setAttribute("aria-label", "add to list");
      console.log("not-disabled", addButton.getAttribute("aria-disabled"));
      addButton.addEventListener("click", eventHandler);
      if (inDisplayFunc) {
        addButton.setAttribute("data-brewery", breweryId);
        return addButton;
      }
    }
  }
};

// error handling display's gif when error is encountered
const errorHandlingFunction = (e) => {
  // ul.innerHTML = `<div class="errorBox"> <img src = "media/wasted.gif"/> <p> Sorry, your search didn't return any results, try searching when you're sober</p></div>`;
  const errorScreen = document.querySelector(".errorScreen");
  const errorMessage = document.querySelector(".errorMessage");
  errorScreen.classList.remove("errorScreenHide");
  errorScreen.focus();
  // errorScreen.removeAttribute("aria-hidden")
  errorMessage.innerHTML = e?.message || null;
  const closeBtn = document.querySelector(".closeBtn");
  closeBtn.addEventListener(
    "click",
    function () {
      // errorScreen.setAttribute("aria-hidden", "true");
      errorScreen.classList.add("errorScreenHide");
    },
    { once: true }
  );
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
      console.log("brewery", brewery);
      brewery.forEach((result) => {
        const breweryType = result.brewery_type;
        if (breweryType !== "closed" && breweryType !== "planning") {
          app.displayFunction(result);
          // console.log("breweries", result);
          // Done Look at later (do we need to spread this list? ALSO should avoid double loop with buttons)
          // let buttonList = document.querySelectorAll(".listButton");
          // const breweryButtons = [...buttonList];
          // breweryButtons.forEach((btn) => {
          //   btn.addEventListener("click", app.addBreweryToList);
          //   // console.log("button", btn);
          //   // console.log("list of set", setofBreweries);
          // });
        }
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
      console.error("debug me", err);
      errorHandlingFunction(err);
      document.querySelector(".loadingScreen").style.display = "none";
    });
};

// append result from API to the page
app.displayFunction = (str) => {
  const li = document.createElement("li");
  const buttonLinkHolder = document.createElement("div");
  buttonLinkHolder.classList.add("buttonLinkHolder");
  li.setAttribute("tabindex", 0);
  li.classList.add("breweryCard");
  // Done look at later (redundant h2)
  // const h2 = document.createElement("h2");
  // h2.append(str.name);
  // li.appendChild(h2);
  setTimeout((e) => {
    li.classList.add("fade");
  }, 50);
  // Done Look at later (better way to do this?)
  const name = str.name.replace(/[^a-zA-Z0-9 ]/g, "");
  const street = app.nullChecker(str.street, "Street address");
  const city = app.nullChecker(str.city, "City info");
  const state = app.nullChecker(str.state, "State info");
  const postalCode = app.nullChecker(str.postal_code, "Postal Code");
  const phone = app.nullChecker(str.phone, "Phone Number");
  const site = app.nullChecker(str.website_url, "Website");
  buttonLinkHolder.innerHTML = `<a href="${site}">${site}</a>`;
  let newBtn = document.createElement("button");
  const addBreweryBtn = app.addedBreweryChecker(
    str.id,
    app.addBreweryToList,
    true,
    newBtn
  );
  addBreweryBtn.classList.add("listButton");
  buttonLinkHolder.appendChild(addBreweryBtn);
  // console.log("setofBreweries DISPLAYFUNC", setofBreweries, 'id being passed', str.id);

  // const buttonChecker = app.addedBreweryChecker(str.id, true)
  //   ? `<img class="addedCheck" src="./media/whiteCheck.png" alt="brewery added to list">`
  //   : `+`;

  // const addBreweryButton = app.addedBreweryChecker(str.id, true)
  //   ? `<button disabled aria-disabled='true' aria-label='brewery added to list' class='listButton' data-brewery="${str.id}"><img class="addedCheck" src="./media/whiteCheck.png" alt="brewery added to list"></button>`
  //   : `<button aria-label='add brewery to list' class='listButton' data-brewery="${str.id}">+</button>`;

  li.innerHTML = `<h2>${name}</h2> <p>${street}, ${city} ${postalCode}, ${state}</p> <p class="phone"> ${phone}</p>`;
  li.appendChild(buttonLinkHolder);
  ul.appendChild(li);
  // app.addedBreweryChecker(str.id);
  // console.log('id is',str.id )
};

const makeRemovableListEl = (
  listContent,
  listClass,
  listRemoveFunc,
  ariaLabel,
  listAttributeName,
  listAttributeValue
) => {
  let removableListEl = document.createElement("li");
  removableListEl.innerHTML = `<h3 class="${listClass}">${listContent}</h3>`;
  let removeButton = document.createElement("button");
  removeButton.innerText = "X";
  removeButton.setAttribute("aria-label", ariaLabel);
  if (listAttributeName) {
    removeButton.setAttribute(listAttributeName, listAttributeValue);
  } else {
    console.error("no attribute");
  }
  removeButton.addEventListener("click", listRemoveFunc);

  removableListEl.prepend(removeButton);
  return removableListEl;
};

app.addBreweryToList = function (e) {
  // console.log("num of breweries", breweryAddressAndNameArr);
  if (breweryAddressAndNameArr.length >= 10) {
    window.alert("You can only add 10 breweries per trip");
    return;
  }
  // console.log("running", e.target.data);
  let objToSend = {};
  // const keyArray = ["Name", "Address", "Phone", "Website", "id"];
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
  //   for (let i = 0; i < keyArray.length; i++) {
  //     let objKey = keyArray[i];
  //     objToSend[objKey] = newArr[i];
  //   }
  const objId = buttonAttribute;
  // console.log(÷set", setofBreweries);
  // console.log("sentObj", sentObj);
  // const filteredArr = objToSend.filter((el) => el && el !== "Button");
  // const db = getDatabase();

  const postListRef = ref(db, `${userUID}/setofBreweries/${objId}`);
  // // const newPostRef = push(postListRef);
  // console.log("user Id is", userUID);
  update(postListRef, {
    Name: newArr[0],
    Address: newArr[1],
    Phone: newArr[2],
    Website: newArr[3],
    id: newArr[4],
  });
  // .catch((e) => {
  //   console.error(e);
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
      errorHandlingFunction(err);
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
// Should move this to the form submit listener^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
app.roadTripBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  app.startAndEndFormHolder.classList.remove("startAndEndFormHolderHide");
  app.startAndEndFormHolder.addEventListener("keydown", trapFocus);
  startingPoint.focus();
  roadTripButtons.setAttribute("aria-hidden", true);
  savedBreweries.setAttribute("aria-hidden", true);
  cancelTripBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    app.startAndEndFormHolder.removeEventListener("keydown", trapFocus);
    app.startAndEndFormHolder.classList.add("startAndEndFormHolderHide");
    savedBreweries.removeAttribute("aria-hidden");
    roadTripButtons.removeAttribute("aria-hidden");
  });
  // e.preventDefault();
  // await calcRoute(app.brewDirectionArray);
  // app.mapHolder.classList.add("showMap");
});

app.clearListBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  // removeBreweryFromDatabase();
  let postListRef = ref(db, userUID);
  await remove(postListRef).catch((e) => {
    errorHandlingFunction(e);
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
startAndEndForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const startingPointVal = startingPoint.value;
  const endingPointVal = endingPoint.value;
  const calcRouteResult = await calcRoute(
    app.brewDirectionArray,
    startingPointVal,
    endingPointVal,
    breweryAddressAndNameArr
  ).catch((e) => {
    errorHandlingFunction(e);
  });
  // console.log("calcRoute", calcRouteResult);
  // console.log("directionArr", app.brewDirectionArray);
  const link = googleUrlGenerator(
    calcRouteResult,
    breweryAddressAndNameArr,
    startingPointVal,
    endingPointVal
  );
  mapDirectionsLink.innerHTML = `<a class="mapDirectionsLink" target="_blank" href="${link}">Click here to open your directions link</a>`;
  const copyLinkBtn = document.querySelector(".copyLinkBtn");
  const copyConfirmationContainer = document.querySelector(
    ".confirmTextContainer"
  );
  const copyConfirmationMessage = document.querySelector(".confirmText");
  const copyLink = async () => {
    await copyToClipboard(
      link,
      copyConfirmationContainer,
      copyConfirmationMessage,
      "Link Copied"
    );
  };
  copyLinkBtn.addEventListener("click", copyLink);

  // console.log("link", link);
  app.mapHolder.classList.add("showMap");
  const mapContentHolder = document.querySelector(".mapContentHolder");
  mapContentHolder.addEventListener("keydown", trapFocus);
  startAndEndForm.reset();
  app.startAndEndFormHolder.classList.add("startAndEndFormHolderHide");
  const mapCloseBtn = document.querySelector(".mapCloseBtn");
  mapCloseBtn.addEventListener(
    "click",
    () => {
      mapContentHolder.removeEventListener("keydown", trapFocus);
      copyLinkBtn.removeEventListener("click", copyLink);
      app.mapHolder.classList.remove("showMap");
      savedBreweries.removeAttribute("aria-hidden");
      roadTripButtons.removeAttribute("aria-hidden");
    },
    { once: true }
  );
  mapCloseBtn.focus();
});
// cancelTripBtn.addEventListener('click', (e) => {
//   app.startAndEndFormHolder.removeEventListener('click',trapStartAndEndFormHolder);
// },{once:true})

// app.mapCloseBtn.addEventListener("click", () => {
//   app.mapHolder.classList.remove("showMap");
// });

// function trapRoadTripList(e) {
//   return trapFocus(e, roadTripList);
// }

breweryListCloseBtn.addEventListener("click", function (e) {
  this.setAttribute(
    "aria-expanded",
    `${!(this.getAttribute("aria-expanded") === "true")}`
  );
  collapsibleModalHolder.setAttribute(
    "aria-hidden",
    `${!(collapsibleModalHolder.getAttribute("aria-hidden") === "true")}`
  );
  // console.log("aria is", this.getAttribute("aria-expanded"));
  roadTripList.classList.toggle("roadTripHide");
  // console.log(
  //   "aria-hidden is",
  //   collapsibleModalHolder.getAttribute("aria-hidden")
  // );
  this.getAttribute("aria-expanded") === "true"
    ? roadTripList.addEventListener("keydown", trapFocus)
    : roadTripList.removeEventListener("keydown", trapFocus);
});

const copyToClipboard = async (
  textToCopy,
  confirmationParent,
  confirmationChild,
  confirmationMessage
) => {
  try {
    await navigator.clipboard.writeText(textToCopy);
    // alert("Text successfully copied to clipboard!");

    confirmationParent.style.display = "block";
    confirmationChild.innerText = confirmationMessage;
    setTimeout(() => {
      confirmationParent.style.display = "none";
    }, 2000);
  } catch (error) {
    alert(`Failed to copy text to clipboard: ${error.message}`);
  }
};

function trapFocus(e) {
  e.stopPropagation();
  // console.log("event", e);
  // console.log("this", this);
  var focusableEls = this.querySelectorAll(
    'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled]), li'
  );
  var firstFocusableEl = focusableEls[0];
  var lastFocusableEl = focusableEls[focusableEls.length - 1];
  var KEYCODE_TAB = 9;

  var isTabPressed = e.key === "Tab" || e.keyCode === KEYCODE_TAB;

  if (!isTabPressed) {
    return;
  }

  // console.log("focus", firstFocusableEl);
  if (e.shiftKey) {
    /* shift + tab */ if (document.activeElement === firstFocusableEl) {
      lastFocusableEl.focus();
      e.preventDefault();
    }
  } /* tab */ else {
    if (document.activeElement === lastFocusableEl) {
      firstFocusableEl.focus();
      e.preventDefault();
    }
  }
}
