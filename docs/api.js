var $countTweets = 0;
var axios = axios || {};
var Api = (function () {
    function Api() {
    }
    Api.getNeeds = function () {
        return axios.get(Settings.needsUrl)
            .then(function (response) {
            var respVal = [];
            response.data.results.forEach(function (p) {
                if (NeedsPoint.hasValidLocation(p)) {
                    respVal.push(Api.buildNeed(p));
                    $countTweets++;
                }
                else {
                    Help.log("need " + p.id + " has bad location");
                }
            });
            return respVal;
        }).catch(function (e) { return Help.handleErrors(e); });
    };
    Api.getSuppliers = function () {
        return axios.get(Settings.suppliesUrl)
            .then(function (response) {
            var respVal = [];
            response.data.results.forEach(function (p) {
                if (SuppliesPoint.hasValidLocation(p)) {
                    respVal.push(Api.buildSupply(p));
                }
                else {
                    Help.log("supply " + p.id + " has bad location");
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
            var loc = p.values[Ushahidi.Keys.Needs.location][0];
            res.location = [loc.lat, loc.lon];
            res.org = Help.getItem(p.values[Ushahidi.Keys.Needs.org], 0);
            res.ppeTypes = p.values[Ushahidi.Keys.Needs.ppeTypes];
            res.otherPpeTypes = Help.getItem(p.values[Ushahidi.Keys.Needs.otherPpeTypes], 0);
            res.tweetId = Help.getItem(p.values[Ushahidi.Keys.Needs.tweetId], 0);
        }
        catch (e) {
            Help.handleErrors(e);
        }
        return res;
    };
    Api.buildSupply = function (p) {
        var res = new SuppliesPoint();
        res.id = p.id;
        try {
            res.companyName = p.title;
            res.description = p.content;
            res.dateTime = p.post_date;
            var loc = p.values[Ushahidi.Keys.Supplies.location][0];
            res.location = [loc.lat, loc.lon];
            res.ppeTypes = p.values[Ushahidi.Keys.Supplies.ppeTypes];
            res.otherPpeTypes = Help.getItem(p.values[Ushahidi.Keys.Supplies.otherPpeTypes], 0);
        }
        catch (e) {
            Help.handleErrors(e);
        }
        return res;
    };
    return Api;
}());
//# sourceMappingURL=api.js.map