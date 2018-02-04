'use strict';

function homeController( $scope, CelebritiesService ) {
    $scope.title = 'Top Celebrities:';

    $scope.celebrityList = CelebritiesService.get();
    console.log($scope.celebrityList)
}

module.exports = homeController;