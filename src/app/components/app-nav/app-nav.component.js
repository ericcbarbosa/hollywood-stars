function appNavController ($scope, $element, $attrs) {
    $scope.navLinks = {
        home: {
            name: 'Home',
            link: '/'
        },
        celebrities: {
            name: 'Celebrities',
            link: 'celebrities'
        },
        add: {
            name: 'Add',
            link: 'celebrity/add'
        }
    }
}

angular.module('hollywoodStars').component('appNav', {
    templateUrl: '/assets/views/partials/app-nav.template.html',
    controller: appNavController
});

