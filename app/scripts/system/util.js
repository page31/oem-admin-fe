define([], function() {
    _.removeItem = function(item, arr) {
        return arr.splice(arr.indexOf(item), 1);
    };

    _.replaceWith = function(arr, added, removed) {
        return arr.splice(arr.indexOf(removed), 1, added);
    };

    _.map2Arr = function(map, keyList) {
        return _.map(map, function(i) {
            return _.map(keyList, function(k) {
                return i[k];
            });
        });
    };

    _.wrapTable = function(data, opt) {
        _.extend(data, opt || {});
    };
});