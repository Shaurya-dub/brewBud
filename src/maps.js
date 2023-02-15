


// function calcRoute(brewDirectionArray) {
//   directionsService = new google.maps.DirectionsService();
//   directionsRenderer = new google.maps.DirectionsRenderer();
//   var start = "9114 Oak Pride Court, Tampa, FL";
//   var end = "9114 Oak Pride Court, Tampa, FL";
//   var request = {
//     origin: start,
//     destination: end,
//     travelMode: "DRIVING",
//     waypoints: brewDirectionArray,
//   };
//   directionsService.route(request, function (result, status) {
//     if (status == "OK") {
//       directionsRenderer.setDirections(result);
//     }
//   });
// }
// export {calcRoute}

// document.head.appendChild(script);
((g) => {
  var h,
    a,
    k,
    p = "The Google Maps JavaScript API",
    c = "google",
    l = "importLibrary",
    q = "__ib__",
    m = document,
    b = window;
  b = b[c] || (b[c] = {});
  var d = b.maps || (b.maps = {}),
    r = new Set(),
    e = new URLSearchParams(),
    u = () =>
      h ||
      (h = new Promise(async (f, n) => {
        await (a = m.createElement("script"));
        e.set("libraries", [...r] + "");
        for (k in g)
          e.set(
            k.replace(/[A-Z]/g, (t) => "_" + t[0].toLowerCase()),
            g[k]
          );
        e.set("callback", c + ".maps." + q);
        a.src = `https://maps.${c}apis.com/maps/api/js?` + e;
        d[q] = f;
        a.onerror = () => (h = n(Error(p + " could not load.")));
        a.nonce = m.querySelector("script[nonce]")?.nonce || "";
        m.head.append(a);
      }));
  d[l]
    ? console.warn(p + " only loads once. Ignoring:", g)
    : (d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)));
})({
  key: "",
  v: "beta",
  // Add other bootstrap parameters as needed, using camel case.
});

let map;
let directionsService;
let directionsRenderer;
async function initMap() {
  // // Create the map.
  // const { Map, InfoWindow } = await google.maps.importLibrary("maps");
  // map = new Map(document.getElementById("map"), {
  //   center: { lat: 37.4239163, lng: -122.0947209 },
  //   zoom: 14,
  //   mapId: "DEMO_MAP_ID",
  // });

  // // Add an info window.
  // const infoWindow = new InfoWindow({
  //   ariaLabel: "Googleplex",
  // });

  // // Add a marker.
  // const { AdvancedMarkerView } = await google.maps.importLibrary("marker");
  // const { DirectionsService } = await google.maps.importLibrary("marker");
  // const markerView = new AdvancedMarkerView({
  //   map,
  //   position: { lat: 37.4239163, lng: -122.0947209 },
  //   title: "Googleplex, Mountain View CA",
  // });

  // markerView.addListener("click", () => {
  //   infoWindow.close();
  //   infoWindow.setContent("<b>Googleplex</b>, Mountain View CA");
  //   infoWindow.open(markerView.map, markerView);
  // });
  //   const { Map, InfoWindow } = await google.maps.importLibrary("maps");
  //   map = new Map(document.getElementById("map"), {
  //     center: { lat: 37.4239163, lng: -122.0947209 },
  //     zoom: 14,
  //     mapId: "DEMO_MAP_ID",
  //   });
  // directionsService = new google.maps.DirectionsService();
  // directionsRenderer = new google.maps.DirectionsRenderer();
  // var chicago = new google.maps.LatLng(41.850033, -87.6500523);
  // var mapOptions = {
  //   zoom: 7,
  //   center: chicago,
  // };
  // var map = new google.maps.Map(document.getElementById("map"), mapOptions);
  // directionsRenderer.setMap(map);
}

async function calcRoute(brewDirectionArray) {
  // await initMap();
    const { Map, InfoWindow } = await google.maps.importLibrary("maps");
    // map = new Map(document.getElementById("map"), {
    //   center: { lat: 37.4239163, lng: -122.0947209 },
    //   zoom: 14,
    //   mapId: "DEMO_MAP_ID",
    // });
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    var chicago = new google.maps.LatLng(41.850033, -87.6500523);
    var mapOptions = {
      zoom: 7,
      center: chicago,
    };
    var map = new google.maps.Map(document.getElementById("map"));
    directionsRenderer.setMap(map);
  // directionsService = new google.maps.DirectionsService();
  // directionsRenderer = new google.maps.DirectionsRenderer();
  // var start = document.getElementById("start").value;
  // var end = document.getElementById("end").value;
  // var request = {
  //   origin: "9114 Oak Pride Court, Tampa, FL",
  //   destination: "22 Mountainberry road, Brampton, ON",
  //   waypoints: brewDirectionArray,
  //   optimizeWaypoints: true,
  //   travelMode: "DRIVING",
  // };
  // console.log("request", request);
  // directionsService.route(request, function (result, status) {
  //   if (status == "OK") {
  //     console.log("status", status);
  //     console.log("results", result);
  //     directionsRenderer.setDirections(result);
  //   }
  // });
      console.log("snap sent", brewDirectionArray);

  directionsService
    .route({
      origin: "9114 Oak Pride Court, Tampa, FL",
      destination: "22 Mountainberry road, Brampton, ON",
      waypoints: brewDirectionArray,
      optimizeWaypoints: true,
      travelMode: "DRIVING",
    })
    .then((res) => {
      directionsRenderer.setDirections(res);
      console.log("res", res);
    })
    .catch((err) => {
      console.error("error", err);
    });
}

// initMap();
export { initMap, calcRoute };
