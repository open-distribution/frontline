/**
 * Ushahidi API responses use GUIDs to encode form fields
 *
 * This lookup translates from human-readable to the relevant GUID
 */
var USHAHIDI_KEYS = {
    //needs
    location: "9807e1f6-ac37-4f89-9a16-0707cd5f1237",
    org: "f381bb54-8325-4728-90bd-a93f3dd4802c",
    needs: "f3817f67-4a2e-4fda-bb83-df3909d5e588",
    otherNeeds: "949bbb06-c241-4221-8ab2-fec3042fbff9",
    tweetId: "2b3a5248-dfb7-4a9d-b0dc-dc76e92b1ac7",
    //suppliers
    s_location: "7180b854-c51e-4f0a-b5b6-4f30e27c87cc",//in one 7180b854-c51e-4f0a-b5b6-4f30e27c87cc
    s_needs: "175ae465-02b2-44f0-a07c-8eea2b723395",
    s_otherNeeds: "f41976b7-028a-4068-9d74-b9a2ede6e990", //title = co name , //content = description 
    s_webAddress: "10692815-cadc-4bc2-b504-c4ec49880fd7",
    s_logoMediaId: "aaf4c9d9-899c-4050-a39a-1bccf441791a"
}

/**
 * Application settings and configuration
 */
var SETTINGS = {
    needsUrl: "https://frontlinehelp.api.ushahidi.io/api/v3/posts/?form=6", //  API endpoint to GET needs (submitted to form/survey number 6)
    suppliersUrl: "https://frontlinehelp.api.ushahidi.io/api/v3/posts/?form=2",
    tweetsLimit: 4,
    debugMode: false,
    mapZoomDefault: 6,
    mapDefaultLat: 54.606039,
    mapDefaultLng: -1.537400,
    needsColor: "#A51A1A",
    suppliesColor: "#00966B"
}

/**
 * Helper functions
 */
var Help = /** @class */ (function () {
    function Help() {
    }
    Help.log = function (msg) {
        if (SETTINGS.debugMode) {
            console.log(msg);
        }
    };
    Help.handleErrors = function (error, url, line) {
        var msgDetail = error + " LINE : " + line + " URL : " + url;
        console.log("Error Caught : " + msgDetail);
        if (SETTINGS.debugMode) {
            alert(msgDetail);
        }
    };
    Help.labelledTag = function (l, s, t, c) {
        if (c === void 0) { c = ""; }
        return Help.isGoodString(s) ? "<span class=\"label " + c + "\">" + l + "</span>" + Help.htmlTag(s, t) : "";
    };
    Help.labelledList = function (l, s) {
        var str = Help.htmlList(s);
        return Help.isGoodString(str) ? "<span class=\"label\">" + l + "</span>" + str : "";
    };
    Help.htmlTag = function (s, t, ats) {
        if (ats === void 0) { ats = ""; }
        return Help.isGoodString(s) ? "<" + t + " " + ats + ">" + s + "</" + t + ">" : "";
    };
    Help.htmlList = function (s) {
        var respVal = "";
        if (!Help.isNullOrUndef(s) && s.length > 0) {
            respVal = "<ul>";
            s.forEach(function (v) { return respVal += "<li>" + v + "</li>"; });
            respVal += "</ul>";
        }
        return respVal;
    };
    Help.isGoodString = function (s) {
        return !Help.isNullOrEmpty(s) && Help.isString(s);
    };
    Help.isNumber = function (n) {
        return typeof n === "number";
    };
    Help.isString = function (n) {
        return typeof n === "string";
    };
    Help.isNullOrUndef = function (val) {
        return val === undefined || val === null;
    };
    Help.isNullOrEmpty = function (val) {
        return Help.isNullOrUndef(val) || val === '' || val === 'null' || val === 'undefined';
    };
    Help.getProp = function (key, obj, defaultVal) {
        if (defaultVal === void 0) { defaultVal = null; }
        return Help.hasProp(key, obj) ? obj[key] : defaultVal;
    };
    Help.tryGetProp = function (key, obj, result) {
        var respVal = false;
        if (Help.hasProp(key, obj)) {
            result.value = Help.getProp(key, obj);
            respVal = true;
        }
        return respVal;
    };
    Help.hasProp = function (key, obj) {
        return (key in obj);
    };
    Help.getItem = function (ary, i, defaultVal) {
        if (defaultVal === void 0) { defaultVal = null; }
        return !Help.isNullOrUndef(ary) ? ary[i] : defaultVal;
    };
    Help.hasIndex = function (arr, i) {
        return (arr[i] != null);
    };
    Help.contains = function (arr, item) {
        if (Array.isArray(arr)) {
            return arr.indexOf(item) > -1;
        }
        return false;
    };
    Help.hasClass = function (element, cls) {
        return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
    };
    Help.objectsEqualByValue = function (obj1, obj2) {
        return JSON.stringify(obj1) === JSON.stringify(obj2);
    };
    Help.deepCloneObject = function (obj) {
        return JSON.parse(JSON.stringify(obj));
    };
    Help.isValidDate = function (val) {
        var respVal = false;
        if (Object.prototype.toString.call(val) === "[object Date]") {
            if (!isNaN(val.getTime())) {
                respVal = true;
            }
        }
        return respVal;
    };
    return Help;
}());
var countTweets = 0;


