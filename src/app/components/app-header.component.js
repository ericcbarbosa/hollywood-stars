function appHeaderController ($scope, $element, $attrs) {
    
}

var appHeaderComponent = {
    templateUrl: '/assets/views/partials/app-header.template.html',
    controller: appHeaderController,
    bindings: {
        title: '@',
        description: '@'
    }
};

module.exports = appHeaderComponent;
