/// <reference path="help.ts" />
/// <reference path="api.ts" />
/// <reference path="data.ts" />

function setupFrontlineApp() {
    setupEarlyErrors();

    var mapInstance = setupMap();

    var oms = new OverlappingMarkerSpiderfier(mapInstance, { keepSpiderfied: true });

    var tweetsContainer = document.getElementById("needs");

    var browserIsIe = isIe();

    if (!browserIsIe) {
        ["1250844201203400705", "1250736227395022848", "1250539285603733505", "1250209322056978434"]
            .forEach(function (tweetId) {
                addTweet(tweetId, tweetsContainer);
            });
    }

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

    //var openTitlesLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    //    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>',
    //    maxZoom: 18
    //});

    var mapboxTitlesLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmNhbWVyb25zbWl0aCIsImEiOiJjazkydHhleDkwYWVkM2ZxeHFrMm9oOG9yIn0.E9orHowTWrNJtH31DrSIrA', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        maxZoom: 18
    });

    mapboxTitlesLayer.addTo(mapInstance); //openTitlesLayer.addTo(mapInstance); //default

    var needsPoints = L.markerClusterGroup({
        iconCreateFunction: createClusterIcon('needs_cluster')
    });

    var suppliesPoints = L.markerClusterGroup({
        iconCreateFunction: createClusterIcon('supplies_cluster')
    });

    var needsBreakdownChildren = [];
    var suppliesBreakdownChildren = [];

    //var allNeedsLayers = [];
    //allNeedsLayers.push(needsPoints);

    //var allSuppliesLayers = [];
    //allSuppliesLayers.push(suppliesPoints);

    var needsOpen = true;
    var suppliesOpen = false;

    Data.get().then(function (d) {

        d.needsPosts.forEach(function (np) {
            var marker = L.marker(np.location, { icon: postIcon(Settings.needsColor) })
                .bindPopup(np.popupHtml);
            needsPoints.addLayer(marker);
            oms.addMarker(marker);
        });

        needsPoints.addTo(mapInstance); //default

        d.needsPoints.forEach(function (npt) {

            var ppeTypeMarkerClusterGroup = L.markerClusterGroup({
                iconCreateFunction: createClusterIcon('needs_cluster')
            });

            npt.points.forEach(function (p) {

                var marker = L.marker(p.location, {
                    icon: pointIcon(Settings.needsColor, npt.class)
                }).bindPopup(p.popupHtml);//.openTooltip();
                //}).bindPopup(p.popupHtml);
                //circle.bindTooltip("my tooltip text").openTooltip();

                ppeTypeMarkerClusterGroup.addLayer(marker);
                oms.addMarker(marker);
            });

            needsBreakdownChildren.push({
                label: Help.coloredNumberedLabel(npt.ppeType, npt.points.length, npt.class)
                , layer: ppeTypeMarkerClusterGroup
            });
        });

        // console.log("allNeedsLayers " + allNeedsLayers.length);


        d.suppliesPosts.forEach(function (sp) {
            var marker = L.marker(sp.location, { icon: postIcon(Settings.suppliesColor) })
                .bindPopup(sp.popupHtml);
            suppliesPoints.addLayer(marker);
            oms.addMarker(marker);
        });

        //suppliesPoints.addTo(mapInstance); //default

        d.suppliesPoints.forEach(function (spl) {

            var ppeTypeMarkerClusterGroup = L.markerClusterGroup({
                iconCreateFunction: createClusterIcon('supplies_cluster')
            });

            spl.points.forEach(function (p) {

                var marker = L.marker(p.location, {
                    icon: pointIcon(Settings.suppliesColor, spl.class)
                }).bindPopup(p.popupHtml);//.openTooltip();

                ppeTypeMarkerClusterGroup.addLayer(marker);
                oms.addMarker(marker);
            });

            suppliesBreakdownChildren.push({
                label: Help.coloredNumberedLabel(spl.ppeType, spl.points.length, spl.class)
                , layer: ppeTypeMarkerClusterGroup
            });
        });

        var overlayTree = [
            {
                label: "<div class='toggleGroup needs_group'>Needs<i class='fas fa-chevron-circle-up'></i></div>" // 'Needs'
                //, layer: L.layerGroup([]) 
                //, layer : L.layerGroup(allNeedsLayers)
                //, radioGroup: "TypeChoice"
                //, layer: needsPoints 
                , eventedClasses: [
                    {
                        className: "toggleGroup"
                        , event: "click"
                        , selectAll: toggleNeeds
                    },
                    { //clicking posts -- deselects all breakdown chbs 
                        className: "leaflet-control-layers-selector" // rb = Posts
                        , event: "change"
                        , selectAll: postsChangeHandler
                    }
                ]
                , children: [
                    { label: Help.numberedLabel('Posts', d.needsPosts.length), radioGroup: "NeedsChoice", layer: needsPoints },
                    {
                        label: Help.numberedLabel('Breakdown', d.needsPointsCount)
                        , radioGroup: "NeedsChoice"
                        , collapsed: true
                        , children: needsBreakdownChildren
                        , layer: L.layerGroup([]) //needed to make rb 
                        , eventedClasses: {
                            className: "leaflet-control-layers-selector" //rb = breakdown 
                            , event: "change"
                            , selectAll: breakdownChangeHandler
                        }
                    }
                ]
            }
            ,
            {
                label: "<div class='toggleGroup supplies_group toggle_collapsed'>Supplies<i class='fas fa-chevron-circle-up'></i></div>" 
                , collapsed: true
                //, layer: L.layerGroup([]) //needed to make rb 
                // , layer: L.layerGroup(allSuppliesLayers)
                //, radioGroup: "TypeChoice"
                //, selectAllCheckbox: true
                , eventedClasses: [
                    {
                        className: "toggleGroup"
                        , event: "click"
                        , selectAll: toggleSupplies
                    },
                    { //clicking posts -- deselects all breakdown chbs 
                        className: "leaflet-control-layers-selector" // rb = Posts
                        , event: "change"
                        , selectAll: postsChangeHandler
                    }
                ]
                , children: [
                    { label: Help.numberedLabel('Posts', d.suppliesPosts.length), radioGroup: "SuppliesChoice", layer: suppliesPoints },
                    {
                        label: Help.numberedLabel('Breakdown', d.suppliesPointsCount)
                        , radioGroup: "SuppliesChoice"
                        , collapsed: true
                        , children: suppliesBreakdownChildren
                        , layer: L.layerGroup([]) //needed to make rb 
                        , eventedClasses: {
                            className: "leaflet-control-layers-selector" //rb = breakdown 
                            , event: "change"
                            , selectAll: breakdownChangeHandler
                        }
                    }
                ]
            }
        ];

        //leaflet-layerstree-opened leaflet-layerstree-hide

        L.control.layers.tree(mapboxTitlesLayer, overlayTree, { closedSymbol: '', openedSymbol: '', spaceSymbol: '', selectorBack: true, collapsed: true }).addTo(mapInstance);

        //https://github.com/jawj/OverlappingMarkerSpiderfier-Leaflet
        //var popup = new L.Popup({closeButton: false, offset: new L.Point(0.5, -24)});
        //oms.addListener('click', function(marker) {
        //    popup.setContent(marker.desc);
        //    popup.setLatLng(marker.getLatLng());
        //    mapInstance.openPopup(popup);
        //});
        oms.addListener('spiderfy', function (markers) {
            //console.log("spiderfy");
            //for (var i = 0, len = markers.length; i < len; i ++) markers[i].setIcon(new lightIcon());
            //mapInstance.closePopup();
        });
        oms.addListener('unspiderfy', function (markers) {
            //console.log("unspiderfy");
            //for (var i = 0, len = markers.length; i < len; i ++) markers[i].setIcon(new darkIcon());
        });

    });

    function toggleNeeds(ev, domNode, treeNode, map) {
        var aTag = domNode.querySelectorAll("div.toggleGroup");
        var rbs = domNode.querySelectorAll("input[type='radio']");
        var children = domNode.querySelectorAll(".leaflet-layerstree-children");
        if (needsOpen) {
            rbs[1].checked = true;
            children[0].classList.add("leaflet-layerstree-hide");
            aTag[0].classList.add("toggle_collapsed");
        }
        else {
            //rbs[0].checked = true;
            children[0].classList.remove("leaflet-layerstree-hide");
            aTag[0].classList.remove("toggle_collapsed");
        }
        needsOpen = !needsOpen;
        return false;
    }

    function toggleSupplies(ev, domNode, treeNode, map) {
        var aTag = domNode.querySelectorAll("div.toggleGroup");
        var rbs = domNode.querySelectorAll("input[type='radio']");
        var children = domNode.querySelectorAll(".leaflet-layerstree-children");
        if (suppliesOpen) {
            rbs[1].checked = true;
            children[0].classList.add("leaflet-layerstree-hide");
            aTag[0].classList.add("toggle_collapsed");
        }
        else {
            //rbs[0].checked = true;
            children[0].classList.remove("leaflet-layerstree-hide");
            aTag[0].classList.remove("toggle_collapsed");
        }
        suppliesOpen = !suppliesOpen;
        return false;
    }

    function postsChangeHandler(ev, domNode, treeNode, map) {
        //var rbs = domNode.querySelectorAll("input[type='radio']");
        //console.log("posts change " + rbs.length);
        //console.log("posts chosen");
        var chbs = domNode.querySelectorAll("input[type='checkbox']");
        chbs.forEach(function (ch) {
            ch.disabled = true;
        });
        var childrenWrap = domNode.querySelectorAll(".leaflet-layerstree-node");
        var toHide = childrenWrap[1].querySelectorAll(".leaflet-layerstree-children");
        toHide[0].classList.add("leaflet-layerstree-hide");
        return false;
    }

    function breakdownChangeHandler(ev, domNode, treeNode, map) {
        //console.log("breakdown chosen");
        var chbs = domNode.querySelectorAll("input[type='checkbox']");
        chbs.forEach(function (ch) {
            ch.disabled = false;
        });
        var hiddenChildrenWrap = domNode.querySelectorAll(".leaflet-layerstree-children");
        hiddenChildrenWrap[0].classList.remove("leaflet-layerstree-hide");
    }

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
            $countTweets--;
        });
    }

    function setupMap() {

        var flMap = L.map('map').setView([Settings.mapDefaultLat, Settings.mapDefaultLng], Settings.mapZoomDefault);

        //setTitleLayer(flMap);

        return flMap;
    }

    function postIcon(color) {
        color = (color && /^[a-zA-Z0-9#]+$/.test(color)) ? color : '#959595';
        size = [32, 32];
        return L.divIcon({
            className: 'custom-map-marker',
            html: '<svg class="iconic" style="fill:' + color + ';"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="marker.svg#map-marker"></use></svg>',
            iconSize: size,
            iconAnchor: [size[0] / 2, size[1]],
            popupAnchor: [0, 0 - size[1]]
        });
    }

    function pointIcon(colorPin, innerClass) {
        colorPin = (colorPin && /^[a-zA-Z0-9#]+$/.test(colorPin)) ? colorPin : '#959595';
        size = [32, 32];
        return L.divIcon({
            className: 'custom-map-marker',
            html: '<svg class="iconic" style="fill:' + colorPin + ';"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="marker.svg#map-marker"></use></svg><span class="iconic-bg ' + innerClass + '"></span>',
            iconSize: size,
            iconAnchor: [size[0] / 2, size[1]],
            popupAnchor: [0, 0 - size[1]]
        });
    }

    function setTitleLayer(map) {

        if (Settings.freeMapMode) {
            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>',
                //tileSize: 512,
                //zoomOffset: -1,
                maxZoom: 18
            }).addTo(map);
        }
        else {
            //was pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw
            L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmNhbWVyb25zbWl0aCIsImEiOiJjazkydHhleDkwYWVkM2ZxeHFrMm9oOG9yIn0.E9orHowTWrNJtH31DrSIrA', {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                id: 'mapbox/streets-v11',
                tileSize: 512,
                zoomOffset: -1,
                maxZoom: 18
            }).addTo(map);
        }
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