/**
 * Core class for interacting with Ushahidi API
 *
 * - get data
 * - translate to NeedsPoint objects
 */
var Api = {};
Api.getData = function () {

    return axios.get(SETTINGS.needsUrl)
        .then(function (response) {
            var respVal = [];
            response.data.results.forEach(function (p) {
                if (NeedsPoint.hasValidLocation(p)) {
                    respVal.push(Api.buildNeed(p));
                    countTweets++;
                }
                else {
                    Help.log(p.id + " has bad location");
                }
            });
            return respVal;
        }).catch(function (e) { Help.handleErrors(e) });
}

Api.getSuppliersData = function () {
    return axios.get(SETTINGS.suppliersUrl)
        .then(function (response) {
            var respVal = [];
            response.data.results.forEach(function (p) {
                if (SuppliersPoint.hasValidLocation(p)) {
                    respVal.push(Api.buildSupplier(p));
                }
                else {
                    Help.log(p.id + " has bad location");
                }
            });
            return respVal;
        }).catch(function (e) { Help.handleErrors(e) });
}

Api.buildSupplier = function (p) {
    var res = new SuppliersPoint();
    res.coName = p.title;
    res.description = p.content;

    var loc = p.values[USHAHIDI_KEYS.s_location][0];
    res.location = [loc.lat, loc.lon];

    //flesh

    return res;
}

Api.buildNeed = function (p) {
    var res = new NeedsPoint();
    res.id = p.id;
    try {

        res.postcode = p.content;
        res.dateTime = p.post_date;

        var loc = p.values[USHAHIDI_KEYS.location][0];
        res.location = [loc.lat, loc.lon];

        res.org = Help.getItem(p.values[USHAHIDI_KEYS.org], 0);
        res.needs = p.values[USHAHIDI_KEYS.needs];
        res.otherNeeds = Help.getItem(p.values[USHAHIDI_KEYS.otherNeeds], 0);
        res.tweetId = Help.getItem(p.values[USHAHIDI_KEYS.tweetId], 0);
    }
    catch (e) {
        Help.handleErrors(e);
    }
    return res;
}

/**
 * Core data model class to represent PPE needs
 *
 * - expect a location (lat/lon)
 * - may have a tweet ID
 * - other fields as submitted to Ushahidi
 *
 * - add to Leaflet map as a point
 * - add to Needs feed as a twitter embed
 */
