webpackJsonp([0],[
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(20);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

angular.module('hollywoodStars', [
    'ngRoute',
    'ngMessages'
]);

__webpack_require__(2);
__webpack_require__(3)
__webpack_require__(5);
__webpack_require__(11);
__webpack_require__(15);

/***/ }),
/* 2 */
/***/ (function(module, exports) {

angular.module('hollywoodStars')
    .config(
        function( $routeProvider, $locationProvider ) {

            $routeProvider
                .when('/', {
                    templateUrl: '/assets/views/pages/home.template.html',
                    controller: 'homeController'
                })
                .when('/celebrities', {
                    templateUrl: '/assets/views/pages/list-celebrity.template.html',
                    controller: 'listCelebrityController'
                })
                .when('/celebrity/add', {
                    templateUrl: '/assets/views/pages/add-celebrity.template.html',
                    controller: 'addCelebrityController'
                })
                .when('/celebrity/:name/:id', {
                    templateUrl: '/assets/views/pages/celebrity.template.html',
                    controller: 'celebrityController'
                })
                .when('/celebrity/:name/:id/edit', {
                    templateUrl: '/assets/views/pages/edit-celebrity.template.html',
                    controller: 'editCelebrityController'
                })
                .otherwise({
                    redirectTo: '/',
                    controller: 'homeController'
                });

            // Remove o /#!/ da URL
            $locationProvider.html5Mode(true);
            $locationProvider.hashPrefix('');
        }
    );

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

angular.module('hollywoodStars')
    .service('CelebritiesService', __webpack_require__(4));

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function CelebritiesService() {

    var celebrities = [
        {
            id: 1,
            name: 'Sandy Lima',
            urlName: 'sandy-lima',
            description: 'cantora, compositora e atriz brasileira. Cantora desde a infância, Sandy começou sua carreira em 1990, quando formou com o irmão, o músico Junior Lima, a dupla vocal Sandy & Junior.',
            image: 'http://images.virgula.com.br/2015/02/sandy.jpg',
        }, {
            id: 2,
            name: 'Manu Gavassi',
            urlName: 'manu-gavassi',
            description: 'Manoela Latini Gavassi Francisco, mais conhecida como Manu Gavassi, é uma cantora, compositora, atriz e autora brasileira',
            image: 'http://metropolitanafm.com.br/wp-content/uploads/2016/07/capa-manu-gavassi.jpg',
        }, {
            id: 3,
            name: 'Paula Fernandes',
            urlName: 'paula-fernandes',
            description: 'cantora e compositora brasileira. Cantora desde a infância, Fernandes começou a cantar profissionalmente aos oito anos de idade',
            image: 'http://www.assisnews.com.br/wp-content/uploads/2017/12/paula_fernandes-1.jpg',
        }, {
            id: 4,
            name: 'Joana Borges',
            urlName: 'joana-borges',
            description: 'é uma jovem actriz portuguesa. Começou por fazer parte do coro infantil " Jovens Cantores de Lisboa" para ingressar no grupo musical " OndaChoc".',
            image: 'http://s2.glbimg.com/fYMxgE75WaHjEhWzSz1ID0LXZAw=/475x475/top/i.glbimg.com/og/ig/infoglobo/f/original/2017/01/09/joanaborges.png',
        }, {
            id: 5,
            name: 'Paola Oliveira',
            urlName: 'paola-oliveira',
            description: 'Paolla Oliveira é descendente de espanhóis, italianos e portugueses. Ela é filha de um policial militar aposentado e de uma ex-auxiliar de enfermagem',
            image: 'https://patricinhaesperta.com.br/wp-content/uploads/2013/05/paola-oliveira.jpg',
        }, {
            id: 6,
            name: 'Marina Ruy Barbosa',
            urlName: 'marina-ruy-barbosa',
            description: 'Marina Souza Ruy Barbosa Negrão é uma atriz brasileira. Começou a atuar ainda criança, e fez seu primeiro trabalho de destaque no papel de Aninha na telenovela Começar de Novo.',
            image: 'http://s2.glbimg.com/Zpl4bjt56sjaF0zb9x3pK4-oPWM=/e.glbimg.com/og/ed/f/original/2017/08/07/marn.jpg',
        }
    ];

    var service = {

        toUrl: function(string) {
            return string.trim().toLowerCase().split(' ').join('-');
        },

        toCapitalize: function(string) {
            var slices = string.split('-');
            var capitalizedSlices = [];

            slices.forEach( function(word) {
                capitalizedSlices.push( word.charAt(0).toUpperCase() + word.slice(1) );
            });

            return capitalizedSlices.join(' ');
        },

        getCelebrities: function () {
            return celebrities;
        },

        add: function ( celebrity ) {
            var localStorageList = JSON.parse( localStorage.getItem("celebritiesList") );

            if ( localStorageList ) {
                localStorageList.push( celebrity );
                this.update( localStorageList );
            }

            else {
                localStorageList = [];
                localStorageList.push(celebrity);
                this.update( localStorageList );
            }

            return true;
        },

        get: function () {
            var celebritiesList = localStorage.getItem("celebritiesList") !== null
                                  ? JSON.parse( localStorage.getItem("celebritiesList") )
                                  : false;

            return celebritiesList;
        },

        search: function(id) {
            var celebritiesList = this.get();
            var searchResult;

            id = parseInt(id);

            if ( celebritiesList ) {
                celebritiesList.map(function( celebrity ) {

                    if ( celebrity.id == id )
                        searchResult = celebrity;

                });
            }

            return searchResult;
        },

        update: function ( celebritiesList ) {
            localStorage.setItem('celebritiesList', JSON.stringify( celebritiesList ));
        },

        edit: function ( celebrity ) {
            this.delete( celebrity.id );
            this.add( celebrity );

            return this.get();
        },

        delete: function (id) {
            var celebritiesList = this.get();
            var deleted = false;

            id = parseInt(id);

            if ( celebritiesList ) {
                celebritiesList.map( function( celebrity, index ) {

                    if ( celebrity.id == id ) {
                        deleted = celebritiesList.splice(index, 1);
                    }

                });

                this.update( celebritiesList );
            }

            return deleted;
        },

    }

    return service;
};

module.exports = CelebritiesService;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

angular.module('hollywoodStars')
    .controller('homeController', __webpack_require__(6))
    .controller('celebrityController', __webpack_require__(7))
    .controller('addCelebrityController', __webpack_require__(8))
    .controller('editCelebrityController', __webpack_require__(9))
    .controller('listCelebrityController', __webpack_require__(10))

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function homeController( $scope, CelebritiesService ) {
    $scope.title = 'Recently added celebrities:';

    $scope.celebrityList = CelebritiesService.get();
}

module.exports = homeController;

/***/ }),
/* 7 */
/***/ (function(module, exports) {

function celebrityController( $scope, $routeParams, CelebritiesService, $window ) {
    
    $scope.celebrity = CelebritiesService.search( parseInt( $routeParams.id ) );

    $scope.showMessage = false;
    $scope.message = $scope.celebrity.name + ' removed successfully';

    $scope.remove = function (id) {
        CelebritiesService.delete(id);
        $scope.showMessage = true;

        setTimeout(function() {
            $window.location.href = '/';
        }, 3000);
    }
}

module.exports = celebrityController;

/***/ }),
/* 8 */
/***/ (function(module, exports) {

function addCelebrityController( $scope, $routeParams, CelebritiesService ) {

    $scope.title = 'Add a new celebrity:';

    $scope.celebrities = CelebritiesService.get();
    $scope.updateCelebrities = function () {
        $scope.celebrities = CelebritiesService.get();
    }

    $scope.celebrity = {
        name: {
            birth: '',
            artistic: ''
        },
        image: '',
        birthdate: '',
        gender: '',
        height: '',
        occupation: '',
        description: '',
    }
    
    $scope.form = {
        hasError: false,
        disableSave: true,

        validate: function () {
            $scope.feedback.messages = [];
    
            if ($scope.celebrity.name.artistic.length < 3) {
                $scope.feedback.messages.push( 'Invalid name' );
            }
    
            if ($scope.celebrity.description.length < 3) {
                $scope.feedback.messages.push( 'Invalid description' );
            }
    
            if ($scope.celebrity.image.length < 3) {
                $scope.feedback.messages.push( 'Invalid image path' );
            }
    
            return $scope.feedback.messages;
        },

        handleBlur: function () {
            
        },

        handleChange: function () {
            $scope.form.disableSave = $scope.form.validate().length > 0 ? true : false;
        },

        add: function ($form) {

            if ( !$form.$invalid ) {
                $scope.updateCelebrities();
    
                $scope.celebrity.id      = $scope.celebrities ? $scope.celebrities.length + 1 : 1;
                $scope.celebrity.urlName = CelebritiesService.toUrl( $scope.celebrity.name.artistic );
    
                CelebritiesService.add( $scope.celebrity );

                $scope.form.reset();
                $scope.form.hasError = true;

                $scope.feedback.messagesClass();
                $scope.feedback.messages.push( $scope.celebrity.name.artistic + ' added successfully!' );
            } else {
                $scope.form.hasError = true;

                $scope.feedback.messagesClass();
                $scope.feedback.messages = [];
                $scope.feedback.messages.push( 'Complete the form to add a new celebrity' );
                console.log($form.artisticName);
            }
        },

        reset: function () {
            $scope.celebrity = {
                name: {
                    birth: '',
                    artistic: ''
                },
                image: '',
                birthdate: '',
                gender: '',
                height: '',
                occupation: '',
                description: '',
            }
        }
    }

    $scope.feedback = {
        messages: [],
        messagesModifier: '',
        messagesClass: function () {
            $scope.feedback.messagesModifier =  $scope.form.hasError ? 'danger' : 'success';
        },
    }

}

module.exports = addCelebrityController;

/***/ }),
/* 9 */
/***/ (function(module, exports) {

function editCelebrityController( $scope, $window, $routeParams, CelebritiesService ) {

    $scope.title = 'Edit Celebrity'
    $scope.celebrity = CelebritiesService.search( $routeParams.id );


    $scope.form = {
        hasError: false,
        disableSave: true,

        validate: function () {
            $scope.feedback.messages = [];
    
            if ($scope.celebrity.name.length < 3) {
                $scope.feedback.messages.push( 'Invalid name' );
            }
    
            if ($scope.celebrity.description.length < 3) {
                $scope.feedback.messages.push( 'Invalid description' );
            }
    
            if ($scope.celebrity.image.length < 3) {
                $scope.feedback.messages.push( 'Invalid image path' );
            }
    
            return $scope.feedback.messages;
        },

        handleChange: function () {
            $scope.form.disableSave = $scope.form.validate().length > 0 ? true : false;
        },

        update: function () {

            var newCelebrity = $scope.celebrity;
    
            var messages = $scope.form.validate();
    
            if ( messages.length == 0 ) {
    
                CelebritiesService.edit( newCelebrity );
    
                $scope.form.hasError = false;
    
                $scope.feedback.messagesClass();
                $scope.feedback.messages = [];
                $scope.feedback.messages.push( $scope.celebrity.name.artistic + ' updated successfully!' );
    
            } else {
    
                $scope.form.hasError = true;
                $scope.feedback.messagesClass();
    
            }
        }
    };

    $scope.feedback = {
        messages: [],
        messagesModifier: '',
        messagesClass: function () {
            $scope.feedback.messagesModifier =  $scope.form.hasError ? 'error' : 'success';
        }
    };
}

module.exports = editCelebrityController;

/***/ }),
/* 10 */
/***/ (function(module, exports) {

function listCelebrityController( $scope, CelebritiesService ) {

    $scope.celebrityList = CelebritiesService.get();

    $scope.selectOptions = [
        { name: 'Name', value: 'name' },
        { name: 'Age', value: 'age' }
    ]

    $scope.remove = function(id) {
        CelebritiesService.delete(id);
        $scope.celebrityList = CelebritiesService.get();
    }

    $scope.title = 'All celebrities'

    var reg = /^\d{4,5}-\d{4}$/;
}

module.exports = listCelebrityController;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

angular.module('hollywoodStars')
    .directive('capitalize', __webpack_require__(12))
    .directive('date', __webpack_require__(13))
    .directive('height', __webpack_require__(14))

/***/ }),
/* 12 */
/***/ (function(module, exports) {

function capitalizeDirective () {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: link
    };
}

function link(scope, element, attrs, ctrl) {
    
    var _capitalize = function (text) {
        var wordsArray = text.split(' ');

        var capitalizedWords = wordsArray.map(function (word) {

            if (/(da|de)/.test(word)) return word;

            return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
        });
        
        return capitalizedWords.join(' ');
    }
    
    element.bind("blur", function () {

        var checkMinLength = (ctrl.$viewValue.length >= attrs.ngMinlength) ? true : false;
        var checkMaxLength = (ctrl.$viewValue.length <= attrs.ngMaxlength) ? true : false;

        if ( checkMinLength && checkMaxLength ) {
            ctrl.$setViewValue(_capitalize(ctrl.$viewValue));
            ctrl.$render();
        }
    });
}

module.exports = capitalizeDirective;

/***/ }),
/* 13 */
/***/ (function(module, exports) {

function dateDirective () {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: link
    };
}

function link(scope, element, attrs, ctrl) {

    var _formatDate = function (input) {

        // replace everything that's not a num for ""
        input = input.replace(/[^0-9]+/g, "");

        if(input.length > 2) {
            input = input.substring(0,2) + "/" + input.substring(2);
        }

        if(input.length > 5) {
            input = input.substring(0,5) + "/" + input.substring(5,9);
        }

        return input;
    }
    
    element.bind("keyup", function () {
        ctrl.$setViewValue(_formatDate(ctrl.$viewValue));
        ctrl.$render();
    });
}

module.exports = dateDirective;

/***/ }),
/* 14 */
/***/ (function(module, exports) {

function heightDirective () {

    return {
        require: 'ngModel',
        restrict: 'A',
        link: link
    };
}

function link(scope, element, attrs, ctrl) {
    
    var _formatHeight = function (height) {

        // Removes everything that's not a number or a comma
        height = height.replace(/[^0-9]+/g, "");
        
        if ( height.length > 1 ) {
            height = height.substring(0, 1) + ',' + height.substring(1,3);
        }

        return height;
    }

    element.bind("keyup", function () {
        // console.log(_formatHeight(ctrl.$viewValue));
        ctrl.$setViewValue(_formatHeight(ctrl.$viewValue));
        ctrl.$render();
    });
}

module.exports = heightDirective;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

angular.module('hollywoodStars')
    .component('appHeader', __webpack_require__(16))
    .component('appNav', __webpack_require__(17))
    .component('cardCelebrity', __webpack_require__(18))
    .component('feedbackMessages', __webpack_require__(19))
    

/***/ }),
/* 16 */
/***/ (function(module, exports) {

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


/***/ }),
/* 17 */
/***/ (function(module, exports) {

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

var appNavComponent = {
    templateUrl: '/assets/views/partials/app-nav.template.html',
    controller: appNavController
};

module.exports = appNavComponent;

/***/ }),
/* 18 */
/***/ (function(module, exports) {

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

/***/ }),
/* 19 */
/***/ (function(module, exports) {

function feedbackMessagesController ($scope, $element, $attrs) {
    // this.$onInit = function() {
    //     console.log(this)
    // }
}

var feedbackMessagesComponent = {
    templateUrl: '/assets/views/components/feedback-messages.template.html',
    controller: feedbackMessagesController,
    bindings: {
        modifier: '<',
        messages: '<'
    }
};

module.exports = feedbackMessagesComponent;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "../css/main.css";

/***/ })
],[0]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvYXBwL2FwcC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwL2FwcC5jb25maWcuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC9zZXJ2aWNlcy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwL3NlcnZpY2VzL2NlbGVicml0aWVzLnNlcnZpY2UuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC9jb250cm9sbGVycy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwL2NvbnRyb2xsZXJzL2hvbWUuY29udHJvbGxlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwL2NvbnRyb2xsZXJzL2NlbGVicml0eS5jb250cm9sbGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9hcHAvY29udHJvbGxlcnMvYWRkLWNlbGVicml0eS5jb250cm9sbGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9hcHAvY29udHJvbGxlcnMvZWRpdC1jZWxlYnJpdHkuY29udHJvbGxlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwL2NvbnRyb2xsZXJzL2xpc3QtY2VsZWJyaXR5LmNvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC9kaXJlY3RpdmVzL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9hcHAvZGlyZWN0aXZlcy9jYXBpdGFsaXplLmRpcmVjdGl2ZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwL2RpcmVjdGl2ZXMvZGF0ZS5kaXJlY3RpdmUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC9kaXJlY3RpdmVzL2hlaWdodC5kaXJlY3RpdmUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC9jb21wb25lbnRzL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9hcHAvY29tcG9uZW50cy9hcHAtaGVhZGVyLmNvbXBvbmVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwL2NvbXBvbmVudHMvYXBwLW5hdi5jb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC9jb21wb25lbnRzL2NlbGVicml0eS1jYXJkLmNvbXBvbmVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwL2NvbXBvbmVudHMvZmVlZGJhY2stbWVzc2FnZXMuY29tcG9uZW50LmpzIiwid2VicGFjazovLy8uL3NyYy9hcHAvc3R5bGVzL21haW4ubGVzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCOzs7Ozs7QUNUQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjs7QUFFakI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNOzs7Ozs7QUNsQ0E7QUFDQSwyRDs7Ozs7OztBQ0RBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhOztBQUViO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBLGlCQUFpQjtBQUNqQjs7QUFFQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsaUJBQWlCOztBQUVqQjtBQUNBOztBQUVBO0FBQ0EsU0FBUzs7QUFFVDs7QUFFQTtBQUNBOztBQUVBLG9DOzs7Ozs7QUNqSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1FOzs7Ozs7O0FDTEE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBLGdDOzs7Ozs7QUNSQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUEscUM7Ozs7OztBQ2pCQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFNBQVM7O0FBRVQ7O0FBRUEsU0FBUzs7QUFFVDtBQUNBO0FBQ0EsU0FBUzs7QUFFVDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYTtBQUNiOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7O0FBRUEsd0M7Ozs7OztBQ3ZHQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBLGFBQWE7O0FBRWI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx5Qzs7Ozs7O0FDbEVBOztBQUVBOztBQUVBO0FBQ0EsU0FBUyw4QkFBOEI7QUFDdkMsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLG1CQUFtQixJQUFJLElBQUksRUFBRTtBQUM3Qjs7QUFFQSx5Qzs7Ozs7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBLGlEOzs7Ozs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUEscUM7Ozs7OztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUEsK0I7Ozs7OztBQ2hDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQSxpQzs7Ozs7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNKQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlDOzs7Ozs7QUN0QkE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHdDOzs7Ozs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDJDOzs7Ozs7QUNmQSwyRCIsImZpbGUiOiJhcHAuYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ2hvbGx5d29vZFN0YXJzJywgW1xuICAgICduZ1JvdXRlJyxcbiAgICAnbmdNZXNzYWdlcydcbl0pO1xuXG5yZXF1aXJlKCcuL2FwcC5jb25maWcnKTtcbnJlcXVpcmUoJy4vc2VydmljZXMnKVxucmVxdWlyZSgnLi9jb250cm9sbGVycycpO1xucmVxdWlyZSgnLi9kaXJlY3RpdmVzJyk7XG5yZXF1aXJlKCcuL2NvbXBvbmVudHMnKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9hcHAvYXBwLmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImFuZ3VsYXIubW9kdWxlKCdob2xseXdvb2RTdGFycycpXHJcbiAgICAuY29uZmlnKFxyXG4gICAgICAgIGZ1bmN0aW9uKCAkcm91dGVQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIgKSB7XHJcblxyXG4gICAgICAgICAgICAkcm91dGVQcm92aWRlclxyXG4gICAgICAgICAgICAgICAgLndoZW4oJy8nLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvYXNzZXRzL3ZpZXdzL3BhZ2VzL2hvbWUudGVtcGxhdGUuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2hvbWVDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC53aGVuKCcvY2VsZWJyaXRpZXMnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvYXNzZXRzL3ZpZXdzL3BhZ2VzL2xpc3QtY2VsZWJyaXR5LnRlbXBsYXRlLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdsaXN0Q2VsZWJyaXR5Q29udHJvbGxlcidcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAud2hlbignL2NlbGVicml0eS9hZGQnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvYXNzZXRzL3ZpZXdzL3BhZ2VzL2FkZC1jZWxlYnJpdHkudGVtcGxhdGUuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2FkZENlbGVicml0eUNvbnRyb2xsZXInXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLndoZW4oJy9jZWxlYnJpdHkvOm5hbWUvOmlkJywge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL2Fzc2V0cy92aWV3cy9wYWdlcy9jZWxlYnJpdHkudGVtcGxhdGUuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2NlbGVicml0eUNvbnRyb2xsZXInXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLndoZW4oJy9jZWxlYnJpdHkvOm5hbWUvOmlkL2VkaXQnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvYXNzZXRzL3ZpZXdzL3BhZ2VzL2VkaXQtY2VsZWJyaXR5LnRlbXBsYXRlLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdlZGl0Q2VsZWJyaXR5Q29udHJvbGxlcidcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAub3RoZXJ3aXNlKHtcclxuICAgICAgICAgICAgICAgICAgICByZWRpcmVjdFRvOiAnLycsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2hvbWVDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyBSZW1vdmUgbyAvIyEvIGRhIFVSTFxyXG4gICAgICAgICAgICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUodHJ1ZSk7XHJcbiAgICAgICAgICAgICRsb2NhdGlvblByb3ZpZGVyLmhhc2hQcmVmaXgoJycpO1xyXG4gICAgICAgIH1cclxuICAgICk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYXBwL2FwcC5jb25maWcuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiYW5ndWxhci5tb2R1bGUoJ2hvbGx5d29vZFN0YXJzJylcbiAgICAuc2VydmljZSgnQ2VsZWJyaXRpZXNTZXJ2aWNlJywgcmVxdWlyZSgnLi9jZWxlYnJpdGllcy5zZXJ2aWNlJykpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2FwcC9zZXJ2aWNlcy9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XHJcblxyXG5mdW5jdGlvbiBDZWxlYnJpdGllc1NlcnZpY2UoKSB7XHJcblxyXG4gICAgdmFyIGNlbGVicml0aWVzID0gW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWQ6IDEsXHJcbiAgICAgICAgICAgIG5hbWU6ICdTYW5keSBMaW1hJyxcclxuICAgICAgICAgICAgdXJsTmFtZTogJ3NhbmR5LWxpbWEnLFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ2NhbnRvcmEsIGNvbXBvc2l0b3JhIGUgYXRyaXogYnJhc2lsZWlyYS4gQ2FudG9yYSBkZXNkZSBhIGluZsOibmNpYSwgU2FuZHkgY29tZcOnb3Ugc3VhIGNhcnJlaXJhIGVtIDE5OTAsIHF1YW5kbyBmb3Jtb3UgY29tIG8gaXJtw6NvLCBvIG3DunNpY28gSnVuaW9yIExpbWEsIGEgZHVwbGEgdm9jYWwgU2FuZHkgJiBKdW5pb3IuJyxcclxuICAgICAgICAgICAgaW1hZ2U6ICdodHRwOi8vaW1hZ2VzLnZpcmd1bGEuY29tLmJyLzIwMTUvMDIvc2FuZHkuanBnJyxcclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIGlkOiAyLFxyXG4gICAgICAgICAgICBuYW1lOiAnTWFudSBHYXZhc3NpJyxcclxuICAgICAgICAgICAgdXJsTmFtZTogJ21hbnUtZ2F2YXNzaScsXHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnTWFub2VsYSBMYXRpbmkgR2F2YXNzaSBGcmFuY2lzY28sIG1haXMgY29uaGVjaWRhIGNvbW8gTWFudSBHYXZhc3NpLCDDqSB1bWEgY2FudG9yYSwgY29tcG9zaXRvcmEsIGF0cml6IGUgYXV0b3JhIGJyYXNpbGVpcmEnLFxyXG4gICAgICAgICAgICBpbWFnZTogJ2h0dHA6Ly9tZXRyb3BvbGl0YW5hZm0uY29tLmJyL3dwLWNvbnRlbnQvdXBsb2Fkcy8yMDE2LzA3L2NhcGEtbWFudS1nYXZhc3NpLmpwZycsXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICBpZDogMyxcclxuICAgICAgICAgICAgbmFtZTogJ1BhdWxhIEZlcm5hbmRlcycsXHJcbiAgICAgICAgICAgIHVybE5hbWU6ICdwYXVsYS1mZXJuYW5kZXMnLFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ2NhbnRvcmEgZSBjb21wb3NpdG9yYSBicmFzaWxlaXJhLiBDYW50b3JhIGRlc2RlIGEgaW5mw6JuY2lhLCBGZXJuYW5kZXMgY29tZcOnb3UgYSBjYW50YXIgcHJvZmlzc2lvbmFsbWVudGUgYW9zIG9pdG8gYW5vcyBkZSBpZGFkZScsXHJcbiAgICAgICAgICAgIGltYWdlOiAnaHR0cDovL3d3dy5hc3Npc25ld3MuY29tLmJyL3dwLWNvbnRlbnQvdXBsb2Fkcy8yMDE3LzEyL3BhdWxhX2Zlcm5hbmRlcy0xLmpwZycsXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICBpZDogNCxcclxuICAgICAgICAgICAgbmFtZTogJ0pvYW5hIEJvcmdlcycsXHJcbiAgICAgICAgICAgIHVybE5hbWU6ICdqb2FuYS1ib3JnZXMnLFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ8OpIHVtYSBqb3ZlbSBhY3RyaXogcG9ydHVndWVzYS4gQ29tZcOnb3UgcG9yIGZhemVyIHBhcnRlIGRvIGNvcm8gaW5mYW50aWwgXCIgSm92ZW5zIENhbnRvcmVzIGRlIExpc2JvYVwiIHBhcmEgaW5ncmVzc2FyIG5vIGdydXBvIG11c2ljYWwgXCIgT25kYUNob2NcIi4nLFxyXG4gICAgICAgICAgICBpbWFnZTogJ2h0dHA6Ly9zMi5nbGJpbWcuY29tL2ZZTXhnRTc1V2FIakVoV3pTejFJRDBMWFpBdz0vNDc1eDQ3NS90b3AvaS5nbGJpbWcuY29tL29nL2lnL2luZm9nbG9iby9mL29yaWdpbmFsLzIwMTcvMDEvMDkvam9hbmFib3JnZXMucG5nJyxcclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIGlkOiA1LFxyXG4gICAgICAgICAgICBuYW1lOiAnUGFvbGEgT2xpdmVpcmEnLFxyXG4gICAgICAgICAgICB1cmxOYW1lOiAncGFvbGEtb2xpdmVpcmEnLFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1Bhb2xsYSBPbGl2ZWlyYSDDqSBkZXNjZW5kZW50ZSBkZSBlc3BhbmjDs2lzLCBpdGFsaWFub3MgZSBwb3J0dWd1ZXNlcy4gRWxhIMOpIGZpbGhhIGRlIHVtIHBvbGljaWFsIG1pbGl0YXIgYXBvc2VudGFkbyBlIGRlIHVtYSBleC1hdXhpbGlhciBkZSBlbmZlcm1hZ2VtJyxcclxuICAgICAgICAgICAgaW1hZ2U6ICdodHRwczovL3BhdHJpY2luaGFlc3BlcnRhLmNvbS5ici93cC1jb250ZW50L3VwbG9hZHMvMjAxMy8wNS9wYW9sYS1vbGl2ZWlyYS5qcGcnLFxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgICAgaWQ6IDYsXHJcbiAgICAgICAgICAgIG5hbWU6ICdNYXJpbmEgUnV5IEJhcmJvc2EnLFxyXG4gICAgICAgICAgICB1cmxOYW1lOiAnbWFyaW5hLXJ1eS1iYXJib3NhJyxcclxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdNYXJpbmEgU291emEgUnV5IEJhcmJvc2EgTmVncsOjbyDDqSB1bWEgYXRyaXogYnJhc2lsZWlyYS4gQ29tZcOnb3UgYSBhdHVhciBhaW5kYSBjcmlhbsOnYSwgZSBmZXogc2V1IHByaW1laXJvIHRyYWJhbGhvIGRlIGRlc3RhcXVlIG5vIHBhcGVsIGRlIEFuaW5oYSBuYSB0ZWxlbm92ZWxhIENvbWXDp2FyIGRlIE5vdm8uJyxcclxuICAgICAgICAgICAgaW1hZ2U6ICdodHRwOi8vczIuZ2xiaW1nLmNvbS9acGw0Ymp0NTZzamFGMHpiOXgzcEs0LW9QV009L2UuZ2xiaW1nLmNvbS9vZy9lZC9mL29yaWdpbmFsLzIwMTcvMDgvMDcvbWFybi5qcGcnLFxyXG4gICAgICAgIH1cclxuICAgIF07XHJcblxyXG4gICAgdmFyIHNlcnZpY2UgPSB7XHJcblxyXG4gICAgICAgIHRvVXJsOiBmdW5jdGlvbihzdHJpbmcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHN0cmluZy50cmltKCkudG9Mb3dlckNhc2UoKS5zcGxpdCgnICcpLmpvaW4oJy0nKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICB0b0NhcGl0YWxpemU6IGZ1bmN0aW9uKHN0cmluZykge1xyXG4gICAgICAgICAgICB2YXIgc2xpY2VzID0gc3RyaW5nLnNwbGl0KCctJyk7XHJcbiAgICAgICAgICAgIHZhciBjYXBpdGFsaXplZFNsaWNlcyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgc2xpY2VzLmZvckVhY2goIGZ1bmN0aW9uKHdvcmQpIHtcclxuICAgICAgICAgICAgICAgIGNhcGl0YWxpemVkU2xpY2VzLnB1c2goIHdvcmQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB3b3JkLnNsaWNlKDEpICk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGNhcGl0YWxpemVkU2xpY2VzLmpvaW4oJyAnKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBnZXRDZWxlYnJpdGllczogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gY2VsZWJyaXRpZXM7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgYWRkOiBmdW5jdGlvbiAoIGNlbGVicml0eSApIHtcclxuICAgICAgICAgICAgdmFyIGxvY2FsU3RvcmFnZUxpc3QgPSBKU09OLnBhcnNlKCBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImNlbGVicml0aWVzTGlzdFwiKSApO1xyXG5cclxuICAgICAgICAgICAgaWYgKCBsb2NhbFN0b3JhZ2VMaXN0ICkge1xyXG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlTGlzdC5wdXNoKCBjZWxlYnJpdHkgKTtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKCBsb2NhbFN0b3JhZ2VMaXN0ICk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlTGlzdCA9IFtdO1xyXG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlTGlzdC5wdXNoKGNlbGVicml0eSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSggbG9jYWxTdG9yYWdlTGlzdCApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIGNlbGVicml0aWVzTGlzdCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiY2VsZWJyaXRpZXNMaXN0XCIpICE9PSBudWxsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IEpTT04ucGFyc2UoIGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiY2VsZWJyaXRpZXNMaXN0XCIpIClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogZmFsc2U7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gY2VsZWJyaXRpZXNMaXN0O1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHNlYXJjaDogZnVuY3Rpb24oaWQpIHtcclxuICAgICAgICAgICAgdmFyIGNlbGVicml0aWVzTGlzdCA9IHRoaXMuZ2V0KCk7XHJcbiAgICAgICAgICAgIHZhciBzZWFyY2hSZXN1bHQ7XHJcblxyXG4gICAgICAgICAgICBpZCA9IHBhcnNlSW50KGlkKTtcclxuXHJcbiAgICAgICAgICAgIGlmICggY2VsZWJyaXRpZXNMaXN0ICkge1xyXG4gICAgICAgICAgICAgICAgY2VsZWJyaXRpZXNMaXN0Lm1hcChmdW5jdGlvbiggY2VsZWJyaXR5ICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIGNlbGVicml0eS5pZCA9PSBpZCApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlYXJjaFJlc3VsdCA9IGNlbGVicml0eTtcclxuXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHNlYXJjaFJlc3VsdDtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uICggY2VsZWJyaXRpZXNMaXN0ICkge1xyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnY2VsZWJyaXRpZXNMaXN0JywgSlNPTi5zdHJpbmdpZnkoIGNlbGVicml0aWVzTGlzdCApKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBlZGl0OiBmdW5jdGlvbiAoIGNlbGVicml0eSApIHtcclxuICAgICAgICAgICAgdGhpcy5kZWxldGUoIGNlbGVicml0eS5pZCApO1xyXG4gICAgICAgICAgICB0aGlzLmFkZCggY2VsZWJyaXR5ICk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXQoKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBkZWxldGU6IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgICAgICAgICB2YXIgY2VsZWJyaXRpZXNMaXN0ID0gdGhpcy5nZXQoKTtcclxuICAgICAgICAgICAgdmFyIGRlbGV0ZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIGlkID0gcGFyc2VJbnQoaWQpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCBjZWxlYnJpdGllc0xpc3QgKSB7XHJcbiAgICAgICAgICAgICAgICBjZWxlYnJpdGllc0xpc3QubWFwKCBmdW5jdGlvbiggY2VsZWJyaXR5LCBpbmRleCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBjZWxlYnJpdHkuaWQgPT0gaWQgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQgPSBjZWxlYnJpdGllc0xpc3Quc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoIGNlbGVicml0aWVzTGlzdCApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZGVsZXRlZDtcclxuICAgICAgICB9LFxyXG5cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gc2VydmljZTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2VsZWJyaXRpZXNTZXJ2aWNlO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2FwcC9zZXJ2aWNlcy9jZWxlYnJpdGllcy5zZXJ2aWNlLmpzXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImFuZ3VsYXIubW9kdWxlKCdob2xseXdvb2RTdGFycycpXG4gICAgLmNvbnRyb2xsZXIoJ2hvbWVDb250cm9sbGVyJywgcmVxdWlyZSgnLi9ob21lLmNvbnRyb2xsZXInKSlcbiAgICAuY29udHJvbGxlcignY2VsZWJyaXR5Q29udHJvbGxlcicsIHJlcXVpcmUoJy4vY2VsZWJyaXR5LmNvbnRyb2xsZXInKSlcbiAgICAuY29udHJvbGxlcignYWRkQ2VsZWJyaXR5Q29udHJvbGxlcicsIHJlcXVpcmUoJy4vYWRkLWNlbGVicml0eS5jb250cm9sbGVyJykpXG4gICAgLmNvbnRyb2xsZXIoJ2VkaXRDZWxlYnJpdHlDb250cm9sbGVyJywgcmVxdWlyZSgnLi9lZGl0LWNlbGVicml0eS5jb250cm9sbGVyJykpXG4gICAgLmNvbnRyb2xsZXIoJ2xpc3RDZWxlYnJpdHlDb250cm9sbGVyJywgcmVxdWlyZSgnLi9saXN0LWNlbGVicml0eS5jb250cm9sbGVyJykpXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYXBwL2NvbnRyb2xsZXJzL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmZ1bmN0aW9uIGhvbWVDb250cm9sbGVyKCAkc2NvcGUsIENlbGVicml0aWVzU2VydmljZSApIHtcclxuICAgICRzY29wZS50aXRsZSA9ICdSZWNlbnRseSBhZGRlZCBjZWxlYnJpdGllczonO1xyXG5cclxuICAgICRzY29wZS5jZWxlYnJpdHlMaXN0ID0gQ2VsZWJyaXRpZXNTZXJ2aWNlLmdldCgpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGhvbWVDb250cm9sbGVyO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2FwcC9jb250cm9sbGVycy9ob21lLmNvbnRyb2xsZXIuanNcbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZnVuY3Rpb24gY2VsZWJyaXR5Q29udHJvbGxlciggJHNjb3BlLCAkcm91dGVQYXJhbXMsIENlbGVicml0aWVzU2VydmljZSwgJHdpbmRvdyApIHtcclxuICAgIFxyXG4gICAgJHNjb3BlLmNlbGVicml0eSA9IENlbGVicml0aWVzU2VydmljZS5zZWFyY2goIHBhcnNlSW50KCAkcm91dGVQYXJhbXMuaWQgKSApO1xyXG5cclxuICAgICRzY29wZS5zaG93TWVzc2FnZSA9IGZhbHNlO1xyXG4gICAgJHNjb3BlLm1lc3NhZ2UgPSAkc2NvcGUuY2VsZWJyaXR5Lm5hbWUgKyAnIHJlbW92ZWQgc3VjY2Vzc2Z1bGx5JztcclxuXHJcbiAgICAkc2NvcGUucmVtb3ZlID0gZnVuY3Rpb24gKGlkKSB7XHJcbiAgICAgICAgQ2VsZWJyaXRpZXNTZXJ2aWNlLmRlbGV0ZShpZCk7XHJcbiAgICAgICAgJHNjb3BlLnNob3dNZXNzYWdlID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgJHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy8nO1xyXG4gICAgICAgIH0sIDMwMDApO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNlbGVicml0eUNvbnRyb2xsZXI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYXBwL2NvbnRyb2xsZXJzL2NlbGVicml0eS5jb250cm9sbGVyLmpzXG4vLyBtb2R1bGUgaWQgPSA3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImZ1bmN0aW9uIGFkZENlbGVicml0eUNvbnRyb2xsZXIoICRzY29wZSwgJHJvdXRlUGFyYW1zLCBDZWxlYnJpdGllc1NlcnZpY2UgKSB7XHJcblxyXG4gICAgJHNjb3BlLnRpdGxlID0gJ0FkZCBhIG5ldyBjZWxlYnJpdHk6JztcclxuXHJcbiAgICAkc2NvcGUuY2VsZWJyaXRpZXMgPSBDZWxlYnJpdGllc1NlcnZpY2UuZ2V0KCk7XHJcbiAgICAkc2NvcGUudXBkYXRlQ2VsZWJyaXRpZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJHNjb3BlLmNlbGVicml0aWVzID0gQ2VsZWJyaXRpZXNTZXJ2aWNlLmdldCgpO1xyXG4gICAgfVxyXG5cclxuICAgICRzY29wZS5jZWxlYnJpdHkgPSB7XHJcbiAgICAgICAgbmFtZToge1xyXG4gICAgICAgICAgICBiaXJ0aDogJycsXHJcbiAgICAgICAgICAgIGFydGlzdGljOiAnJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaW1hZ2U6ICcnLFxyXG4gICAgICAgIGJpcnRoZGF0ZTogJycsXHJcbiAgICAgICAgZ2VuZGVyOiAnJyxcclxuICAgICAgICBoZWlnaHQ6ICcnLFxyXG4gICAgICAgIG9jY3VwYXRpb246ICcnLFxyXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnJyxcclxuICAgIH1cclxuICAgIFxyXG4gICAgJHNjb3BlLmZvcm0gPSB7XHJcbiAgICAgICAgaGFzRXJyb3I6IGZhbHNlLFxyXG4gICAgICAgIGRpc2FibGVTYXZlOiB0cnVlLFxyXG5cclxuICAgICAgICB2YWxpZGF0ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkc2NvcGUuZmVlZGJhY2subWVzc2FnZXMgPSBbXTtcclxuICAgIFxyXG4gICAgICAgICAgICBpZiAoJHNjb3BlLmNlbGVicml0eS5uYW1lLmFydGlzdGljLmxlbmd0aCA8IDMpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5mZWVkYmFjay5tZXNzYWdlcy5wdXNoKCAnSW52YWxpZCBuYW1lJyApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICBcclxuICAgICAgICAgICAgaWYgKCRzY29wZS5jZWxlYnJpdHkuZGVzY3JpcHRpb24ubGVuZ3RoIDwgMykge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmZlZWRiYWNrLm1lc3NhZ2VzLnB1c2goICdJbnZhbGlkIGRlc2NyaXB0aW9uJyApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICBcclxuICAgICAgICAgICAgaWYgKCRzY29wZS5jZWxlYnJpdHkuaW1hZ2UubGVuZ3RoIDwgMykge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmZlZWRiYWNrLm1lc3NhZ2VzLnB1c2goICdJbnZhbGlkIGltYWdlIHBhdGgnICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gJHNjb3BlLmZlZWRiYWNrLm1lc3NhZ2VzO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGhhbmRsZUJsdXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgaGFuZGxlQ2hhbmdlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5mb3JtLmRpc2FibGVTYXZlID0gJHNjb3BlLmZvcm0udmFsaWRhdGUoKS5sZW5ndGggPiAwID8gdHJ1ZSA6IGZhbHNlO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGFkZDogZnVuY3Rpb24gKCRmb3JtKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoICEkZm9ybS4kaW52YWxpZCApIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS51cGRhdGVDZWxlYnJpdGllcygpO1xyXG4gICAgXHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2VsZWJyaXR5LmlkICAgICAgPSAkc2NvcGUuY2VsZWJyaXRpZXMgPyAkc2NvcGUuY2VsZWJyaXRpZXMubGVuZ3RoICsgMSA6IDE7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2VsZWJyaXR5LnVybE5hbWUgPSBDZWxlYnJpdGllc1NlcnZpY2UudG9VcmwoICRzY29wZS5jZWxlYnJpdHkubmFtZS5hcnRpc3RpYyApO1xyXG4gICAgXHJcbiAgICAgICAgICAgICAgICBDZWxlYnJpdGllc1NlcnZpY2UuYWRkKCAkc2NvcGUuY2VsZWJyaXR5ICk7XHJcblxyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmZvcm0ucmVzZXQoKTtcclxuICAgICAgICAgICAgICAgICRzY29wZS5mb3JtLmhhc0Vycm9yID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuZmVlZGJhY2subWVzc2FnZXNDbGFzcygpO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmZlZWRiYWNrLm1lc3NhZ2VzLnB1c2goICRzY29wZS5jZWxlYnJpdHkubmFtZS5hcnRpc3RpYyArICcgYWRkZWQgc3VjY2Vzc2Z1bGx5IScgKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5mb3JtLmhhc0Vycm9yID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuZmVlZGJhY2subWVzc2FnZXNDbGFzcygpO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmZlZWRiYWNrLm1lc3NhZ2VzID0gW107XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuZmVlZGJhY2subWVzc2FnZXMucHVzaCggJ0NvbXBsZXRlIHRoZSBmb3JtIHRvIGFkZCBhIG5ldyBjZWxlYnJpdHknICk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygkZm9ybS5hcnRpc3RpY05hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgcmVzZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHNjb3BlLmNlbGVicml0eSA9IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IHtcclxuICAgICAgICAgICAgICAgICAgICBiaXJ0aDogJycsXHJcbiAgICAgICAgICAgICAgICAgICAgYXJ0aXN0aWM6ICcnXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgaW1hZ2U6ICcnLFxyXG4gICAgICAgICAgICAgICAgYmlydGhkYXRlOiAnJyxcclxuICAgICAgICAgICAgICAgIGdlbmRlcjogJycsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcnLFxyXG4gICAgICAgICAgICAgICAgb2NjdXBhdGlvbjogJycsXHJcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJycsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgJHNjb3BlLmZlZWRiYWNrID0ge1xyXG4gICAgICAgIG1lc3NhZ2VzOiBbXSxcclxuICAgICAgICBtZXNzYWdlc01vZGlmaWVyOiAnJyxcclxuICAgICAgICBtZXNzYWdlc0NsYXNzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5mZWVkYmFjay5tZXNzYWdlc01vZGlmaWVyID0gICRzY29wZS5mb3JtLmhhc0Vycm9yID8gJ2RhbmdlcicgOiAnc3VjY2Vzcyc7XHJcbiAgICAgICAgfSxcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYWRkQ2VsZWJyaXR5Q29udHJvbGxlcjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9hcHAvY29udHJvbGxlcnMvYWRkLWNlbGVicml0eS5jb250cm9sbGVyLmpzXG4vLyBtb2R1bGUgaWQgPSA4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImZ1bmN0aW9uIGVkaXRDZWxlYnJpdHlDb250cm9sbGVyKCAkc2NvcGUsICR3aW5kb3csICRyb3V0ZVBhcmFtcywgQ2VsZWJyaXRpZXNTZXJ2aWNlICkge1xyXG5cclxuICAgICRzY29wZS50aXRsZSA9ICdFZGl0IENlbGVicml0eSdcclxuICAgICRzY29wZS5jZWxlYnJpdHkgPSBDZWxlYnJpdGllc1NlcnZpY2Uuc2VhcmNoKCAkcm91dGVQYXJhbXMuaWQgKTtcclxuXHJcblxyXG4gICAgJHNjb3BlLmZvcm0gPSB7XHJcbiAgICAgICAgaGFzRXJyb3I6IGZhbHNlLFxyXG4gICAgICAgIGRpc2FibGVTYXZlOiB0cnVlLFxyXG5cclxuICAgICAgICB2YWxpZGF0ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkc2NvcGUuZmVlZGJhY2subWVzc2FnZXMgPSBbXTtcclxuICAgIFxyXG4gICAgICAgICAgICBpZiAoJHNjb3BlLmNlbGVicml0eS5uYW1lLmxlbmd0aCA8IDMpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5mZWVkYmFjay5tZXNzYWdlcy5wdXNoKCAnSW52YWxpZCBuYW1lJyApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICBcclxuICAgICAgICAgICAgaWYgKCRzY29wZS5jZWxlYnJpdHkuZGVzY3JpcHRpb24ubGVuZ3RoIDwgMykge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmZlZWRiYWNrLm1lc3NhZ2VzLnB1c2goICdJbnZhbGlkIGRlc2NyaXB0aW9uJyApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICBcclxuICAgICAgICAgICAgaWYgKCRzY29wZS5jZWxlYnJpdHkuaW1hZ2UubGVuZ3RoIDwgMykge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmZlZWRiYWNrLm1lc3NhZ2VzLnB1c2goICdJbnZhbGlkIGltYWdlIHBhdGgnICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gJHNjb3BlLmZlZWRiYWNrLm1lc3NhZ2VzO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGhhbmRsZUNoYW5nZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkc2NvcGUuZm9ybS5kaXNhYmxlU2F2ZSA9ICRzY29wZS5mb3JtLnZhbGlkYXRlKCkubGVuZ3RoID4gMCA/IHRydWUgOiBmYWxzZTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBuZXdDZWxlYnJpdHkgPSAkc2NvcGUuY2VsZWJyaXR5O1xyXG4gICAgXHJcbiAgICAgICAgICAgIHZhciBtZXNzYWdlcyA9ICRzY29wZS5mb3JtLnZhbGlkYXRlKCk7XHJcbiAgICBcclxuICAgICAgICAgICAgaWYgKCBtZXNzYWdlcy5sZW5ndGggPT0gMCApIHtcclxuICAgIFxyXG4gICAgICAgICAgICAgICAgQ2VsZWJyaXRpZXNTZXJ2aWNlLmVkaXQoIG5ld0NlbGVicml0eSApO1xyXG4gICAgXHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuZm9ybS5oYXNFcnJvciA9IGZhbHNlO1xyXG4gICAgXHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuZmVlZGJhY2subWVzc2FnZXNDbGFzcygpO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmZlZWRiYWNrLm1lc3NhZ2VzID0gW107XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuZmVlZGJhY2subWVzc2FnZXMucHVzaCggJHNjb3BlLmNlbGVicml0eS5uYW1lLmFydGlzdGljICsgJyB1cGRhdGVkIHN1Y2Nlc3NmdWxseSEnICk7XHJcbiAgICBcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgIFxyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmZvcm0uaGFzRXJyb3IgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmZlZWRiYWNrLm1lc3NhZ2VzQ2xhc3MoKTtcclxuICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuZmVlZGJhY2sgPSB7XHJcbiAgICAgICAgbWVzc2FnZXM6IFtdLFxyXG4gICAgICAgIG1lc3NhZ2VzTW9kaWZpZXI6ICcnLFxyXG4gICAgICAgIG1lc3NhZ2VzQ2xhc3M6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHNjb3BlLmZlZWRiYWNrLm1lc3NhZ2VzTW9kaWZpZXIgPSAgJHNjb3BlLmZvcm0uaGFzRXJyb3IgPyAnZXJyb3InIDogJ3N1Y2Nlc3MnO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZWRpdENlbGVicml0eUNvbnRyb2xsZXI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYXBwL2NvbnRyb2xsZXJzL2VkaXQtY2VsZWJyaXR5LmNvbnRyb2xsZXIuanNcbi8vIG1vZHVsZSBpZCA9IDlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZnVuY3Rpb24gbGlzdENlbGVicml0eUNvbnRyb2xsZXIoICRzY29wZSwgQ2VsZWJyaXRpZXNTZXJ2aWNlICkge1xyXG5cclxuICAgICRzY29wZS5jZWxlYnJpdHlMaXN0ID0gQ2VsZWJyaXRpZXNTZXJ2aWNlLmdldCgpO1xyXG5cclxuICAgICRzY29wZS5zZWxlY3RPcHRpb25zID0gW1xyXG4gICAgICAgIHsgbmFtZTogJ05hbWUnLCB2YWx1ZTogJ25hbWUnIH0sXHJcbiAgICAgICAgeyBuYW1lOiAnQWdlJywgdmFsdWU6ICdhZ2UnIH1cclxuICAgIF1cclxuXHJcbiAgICAkc2NvcGUucmVtb3ZlID0gZnVuY3Rpb24oaWQpIHtcclxuICAgICAgICBDZWxlYnJpdGllc1NlcnZpY2UuZGVsZXRlKGlkKTtcclxuICAgICAgICAkc2NvcGUuY2VsZWJyaXR5TGlzdCA9IENlbGVicml0aWVzU2VydmljZS5nZXQoKTtcclxuICAgIH1cclxuXHJcbiAgICAkc2NvcGUudGl0bGUgPSAnQWxsIGNlbGVicml0aWVzJ1xyXG5cclxuICAgIHZhciByZWcgPSAvXlxcZHs0LDV9LVxcZHs0fSQvO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGxpc3RDZWxlYnJpdHlDb250cm9sbGVyO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2FwcC9jb250cm9sbGVycy9saXN0LWNlbGVicml0eS5jb250cm9sbGVyLmpzXG4vLyBtb2R1bGUgaWQgPSAxMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJhbmd1bGFyLm1vZHVsZSgnaG9sbHl3b29kU3RhcnMnKVxuICAgIC5kaXJlY3RpdmUoJ2NhcGl0YWxpemUnLCByZXF1aXJlKCcuL2NhcGl0YWxpemUuZGlyZWN0aXZlJykpXG4gICAgLmRpcmVjdGl2ZSgnZGF0ZScsIHJlcXVpcmUoJy4vZGF0ZS5kaXJlY3RpdmUnKSlcbiAgICAuZGlyZWN0aXZlKCdoZWlnaHQnLCByZXF1aXJlKCcuL2hlaWdodC5kaXJlY3RpdmUnKSlcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9hcHAvZGlyZWN0aXZlcy9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gMTFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZnVuY3Rpb24gY2FwaXRhbGl6ZURpcmVjdGl2ZSAoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHJlcXVpcmU6ICduZ01vZGVsJyxcclxuICAgICAgICByZXN0cmljdDogJ0EnLFxyXG4gICAgICAgIGxpbms6IGxpbmtcclxuICAgIH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjdHJsKSB7XHJcbiAgICBcclxuICAgIHZhciBfY2FwaXRhbGl6ZSA9IGZ1bmN0aW9uICh0ZXh0KSB7XHJcbiAgICAgICAgdmFyIHdvcmRzQXJyYXkgPSB0ZXh0LnNwbGl0KCcgJyk7XHJcblxyXG4gICAgICAgIHZhciBjYXBpdGFsaXplZFdvcmRzID0gd29yZHNBcnJheS5tYXAoZnVuY3Rpb24gKHdvcmQpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICgvKGRhfGRlKS8udGVzdCh3b3JkKSkgcmV0dXJuIHdvcmQ7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gd29yZC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHdvcmQuc3Vic3RyaW5nKDEpLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIGNhcGl0YWxpemVkV29yZHMuam9pbignICcpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBlbGVtZW50LmJpbmQoXCJibHVyXCIsIGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgdmFyIGNoZWNrTWluTGVuZ3RoID0gKGN0cmwuJHZpZXdWYWx1ZS5sZW5ndGggPj0gYXR0cnMubmdNaW5sZW5ndGgpID8gdHJ1ZSA6IGZhbHNlO1xyXG4gICAgICAgIHZhciBjaGVja01heExlbmd0aCA9IChjdHJsLiR2aWV3VmFsdWUubGVuZ3RoIDw9IGF0dHJzLm5nTWF4bGVuZ3RoKSA/IHRydWUgOiBmYWxzZTtcclxuXHJcbiAgICAgICAgaWYgKCBjaGVja01pbkxlbmd0aCAmJiBjaGVja01heExlbmd0aCApIHtcclxuICAgICAgICAgICAgY3RybC4kc2V0Vmlld1ZhbHVlKF9jYXBpdGFsaXplKGN0cmwuJHZpZXdWYWx1ZSkpO1xyXG4gICAgICAgICAgICBjdHJsLiRyZW5kZXIoKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjYXBpdGFsaXplRGlyZWN0aXZlO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2FwcC9kaXJlY3RpdmVzL2NhcGl0YWxpemUuZGlyZWN0aXZlLmpzXG4vLyBtb2R1bGUgaWQgPSAxMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJmdW5jdGlvbiBkYXRlRGlyZWN0aXZlICgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcmVxdWlyZTogJ25nTW9kZWwnLFxyXG4gICAgICAgIHJlc3RyaWN0OiAnQScsXHJcbiAgICAgICAgbGluazogbGlua1xyXG4gICAgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMsIGN0cmwpIHtcclxuXHJcbiAgICB2YXIgX2Zvcm1hdERhdGUgPSBmdW5jdGlvbiAoaW5wdXQpIHtcclxuXHJcbiAgICAgICAgLy8gcmVwbGFjZSBldmVyeXRoaW5nIHRoYXQncyBub3QgYSBudW0gZm9yIFwiXCJcclxuICAgICAgICBpbnB1dCA9IGlucHV0LnJlcGxhY2UoL1teMC05XSsvZywgXCJcIik7XHJcblxyXG4gICAgICAgIGlmKGlucHV0Lmxlbmd0aCA+IDIpIHtcclxuICAgICAgICAgICAgaW5wdXQgPSBpbnB1dC5zdWJzdHJpbmcoMCwyKSArIFwiL1wiICsgaW5wdXQuc3Vic3RyaW5nKDIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoaW5wdXQubGVuZ3RoID4gNSkge1xyXG4gICAgICAgICAgICBpbnB1dCA9IGlucHV0LnN1YnN0cmluZygwLDUpICsgXCIvXCIgKyBpbnB1dC5zdWJzdHJpbmcoNSw5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBpbnB1dDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZWxlbWVudC5iaW5kKFwia2V5dXBcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGN0cmwuJHNldFZpZXdWYWx1ZShfZm9ybWF0RGF0ZShjdHJsLiR2aWV3VmFsdWUpKTtcclxuICAgICAgICBjdHJsLiRyZW5kZXIoKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGRhdGVEaXJlY3RpdmU7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYXBwL2RpcmVjdGl2ZXMvZGF0ZS5kaXJlY3RpdmUuanNcbi8vIG1vZHVsZSBpZCA9IDEzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImZ1bmN0aW9uIGhlaWdodERpcmVjdGl2ZSAoKSB7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByZXF1aXJlOiAnbmdNb2RlbCcsXHJcbiAgICAgICAgcmVzdHJpY3Q6ICdBJyxcclxuICAgICAgICBsaW5rOiBsaW5rXHJcbiAgICB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY3RybCkge1xyXG4gICAgXHJcbiAgICB2YXIgX2Zvcm1hdEhlaWdodCA9IGZ1bmN0aW9uIChoZWlnaHQpIHtcclxuXHJcbiAgICAgICAgLy8gUmVtb3ZlcyBldmVyeXRoaW5nIHRoYXQncyBub3QgYSBudW1iZXIgb3IgYSBjb21tYVxyXG4gICAgICAgIGhlaWdodCA9IGhlaWdodC5yZXBsYWNlKC9bXjAtOV0rL2csIFwiXCIpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICggaGVpZ2h0Lmxlbmd0aCA+IDEgKSB7XHJcbiAgICAgICAgICAgIGhlaWdodCA9IGhlaWdodC5zdWJzdHJpbmcoMCwgMSkgKyAnLCcgKyBoZWlnaHQuc3Vic3RyaW5nKDEsMyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gaGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIGVsZW1lbnQuYmluZChcImtleXVwXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhfZm9ybWF0SGVpZ2h0KGN0cmwuJHZpZXdWYWx1ZSkpO1xyXG4gICAgICAgIGN0cmwuJHNldFZpZXdWYWx1ZShfZm9ybWF0SGVpZ2h0KGN0cmwuJHZpZXdWYWx1ZSkpO1xyXG4gICAgICAgIGN0cmwuJHJlbmRlcigpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gaGVpZ2h0RGlyZWN0aXZlO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2FwcC9kaXJlY3RpdmVzL2hlaWdodC5kaXJlY3RpdmUuanNcbi8vIG1vZHVsZSBpZCA9IDE0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImFuZ3VsYXIubW9kdWxlKCdob2xseXdvb2RTdGFycycpXHJcbiAgICAuY29tcG9uZW50KCdhcHBIZWFkZXInLCByZXF1aXJlKCcuL2FwcC1oZWFkZXIuY29tcG9uZW50JykpXHJcbiAgICAuY29tcG9uZW50KCdhcHBOYXYnLCByZXF1aXJlKCcuL2FwcC1uYXYuY29tcG9uZW50JykpXHJcbiAgICAuY29tcG9uZW50KCdjYXJkQ2VsZWJyaXR5JywgcmVxdWlyZSgnLi9jZWxlYnJpdHktY2FyZC5jb21wb25lbnQnKSlcclxuICAgIC5jb21wb25lbnQoJ2ZlZWRiYWNrTWVzc2FnZXMnLCByZXF1aXJlKCcuL2ZlZWRiYWNrLW1lc3NhZ2VzLmNvbXBvbmVudCcpKVxyXG4gICAgXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYXBwL2NvbXBvbmVudHMvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDE1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImZ1bmN0aW9uIGFwcEhlYWRlckNvbnRyb2xsZXIgKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycykge1xyXG4gICAgXHJcbn1cclxuXHJcbnZhciBhcHBIZWFkZXJDb21wb25lbnQgPSB7XHJcbiAgICB0ZW1wbGF0ZVVybDogJy9hc3NldHMvdmlld3MvcGFydGlhbHMvYXBwLWhlYWRlci50ZW1wbGF0ZS5odG1sJyxcclxuICAgIGNvbnRyb2xsZXI6IGFwcEhlYWRlckNvbnRyb2xsZXIsXHJcbiAgICBiaW5kaW5nczoge1xyXG4gICAgICAgIHRpdGxlOiAnQCcsXHJcbiAgICAgICAgZGVzY3JpcHRpb246ICdAJ1xyXG4gICAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhcHBIZWFkZXJDb21wb25lbnQ7XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2FwcC9jb21wb25lbnRzL2FwcC1oZWFkZXIuY29tcG9uZW50LmpzXG4vLyBtb2R1bGUgaWQgPSAxNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJmdW5jdGlvbiBhcHBOYXZDb250cm9sbGVyICgkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMpIHtcclxuICAgICRzY29wZS5uYXZMaW5rcyA9IHtcclxuICAgICAgICBob21lOiB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdIb21lJyxcclxuICAgICAgICAgICAgbGluazogJy8nXHJcbiAgICAgICAgfSxcclxuICAgICAgICBjZWxlYnJpdGllczoge1xyXG4gICAgICAgICAgICBuYW1lOiAnQ2VsZWJyaXRpZXMnLFxyXG4gICAgICAgICAgICBsaW5rOiAnY2VsZWJyaXRpZXMnXHJcbiAgICAgICAgfSxcclxuICAgICAgICBhZGQ6IHtcclxuICAgICAgICAgICAgbmFtZTogJ0FkZCcsXHJcbiAgICAgICAgICAgIGxpbms6ICdjZWxlYnJpdHkvYWRkJ1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxudmFyIGFwcE5hdkNvbXBvbmVudCA9IHtcclxuICAgIHRlbXBsYXRlVXJsOiAnL2Fzc2V0cy92aWV3cy9wYXJ0aWFscy9hcHAtbmF2LnRlbXBsYXRlLmh0bWwnLFxyXG4gICAgY29udHJvbGxlcjogYXBwTmF2Q29udHJvbGxlclxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhcHBOYXZDb21wb25lbnQ7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYXBwL2NvbXBvbmVudHMvYXBwLW5hdi5jb21wb25lbnQuanNcbi8vIG1vZHVsZSBpZCA9IDE3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImZ1bmN0aW9uIGNlbGVicml0eUNhcmRDb250cm9sbGVyICgkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMpIHtcclxuICAgICRzY29wZS5yZW1vdmUgPSAkc2NvcGUuJHBhcmVudC5yZW1vdmU7XHJcbiAgICBcclxuICAgIHRoaXMuJG9uSW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmZhbGxiYWNrQ29udGVudCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZmFsbGJhY2tDb250ZW50ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJHNjb3BlLm5hbWUgICAgICAgID0gdGhpcy5jZWxlYnJpdHkubmFtZS5hcnRpc3RpYyA/IHRoaXMuY2VsZWJyaXR5Lm5hbWUuYXJ0aXN0aWMgOiAnTm8gbmFtZSBwcm92aWRlZCc7XHJcbiAgICAgICAgJHNjb3BlLmltYWdlICAgICAgID0gdGhpcy5jZWxlYnJpdHkuaW1hZ2UgPyB0aGlzLmNlbGVicml0eS5pbWFnZSA6ICdodHRwOi8vdmlhLnBsYWNlaG9sZGVyLmNvbS80NTB4MzAwJztcclxuICAgICAgICAkc2NvcGUuZGVzY3JpcHRpb24gPSB0aGlzLmNlbGVicml0eS5kZXNjcmlwdGlvbiA/IHRoaXMuY2VsZWJyaXR5LmRlc2NyaXB0aW9uIDogJ1lvdSBzaG91bGQgaW5mb3JtIGEgc2hvcnQgZGVzY3JpcHRpb24gZm9yIHRoaXMgY2VsZWJyaXR5JztcclxuICAgIH1cclxufVxyXG5cclxudmFyIGNlbGVicml0eUNhcmRDb21wb25lbnQgPSB7XHJcbiAgICB0ZW1wbGF0ZVVybDogJy9hc3NldHMvdmlld3MvY29tcG9uZW50cy9jZWxlYnJpdHktY2FyZC50ZW1wbGF0ZS5odG1sJyxcclxuICAgIGNvbnRyb2xsZXI6IGNlbGVicml0eUNhcmRDb250cm9sbGVyLFxyXG4gICAgYmluZGluZ3M6IHtcclxuICAgICAgICBjZWxlYnJpdHk6ICc8J1xyXG4gICAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjZWxlYnJpdHlDYXJkQ29tcG9uZW50O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2FwcC9jb21wb25lbnRzL2NlbGVicml0eS1jYXJkLmNvbXBvbmVudC5qc1xuLy8gbW9kdWxlIGlkID0gMThcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZnVuY3Rpb24gZmVlZGJhY2tNZXNzYWdlc0NvbnRyb2xsZXIgKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycykge1xyXG4gICAgLy8gdGhpcy4kb25Jbml0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAvLyAgICAgY29uc29sZS5sb2codGhpcylcclxuICAgIC8vIH1cclxufVxyXG5cclxudmFyIGZlZWRiYWNrTWVzc2FnZXNDb21wb25lbnQgPSB7XHJcbiAgICB0ZW1wbGF0ZVVybDogJy9hc3NldHMvdmlld3MvY29tcG9uZW50cy9mZWVkYmFjay1tZXNzYWdlcy50ZW1wbGF0ZS5odG1sJyxcclxuICAgIGNvbnRyb2xsZXI6IGZlZWRiYWNrTWVzc2FnZXNDb250cm9sbGVyLFxyXG4gICAgYmluZGluZ3M6IHtcclxuICAgICAgICBtb2RpZmllcjogJzwnLFxyXG4gICAgICAgIG1lc3NhZ2VzOiAnPCdcclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZmVlZGJhY2tNZXNzYWdlc0NvbXBvbmVudDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9hcHAvY29tcG9uZW50cy9mZWVkYmFjay1tZXNzYWdlcy5jb21wb25lbnQuanNcbi8vIG1vZHVsZSBpZCA9IDE5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcIi4uL2Nzcy9tYWluLmNzc1wiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2FwcC9zdHlsZXMvbWFpbi5sZXNzXG4vLyBtb2R1bGUgaWQgPSAyMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9