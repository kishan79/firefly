'use strict';

angular.module('fireflyApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ngMaterial',
  'ngAria',
  'ui.bootstrap',
  'googlechart',
  'uiGmapgoogle-maps',
  'ngGeolocation',
  'linkify',
  'viewhead',
  'ja.qr'
])
  .config(function ($routeProvider, $locationProvider, $mdThemingProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);

    $mdThemingProvider.theme('default')
        .primaryPalette('deep-orange')
        .accentPalette('indigo');
  })
  .config(['uiGmapGoogleMapApiProvider', function (GoogleMapApi) {
        GoogleMapApi.configure({
            //    key: 'your api key',
            v: '3.17',
            libraries: 'weather,geometry,visualization'
        });
  }])
  .run(function($rootScope, $geolocation, $http) {

    $rootScope.all = window.location.search.indexOf('all') >= 0;
    $rootScope.prefix = window.location.hostname.replace('.gdg.events','');

    if($rootScope.prefix === window.location.hostname ) {
       $rootScope.prefix = 'i-oextended';
    }

    if($rootScope.prefix) {
      $http.jsonp('https://hub.gdgx.io/api/v1/tags/'+ $rootScope.prefix+'?callback=JSON_CALLBACK')
        .success(function(data) {
          $rootScope.tag = data;
          $rootScope.tagColor = {
            'background-color': $rootScope.tag.color,
            height: '4px'
          };
        })
        .error(function() {
          $rootScope.prefix = undefined;
        });
    }
    $geolocation.watchPosition({
        timeout: 60000,
        maximumAge: 250,
        enableHighAccuracy: true
    });

    $rootScope.$on('$geolocation.position.changed', function(event, value) {
      if(!$rootScope.geo ||
        (value.coords.latitude !== $rootScope.latitude &&
         value.coords.longitude !== $rootScope.longitude)) {
        $rootScope.geo = {
          latitude: value.coords.latitude,
          longitude: value.coords.longitude,
          timestamp: value.timestamp
        };
      }
    });
  });
