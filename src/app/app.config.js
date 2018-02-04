angular
    .module('hollywoodStars')
    .config(
        function( $routeProvider, $locationProvider ) {

            $routeProvider
                .when('/', {
                    templateUrl: '/assets/views/pages/home.template.html',
                    controller: 'homeController'
                })
                .when('/celebrities', {
                    templateUrl: '/assets/views/pages/list-celebrity.template.html',
                    controller: 'listCelebrityController'
                })
                .when('/celebrity/add', {
                    templateUrl: '/assets/views/pages/add-celebrity.template.html',
                    controller: 'addCelebrityController'
                })
                .when('/celebrity/:name/:id', {
                    templateUrl: '/assets/views/pages/celebrity.template.html',
                    controller: 'celebrityController'
                })
                .when('/celebrity/:name/:id/edit', {
                    templateUrl: '/assets/views/pages/edit-celebrity.template.html',
                    controller: 'editCelebrityController'
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