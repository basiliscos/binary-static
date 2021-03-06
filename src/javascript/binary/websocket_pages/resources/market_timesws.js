var MarketTimes = (function() {
    "use strict";

    var getSubmarketInfo = function(activeSymbols, submarketDisplayName) {
        return activeSymbols.filter(function(sy) {
            return sy.submarket_display_name === submarketDisplayName;
        });
    };

    var external = {
        getSubmarketInfo: getSubmarketInfo,
    };
    return external;
}());

module.exports = {
    MarketTimes: MarketTimes,
};
