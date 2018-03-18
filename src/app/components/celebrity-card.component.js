function celebrityCardController ($scope, $element, $attrs) {
    $scope.remove = $scope.$parent.remove;
    
    this.$onInit = function () {
        this.fallbackContent();
    }

    this.fallbackContent = function() {
        $scope.name        = this.celebrity.name.artistic ? this.celebrity.name.artistic : 'No name provided';
        $scope.image       = this.celebrity.image ? this.celebrity.image : 'http://via.placeholder.com/450x300';
        $scope.description = this.celebrity.description ? this.celebrity.description : 'You should inform a short description for this celebrity';
    }
}

var celebrityCardComponent = {
    templateUrl: '/assets/views/components/celebrity-card.template.html',
    controller: celebrityCardController,
    bindings: {
        celebrity: '<'
    }
};

module.exports = celebrityCardComponent;