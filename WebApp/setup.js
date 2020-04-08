

function setupFrontlineApp() {

    setupEarlyErrors();
    //vue
    var vmFeeds = new Vue({
        el: '#twitter_feeds',
        data: {
            needsFeedReady: false,
            dashboardMode: false
        }
    });

    var mapInstance = setupMap();

    let tweetsContainer = document.getElementById("published_tweets");

    var $grid = null;

    Api.getData().then((d) => {
        var markers = L.markerClusterGroup();
        vmFeeds.needsFeedReady = true;
        d.forEach(n => {
            if (n.hasTweet()) {
                addTweet(n.tweetId, tweetsContainer);
                addTweet(n.tweetId, tweetsContainer);
            }
            var marker = L.marker(n.location, {
                icon: pointIcon("#A51A1A")
            }).bindPopup(n.getPopupContent());
            markers.addLayer(marker);
        });
        mapInstance.addLayer(markers);
    }).then(x => {

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
        }, 600);

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
            , width: 290
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
        flMap.on('fullscreenchange', function () {
            vmFeeds.dashboardMode = flMap.isFullscreen();
            //TODO:PROD remove
            //DOM manipulation as twitter and vue will not play nice.
            //when the feeds are from twitters API and custom rendered can sort this with vue instead
            var feedsDiv = document.getElementById("feeds");
            if (flMap.isFullscreen()) {
                feedsDiv.className = "";
                feedsDiv.style.display = "none";
            }
            else {
                feedsDiv.className = "visible";
                feedsDiv.style.display = "flex";
            }


        });
        return flMap;
    }

    function pointIcon(color, size, className) {
        // Test string to make sure that it does not contain injection
        color = (color && /^[a-zA-Z0-9#]+$/.test(color)) ? color : '#959595';
        size = size || [32, 32];
        return L.divIcon({
            className: 'custom-map-marker ' + className,
            html: '<svg class="iconic" style="fill:' + color + ';"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="44fed91f69f09c95876314a8e23f311e.svg#map-marker"></use></svg>', 
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

