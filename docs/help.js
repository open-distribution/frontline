var Settings = (function () {
    function Settings() {
    }
    Settings.apiUrl = "https://api.frontline.live/data";
    Settings.needsUrl = "https://frontlinehelp.api.ushahidi.io/api/v3/posts/?form=6";
    Settings.suppliesUrl = "https://frontlinehelp.api.ushahidi.io/api/v3/posts/?form=2";
    Settings.debugMode = false;
    Settings.tweetsLimit = 4;
    Settings.mapZoomDefault = 5;
    Settings.mapDefaultLat = 54.606039;
    Settings.mapDefaultLng = -1.537400;
    Settings.needsColor = "#A51A1A";
    Settings.suppliesColor = "#00966B";
    Settings.freeMapMode = false;
    return Settings;
}());
var Images = (function () {
    function Images() {
    }
    Images.mapNeed = "";
    return Images;
}());
var Help = (function () {
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
    Help.numberedLabel = function (l, n) {
        return l + " <i>" + n + "</i>";
    };
    Help.coloredNumberedLabel = function (l, n, c) {
        return "<span class=\"" + c + "\"></span>" + l + " <i>" + n + "</i>";
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
var TryGetResult = (function () {
    function TryGetResult() {
        this.value = null;
    }
    return TryGetResult;
}());
//# sourceMappingURL=help.js.map