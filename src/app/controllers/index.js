'use strict';

var angular = require('angular');

angular.module('hollywoodStars')
    .controller('homeController', require('./home.controller'))
    .controller('celebrityController', require('./celebrity.controller'))
    .controller('addCelebrityController', require('./add-celebrity.controller'));