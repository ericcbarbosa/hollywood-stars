function appHeaderController ($scope, $element, $attrs) {
    
}

angular.module('hollywoodStars').component('appHeader', {
    templateUrl: '/assets/views/partials/app-header.template.html',
    controller: appHeaderController,
    bindings: {
        title: '@',
        description: '@'
    }
});

