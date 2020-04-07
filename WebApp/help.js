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
class Help {
    static handleErrors(error, url, line) {
        var msgDetail = `${error} LINE : ${line} URL : ${url}`;
        console.log("Error Caught : " + msgDetail); //we could ping these to a server if we wanted 
        if (Settings.debugMode) {
            alert(msgDetail); //so we catch issues early when doing RAD
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
        if (s.length > 0) {
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
class ApiHelp {
    static isNumber(n) {
        var t = IsEnum.Both;
        return typeof n === "number";
    }
}
var IsEnum;
(function (IsEnum) {
    IsEnum[IsEnum["IsNever"] = 0] = "IsNever";
    IsEnum[IsEnum["Is"] = 1] = "Is";
    IsEnum[IsEnum["Both"] = 2] = "Both";
})(IsEnum || (IsEnum = {}));
//// To String
//var green: string = Color[Color.Green];
//// To Enum / number
//var color : Color = Color[green];
var frontlineSettings = {
    mainUrl: "https://frontlinehelp.api.ushahidi.io/api/v3/posts/geojson",
    mediaUrlRoot: "https://frontlinehelp.api.ushahidi.io/api/v3/media/",
    mediaValuesKey: "aaf4c9d9-899c-4050-a39a-1bccf441791a"
    //deprecate 
    ,
    bad: {
        color: "#A51A1A" //red
        ,
        needsListValuesKey: "f3817f67-4a2e-4fda-bb83-df3909d5e588",
        popupTitle: "Need"
    },
    good: {
        color: "#00966B" //green
        ,
        needsListValuesKey: "175ae465-02b2-44f0-a07c-8eea2b723395",
        popupTitle: "Solution"
    }
    //new version s
    ,
    Need: {
        color: "#A51A1A" //red
        ,
        needsListValuesKey: "f3817f67-4a2e-4fda-bb83-df3909d5e588"
    },
    Supplier: {
        color: "#00966B" //green
        ,
        needsListValuesKey: "175ae465-02b2-44f0-a07c-8eea2b723395"
    },
    AutoFeeds: {
        color: "#1DA1F2" //twitter blue
        ,
        needsListValuesKey: "DONTUSETHIS"
    }
};
var postTypes = {
    Need: 6,
    Volunteer: 5,
    Supplier: 2,
    AutoFeeds: 4 //3 - 55,57,58      https://frontlinehelp.api.ushahidi.io/api/v3/posts?form=4      https://frontlinehelp.api.ushahidi.io/api/v3/forms/6 //Automagically collects Twitter \/ SMS \/ Email requests
};
///grrr I want typescript - no time !!! 
function getKeyByValue(object, value) {
    for (var prop in object) {
        if (object.hasOwnProperty(prop)) {
            if (object[prop] === value)
                return prop;
        }
    }
}
//{lon lat}
//"9807e1f6-ac37-4f89-9a16-0707cd5f1237"
//Needs
//"f3817f67-4a2e-4fda-bb83-df3909d5e588"
//Org Name
//"f381bb54-8325-4728-90bd-a93f3dd4802c"
//TwitterId 
//"2b3a5248-dfb7-4a9d-b0dc-dc76e92b1ac7"
//# sourceMappingURL=Help.js.map