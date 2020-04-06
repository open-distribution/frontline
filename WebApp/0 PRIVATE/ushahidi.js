function getGeoJson() {
    //TODO:flesh https://frontlinehelp.api.ushahidi.io/api/v3/posts/geojson
    var url = "https://frontlinehelp.api.ushahidi.io/api/v3/posts/geojson";

    fetch(url)
        .then(
            function (response) {
                if (response.status !== 200) {
                    console.log(`Fetch problem Status Code: ${response.status}`);
                    return;
                }
                response.json().then(function (data) {
                    console.log(data);
                    data.forEach(function (item) {
                        self.needsData.push(item);
                    })
                    self.needsFeedReady = true;
                });
            }
        )
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
        });

}