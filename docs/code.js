var Keys = /** @class */ (function () {
    function Keys() {
    }
    Keys.location = "9807e1f6-ac37-4f89-9a16-0707cd5f1237";
    Keys.org = "f381bb54-8325-4728-90bd-a93f3dd4802c";
    Keys.needs = "f3817f67-4a2e-4fda-bb83-df3909d5e588";
    Keys.otherNeeds = "949bbb06-c241-4221-8ab2-fec3042fbff9";
    Keys.tweetId = "2b3a5248-dfb7-4a9d-b0dc-dc76e92b1ac7";
    return Keys;
}());
var Settings = /** @class */ (function () {
    function Settings() {
    }
    Settings.needsUrl = "https://frontlinehelp.api.ushahidi.io/api/v3/posts/?form=6";
    Settings.debugMode = false;
    Settings.mapZoomDefault = 5;
    Settings.mapDefaultLat = 53.606039;
    Settings.mapDefaultLng = -1.537400;
    Settings.twitterLoadDelay = 1500;
    return Settings;
}());
var Images = /** @class */ (function () {
    function Images() {
    }
    Images.mapNeed = "";
    return Images;
}());
var Help = /** @class */ (function () {
    function Help() {
    }
    Help.log = function (msg) {
        if (Settings.debugMode) {
            console.log(msg);
        }
    };
    Help.handleErrors = function (error, url, line) {
        var msgDetail = error + " LINE : " + line + " URL : " + url;
        console.log("Error Caught : " + msgDetail);
        if (Settings.debugMode) {
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
    Help.htmlTag = function (s, t, as) {
        if (as === void 0) { as = ""; }
        return Help.isGoodString(s) ? "<" + t + " " + as + ">" + s + "</" + t + ">" : "";
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
            ;
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
var TryGetResult = /** @class */ (function () {
    function TryGetResult() {
        this.value = null;
    }
    return TryGetResult;
}());
var $countTweets = 0;
var Api = /** @class */ (function () {
    function Api() {
    }
    Api.getData = function () {
        return fetch(Settings.needsUrl).then(function (response) { return response.json(); })
            .then(function (data) {
            var respVal = [];
            data.results.forEach(function (p) {
                if (NeedsPoint.hasValidLocation(p)) {
                    respVal.push(Api.buildNeed(p));
                    $countTweets++;
                }
                else {
                    Help.log(p.id + " has bad location");
                }
            });
            return respVal;
        })["catch"](function (e) { return Help.handleErrors(e); });
    };
    Api.buildNeed = function (p) {
        var res = new NeedsPoint();
        res.id = p.id;
        try {
            res.postcode = p.content;
            res.dateTime = p.post_date;
            var loc = p.values[Keys.location][0];
            res.location = [loc.lat, loc.lon];
            res.org = Help.getItem(p.values[Keys.org], 0);
            res.needs = p.values[Keys.needs];
            res.otherNeeds = Help.getItem(p.values[Keys.otherNeeds], 0);
            res.tweetId = Help.getItem(p.values[Keys.tweetId], 0);
            //Help.log(`Created NeedsPoint ${p.id}`);
        }
        catch (e) {
            Help.handleErrors(e);
        }
        return res;
    };
    return Api;
}());
var NeedsPoint = /** @class */ (function () {
    function NeedsPoint() {
    }
    NeedsPoint.prototype.hasTweet = function () { return Help.isGoodString(this.tweetId); };
    NeedsPoint.prototype.getPopupContent = function () {
        var twitterLink = this.hasTweet() ? "<a class=\"twitter_link\" target=\"_blank\" title=\"View related tweet\" href=\"https://twitter.com/i/web/status/" + this.tweetId + "\"><i class='fab fa-twitter fa-2x'></i></a>" : "";
        // TODO - format datetime, maybe don't need full momentjs
        // var dt = moment(this.dateTime).format("DD/MM/YYYY H:mm");
        var dt = this.dateTime;
        var postedHTml = Help.htmlTag(dt, "div", "class='date_time act_as_hover' title='Published'");
        return "<h1 class=\"bad\">Need</h1>\n            " + twitterLink + "\n            " + Help.labelledTag("Postcode:", this.postcode, "p") + "\n            " + Help.labelledTag("Organisation:", this.org, "p") + "\n            " + Help.labelledList("Needs:", this.needs) + "\n            " + Help.labelledTag("Other Needs:", this.otherNeeds, "p") + "\n            " + postedHTml;
    };
    NeedsPoint.hasValidLocation = function (p) {
        var respVal = false;
        if (Help.hasProp(Keys.location, p.values)) {
            var locsAr = Help.getProp(Keys.location, p.values);
            if (Help.hasIndex(locsAr, 0)) {
                var locsObj = locsAr[0];
                return Help.hasProp("lat", locsObj) && Help.hasProp("lon", locsObj);
            }
        }
        return respVal;
    };
    return NeedsPoint;
}());
