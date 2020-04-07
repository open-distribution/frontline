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
        let res: NeedsPoint = new NeedsPoint();
        res.id = p.id;
        if(Settings.debugMode) {
            console.log(p.id);
        }
        try {
            res.postcode = p.content;
            res.dateTime = p.post_date;
            var loc = p.values[Keys.location][0];
            res.location = [loc.lat, loc.lon];

            res.org = Help.getItem2(p.values[Keys.org], 0);
            res.needs = p.values[Keys.needs];
            res.otherNeeds =  Help.getItem2(p.values[Keys.otherNeeds], 0);
            res.tweetId = Help.getItem2(p.values[Keys.tweetId] , 0);
        }
        catch (e) {
            var t = 0;
            //Help.handleErrors(e);
        }

        return res;
    }
}

class NeedsPoint {
    id: number;
    postcode: string;
    dateTime: string; //"e.g. 2020-04-07T12:37:24+00:00"
    location: number[];
    org: string;
    needs: string[];
    otherNeeds: string;
    tweetId: string;

    getPopupContent(): string {
        var twitterLink = Help.isGoodString(this.tweetId)? `<a class="twitter_link" title="View related tweet" href="https://twitter.com/i/web/status/${this.tweetId}"><i class='fab fa-twitter fa-2x'></i></a>` : "";
        
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
