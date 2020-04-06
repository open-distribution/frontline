// JavaScript source code
function setup() {

    //map setup
    var requirementsIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAoCAYAAADpE0oSAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxEAAAsRAX9kX5EAAALHSURBVFhHvZc9bE5RGMdvlbaa+GYgTaUlNGKxlMVEIhHxkfhoOlVithlEBxOLWAw2JCbC0EgTaQwdBY0BA5IWKQ2KIqLqo35/52l625xz77l97+uf/PKe95z/8zzvae8997k1SY4mk0SeVtgBO2ELtEAtSBMwCAPQB/0EvOJz7qJoK1yCUZiMZAQuwlpLEy+CGuAEfAVf8hi+wHFosLTZwtgIl+EX+BIWQTmUq9HS+4VBO70BviSVcBPCxVk8DX/MXDZnrcxMsbALvqeMZTMOe6ycExO1cN8M1eQh1FlZZpLkYGoxj98wBPfgLgzanM/ro3OqqHZ7O7WQxWM4BCugxlgOB+AJ+GJmcwdqVXgDjNlkFr2w6N+v9Yi1xaCkvtg0n2GjAjpSkyH051xtNYLC0wQvLCaLjnn4211Yps5z/o7YOCg8w3yccd8y1a7COvCzpIdAjxtGqRfG3TCoFhVe6cZBvYFPbhilMdDOs7RMhUWZ0mN0vhsGtUBF37txUE2wyg2jJK9isjSqwkNuHJR+/RE3jJK8eTse1i3QOetS96FGYJMFBYWnDd5aTBZHZV4HH1KTIQYgeAew1gwx5/032KwAHXu3bDIP7fwkrIclhnZ5CmLbo35w/woG+1MLMeiIfW4UbY+mrxe+/K/H4gOY6k6dmNgLE2aoBsq9z8pNi0nt+rqZqsFV8B9WLOgK/2jGMnkNzVbGLwzH4KcFlMEPOGzpw8JUBz0WVAZXYOYFFRLGNfDSAivhGeQ9/aaFWai3quQqVzu722UsKAIvpBIV5ZylKS6C1U0+SiWLRef6UkszN5FgG+jNz1fAh7rImD4uXyTqTiXOo9vCKhfJ9Ooa0zP3wUILK0ck1OMvq/HXWpvZyxWJu8B3qmmuy2zli+T1cM2KpdHLfL3ZqiMK6BbTK81UUZ1wRbrQuYtCW+EpvIPtNl1ASfIX/A3niLh/yFIAAAAASUVORK5CYII=";
    var solvedIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAoCAYAAADpE0oSAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxEAAAsRAX9kX5EAAAN5SURBVFhHtZhJaBRBFIYrLigiSnBBRYWoiHgyEuJyUEaDARFxCehF8KCIiKCSgwcdtBPEiwEPevBoBAnu68Gooxe3RPHgBoIbQQXjDi5xwf+v1+XMZLqWZCYffJWqyqRfV3V11ZuUKR+R4mcmwYWwBlbCCtgfki74DN6Fl+A1lVav8NOJO3CkA+6AS+EIdgXwFp6Ge3EDL3VPAsmBIzUY5WaYhkPZ1Qu+Qt70IVzlh+7JwUxXlkgNQXkQboO8gd4yCC6CE1RKtaqM+qV7Y/JHLCM9Alfqduk4Cddg5N+kqVS/+KdhO1wh1ZLCa+6UqpAdcaRqUXJRFDO9Ln7COoz6PBsSONLP+has0u2+4z6cheBdZqqXw9Cgf+EL2AZvw+dxXwgzYB0rZfFoL0BOtY+HcDe8Cj+wA5TD+bARTmeHhyuwloGnonIHDmevg4twNaaJ72chkRqGkquXO5yLL7CaUz0T+oJyOtdZg5K0vuBaaN2tYniDlQxcrZtumnDhN3HdTlp1oNwjDSd6xNzwXfAQOCPVILheCrbIblQw8EipW3kNP0o1iE+QI3dRzsC0lHBvGCBVKwMZ9J3UrYyHo6QaBD/Lv3HRycBcsS5496ukGgQ/6xtxBwNzB/JRj/fUvzlEahrKrdJw0s7A3PbMLmSD2UczLmx/AyI1EWUzHK3bdng0tnHn4mI4C5ew18N7uA8eg2ZtjIU8vznSkPToOqwxp9MylKd0PYzP0AQeA3uSHnHbbTGv0jnYLtUguMVOie1JUGaix1mRwGn1B2UDzMuLSgyv3RDHyts8uNUxA+krWiBnVpNNfUikJqPk68UztpRw252D0f5P9PPT2wz25JReuYth7mwUAw+ZDQh6Q5pC0sUPQx76peIoPCHVLPlTbYjUOJQ3ITeFYngK52K0ndLMYptOPpN6WMwqZzq7JSkoKfwKQzLaR3je3P5CMpQk9iPogbhegG8B7YIPpNoj7kFmnVbcgdN6ha+H9iSvECZ9G/G3zESsJE91LhmkMSn9uQXS4aURQbmSnYS+q02QibiPVsjTy0vy65SEHPL8fmXLwXlizcZon0jTjX+qDRm8Fin9bwae291n6jfchKCXpekndKoNfHb8mtId5t3e55pL+FQbIp1l8CAxaRA3/iqM1pet5hE+1YaM+o4p57OeB/n1lBnFY/4qHKX+Af57rdvHZ3ClAAAAAElFTkSuQmCC";

    //places

    var centreLat = 52.606039;
    var centreLng = -1.537400;
    var centreLocation = [centreLat, centreLng];

    //map
    var mapZoom = 7;//large = more zoom
    //var mapCentre = [-109.05, 41.00] //centreLocation;
    var mapCentre = centreLocation;

    var mymap = L.map('map_container').setView(mapCentre, mapZoom);
    setupAttributions();


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

    //vue
    var appVm = new Vue({
        el: '#twitter_feeds',
        data: {
            needsData: [],
            needsFeedReady: false,
            geojsonData: [],
            geojsonDataSecondary: [],
            featuresAndUrls: [],
        },
        methods: {
            fetchData: function () {
                console.log("doing stuff");
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
            console.log("mounted done");
            self.fetchData();
        }
    });



    //fake twitter load
    //hacky simulation of APIs giving new data (Yes I know the order's wrong way round)
    //setTimeout(appVm.loadData, 1500);
    //setTimeout(appVm.loadMoreData, 3500);
    //setTimeout(appVm.loadEvenMoreData, 4500);
    //setTimeout(appVm.loadLastData, 4900);


}