var NeedsPoint = /** @class */ (function () {

    // id;
    // postcode;
    // dateTime;
    // location;
    // org;
    // needs;
    // otherNeeds;
    // tweetId;
    function NeedsPoint() {
    }
    NeedsPoint.prototype.hasTweet = function () { return Help.isGoodString(this.tweetId); };
    NeedsPoint.prototype.getPopupContent = function () {
        var twitterLink = this.hasTweet() ? "<a class=\"twitter_link\" target=\"_blank\" title=\"View related tweet\" href=\"https://twitter.com/i/web/status/" + this.tweetId + "\"><i class='fab fa-twitter fa-2x'></i></a>" : "";

        var dt = this.dateTime;
        var dtf = dt.substring(0, 10); //TODO:moment - format datetime, maybe don't need full momentjs var dt = moment(this.dateTime).format("DD/MM/YYYY H:mm");
        var postedHTml = Help.htmlTag(dtf, "div", "class='date_time act_as_hover' title='Published " + dt + "'");

        return "<h1 class=\"bad\">Need</h1>\n            " + twitterLink + "  \n            " + Help.labelledTag("Postcode:", this.postcode, "p") + "\n            " + Help.labelledTag("Organisation:", this.org, "p") + "\n            " + Help.labelledList("Needs:", this.needs) + "\n            " + Help.labelledTag("Other Needs:", this.otherNeeds, "p") + "\n            " + postedHTml;
    };
    NeedsPoint.hasValidLocation = function (p) {
        var respVal = false;
        if (Help.hasProp(USHAHIDI_KEYS.location, p.values)) {
            var locsAr = Help.getProp(USHAHIDI_KEYS.location, p.values);
            if (Help.hasIndex(locsAr, 0)) {
                var locsObj = locsAr[0];
                return Help.hasProp("lat", locsObj) && Help.hasProp("lon", locsObj);
            }
        }
        return respVal;
    };
    return NeedsPoint;
}());


var SuppliersPoint = /** @class */ (function () {

    //res.coName = p.title;
    //res.description = p.content;

    //contact details e.g. sylviacheng999@gmail.com
    //e.g.
    //https://frontlinehelp.ushahidi.io/posts/599/edit
    //postcode LE11 5XE
    function SuppliersPoint() {
    }
    SuppliersPoint.prototype.getPopupContent = function () {
        //var dt = this.dateTime;
        //var dtf = dt.substring(0, 10); //TODO:moment - format datetime, maybe don't need full momentjs var dt = moment(this.dateTime).format("DD/MM/YYYY H:mm");
        //var postedHTml = Help.htmlTag(dtf, "div", "class='date_time act_as_hover' title='Published " + dt + "'");
        return "<h1 class=\"good\">Supplier</h1>";
    };
    SuppliersPoint.hasValidLocation = function (p) {
        var respVal = false;
        if (Help.hasProp(USHAHIDI_KEYS.s_location, p.values)) {
            var locsAr = Help.getProp(USHAHIDI_KEYS.s_location, p.values);
            if (Help.hasIndex(locsAr, 0)) {
                var locsObj = locsAr[0];
                return Help.hasProp("lat", locsObj) && Help.hasProp("lon", locsObj);
            }
        }
        return respVal;
    };
    return SuppliersPoint;

}());

function isIe() {
    var respVal = false;
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf('MSIE ');
    var trident = ua.indexOf('Trident/');
    if (msie > 0 || trident > 0) {
        respVal = true;
    }
    return respVal;
}

/**
 * Setup app
 *
 * - create Leaflet map
 * - get data from Ushahidi API
 * - populate PPE needs feed with twitter embeds
 * - populate map with markers
 */
