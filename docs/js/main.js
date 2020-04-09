/**
 * Ushahidi API responses use GUIDs to encode form fields
 *
 * This lookup translates from human-readable to the relevant GUID
 */
const USHAHIDI_KEYS = {
    location:  "9807e1f6-ac37-4f89-9a16-0707cd5f1237",
    org:  "f381bb54-8325-4728-90bd-a93f3dd4802c",
    needs:  "f3817f67-4a2e-4fda-bb83-df3909d5e588",
    otherNeeds:  "949bbb06-c241-4221-8ab2-fec3042fbff9",
    tweetId:  "2b3a5248-dfb7-4a9d-b0dc-dc76e92b1ac7",
}

/**
 * Application settings and configuration
 */
const SETTINGS = {
    //  API endpoint to GET needs (submitted to form/survey number 6) 
    needsUrl: "https://frontlinehelp.api.ushahidi.io/api/v3/posts/?form=6",
    debugMode: false,
    mapZoomDefault:  5,
    mapDefaultLat:  53.606039,
    mapDefaultLng:  -1.537400,
}

/**
 * Helper functions
 *
 * TODO - trim this down to used only
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


let countTweets = 0;


/**
 * Core class for interacting with Ushahidi API
 *
 * - get data
 * - translate to NeedsPoint objects
 */
class Api {

    static getData() {
        return fetch(SETTINGS.needsUrl).then(response => response.json())
            .then(function (data) {
                var respVal = [];
                data.results.forEach((p) => {
                    if (NeedsPoint.hasValidLocation(p)) {
                        respVal.push(Api.buildNeed(p));
                        countTweets++;
                    }
                    else {
                        Help.log(`${p.id} has bad location`);
                    }
                });
                return respVal;
            }).catch(e => Help.handleErrors(e));
    }

    static buildNeed(p) {
        let res = new NeedsPoint();
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
class NeedsPoint {
    // id;
    // postcode;
    // dateTime;
    // location;
    // org;
    // needs;
    // otherNeeds;
    // tweetId;

    hasTweet() { return Help.isGoodString(this.tweetId); }

    getPopupContent() {
        var twitterLink = this.hasTweet() ? `<a class="twitter_link" target="_blank" title="View related tweet" href="https://twitter.com/i/web/status/${this.tweetId}"><i class='fab fa-twitter fa-2x'></i></a>` : "";

        // TODO - format datetime, maybe don't need full momentjs
        // var dt = moment(this.dateTime).format("DD/MM/YYYY H:mm");
        var dt = this.dateTime;
        var postedHTml = Help.htmlTag(dt, "div", "class='date_time act_as_hover' title='Published'");

        return `<h1 class="bad">Need</h1>
            ${twitterLink}
            ${Help.labelledTag("Postcode:", this.postcode, "p")}
            ${Help.labelledTag("Organisation:", this.org, "p")}
            ${Help.labelledList("Needs:", this.needs)}
            ${Help.labelledTag("Other Needs:", this.otherNeeds, "p")}
            ${postedHTml}`;
    }

    static hasValidLocation(p) {
        if (Help.hasProp(USHAHIDI_KEYS.location, p.values)) {
            let locsAr = Help.getProp(USHAHIDI_KEYS.location, p.values);
            if (Help.hasIndex(locsAr, 0)) {
                let locsObj = locsAr[0];
                return Help.hasProp("lat", locsObj) && Help.hasProp("lon", locsObj);
            }
        }
        return false;
    }
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
    var tweetsContainer = document.getElementById("published_tweets");

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

    });

    function addTweet(tweetId, container) {
        let div = document.createElement("div");
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
            const css = document.createTextNode(`.EmbeddedTweet .CallToAction { display: none; } .EmbeddedTweet .TweetInfo { display: none; } .Tweet-body.e-entry-content { font-size:12px; }`);
            let style;
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
        var flMap = L.map('map_container', {
            fullscreenControl: {
                position: 'bottomleft'
                , pseudoFullscreen: true
                , title: {
                    'false': 'Fullscreen Dashboard',
                    'true': 'Exit Fullscreen'
                }
            }
        }).setView([SETTINGS.mapDefaultLat, SETTINGS.mapDefaultLng], SETTINGS.mapZoomDefault);

        setupAttributions(flMap);

        flMap.on('fullscreenchange', function () {
            var feedsDiv = document.getElementById("feeds");
            if (flMap.isFullscreen()) {
                feedsDiv.className = "";
                feedsDiv.style.display = "none";
                $("#loadingCog").fadeOut();
            }
            else {
                feedsDiv.className = "visible";
                feedsDiv.style.display = "flex";
                $("#loadingCog").fadeIn();
            }
        });
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
    }
}

/**
 * Call to setup
 */
(function () {

    setupFrontlineApp();

})();
