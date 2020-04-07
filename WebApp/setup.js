function setupFrontlineApp() {

    setupEarlyErrors();

    var mapInstance = setupMap();
    Api.getData().then((d) => {
        d.forEach(n => {

            //alert(n);

            //alert(n.location);

            L.marker(n.location
                //, {
                //icon: L.icon({
                //    iconUrl: requirementsIcon
                //    , iconAnchor: [15, 40] //x = 50% of pixel width of custom img, y = 100% pixel height
                //    , popupAnchor: [0, -45] // relative to the iconAnchor
                //}
                //    )
                //}
            ).addTo(mapInstance).bindPopup(n.getPopupContent());
        });
    });


    function setupMap() {
        var centreLat = 52.606039;
        var centreLng = -1.537400;
        var centreLocation = [centreLat, centreLng];
        var mapZoom = 7;
        var flMap = L.map('map_container', {
            fullscreenControl: {
                position: 'bottomleft'
                , pseudoFullscreen: true
                , title: {
                    'false': 'Fullscreen Dashboard',
                    'true': 'Exit Fullscreen'
                }
            }
        }).setView(centreLocation, mapZoom);
        setupAttributions(flMap);
        return flMap;
    }

    function setupAttributions(map) {
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1
        }).addTo(map);
    }

    function setupEarlyErrors() {
        window.onerror = Help.handleErrors;
        Vue.config.errorHandler = function (err, vm, info) {
            Help.handleErrors(err, "N/A", "N/A");
        };
    }
}

function hackDateTime(dateValue) {
    return new moment(dateValue).format("DD/MM/YYYY H:mm:ss");
}