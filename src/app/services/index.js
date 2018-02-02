'use strict';

var angular = require('angular');

angular.module('hollywoodStars')
       .service('CelebritiesService', require('./celebrities.service'));