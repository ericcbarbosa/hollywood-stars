'use strict';

function homeController( $scope, CelebritiesService ) {
    $scope.title = 'Recently added celebrities:';

    $scope.celebrityList = CelebritiesService.getCelebrities();
}

module.exports = homeController;