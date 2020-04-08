class Keys {
}
Keys.location = "9807e1f6-ac37-4f89-9a16-0707cd5f1237";
Keys.org = "f381bb54-8325-4728-90bd-a93f3dd4802c";
Keys.needs = "f3817f67-4a2e-4fda-bb83-df3909d5e588";
Keys.otherNeeds = "949bbb06-c241-4221-8ab2-fec3042fbff9";
Keys.tweetId = "2b3a5248-dfb7-4a9d-b0dc-dc76e92b1ac7";
class Settings {
}
Settings.needsUrl = "https://frontlinehelp.api.ushahidi.io/api/v3/posts/?form=6";
Settings.debugMode = true;
Settings.mapZoomDefault = 5;
Settings.mapDefaultLat = 53.606039;
Settings.mapDefaultLng = -1.537400;
Settings.twitterLoadDelay = 1500;
class Images {
}
Images.mapNeed = "";
class Help {
    static log(msg) {
        if (Settings.debugMode) {
            console.log(msg);
        }
    }
    static handleErrors(error, url, line) {
        var msgDetail = `${error} LINE : ${line} URL : ${url}`;
        console.log("Error Caught : " + msgDetail);
        if (Settings.debugMode) {
            alert(msgDetail);
        }
    }
    static labelledTag(l, s, t, c = "") {
        return Help.isGoodString(s) ? `<span class="label ${c}">${l}</span>${Help.htmlTag(s, t)}` : "";
    }
    static labelledList(l, s) {
        var str = Help.htmlList(s);
        return Help.isGoodString(str) ? `<span class="label">${l}</span>${str}` : "";
    }
    static htmlTag(s, t, as = "") {
        return Help.isGoodString(s) ? `<${t} ${as}>${s}</${t}>` : "";
    }
    static htmlList(s) {
        var respVal = "";
        if (!Help.isNullOrUndef(s) && s.length > 0) {
            respVal = "<ul>";
            s.forEach(v => respVal += `<li>${v}</li>`);
            respVal += "</ul>";
        }
        return respVal;
    }
    static isGoodString(s) {
        return !Help.isNullOrEmpty(s) && Help.isString(s);
    }
    static isNumber(n) {
        return typeof n === "number";
    }
    static isString(n) {
        return typeof n === "string";
    }
    static isNullOrUndef(val) {
        return val === undefined || val === null;
    }
    static isNullOrEmpty(val) {
        return Help.isNullOrUndef(val) || val === '' || val === 'null' || val === 'undefined';
    }
    static getProp(key, obj, defaultVal = null) {
        return Help.hasProp(key, obj) ? obj[key] : defaultVal;
    }
    static tryGetProp(key, obj, result) {
        let respVal = false;
        if (Help.hasProp(key, obj)) {
            result.value = Help.getProp(key, obj);
            respVal = true;
        }
        return respVal;
    }
    static hasProp(key, obj) {
        return (key in obj);
    }
    static getItem(ary, i, defaultVal = null) {
        return !Help.isNullOrUndef(ary) ? ary[i] : defaultVal;
    }
    static hasIndex(arr, i) {
        return (arr[i] != null);
    }
    static contains(arr, item) {
        if (Array.isArray(arr)) {
            return arr.indexOf(item) > -1;
            ;
        }
        return false;
    }
    static hasClass(element, cls) {
        return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
    }
    static objectsEqualByValue(obj1, obj2) {
        return JSON.stringify(obj1) === JSON.stringify(obj2);
    }
    static deepCloneObject(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
    static isValidDate(val) {
        let respVal = false;
        if (Object.prototype.toString.call(val) === "[object Date]") {
            if (!isNaN(val.getTime())) {
                respVal = true;
            }
        }
        return respVal;
    }
}
class TryGetResult {
    constructor() {
        this.value = null;
    }
}
//# sourceMappingURL=help.js.map