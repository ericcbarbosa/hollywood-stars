function listCelebrityController( $scope, CelebritiesService ) {

    $scope.celebrityList = CelebritiesService.get();

    $scope.remove = function(id) {
        CelebritiesService.delete(id);
        $scope.celebrityList = CelebritiesService.get();
    }

    $scope.title = 'See all the celebrities listed:'
}

module.exports = listCelebrityController;