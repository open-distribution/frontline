function getUshahidiData(theMap) {

    var features = [];
    var featuresAndUrls = [];
    var featuresAndDataById = {};

    var mainUrl = "https://frontlinehelp.api.ushahidi.io/api/v3/posts/geojson";
    var mediaUrlRoot = "https://frontlinehelp.api.ushahidi.io/api/v3/media/";

    const grabSecondaryContent = (objData) => {
        return fetch(objData.url).then(res => res.json())
            .then(data2 => {
                var mediaId = getMediaId(data2);
                if (mediaId !== undefined) {
                    mediaUrl = mediaUrlRoot + mediaId;
                    return fetch(mediaUrl)
                        .then(res => res.json())
                        .then(mediaData => {
                            var thisImgUrl = mediaData.original_file_url;
                            return { feature: objData.feature, ajaxData: data2, imgUrl: thisImgUrl };
                        });
                }
                else {
                    return { feature: objData.feature, ajaxData: data2, imgUrl: null };
                }
                //var thisImgUrl = null;
                //var mediaId = getMediaId(data2);
                //if (mediaId !== undefined) {
                //    mediaUrl = mediaUrlRoot + mediaId;
                //    fetch(mediaUrl).then(res => res.json()).then(mediaData => {
                //        thisImgUrl = mediaData.original_file_url;
                //    });
                //}
                //var newObj = { feature: objData.feature, ajaxData: data2, imgUrl: thisImgUrl  };
                //featuresAndDataById[objData.feature.properties.id] = newObj;
            }).then((whatever) => {

                storeCollectedInfo(whatever, featuresAndDataById);

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
                    var thisFeaturesImageUrl = featuresAndDataById[id].imgUrl;
                    L.geoJSON(thisFeature, {
                        pointToLayer: function (feature, latlng) {
                            return getMarker(feature, latlng);
                        },
                        onEachFeature: (f, l) => {
                            handleFeature(f, l, thisFeaturesAjaxData, thisFeaturesImageUrl);
                        }
                    }).addTo(theMap);
                }
            });
        });
}



function storeCollectedInfo(theobject, theFeaturesAndDataById) {
    theFeaturesAndDataById[theobject.feature.properties.id] = theobject;
}

const mediaValuesKey = "aaf4c9d9-899c-4050-a39a-1bccf441791a";

function getMediaId(sourceAjaxData) {
    var respVal = undefined;
    if (mediaValuesKey in sourceAjaxData.values) {
        console.log("Have media Id in ajax data for " + sourceAjaxData.title);
        respVal = sourceAjaxData.values[mediaValuesKey];
    }
    return respVal;
}


function handleFeature(feature, layer, ajaxData, featureImgUrl) {
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

    if (featureImgUrl !== null) {
        html += `<img src='${featureImgUrl}' style="width:100px;height:auto;" />`;
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