function setupFrontlineApp() {
    setupEarlyErrors();

    var mapInstance = setupMap();
    var tweetsContainer = document.getElementById("needs");

    var browserIsIe = isIe();

    function createClusterIcon(baseClass) {
        return function (cluster) {
            var childCount = cluster.getChildCount();
            var c = ' marker-cluster-';
            if (childCount < 10) {
                c += 'small';
            } else if (childCount < 100) {
                c += 'medium';
            } else {
                c += 'large';
            }
            return new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>', className: baseClass + ' marker-cluster' + c, iconSize: new L.Point(40, 40) });
        }
    }

    var needsPoints = L.markerClusterGroup({
        iconCreateFunction: createClusterIcon('needs_cluster')
    });

    var suppliersPoints = L.markerClusterGroup({
        iconCreateFunction: createClusterIcon('suppliers_cluster')
    });

    
    
    Api.getData().then(function (d) {

        var tweetRenderedToFeed = 0;

        d.forEach(function (n) {
            if (!browserIsIe && n.hasTweet() && tweetRenderedToFeed < SETTINGS.tweetsLimit) {
                tweetRenderedToFeed++;
                addTweet(n.tweetId, tweetsContainer);
            }
            var marker = L.marker(n.location, {
                icon: pointIcon(SETTINGS.needsColor)
            }).bindPopup(n.getPopupContent());
            needsPoints.addLayer(marker);
        });


        Api.getSuppliersData().then(function (s) {

            s.forEach(function (si) {
                var marker = L.marker(si.location, {
                    icon: pointIcon(SETTINGS.suppliesColor)
                }).bindPopup(si.getPopupContent());
                suppliersPoints.addLayer(marker);
            });

            var overlayMaps = {
                "Needs": needsPoints,
                "Supplies": suppliersPoints
            };

            L.control.layers(null, overlayMaps).addTo(mapInstance);

            needsPoints.addTo(mapInstance);//default needs selected

        });
    });

    function addTweet(tweetId, container) {
        var div = document.createElement("div");
        div.id = tweetId;
        div.className = "grid-item";
        container.appendChild(div);
        buildTweet(tweetId, div);
    }

    function buildTweet(tweetId, tweetContainer) {
        // Create tweet embed
        twttr.widgets.createTweet(tweetId, tweetContainer, {
            conversation: 'none'
            , width: 250
        }).then(function (tweet) {
            // inject CSS into iframe to hide elements
            var css = document.createTextNode(".EmbeddedTweet .CallToAction { display: none; } .EmbeddedTweet .TweetInfo { display: none; } .Tweet-body.e-entry-content { font-size:12px; }");
            var style;
            if (tweet.shadowRoot) {
                style = tweet.shadowRoot.firstElementChild;
            } else {
                style = tweet.contentWindow.document.querySelector('style');
            }
            style.appendChild(css);
            countTweets--;
        });
    }

    function setupMap() {

        var flMap = L.map('map').setView([SETTINGS.mapDefaultLat, SETTINGS.mapDefaultLng], SETTINGS.mapZoomDefault);

        setTitleLayer(flMap);
       
        return flMap;
    }

    function pointIcon(color, size, className) {
        color = (color && /^[a-zA-Z0-9#]+$/.test(color)) ? color : '#959595';
        size = size || [32, 32];
        return L.divIcon({
            className: 'custom-map-marker ' + className,
            html: '<svg class="iconic" style="fill:' + color + ';"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="marker.svg#map-marker"></use></svg>',
            iconSize: size,
            iconAnchor: [size[0] / 2, size[1]],
            popupAnchor: [0, 0 - size[1]]
        });
    }

    function setTitleLayer(map) { //was pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw
        //L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmNhbWVyb25zbWl0aCIsImEiOiJjazkydHhleDkwYWVkM2ZxeHFrMm9oOG9yIn0.E9orHowTWrNJtH31DrSIrA', {
        //    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        //        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        //        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        //    id: 'mapbox/streets-v11',
        //    tileSize: 512,
        //    zoomOffset: -1,
        //    maxZoom: 18
        //}).addTo(map);

        //var basemap = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        //    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>'
        //}).addTo(map);

       L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>',
            //tileSize: 512,
            //zoomOffset: -1,
            maxZoom: 18
        }).addTo(map);
    }

    function setupEarlyErrors() {
        window.onerror = Help.handleErrors;
    }

    if (browserIsIe) {
        addIeNote(tweetsContainer);
        var twitterTimelineContainer = document.getElementById("our_voice");
        addIeNote(twitterTimelineContainer);
    }

    function addIeNote(container) {
        var div = document.createElement("div");
        div.className = "ie_note";
        div.textContent = "Internet Explorer is not supported by Twitter";
        container.appendChild(div);
    }
}

/**
 * Call to setup
 */
(function () {

    setupFrontlineApp();

})();


//var markers = L.markerClusterGroup({
//    iconCreateFunction: function(cluster) {
//        return L.divIcon({ html: '<b>' + cluster.getChildCount() + '</b>', className: 'needsCluster' });
//    }
//});


////Custom radius and icon create function
//var markers = L.markerClusterGroup({
//    maxClusterRadius: 120,
//    iconCreateFunction: function (cluster) {
//        var markers = cluster.getAllChildMarkers();
//        var n = 0;
//        for (var i = 0; i < markers.length; i++) {
//            n += markers[i].number;
//        }
//        return L.divIcon({ html: n, className: 'mycluster', iconSize: L.point(40, 40) });
//    },
//    //Disable all of the defaults:
//    spiderfyOnMaxZoom: false, showCoverageOnHover: false, zoomToBoundsOnClick: false
//});
