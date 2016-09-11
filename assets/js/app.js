'use strict';

/**
 * @ngdoc overview
 * @name streamsApp
 * @description
 * # streamsApp
 *
 * Main module of the application.
 */
angular
    .module('streamsApp', [
        'ngRoute',
        'ngSanitize',
        'ngResource'
    ])
    .config(function ($locationProvider, $interpolateProvider, $routeProvider) {
        $interpolateProvider.startSymbol('[[');
        $interpolateProvider.endSymbol(']]');
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
        $routeProvider
            .when('/:game', {controller: 'RouteCtrl', template: ' '})
            .when('/', {controller: 'RouteCtrl', template: ' '})
            .otherwise({redirectTo: '/'});
    });
