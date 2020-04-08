

function setupFrontlineApp() {

    setupEarlyErrors();

    var mapInstance = setupMap();

    let tweetsContainer = document.getElementById("published_tweets");

    var $grid = null;

    Api.getData().then((d) => {
        var markers = L.markerClusterGroup();
        d.forEach(n => {
            if (n.hasTweet()) {
                addTweet(n.tweetId, tweetsContainer);
            }
            var marker = L.marker(n.location, {
                icon: pointIcon("#A51A1A")
            }).bindPopup(n.getPopupContent());
            markers.addLayer(marker);
        });
        mapInstance.addLayer(markers);
    }).then(x => {

        console.log("Doing this NOW");

        $grid = $('.grid').masonry({
            itemSelector: '.grid-item',
            columnWidth: 300
        });

        $grid.on('layoutComplete', function (event, laidOutItems) {
            console.log('Masonry layout complete with ' + laidOutItems.length + ' items');
        });

        setTimeout(function () {
            console.log("RIGHT " + $countTweets);
            $grid.masonry();
            $('#published_tweets').addClass("loaded");
            //    opacity: 0.1;
        }, 550);

    });

    function addTweet(tweetId, container) {
        let div = document.createElement("div");
        div.id = tweetId;
        div.className = "grid-item";
        container.appendChild(div);
        buildTweet(tweetId, div);
    }

    function buildTweet(tweetId, tweetContainer) {
        twttr.widgets.createTweet(tweetId, tweetContainer, {
            conversation: 'none'
            , cards: 'hidden'
            , width: 290  //max-width set by container 
            //align:left,right,centre
        })
            .then(function (tweet) {
                let style = tweet.shadowRoot.firstElementChild;
                let css = document.createTextNode(`.EmbeddedTweet .CallToAction { display: none; } .EmbeddedTweet .TweetInfo { display: none; }`);
                style.appendChild(css);
                $countTweets--;
            });
    }

    function setupMap() {
        var centreLat = 54.606039;
        var centreLng = -1.537400;
        var centreLocation = [centreLat, centreLng];
        var mapZoom = 5;
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

    // Icon configuration
    function pointIcon(color, size, className) {
        // Test string to make sure that it does not contain injection
        color = (color && /^[a-zA-Z0-9#]+$/.test(color)) ? color : '#959595';
        size = size || [32, 32];
        // var iconicSprite = require('ushahidi-platform-pattern-library/assets/img/iconic-sprite.svg');

        return L.divIcon({
            className: 'custom-map-marker ' + className,
            html: '<svg class="iconic" style="fill:' + color + ';"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="44fed91f69f09c95876314a8e23f311e.svg#map-marker"></use></svg>', //<span class="iconic-bg" style="background-color:' + color + ';""></span>
            iconSize: size,
            iconAnchor: [size[0] / 2, size[1]],
            popupAnchor: [0, 0 - size[1]]
        });
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















//return L.divIcon({
//    className: 'custom-map-marker ' + className,
//    html: '<svg class="iconic" style="fill:' + color + ';"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="' + iconicSprite + '#map-marker"></use></svg><span class="iconic-bg" style="background-color:' + color + ';""></span>',
//    iconSize: size,
//    iconAnchor: [size[0] / 2, size[1]],
//    popupAnchor: [0, 0 - size[1]]
//});

//"leaflet.locatecontrol": "^0.71.1",
//    "leaflet": "^1.6.0",
//    "leaflet-easybutton": "^2.4.0",
//    "leaflet.markercluster": "1.0.5",

//var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//        maxZoom: 18,
//        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Points &copy 2012 LINZ'
//    }),
//    latlng = L.latLng(-37.82, 175.24);

//var map = L.map('map', {center: latlng, zoom: 13, layers: [tiles]});

//var markers = L.markerClusterGroup();

//for (var i = 0; i < addressPoints.length; i++) {
//    var a = addressPoints[i];
//    var title = a[2];
//    var marker = L.marker(new L.LatLng(a[0], a[1]), { title: title });
//    marker.bindPopup(title);
//    markers.addLayer(marker);
//}

//map.addLayer(markers);

// "leaflet.markercluster": "1.0.5",
//https://unpkg.com/leaflet.markercluster@1.0.5/dist/

//L.marker(bartsLocation, {
//    icon: L.icon({
//        iconUrl: requirementsIcon
//        , iconAnchor: [15, 40] //x = 50% of pixel width of custom img, y = 100% pixel height
//        , popupAnchor: [0, -45] // relative to the iconAnchor
//    })
//})

//var svg = '<svg class="iconic" style="fill:#A51A1A;"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="44fed91f69f09c95876314a8e23f311e.svg#map-marker"></use></svg>'; /* insert your own svg */
//var iconUrl = 'data:image/svg+xml;base64,' + btoa(svg);

//var icon = L.icon({
//    iconUrl: iconUrl
//});









 //addTweet("1247224310860783621", tweetsContainer);

        //console.log("here we go " + $('.published_tweets').length);
        //$('#published_tweets').masonry({
        //    itemSelector: '.grid-item',
        //    columnWidth: 100,
        //    gutter: 20
        //});

        //setTimeout(function () {

        //$('#btn_start').click((e) => {

        //    // trigger layout
        //    $grid.masonry();

        //});
        //$grid.on('click', '.grid-item', function () {
        //    // change size of item via class
        //    $(this).toggleClass('grid-item--gigante');
        //    // trigger layout
        //    $grid.masonry();
        //});

        //$('.grid').masonry({
        //    itemSelector: '.grid-item',
        //    columnWidth: 300,
        //    gutter: 20
        //});
        // jQuery

        //var $grid = $('.grid').masonry({
        //    itemSelector: '.grid-item',
        //    columnWidth: 300,
        //    gutter: 20
        //});

        //function onLayout() {
        //    console.log('layout done');
        //}
        //// bind event listener
        //$grid.on('layoutComplete', onLayout);
        //// un-bind event listener
        //$grid.off('layoutComplete', onLayout);
        //// bind event listener to be triggered just once. note ONE not ON
        //$grid.one('layoutComplete', function () {
        //    console.log('layout done, just this one time');
        //});




        //window.twttr = (function (d, s, id) {
        //    var js, fjs = d.getElementsByTagName(s)[0],
        //        t = window.twttr || {};
        //    if (d.getElementById(id)) return t;
        //    js = d.createElement(s);
        //    js.id = id;
        //    js.src = "https://platform.twitter.com/widgets.js";
        //    fjs.parentNode.insertBefore(js, fjs);

        //    t._e = [];
        //    t.ready = function (f) {
        //        t._e.push(f);
        //    };

        //    return t;
        //}(document, "script", "twitter-wjs"));

        //twttr.ready(function (twttr) {
        //    console.log("TWITTER LOADED");
        //    twttr.events.bind('loaded', function (event) {
        //        console.log("here we go " + $('.grid').length);
        //        $('.grid').masonry({
        //            itemSelector: '.grid-item',
        //            columnWidth: 300,
        //            gutter: 20
        //        });
        //    });
        //});

        //}, 2000);