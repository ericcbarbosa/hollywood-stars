angular
    .module('hollywoodStars')
    .config(
        function( $routeProvider, $locationProvider ) {

            $routeProvider
                .when('/', {
                    templateUrl: '/assets/views/pages/home.template.html',
                    controller: 'homeController'
                })
                .when('/celebrity/:name', {
                    templateUrl: '/assets/views/pages/celebrity.template.html',
                    controller: 'celebrityController'
                })
                .otherwise({
                    redirectTo: '/',
                    controller: 'homeController'
                });

            // Remove o /#!/ da URL
            $locationProvider.html5Mode(true);
            $locationProvider.hashPrefix('');
        }
    );