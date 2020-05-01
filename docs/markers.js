var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Ushahidi;
(function (Ushahidi) {
    var Keys;
    (function (Keys) {
        var Needs = (function () {
            function Needs() {
            }
            Needs.location = "9807e1f6-ac37-4f89-9a16-0707cd5f1237";
            Needs.org = "f381bb54-8325-4728-90bd-a93f3dd4802c";
            Needs.ppeTypes = "f3817f67-4a2e-4fda-bb83-df3909d5e588";
            Needs.otherPpeTypes = "949bbb06-c241-4221-8ab2-fec3042fbff9";
            Needs.tweetId = "2b3a5248-dfb7-4a9d-b0dc-dc76e92b1ac7";
            return Needs;
        }());
        Keys.Needs = Needs;
        var Supplies = (function () {
            function Supplies() {
            }
            Supplies.location = "7180b854-c51e-4f0a-b5b6-4f30e27c87cc";
            Supplies.ppeTypes = "175ae465-02b2-44f0-a07c-8eea2b723395";
            Supplies.otherPpeTypes = "f41976b7-028a-4068-9d74-b9a2ede6e990";
            Supplies.webAddress = "10692815-cadc-4bc2-b504-c4ec49880fd7";
            Supplies.logoMediaId = "aaf4c9d9-899c-4050-a39a-1bccf441791a";
            return Supplies;
        }());
        Keys.Supplies = Supplies;
    })(Keys = Ushahidi.Keys || (Ushahidi.Keys = {}));
})(Ushahidi || (Ushahidi = {}));
var Marker = (function () {
    function Marker() {
    }
    Marker.hasValidLocation = function (p, locationKey) {
        var respVal = false;
        if (Help.hasProp(locationKey, p.values)) {
            var locsAr = Help.getProp(locationKey, p.values);
            if (Help.hasIndex(locsAr, 0)) {
                var locsObj = locsAr[0];
                respVal = Help.hasProp("lat", locsObj) && Help.hasProp("lon", locsObj);
            }
        }
        return respVal;
    };
    Marker.prototype.getPostedHtml = function () {
        var m = moment(this.dateTime);
        var dt = m.format("DD/MM/YYYY H:mm");
        return Help.htmlTag(dt, "div", "class='date_time act_as_hover' title='Published " + m.format('MMMM Do YYYY, h:mm:ss a') + "'");
    };
    return Marker;
}());
var NeedsPoint = (function (_super) {
    __extends(NeedsPoint, _super);
    function NeedsPoint() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NeedsPoint.prototype.hasTweet = function () { return Help.isGoodString(this.tweetId); };
    NeedsPoint.prototype.getPopupContent = function () {
        var twitterLink = this.hasTweet() ? "<a class=\"twitter_link\" target=\"_blank\" title=\"View related tweet\" href=\"https://twitter.com/i/web/status/" + this.tweetId + "\"><i class='fab fa-twitter fa-2x'></i></a>" : "";
        return "<h1 class=\"bad\">Need</h1>\n            " + twitterLink + "  \n            " + Help.labelledTag("Postcode:", this.postcode, "p") + "\n            " + Help.labelledTag("Organisation:", this.org, "p") + "\n            " + Help.labelledList("Needs:", this.ppeTypes) + "\n            " + Help.labelledTag("Other Needs:", this.otherPpeTypes, "p") + "\n            " + this.getPostedHtml();
    };
    NeedsPoint.hasValidLocation = function (p) {
        return Marker.hasValidLocation(p, Ushahidi.Keys.Needs.location);
    };
    return NeedsPoint;
}(Marker));
var SuppliesPoint = (function (_super) {
    __extends(SuppliesPoint, _super);
    function SuppliesPoint() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SuppliesPoint.prototype.getPopupContent = function () {
        return "<h1 class=\"good\">Supplier</h1>\n            " + Help.labelledTag("Company:", this.companyName, "p") + "\n            " + Help.labelledTag("Description:", this.description, "p") + "\n            " + Help.labelledList("Needs:", this.ppeTypes) + "\n            " + Help.labelledTag("Other Needs:", this.otherPpeTypes, "p") + "\n            " + this.getPostedHtml();
    };
    SuppliesPoint.hasValidLocation = function (p) {
        return Marker.hasValidLocation(p, Ushahidi.Keys.Supplies.location);
    };
    return SuppliesPoint;
}(Marker));
//# sourceMappingURL=markers.js.map