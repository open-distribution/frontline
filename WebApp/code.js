class Api {
    static getData() {
        return fetch(Settings.needsUrl).then(response => response.json())
            .then(function (data) {
            var respVal = [];
            data.results.forEach((p) => {
                if (NeedsPoint.hasValidLocation(p)) {
                    respVal.push(Api.buildNeed(p));
                }
                else {
                    Help.log(`${p.id} has bad location`);
                }
            });
            return respVal;
        }).catch(e => Help.handleErrors(e));
    }
    static buildNeed(p) {
        let res = new NeedsPoint();
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
            Help.log(`Created NeedsPoint ${p.id}`);
        }
        catch (e) {
            Help.handleErrors(e);
        }
        return res;
    }
}
class NeedsPoint {
    hasTweet() { return Help.isGoodString(this.tweetId); }
    getPopupContent() {
        try {
            var twitterLink = this.hasTweet() ? `<a class="twitter_link" target="_blank" title="View related tweet" href="https://twitter.com/i/web/status/${this.tweetId}"><i class='fab fa-twitter fa-2x'></i></a>` : "";
            var dt = moment(this.dateTime).format("DD/MM/YYYY H:mm");
            var postedHTml = Help.htmlTag(dt, "div", "class='date_time act_as_hover' title='Published'");
            return `<h1 class="bad">Need</h1>
            ${twitterLink}  
            ${Help.labelledTag("Postcode:", this.postcode, "p")}
            ${Help.labelledTag("Organisation:", this.org, "p")}
            ${Help.labelledList("Needs:", this.needs)}
            ${Help.labelledTag("Other Needs:", this.otherNeeds, "p")}
            ${postedHTml}`;
        }
        catch (e) {
            var t = 0; //Help.handleErrors(e); //TODO:prod
        }
        return `BAD ${this.id}`;
    }
    static hasValidLocation(p) {
        let respVal = false;
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
//let locAry = new TryGetResult<any[]>();
//if (Help.tryGetProp(Keys.location, p.values, locAry)) {
//    var locObj = Help.getItem(locAry.value, 0);
//}
//if(Help.tryGetProp())
//if(Help.hasProp(Keys.location, p.values)) {
//    var loc = p.values[Keys.location][0];
//}
//res.location = [loc.lat, loc.lon];
//# sourceMappingURL=code.js.map