var frontlineSettings = {
    mainUrl: "https://frontlinehelp.api.ushahidi.io/api/v3/posts/geojson"
    , mediaUrlRoot: "https://frontlinehelp.api.ushahidi.io/api/v3/media/"
    , mediaValuesKey: "aaf4c9d9-899c-4050-a39a-1bccf441791a"

    , bad: {
        color: "#A51A1A" //red
        , needsListValuesKey: "f3817f67-4a2e-4fda-bb83-df3909d5e588"
        , popupTitle: "Need"
    }

    , good: {
        color: "#00966B" //green
        , needsListValuesKey: "175ae465-02b2-44f0-a07c-8eea2b723395"
        , popupTitle: "Solution"
    }
};

function getUshahidiData(theMap) {

    var features = [];
    var featuresAndUrls = [];
    var featuresAndDataById = {};

    const grabSecondaryContent = (objData) => {
        return fetch(objData.url).then(res => res.json())
            .then(data2 => {
                var mediaId = getMediaId(data2);
                if (mediaId !== undefined) {
                    mediaUrl = frontlineSettings.mediaUrlRoot + mediaId;
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
            }).then((whatever) => {
                storeCollectedInfo(whatever, featuresAndDataById);
            });
    };


    fetch(frontlineSettings.mainUrl).then(response => response.json())
        .then(function (data) {
            features = data.features.slice();
            features.forEach(feat =>
                featuresAndUrls.push({
                    url: feat.properties.url,
                    feature: feat
                })
            );

            Promise.all(featuresAndUrls.map(grabSecondaryContent)).then(() => {
                console.log("All API Calls Done");
                for (const id in featuresAndDataById) {
                    L.geoJSON(featuresAndDataById[id].feature, {
                        pointToLayer: function (feature, latlng) {
                            return getMarker(feature, latlng);
                        },
                        onEachFeature: (f, l) => {
                            setPopupContent(f, l, featuresAndDataById[id].ajaxData, featuresAndDataById[id].imgUrl);
                        }
                    }).addTo(theMap);
                }
            });
        });


    throw new Error("hereitis");
}

function setPopupContent(feature, layer, ajaxData, featureImgUrl) {
    var html = "";
    if (feature.properties) {
        var typeName = getTypeFromColor(feature);
        html = `<h1 class="${typeName}">${frontlineSettings[typeName].popupTitle}</h1>`;
        if (feature.properties.title) {
            html += `<h2>${feature.properties.title}</h2>`;
        }
        if (feature.properties.description) {
            html += `<p>${feature.properties.description}</p>`;
        }

        html += getNeedsHtml(frontlineSettings[typeName].needsListValuesKey, ajaxData);
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

function getTypeFromColor(aFeature) {
    var color = aFeature.properties["marker-color"];
    if (color === frontlineSettings.good.color) {
        return "good";
    }
    else if (color === frontlineSettings.bad.color) {
        return "bad";
    }
    else {
        throw new Error("feature color was not coded for " + color);
    }
}

function storeCollectedInfo(theobject, theFeaturesAndDataById) {
    theFeaturesAndDataById[theobject.feature.properties.id] = theobject;
}

function getMediaId(sourceAjaxData) {
    var respVal = undefined;
    if (frontlineSettings.mediaValuesKey in sourceAjaxData.values) {
        respVal = sourceAjaxData.values[frontlineSettings.mediaValuesKey];
    }
    return respVal;
}