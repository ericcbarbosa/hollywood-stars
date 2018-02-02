function celebrityCardController ($scope, $element, $attrs) {
    
}

angular.module('hollywoodStars').component('cardCelebrity', {
    templateUrl: '/assets/views/components/celebrity-card.template.html',
    controller: celebrityCardController,
    bindings: {
        celebrity: '<'
    }
});

