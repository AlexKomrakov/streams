'use strict';

/**
 * @ngdoc filter
 * @name streamsApp.filter:numberFormat
 * @function
 * @description
 * # numberFormat
 * Filter in the streamsApp.
 */
angular.module('streamsApp')
    .filter('numberFormat', function () {
        return function (number, decimals, dec_point, thousands_sep) {
            var i, j, kw, kd, km, minus = "";

            if(number < 0){
                minus = "-";
                number = number*-1;
            }

            // input sanitation & defaults
            if( isNaN(decimals = Math.abs(decimals)) ){
                decimals = 2;
            }
            if( dec_point == undefined ){
                dec_point = ",";
            }
            if( thousands_sep == undefined ){
                thousands_sep = ".";
            }
            if( number < 10000 ){
                thousands_sep = "";
            }

            i = parseInt(number = (+number || 0).toFixed(decimals)) + "";

            if( (j = i.length) > 3 ){
                j = j % 3;
            } else{
                j = 0;
            }

            km = (j ? i.substr(0, j) + thousands_sep : "");
            kw = i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands_sep);
            kd = (decimals ? dec_point + Math.abs(number - i).toFixed(decimals).replace(/-/, 0).slice(2) : "");

            return minus + km + kw + kd;
        }
    });
