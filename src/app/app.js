require('angular-route');

angular.module('hollywoodStars', [
    'ngRoute'
]);

require('./app.config');

require('./services/')

require('./controllers');

require('./components/app-header/app-header.component');
require('./components/app-nav/app-nav.component');
require('./components/celebrity/celebrity-card.component');
