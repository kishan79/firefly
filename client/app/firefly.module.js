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
  .run(function($rootScope, $geolocation, $http, config) {

    $rootScope.all = window.location.search.indexOf('all') >= 0;
    $rootScope.prefix = window.location.hostname.replace('.' + config.DOMAIN, '');

    if ($rootScope.prefix === window.location.hostname) {
      $rootScope.prefix = config.DEFAULT_PREFIX;
    }

    if ($rootScope.prefix) {
      $http.jsonp('https://hub.gdgx.io/api/v1/tags/' + $rootScope.prefix + '?callback=JSON_CALLBACK')
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
      if (!$rootScope.geo ||
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