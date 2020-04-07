/// <reference path="setup.js" />
class Api {
    static getData() {
        return fetch(Settings.needsUrl).then(response => response.json())
            .then(function (data) {
            var respVal = [];
            data.results.forEach((p) => {
                respVal.push(Api.buildNeed(p));
            });
            return respVal;
        }).catch(e => Help.handleErrors(e));
    }
    static buildNeed(p) {
        let res = new NeedsPoint();
        res.id = p.id;
        res.postcode = p.content;
        res.dateTime = p.post_date;
        var loc = p.values[Keys.location][0];
        res.location = [loc.lat, loc.lon];
        res.org = p.values[Keys.org][0];
        res.needs = p.values[Keys.needs];
        res.otherNeeds = p.values[Keys.otherNeeds][0];
        res.tweetId = p.values[Keys.tweetId][0];
        return res;
    }
}
class NeedsPoint {
    getPopupContent() {
        var twitterLink = Help.isGoodString(this.tweetId) ? `<a class="twitter_link" title="View tweet" href="https://twitter.com/i/web/status/${this.tweetId}"><i class='fab fa-twitter fa-2x'></i></a>` : "";
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
}
//# sourceMappingURL=code.js.map