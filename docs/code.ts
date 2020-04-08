class Keys {
    static location: string = "9807e1f6-ac37-4f89-9a16-0707cd5f1237";
    static org: string = "f381bb54-8325-4728-90bd-a93f3dd4802c";
    static needs: string = "f3817f67-4a2e-4fda-bb83-df3909d5e588";
    static otherNeeds: string = "949bbb06-c241-4221-8ab2-fec3042fbff9";
    static tweetId: string = "2b3a5248-dfb7-4a9d-b0dc-dc76e92b1ac7";
}

class Settings {
    static needsUrl: string = "https://frontlinehelp.api.ushahidi.io/api/v3/posts/?form=6";
    static debugMode: boolean = false;
    static mapZoomDefault: number = 5;
    static mapDefaultLat: number = 53.606039;
    static mapDefaultLng: number = -1.537400;
    static twitterLoadDelay: number = 1500;
}

class Images {
    static mapNeed: string = "";
}

class Help {

    static log(msg) {
        if (Settings.debugMode) {
            console.log(msg);
        }
    }

    static handleErrors(error, url?, line?) {
        var msgDetail = `${error} LINE : ${line} URL : ${url}`;
        console.log("Error Caught : " + msgDetail);
        if (Settings.debugMode) {
            alert(msgDetail);
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
        if(!Help.isNullOrUndef(s) && s.length > 0) {
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
        return Help.hasProp(key, obj)? obj[key] : defaultVal;
    }

    static tryGetProp<T>(key: any, obj:any, result: TryGetResult<T>): boolean {
        let respVal = false;
        if (Help.hasProp(key, obj)) {
            result.value = Help.getProp(key, obj);
            respVal = true;
        }
        return respVal;
    }

    static hasProp(key: any, obj:any) : boolean {
        return (key in obj);
    }

    static getItem<T>(ary:any, i:number, defaultVal:any = null){
        return !Help.isNullOrUndef(ary)? ary[i] : defaultVal;
    }

    static hasIndex<T>(arr: Array<T>, i : number) : boolean {
        return (arr[i] != null);
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

class TryGetResult<T> {
    value: T | undefined | null;
    constructor() {
        this.value = null;
    }
}


var $countTweets = 0;


class Api {

    static getData() {
        return fetch(Settings.needsUrl).then(response => response.json())
            .then(function (data) {
                var respVal = [];
                data.results.forEach((p) => {
                    if (NeedsPoint.hasValidLocation(p)) {
                        respVal.push(Api.buildNeed(p));
                        $countTweets++;
                    }
                    else {
                        Help.log(`${p.id} has bad location`);
                    }
                });
                return respVal;
            }).catch(e => Help.handleErrors(e));
    }

    static buildNeed(p) {
        let res: NeedsPoint = new NeedsPoint();
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
    }
}

class NeedsPoint {
    id: number;
    postcode: string;
    dateTime: string;
    location: number[];
    org: string;
    needs: string[];
    otherNeeds: string;
    tweetId: string;

    hasTweet(): boolean { return Help.isGoodString(this.tweetId); }

    getPopupContent(): string {
        var twitterLink = this.hasTweet() ? `<a class="twitter_link" target="_blank" title="View related tweet" href="https://twitter.com/i/web/status/${this.tweetId}"><i class='fab fa-twitter fa-2x'></i></a>` : "";

        // TODO - format datetime, maybe don't need full momentjs
        // var dt = moment(this.dateTime).format("DD/MM/YYYY H:mm");
        var dt = this.dateTime;
        var postedHTml = Help.htmlTag(dt, "div", "class='date_time act_as_hover' title='Published'");

        return `<h1 class="bad">Need</h1>
            ${twitterLink}
            ${Help.labelledTag("Postcode:", this.postcode, "p")}
            ${Help.labelledTag("Organisation:", this.org, "p")}
            ${Help.labelledList("Needs:", this.needs)}
            ${Help.labelledTag("Other Needs:", this.otherNeeds, "p")}
            ${postedHTml}`;
    }

    static hasValidLocation(p) {
        let respVal: boolean = false;

        if (Help.hasProp(Keys.location, p.values)) {
            let locsAr = Help.getProp(Keys.location, p.values);
            if (Help.hasIndex(locsAr, 0)) {
                let locsObj = locsAr[0];
                return Help.hasProp("lat", locsObj) && Help.hasProp("lon", locsObj);
            }
        }
        return respVal;
    }
}
