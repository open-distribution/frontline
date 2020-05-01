var Data = (function () {
    function Data() {
    }
    Data.get = function () {
        return axios.get(Settings.apiUrl)
            .then(function (response) {
            return response.data;
        }).catch(function (e) { return Help.handleErrors(e); });
    };
    return Data;
}());
//# sourceMappingURL=data.js.map