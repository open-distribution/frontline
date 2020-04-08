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
        }).catch(function (e) { return Help.handleErrors(e); });
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
        var dt = moment(this.dateTime).format("DD/MM/YYYY H:mm");
        var postedHTml = Help.htmlTag(dt, "div", "class='date_time act_as_hover' title='Published'");
        return "<h1 class=\"bad\">Need</h1>\n            " + twitterLink + "  \n            " + Help.labelledTag("Postcode:", this.postcode, "p") + "\n            " + Help.labelledTag("Organisation:", this.org, "p") + "\n            " + Help.labelledList("Needs:", this.needs) + "\n            " + Help.labelledTag("Other Needs:", this.otherNeeds, "p") + "\n            " + postedHTml;
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
//# sourceMappingURL=code.js.map