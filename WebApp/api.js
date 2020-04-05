function getUshahidiData(theMap) {

    var features = [];
    var featuresAndUrls = [];
    var featuresAndData = [];
    var featuresAndDataById = {};

    var mainUrl = "https://frontlinehelp.api.ushahidi.io/api/v3/posts/geojson";

    const grabSecondaryContent = (objData) => {
        return fetch(objData.url).then(res => res.json())
            .then(data2 => {
                var newObj = { feature: objData.feature, ajaxData: data2 };
                featuresAndData.push(newObj);
                featuresAndDataById[objData.feature.properties.id] = newObj;
            });
    };

    fetch(mainUrl).then(response => response.json())
        .then(function (data) {
            features = data.features.slice();
            features.forEach(feat =>

                featuresAndUrls.push({
                    url: feat.properties.url,
                    feature: feat
                })

            );

            Promise.all(featuresAndUrls.map(grabSecondaryContent)).then(() => {
                console.log("All Calls Done");

                for (const id in featuresAndDataById) {
                    //console.log(`${property}: ${featuresAndDataById[property]}`);
                    console.log(id);
                    var thisFeature = featuresAndDataById[id].feature;
                    var thisFeaturesAjaxData = featuresAndDataById[id].ajaxData;
                    L.geoJSON(thisFeature, {
                        pointToLayer: function (feature, latlng) {
                            return getMarker(feature, latlng);
                        },
                        onEachFeature: (f, l) => {
                            handleFeature(f, l, thisFeaturesAjaxData);
                        }
                    }).addTo(theMap);
                }

                //.forEach(function (item) {
                //    L.geoJSON(item.feature, {
                //        pointToLayer: function (feature, latlng) {
                //            return getMarker(feature, latlng);
                //        },
                //        onEachFeature: (f, l) => {
                //            handleFeature(f, l, featuresAndDataById);
                //        }
                //    }).addTo(theMap);
                //});
            });
        });
}

function handleFeature(feature, layer, ajaxData) {
    var html = "";

    if (feature.properties) {
        var typeAsColor = feature.properties["marker-color"];
        var typeTitle = "N/A";
        if (typeAsColor === "#00966B")//green
        {
            typeTitle = "Solution";
            needsListValuesKey = "175ae465-02b2-44f0-a07c-8eea2b723395";
        }
        else if (typeAsColor === "#A51A1A")//red
        {
            typeTitle = "Need";
            needsListValuesKey = "f3817f67-4a2e-4fda-bb83-df3909d5e588";
        }

        html = `<h1>${typeTitle}</h1>`;

        if (feature.properties.title) {
            html += `<h2>${feature.properties.title}</h2>`;
        }

        if (feature.properties.description) {
            html += `<p>${feature.properties.description}</p>`;
        }

        html += getNeedsHtml(needsListValuesKey, ajaxData);
    }

    if (html.length > 0) {
        layer.bindPopup(html);
    }
}

function getNeedsHtml(valsKey, relevantAjaxData) {
    var respVal = "<ul>";
    relevantAjaxData.values[valsKey].forEach((v) => respVal += `<li>${v}</li>`);
    respVal += "</ul>";
    return respVal;
}


function getMarker(sourceFeature, location) {
    var markerProps = getMarkerProps(sourceFeature);
    return L.circleMarker(location, markerProps);
}

function getMarkerProps(someFeature) {
    return {
        radius: 8,
        fillColor: someFeature.properties["marker-color"],
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };
}