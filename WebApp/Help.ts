class Keys {
    static location: string = "9807e1f6-ac37-4f89-9a16-0707cd5f1237";  
    static org: string = "f381bb54-8325-4728-90bd-a93f3dd4802c";
    static needs: string = "f3817f67-4a2e-4fda-bb83-df3909d5e588";
    static otherNeeds: string = "949bbb06-c241-4221-8ab2-fec3042fbff9";
    static tweetId: string = "2b3a5248-dfb7-4a9d-b0dc-dc76e92b1ac7";
}

class Settings {
    static needsUrl: string = "https://frontlinehelp.api.ushahidi.io/api/v3/posts/?form=6";
    static debugMode: boolean = true;
}

class Images {
    static mapNeed: string = "";
}

class Help {
    static handleErrors(error, url?, line?) {
        var msgDetail = `${error} LINE : ${line} URL : ${url}`;
        console.log("Error Caught : " + msgDetail); //we could ping these to a server if we wanted 
        if (Settings.debugMode) {
            alert(msgDetail); //so we catch issues early when doing RAD
        }
    }

    static labelledTag(l: string, s: any, t: string, c:string = "") {
        return Help.isGoodString(s)? `<span class="label ${c}">${l}</span>${Help.htmlTag(s, t)}` : "";
    }

    static labelledList(l: string, s: any) {
        var str = Help.htmlList(s);
        return Help.isGoodString(str)? `<span class="label">${l}</span>${str}` : "";
    }

    static htmlTag(s: any, t: string, as:string = "") {
        return Help.isGoodString(s)? `<${t} ${as}>${s}</${t}>` : "";
    }

    static htmlList(s: any) {
        var respVal = "";
        if(s.length > 0) {
            respVal = "<ul>";
            s.forEach(v => respVal += `<li>${v}</li>`);
            respVal += "</ul>";
        }
        return respVal;
    }

    static isGoodString(s: any) {
        return !Help.isNullOrEmpty(s) && Help.isString(s);
    }

    static isNumber(n: any): n is number {
        return typeof n === "number";
    }

    static isString(n: any): n is string {
        return typeof n === "string";
    }
    static isNullOrUndef(val: any): boolean {
        return val === undefined || val === null;
    }

    static isNullOrEmpty(val: any): boolean {
        return Help.isNullOrUndef(val) || val === '' || val === 'null' || val === 'undefined';
    }

    static getProp(key: any, obj:any, defaultVal:any = null) {
        return (key in obj)? obj[key] : defaultVal;
    }

    static getItem2<T>(ary:any, i:number, defaultVal:any = null){
        return !Help.isNullOrUndef(ary)? ary[i] : defaultVal;
    }

    static getItem<T>(key: any, obj:any, i:number, defaultVal:any = null){
        var t = Help.getProp(key, obj, defaultVal);
        if(t) {
            return t[i];
        }
        return defaultVal;
    }

    static contains<T>(arr: Array<T>, item: T): boolean {
        if (Array.isArray(arr)) {
            return arr.indexOf(item) > -1;;
        }
        return false;
    }

    static hasClass(element, cls) {
        return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
    }

    static objectsEqualByValue(obj1, obj2): boolean {
        return JSON.stringify(obj1) === JSON.stringify(obj2);
        //cheap and easy, if order of keys diff then will be diff. cref:https://stackoverflow.com/questions/1068834/object-comparison-in-javascript
    }

    static deepCloneObject(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    static isValidDate(val: any) {
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
    static isNumber(n: any): n is number {
        var t = IsEnum.Both;
        return typeof n === "number";
    }
}



enum IsEnum {
    IsNever = 0,
    Is = 1,
    Both = 2,
}


//// To String
//var green: string = Color[Color.Green];

//// To Enum / number
//var color : Color = Color[green];

var frontlineSettings = {
    mainUrl: "https://frontlinehelp.api.ushahidi.io/api/v3/posts/geojson"
    , mediaUrlRoot: "https://frontlinehelp.api.ushahidi.io/api/v3/media/"
    , mediaValuesKey: "aaf4c9d9-899c-4050-a39a-1bccf441791a"

    //deprecate 
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


    //new version s
    , Need: {
        color: "#A51A1A" //red
        , needsListValuesKey: "f3817f67-4a2e-4fda-bb83-df3909d5e588"
    }
    , Supplier: {
        color: "#00966B" //green
        , needsListValuesKey: "175ae465-02b2-44f0-a07c-8eea2b723395"
    }
    , AutoFeeds: {
        color: "#1DA1F2" //twitter blue
        , needsListValuesKey: "DONTUSETHIS"
    }
};

var postTypes = {
    Need: 6, //two 116, 117 
    Volunteer: 5, //one 66 - brilliant Homerton 
    Supplier: 2, //9 e.g. 90,94,74,73 etc
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