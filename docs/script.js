function setupFrontline() {

    const debugMode = false; //turn off for prod

    setupEarlyErrors();

    //map setup
    var centreLat = 52.606039;
    var centreLng = -1.537400;
    var centreLocation = [centreLat, centreLng];
    var mapZoom = 7;//large = more zoom
    var mymap = L.map('map_container', {
        scrollWheelZoom: false
        , fullscreenControl: {
            position: 'bottomleft'
            , pseudoFullscreen: true //fullscreen to page width and height
            , title: {
                'false': 'Fullscreen Dashboard',
                'true': 'Exit Fullscreen'
            }
        }
    }).setView(centreLocation, mapZoom);
    setupAttributions();


    //vue
    var appVm = new Vue({
        el: '#dash_controls',
        data: {
            needsData: [],
            needsFeedReady: false,
            geojsonData: [],
            geojsonDataSecondary: [],
            featuresAndUrls: [],
            dashboardMode: false
        },
        methods: {
            fetchData: function () {
                getUshahidiData(mymap);
            },
            hackTime: function (dateValue) {
                return new moment(dateValue).format("H:mm:ss");
            },
            hackDateTime: function (dateValue) {
                return new moment(dateValue).format("DD/MM/YYYY H:mm:ss");
            }
        },
        mounted: function () {
            var self = this;
            document.getElementById("body").className = '';
            self.fetchData();

			mymap.on('fullscreenchange', function () {
				self.dashboardMode = mymap.isFullscreen();
				//nasty nasty DOM manipulation as without more fiddling twitter and vue will not play nice.
				//when the feeds are from twitters API / Ushahidi can sort this with vue instead
				var feedsDiv = document.getElementById("feeds");
				if (mymap.isFullscreen())
				{
					feedsDiv.className = "";
					feedsDiv.style.display = "none";
				}
				else {
					feedsDiv.className = "visible";
					feedsDiv.style.display = "flex";
				}
            });
        }
    });

    function setupAttributions() {
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1
        }).addTo(mymap);
    }

    function setupEarlyErrors() {
        window.onerror = handleErrors;
        Vue.config.errorHandler = function (err, vm, info) {
            handleErrors(err, "N/A", "N/A");
        };
    }

    function handleErrors(error, url, line) {
        var msgDetail = `${error} LINE : ${line} URL : ${url}`;
        console.log("Error Caught : " + msgDetail); //we could ping these to a server if we wanted
        if (debugMode) {
            alert(msgDetail); //so we catch issues early when doing RAD
        }
    }
}
