'use strict';

function homeController( $scope, CelebritiesService ) {
    $scope.title = 'Top Celebrities:';

    $scope.celebrityList = CelebritiesService;
}

module.exports = homeController;