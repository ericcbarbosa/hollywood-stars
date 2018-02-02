'use strict';

var angular = require('angular');

angular.module('hollywoodStars')
    .controller('homeController', require('./home.controller'));

angular.module('hollywoodStars')
    .controller('celebrityController', require('./celebrity.controller'));