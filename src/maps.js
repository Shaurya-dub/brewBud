import { Loader } from "@googlemaps/js-api-loader";
// import { MarkerClusterer } from "@googlemaps/markerclusterer";

// use default algorithm and renderer
// const fetchFunc = await fetch("/.netlify/functions/fetch-maps");
// const data = await fetchFunc.json();
// const loader = new Loader({
//   apiKey: data.api_key,
//   version: "weekly",
//   libraries: ["places", "maps"],
// });
async function autoCompleteInput(...inputs) {
  // let loader;
  // fetch("/.netlify/functions/fetch-maps")
  //   .then((response) => response.json())
  //   .then((data) => {
  //     loader = new Loader({
  //       apiKey: data.api_key,
  //       version: "weekly",
  //       libraries: ["places", "maps"],
  //     });
  //     // ...rest of your code
  //   });
  // const mapsCall = await fetch("/.netlify/functions/fetch-maps");
  // const mapsData = await mapsCall.json();
  // const loader = new Loader({
  //   apiKey: process.env.MAPS_KEY,
  //   version: "weekly",
  //   libraries: ["places", "maps"],
  // });
  // console.log('changes')
  await fetch("/.netlify/functions/fetch-maps").catch((e) =>
    console.error("loading error", e)
  );
  inputs.map((input) => {
    const autoComplete = new google.maps.places.Autocomplete(input);
    autoComplete.addListener("place_changed", () => {
      const place = autoComplete.getPlace();
      if (!place.geometry || !place.geometry.location) {
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }
    });
  });
}

function markerMaker(lat, lng, map, markerTitle, label) {
  const latLng = { lat: lat, lng: lng };
  const marker = new google.maps.Marker({
    position: latLng,
    map,
    title: markerTitle,
    label: label,
    optimized: false,
  });
  console.log("passed label", label);
  const infoWindow = new google.maps.InfoWindow({
    content: markerTitle,
    ariaLabel: markerTitle,
  });
  marker.addListener("click", function () {
    infoWindow.open({
      anchor: marker,
      map,
    });
  });
  return marker;
}
async function calcRoute(
  brewDirectionArray,
  startingPoint,
  endingPoint,
  breweryAddressAndNameArr
) {
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer({
    suppressMarkers: true,
  });

  var map = new google.maps.Map(document.getElementById("map"));
  directionsRenderer.setMap(map);

  // look at later (error handling using status (?))

  const res = await directionsService.route({
    origin: startingPoint,
    destination: endingPoint,
    waypoints: brewDirectionArray,
    optimizeWaypoints: true,
    travelMode: "DRIVING",
  });

  directionsRenderer.setDirections(res);
  const routeCords = res.routes[0].legs;
  const waypointOrder = res.routes[0].waypoint_order;
  const labelLetters = "BCDEFGHIJKLMNOPQRSTUVWXYZ";
  let markers = [];
  for (let i = 0; i < routeCords.length; i++) {
    if (i === 0) {
      let markerLabel = startingPoint === endingPoint ? "" : "A";
      const startLat = routeCords[i].start_location.lat();
      const startLng = routeCords[i].start_location.lng();
      const marker = markerMaker(
        startLat,
        startLng,
        map,
        startingPoint,
        markerLabel
      );
      markers.push(marker);
    }
    let markerTitle;
    let markerLabel = labelLetters[i];
    if (i === routeCords.length - 1) {
      markerTitle = endingPoint;
      if (startingPoint === endingPoint) {
        markerLabel = `A/${labelLetters[i]}`;
      }
    } else {
      markerTitle = breweryAddressAndNameArr[waypointOrder[i]];
    }

    const lat = routeCords[i].end_location.lat();
    const lng = routeCords[i].end_location.lng();
    const marker = markerMaker(lat, lng, map, markerTitle, markerLabel);
    markers.push(marker);
  }
  console.log("markers", markers);
  return res;
}
const googleUrlGenerator = (res, waypointAddressArr, startPoint, endPoint) => {
  // look at later (this oculd be an object literal)
  console.log("res", res, waypointAddressArr);
  let geoCodedArr = res.geocoded_waypoints;
  const startId = geoCodedArr.pop().place_id;
  const endId = geoCodedArr.shift().place_id;
  let googleUrl = "https://www.google.com/maps/dir/?api=1&";
  googleUrl +=
    "origin=" + encodeURIComponent(startPoint) + "&origin_place_id=" + startId;
  googleUrl +=
    "&destination=" +
    encodeURIComponent(endPoint) +
    "&destination_place_id=" +
    endId;
  let addressHolderArr = [];
  let placeIdHolderArr = [];
  let waypointOrderArr = res.routes[0].waypoint_order;

  for (let i = 0; i < waypointOrderArr.length; i++) {
    const waypointOrderIndex = waypointOrderArr[i];
    addressHolderArr.push(waypointAddressArr[waypointOrderIndex]);
    placeIdHolderArr.push(geoCodedArr[i].place_id);
  }
  console.log("LINK SHIT HERE", addressHolderArr);
  const placeIds = placeIdHolderArr.join("|");
  const wayPointAddresses = encodeURIComponent(addressHolderArr.join("|"));
  console.log("WAYPOINT ADDRESS", wayPointAddresses);

  googleUrl += `&waypoints=${wayPointAddresses}&waypoint_place_ids=${placeIds}`;
  return googleUrl;
};
// initMap();
export { calcRoute, autoCompleteInput, googleUrlGenerator };
