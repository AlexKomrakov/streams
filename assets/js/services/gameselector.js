'use strict';

/**
 * @ngdoc service
 * @name streamsApp.gameSelector
 * @description
 * # gameSelector
 * Service in the streamsApp.
 */
angular.module('streamsApp')
    .service('gameSelector', function ($rootScope) {
        var GameSelector = this;
        var game = {id: null};
        GameSelector.getGame = function () {
            return game;
        };
        GameSelector.selectGame = function (game_id) {
            game.id = game_id;
            $rootScope.$broadcast("changeGame");
        }
    });
