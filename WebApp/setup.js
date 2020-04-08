function vexed() {
    $('#published_tweets').masonry('layout');
}

function twitterOnLoaded() {
    twitterLoaded = true;
    $(document).ready(function () {
        $('#published_tweets').addClass("loaded");
        ensureMasonry();
    });
}

function ensureMasonry() {
    setTimeout(function () {
        initMasonry();
        setTimeout(function () {
            initMasonry();
            setTimeout(function () {
                initMasonry();
            }, 3500);
        }, 1000);
    }, 550);
    initMasonry();
}

function initMasonry() {

    if (!masonryLoaded) {
        // init Masonry
        var $grid = $('#published_tweets').masonry({
            itemSelector: '.grid-item',
            columnWidth: 260
        });

        $grid.on('layoutComplete', function (event, laidOutItems) {
            console.log('Masonry layout complete with ' + laidOutItems.length + ' items');
            masonryLoaded = laidOutItems.length > 0;
        });
    }

    $('#published_tweets').masonry('layout');
}

function setupFrontlineApp() {

    $(document).ready(function () {

        setupEarlyErrors();
        var mapInstance = setupMap();
        var tweetsContainer = document.getElementById("published_tweets");
        Api.getData().then((d) => {
            var markers = L.markerClusterGroup();
            $("#loadingCog").fadeOut("slow");

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
            ensureMasonry();
            //var $grid = $('#published_tweets');
            // layout Masonry after each image loads
            imagesLoaded('#published_tweets', function() {
                console.log("images loaded");
                $('#published_tweets').masonry('layout');
            });
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
                , width: 250
            })
                .then(function (tweet) {
                    let style = tweet.shadowRoot.firstElementChild;
                    let css = document.createTextNode(`.EmbeddedTweet .CallToAction { display: none; } .EmbeddedTweet .TweetInfo { display: none; } .Tweet-body.e-entry-content { font-size:12px; }`);
                    style.appendChild(css);
                    $countTweets--;
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
            }).setView([Settings.mapDefaultLat, Settings.mapDefaultLng], Settings.mapZoomDefault);
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
        }

    });


}

