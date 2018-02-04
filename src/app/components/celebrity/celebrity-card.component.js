function celebrityCardController ($scope, $element, $attrs) {
    $scope.remove = $scope.$parent.remove;
}

angular.module('hollywoodStars').component('cardCelebrity', {
    templateUrl: '/assets/views/components/celebrity-card.template.html',
    controller: celebrityCardController,
    bindings: {
        celebrity: '<'
    }
});

