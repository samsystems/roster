'use strict';

angular.module("common").factory("uuid", function () {
    return {
        v4: function () {
            // get currrent time
            var time = new Date().getTime(), sixteen = 16;
            // create UUID by replacing the template string
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (match) {
                var remainder = (time + sixteen * Math.random()) % sixteen | 0;
                // update for next match
                time = Math.floor(time / sixteen);
                // check matched character
                return (match == "x" ? remainder : remainder & 7 | 8).toString(sixteen);
            });
        }
    };
});