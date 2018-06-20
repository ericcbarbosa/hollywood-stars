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
            name: {
                birth: 'Marina Souza Ruy Barbosa Negrão',
                artistic: 'Marina Ruy Barbosa',
            },
            urlName: 'marina-ruy-barbosa',
            description: 'Marina Souza Ruy Barbosa Negrão é uma atriz brasileira. Começou a atuar ainda criança, e fez seu primeiro trabalho de destaque no papel de Aninha na telenovela Começar de Novo.',
            image: 'https://www.ibahia.com/fileadmin/user_upload/ibahia/2017/julho/13/marina1111.jpg',
            birthdate: '28/01/1983',
            gender: 'Female',
            height: '1.58',
            occupation: 'Singer',
        }, {
            id: 2,
            name: {
                birth: 'Bruno Gagliasso Marques',
                artistic: 'Bruno Gagliasso',
            },
            urlName: 'bruno-gagliasso',
            description: 'Começou a carreira ainda criança, em 1990, fazendo figuração em novelas da Rede Globo. Em 1999 participou do episódio "Papai é Gay!", do programa Você Decide.',
            image: 'https://www.otvfoco.com.br/wp-content/uploads/2017/08/3530300927-bruno-gagliasso-e1503421087829.jpg',
            birthdate: '13/04/1982',
            gender: 'Male',
            height: '1.70',
            occupation: 'Actor',
        }, {
            id: 3,
            name: {
                birth: 'Paula Fernandes',
                artistic: 'Paula Fernandes',
            },
            urlName: 'paula-fernandes',
            description: 'cantora e compositora brasileira. Cantora desde a infância, Fernandes começou a cantar profissionalmente aos oito anos de idade',
            image: 'http://www.assisnews.com.br/wp-content/uploads/2017/12/paula_fernandes-1.jpg',
            birthdate: '28/08/1984',
            gender: 'Female',
            height: '1.65',
            occupation: 'Singer',
        }, {
            id: 4,
            name: {
                birth: 'Fausto Corrêa da Silva',
                artistic: 'Faustão',
            },
            urlName: 'fausto-silva',
            description: 'Fausto Corrêa da Silva, mais conhecido como Faustão, é um apresentador brasileiro que atualmente apresenta o programa de auditório Domingão do Faustão, da Rede Globo.',
            image: 'http://imagens.us/subcelebridades/fausto-silva/fausto-silva%20(4).jpg',
            birthdate: '03/05/1950',
            gender: 'Male',
            height: '1.88',
            occupation: 'Presenter',
        }, {
            id: 5,
            name: {
                birth: 'Paolla Oliveira',
                artistic: 'Paolla Oliveira',
            },
            urlName: 'paola-oliveira',
            description: 'Paolla Oliveira é descendente de espanhóis, italianos e portugueses. Ela é filha de um policial militar aposentado e de uma ex-auxiliar de enfermagem',
            image: 'https://patricinhaesperta.com.br/wp-content/uploads/2013/05/paola-oliveira.jpg',
            birthdate: '28/01/1983',
            gender: 'Female',
            height: '1.58',
            occupation: 'Singer',
        }, {
            id: 6,
            name: {
                birth: 'Sandy Lima',
                artistic: 'Sandy Lima',
            },
            urlName: 'sandy-lima',
            description: 'cantora, compositora e atriz brasileira. Cantora desde a infância, Sandy começou sua carreira em 1990, quando formou com o irmão, o músico Junior Lima, a dupla vocal Sandy & Junior.',
            image: 'http://images.virgula.com.br/2015/02/sandy.jpg',
            birthdate: '28/01/1983',
            gender: 'Female',
            height: '1.58',
            occupation: 'Singer',
        },
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
            console.log('celebrities: ', celebrities);
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
            var celebritiesList = this.getCelebrities();
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

    $scope.celebrityList = CelebritiesService.getCelebrities();
}

module.exports = homeController;

/***/ }),
/* 7 */
/***/ (function(module, exports) {

function celebrityController( $scope, $routeParams, CelebritiesService, $window ) {

    console.log('parseInt( $routeParams.id ): ', CelebritiesService.search( parseInt( $routeParams.id )) );
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

    $scope.celebrities = CelebritiesService.getCelebrities();
    $scope.updateCelebrities = function () {
        $scope.celebrities = CelebritiesService.getCelebrities();
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

    $scope.celebrityList = CelebritiesService.getCelebrities();

    $scope.selectOptions = [
        { name: 'Name', value: 'name' },
        { name: 'Age', value: 'age' }
    ]

    $scope.remove = function(id) {
        CelebritiesService.delete(id);
        $scope.celebrityList = CelebritiesService.getCelebrities();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvYXBwL2FwcC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwL2FwcC5jb25maWcuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC9zZXJ2aWNlcy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwL3NlcnZpY2VzL2NlbGVicml0aWVzLnNlcnZpY2UuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC9jb250cm9sbGVycy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwL2NvbnRyb2xsZXJzL2hvbWUuY29udHJvbGxlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwL2NvbnRyb2xsZXJzL2NlbGVicml0eS5jb250cm9sbGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9hcHAvY29udHJvbGxlcnMvYWRkLWNlbGVicml0eS5jb250cm9sbGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9hcHAvY29udHJvbGxlcnMvZWRpdC1jZWxlYnJpdHkuY29udHJvbGxlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwL2NvbnRyb2xsZXJzL2xpc3QtY2VsZWJyaXR5LmNvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC9kaXJlY3RpdmVzL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9hcHAvZGlyZWN0aXZlcy9jYXBpdGFsaXplLmRpcmVjdGl2ZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwL2RpcmVjdGl2ZXMvZGF0ZS5kaXJlY3RpdmUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC9kaXJlY3RpdmVzL2hlaWdodC5kaXJlY3RpdmUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC9jb21wb25lbnRzL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9hcHAvY29tcG9uZW50cy9hcHAtaGVhZGVyLmNvbXBvbmVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwL2NvbXBvbmVudHMvYXBwLW5hdi5jb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC9jb21wb25lbnRzL2NlbGVicml0eS1jYXJkLmNvbXBvbmVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwL2NvbXBvbmVudHMvZmVlZGJhY2stbWVzc2FnZXMuY29tcG9uZW50LmpzIiwid2VicGFjazovLy8uL3NyYy9hcHAvc3R5bGVzL21haW4ubGVzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCOzs7Ozs7QUNUQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjs7QUFFakI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNOzs7Ozs7QUNsQ0E7QUFDQSwyRDs7Ozs7OztBQ0RBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWE7O0FBRWI7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxpQkFBaUI7QUFDakI7O0FBRUE7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLGlCQUFpQjs7QUFFakI7QUFDQTs7QUFFQTtBQUNBLFNBQVM7O0FBRVQ7O0FBRUE7QUFDQTs7QUFFQSxvQzs7Ozs7O0FDNUxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtRTs7Ozs7OztBQ0xBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxnQzs7Ozs7O0FDUkE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUEscUM7Ozs7OztBQ2xCQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFNBQVM7O0FBRVQ7O0FBRUEsU0FBUzs7QUFFVDtBQUNBO0FBQ0EsU0FBUzs7QUFFVDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYTtBQUNiOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7O0FBRUEsd0M7Ozs7OztBQ3ZHQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBLGFBQWE7O0FBRWI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx5Qzs7Ozs7O0FDbEVBOztBQUVBOztBQUVBO0FBQ0EsU0FBUyw4QkFBOEI7QUFDdkMsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLG1CQUFtQixJQUFJLElBQUksRUFBRTtBQUM3Qjs7QUFFQSx5Qzs7Ozs7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBLGlEOzs7Ozs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUEscUM7Ozs7OztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUEsK0I7Ozs7OztBQ2hDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQSxpQzs7Ozs7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNKQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlDOzs7Ozs7QUN0QkE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHdDOzs7Ozs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDJDOzs7Ozs7QUNmQSwyRCIsImZpbGUiOiJhcHAuYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ2hvbGx5d29vZFN0YXJzJywgW1xuICAgICduZ1JvdXRlJyxcbiAgICAnbmdNZXNzYWdlcydcbl0pO1xuXG5yZXF1aXJlKCcuL2FwcC5jb25maWcnKTtcbnJlcXVpcmUoJy4vc2VydmljZXMnKVxucmVxdWlyZSgnLi9jb250cm9sbGVycycpO1xucmVxdWlyZSgnLi9kaXJlY3RpdmVzJyk7XG5yZXF1aXJlKCcuL2NvbXBvbmVudHMnKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9hcHAvYXBwLmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImFuZ3VsYXIubW9kdWxlKCdob2xseXdvb2RTdGFycycpXHJcbiAgICAuY29uZmlnKFxyXG4gICAgICAgIGZ1bmN0aW9uKCAkcm91dGVQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIgKSB7XHJcblxyXG4gICAgICAgICAgICAkcm91dGVQcm92aWRlclxyXG4gICAgICAgICAgICAgICAgLndoZW4oJy8nLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvYXNzZXRzL3ZpZXdzL3BhZ2VzL2hvbWUudGVtcGxhdGUuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2hvbWVDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC53aGVuKCcvY2VsZWJyaXRpZXMnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvYXNzZXRzL3ZpZXdzL3BhZ2VzL2xpc3QtY2VsZWJyaXR5LnRlbXBsYXRlLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdsaXN0Q2VsZWJyaXR5Q29udHJvbGxlcidcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAud2hlbignL2NlbGVicml0eS9hZGQnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvYXNzZXRzL3ZpZXdzL3BhZ2VzL2FkZC1jZWxlYnJpdHkudGVtcGxhdGUuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2FkZENlbGVicml0eUNvbnRyb2xsZXInXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLndoZW4oJy9jZWxlYnJpdHkvOm5hbWUvOmlkJywge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL2Fzc2V0cy92aWV3cy9wYWdlcy9jZWxlYnJpdHkudGVtcGxhdGUuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2NlbGVicml0eUNvbnRyb2xsZXInXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLndoZW4oJy9jZWxlYnJpdHkvOm5hbWUvOmlkL2VkaXQnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvYXNzZXRzL3ZpZXdzL3BhZ2VzL2VkaXQtY2VsZWJyaXR5LnRlbXBsYXRlLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdlZGl0Q2VsZWJyaXR5Q29udHJvbGxlcidcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAub3RoZXJ3aXNlKHtcclxuICAgICAgICAgICAgICAgICAgICByZWRpcmVjdFRvOiAnLycsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2hvbWVDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyBSZW1vdmUgbyAvIyEvIGRhIFVSTFxyXG4gICAgICAgICAgICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUodHJ1ZSk7XHJcbiAgICAgICAgICAgICRsb2NhdGlvblByb3ZpZGVyLmhhc2hQcmVmaXgoJycpO1xyXG4gICAgICAgIH1cclxuICAgICk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYXBwL2FwcC5jb25maWcuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiYW5ndWxhci5tb2R1bGUoJ2hvbGx5d29vZFN0YXJzJylcbiAgICAuc2VydmljZSgnQ2VsZWJyaXRpZXNTZXJ2aWNlJywgcmVxdWlyZSgnLi9jZWxlYnJpdGllcy5zZXJ2aWNlJykpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2FwcC9zZXJ2aWNlcy9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XHJcblxyXG5mdW5jdGlvbiBDZWxlYnJpdGllc1NlcnZpY2UoKSB7XHJcblxyXG4gICAgdmFyIGNlbGVicml0aWVzID0gW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWQ6IDEsXHJcbiAgICAgICAgICAgIG5hbWU6IHtcclxuICAgICAgICAgICAgICAgIGJpcnRoOiAnTWFyaW5hIFNvdXphIFJ1eSBCYXJib3NhIE5lZ3LDo28nLFxyXG4gICAgICAgICAgICAgICAgYXJ0aXN0aWM6ICdNYXJpbmEgUnV5IEJhcmJvc2EnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB1cmxOYW1lOiAnbWFyaW5hLXJ1eS1iYXJib3NhJyxcclxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdNYXJpbmEgU291emEgUnV5IEJhcmJvc2EgTmVncsOjbyDDqSB1bWEgYXRyaXogYnJhc2lsZWlyYS4gQ29tZcOnb3UgYSBhdHVhciBhaW5kYSBjcmlhbsOnYSwgZSBmZXogc2V1IHByaW1laXJvIHRyYWJhbGhvIGRlIGRlc3RhcXVlIG5vIHBhcGVsIGRlIEFuaW5oYSBuYSB0ZWxlbm92ZWxhIENvbWXDp2FyIGRlIE5vdm8uJyxcclxuICAgICAgICAgICAgaW1hZ2U6ICdodHRwczovL3d3dy5pYmFoaWEuY29tL2ZpbGVhZG1pbi91c2VyX3VwbG9hZC9pYmFoaWEvMjAxNy9qdWxoby8xMy9tYXJpbmExMTExLmpwZycsXHJcbiAgICAgICAgICAgIGJpcnRoZGF0ZTogJzI4LzAxLzE5ODMnLFxyXG4gICAgICAgICAgICBnZW5kZXI6ICdGZW1hbGUnLFxyXG4gICAgICAgICAgICBoZWlnaHQ6ICcxLjU4JyxcclxuICAgICAgICAgICAgb2NjdXBhdGlvbjogJ1NpbmdlcicsXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICBpZDogMixcclxuICAgICAgICAgICAgbmFtZToge1xyXG4gICAgICAgICAgICAgICAgYmlydGg6ICdCcnVubyBHYWdsaWFzc28gTWFycXVlcycsXHJcbiAgICAgICAgICAgICAgICBhcnRpc3RpYzogJ0JydW5vIEdhZ2xpYXNzbycsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHVybE5hbWU6ICdicnVuby1nYWdsaWFzc28nLFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0NvbWXDp291IGEgY2FycmVpcmEgYWluZGEgY3JpYW7Dp2EsIGVtIDE5OTAsIGZhemVuZG8gZmlndXJhw6fDo28gZW0gbm92ZWxhcyBkYSBSZWRlIEdsb2JvLiBFbSAxOTk5IHBhcnRpY2lwb3UgZG8gZXBpc8OzZGlvIFwiUGFwYWkgw6kgR2F5IVwiLCBkbyBwcm9ncmFtYSBWb2PDqiBEZWNpZGUuJyxcclxuICAgICAgICAgICAgaW1hZ2U6ICdodHRwczovL3d3dy5vdHZmb2NvLmNvbS5ici93cC1jb250ZW50L3VwbG9hZHMvMjAxNy8wOC8zNTMwMzAwOTI3LWJydW5vLWdhZ2xpYXNzby1lMTUwMzQyMTA4NzgyOS5qcGcnLFxyXG4gICAgICAgICAgICBiaXJ0aGRhdGU6ICcxMy8wNC8xOTgyJyxcclxuICAgICAgICAgICAgZ2VuZGVyOiAnTWFsZScsXHJcbiAgICAgICAgICAgIGhlaWdodDogJzEuNzAnLFxyXG4gICAgICAgICAgICBvY2N1cGF0aW9uOiAnQWN0b3InLFxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgICAgaWQ6IDMsXHJcbiAgICAgICAgICAgIG5hbWU6IHtcclxuICAgICAgICAgICAgICAgIGJpcnRoOiAnUGF1bGEgRmVybmFuZGVzJyxcclxuICAgICAgICAgICAgICAgIGFydGlzdGljOiAnUGF1bGEgRmVybmFuZGVzJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdXJsTmFtZTogJ3BhdWxhLWZlcm5hbmRlcycsXHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnY2FudG9yYSBlIGNvbXBvc2l0b3JhIGJyYXNpbGVpcmEuIENhbnRvcmEgZGVzZGUgYSBpbmbDom5jaWEsIEZlcm5hbmRlcyBjb21lw6dvdSBhIGNhbnRhciBwcm9maXNzaW9uYWxtZW50ZSBhb3Mgb2l0byBhbm9zIGRlIGlkYWRlJyxcclxuICAgICAgICAgICAgaW1hZ2U6ICdodHRwOi8vd3d3LmFzc2lzbmV3cy5jb20uYnIvd3AtY29udGVudC91cGxvYWRzLzIwMTcvMTIvcGF1bGFfZmVybmFuZGVzLTEuanBnJyxcclxuICAgICAgICAgICAgYmlydGhkYXRlOiAnMjgvMDgvMTk4NCcsXHJcbiAgICAgICAgICAgIGdlbmRlcjogJ0ZlbWFsZScsXHJcbiAgICAgICAgICAgIGhlaWdodDogJzEuNjUnLFxyXG4gICAgICAgICAgICBvY2N1cGF0aW9uOiAnU2luZ2VyJyxcclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIGlkOiA0LFxyXG4gICAgICAgICAgICBuYW1lOiB7XHJcbiAgICAgICAgICAgICAgICBiaXJ0aDogJ0ZhdXN0byBDb3Jyw6phIGRhIFNpbHZhJyxcclxuICAgICAgICAgICAgICAgIGFydGlzdGljOiAnRmF1c3TDo28nLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB1cmxOYW1lOiAnZmF1c3RvLXNpbHZhJyxcclxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdGYXVzdG8gQ29ycsOqYSBkYSBTaWx2YSwgbWFpcyBjb25oZWNpZG8gY29tbyBGYXVzdMOjbywgw6kgdW0gYXByZXNlbnRhZG9yIGJyYXNpbGVpcm8gcXVlIGF0dWFsbWVudGUgYXByZXNlbnRhIG8gcHJvZ3JhbWEgZGUgYXVkaXTDs3JpbyBEb21pbmfDo28gZG8gRmF1c3TDo28sIGRhIFJlZGUgR2xvYm8uJyxcclxuICAgICAgICAgICAgaW1hZ2U6ICdodHRwOi8vaW1hZ2Vucy51cy9zdWJjZWxlYnJpZGFkZXMvZmF1c3RvLXNpbHZhL2ZhdXN0by1zaWx2YSUyMCg0KS5qcGcnLFxyXG4gICAgICAgICAgICBiaXJ0aGRhdGU6ICcwMy8wNS8xOTUwJyxcclxuICAgICAgICAgICAgZ2VuZGVyOiAnTWFsZScsXHJcbiAgICAgICAgICAgIGhlaWdodDogJzEuODgnLFxyXG4gICAgICAgICAgICBvY2N1cGF0aW9uOiAnUHJlc2VudGVyJyxcclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIGlkOiA1LFxyXG4gICAgICAgICAgICBuYW1lOiB7XHJcbiAgICAgICAgICAgICAgICBiaXJ0aDogJ1Bhb2xsYSBPbGl2ZWlyYScsXHJcbiAgICAgICAgICAgICAgICBhcnRpc3RpYzogJ1Bhb2xsYSBPbGl2ZWlyYScsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHVybE5hbWU6ICdwYW9sYS1vbGl2ZWlyYScsXHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnUGFvbGxhIE9saXZlaXJhIMOpIGRlc2NlbmRlbnRlIGRlIGVzcGFuaMOzaXMsIGl0YWxpYW5vcyBlIHBvcnR1Z3Vlc2VzLiBFbGEgw6kgZmlsaGEgZGUgdW0gcG9saWNpYWwgbWlsaXRhciBhcG9zZW50YWRvIGUgZGUgdW1hIGV4LWF1eGlsaWFyIGRlIGVuZmVybWFnZW0nLFxyXG4gICAgICAgICAgICBpbWFnZTogJ2h0dHBzOi8vcGF0cmljaW5oYWVzcGVydGEuY29tLmJyL3dwLWNvbnRlbnQvdXBsb2Fkcy8yMDEzLzA1L3Bhb2xhLW9saXZlaXJhLmpwZycsXHJcbiAgICAgICAgICAgIGJpcnRoZGF0ZTogJzI4LzAxLzE5ODMnLFxyXG4gICAgICAgICAgICBnZW5kZXI6ICdGZW1hbGUnLFxyXG4gICAgICAgICAgICBoZWlnaHQ6ICcxLjU4JyxcclxuICAgICAgICAgICAgb2NjdXBhdGlvbjogJ1NpbmdlcicsXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICBpZDogNixcclxuICAgICAgICAgICAgbmFtZToge1xyXG4gICAgICAgICAgICAgICAgYmlydGg6ICdTYW5keSBMaW1hJyxcclxuICAgICAgICAgICAgICAgIGFydGlzdGljOiAnU2FuZHkgTGltYScsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHVybE5hbWU6ICdzYW5keS1saW1hJyxcclxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdjYW50b3JhLCBjb21wb3NpdG9yYSBlIGF0cml6IGJyYXNpbGVpcmEuIENhbnRvcmEgZGVzZGUgYSBpbmbDom5jaWEsIFNhbmR5IGNvbWXDp291IHN1YSBjYXJyZWlyYSBlbSAxOTkwLCBxdWFuZG8gZm9ybW91IGNvbSBvIGlybcOjbywgbyBtw7pzaWNvIEp1bmlvciBMaW1hLCBhIGR1cGxhIHZvY2FsIFNhbmR5ICYgSnVuaW9yLicsXHJcbiAgICAgICAgICAgIGltYWdlOiAnaHR0cDovL2ltYWdlcy52aXJndWxhLmNvbS5ici8yMDE1LzAyL3NhbmR5LmpwZycsXHJcbiAgICAgICAgICAgIGJpcnRoZGF0ZTogJzI4LzAxLzE5ODMnLFxyXG4gICAgICAgICAgICBnZW5kZXI6ICdGZW1hbGUnLFxyXG4gICAgICAgICAgICBoZWlnaHQ6ICcxLjU4JyxcclxuICAgICAgICAgICAgb2NjdXBhdGlvbjogJ1NpbmdlcicsXHJcbiAgICAgICAgfSxcclxuICAgIF07XHJcblxyXG4gICAgdmFyIHNlcnZpY2UgPSB7XHJcblxyXG4gICAgICAgIHRvVXJsOiBmdW5jdGlvbihzdHJpbmcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHN0cmluZy50cmltKCkudG9Mb3dlckNhc2UoKS5zcGxpdCgnICcpLmpvaW4oJy0nKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICB0b0NhcGl0YWxpemU6IGZ1bmN0aW9uKHN0cmluZykge1xyXG4gICAgICAgICAgICB2YXIgc2xpY2VzID0gc3RyaW5nLnNwbGl0KCctJyk7XHJcbiAgICAgICAgICAgIHZhciBjYXBpdGFsaXplZFNsaWNlcyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgc2xpY2VzLmZvckVhY2goIGZ1bmN0aW9uKHdvcmQpIHtcclxuICAgICAgICAgICAgICAgIGNhcGl0YWxpemVkU2xpY2VzLnB1c2goIHdvcmQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB3b3JkLnNsaWNlKDEpICk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGNhcGl0YWxpemVkU2xpY2VzLmpvaW4oJyAnKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBnZXRDZWxlYnJpdGllczogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnY2VsZWJyaXRpZXM6ICcsIGNlbGVicml0aWVzKTtcclxuICAgICAgICAgICAgcmV0dXJuIGNlbGVicml0aWVzO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGFkZDogZnVuY3Rpb24gKCBjZWxlYnJpdHkgKSB7XHJcbiAgICAgICAgICAgIHZhciBsb2NhbFN0b3JhZ2VMaXN0ID0gSlNPTi5wYXJzZSggbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJjZWxlYnJpdGllc0xpc3RcIikgKTtcclxuXHJcbiAgICAgICAgICAgIGlmICggbG9jYWxTdG9yYWdlTGlzdCApIHtcclxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZUxpc3QucHVzaCggY2VsZWJyaXR5ICk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSggbG9jYWxTdG9yYWdlTGlzdCApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZUxpc3QgPSBbXTtcclxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZUxpc3QucHVzaChjZWxlYnJpdHkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoIGxvY2FsU3RvcmFnZUxpc3QgKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBjZWxlYnJpdGllc0xpc3QgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImNlbGVicml0aWVzTGlzdFwiKSAhPT0gbnVsbFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBKU09OLnBhcnNlKCBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImNlbGVicml0aWVzTGlzdFwiKSApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGNlbGVicml0aWVzTGlzdDtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBzZWFyY2g6IGZ1bmN0aW9uKGlkKSB7XHJcbiAgICAgICAgICAgIHZhciBjZWxlYnJpdGllc0xpc3QgPSB0aGlzLmdldENlbGVicml0aWVzKCk7XHJcbiAgICAgICAgICAgIHZhciBzZWFyY2hSZXN1bHQ7XHJcblxyXG4gICAgICAgICAgICBpZCA9IHBhcnNlSW50KGlkKTtcclxuXHJcbiAgICAgICAgICAgIGlmICggY2VsZWJyaXRpZXNMaXN0ICkge1xyXG4gICAgICAgICAgICAgICAgY2VsZWJyaXRpZXNMaXN0Lm1hcChmdW5jdGlvbiggY2VsZWJyaXR5ICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIGNlbGVicml0eS5pZCA9PSBpZCApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlYXJjaFJlc3VsdCA9IGNlbGVicml0eTtcclxuXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHNlYXJjaFJlc3VsdDtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uICggY2VsZWJyaXRpZXNMaXN0ICkge1xyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnY2VsZWJyaXRpZXNMaXN0JywgSlNPTi5zdHJpbmdpZnkoIGNlbGVicml0aWVzTGlzdCApKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBlZGl0OiBmdW5jdGlvbiAoIGNlbGVicml0eSApIHtcclxuICAgICAgICAgICAgdGhpcy5kZWxldGUoIGNlbGVicml0eS5pZCApO1xyXG4gICAgICAgICAgICB0aGlzLmFkZCggY2VsZWJyaXR5ICk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXQoKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBkZWxldGU6IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgICAgICAgICB2YXIgY2VsZWJyaXRpZXNMaXN0ID0gdGhpcy5nZXQoKTtcclxuICAgICAgICAgICAgdmFyIGRlbGV0ZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIGlkID0gcGFyc2VJbnQoaWQpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCBjZWxlYnJpdGllc0xpc3QgKSB7XHJcbiAgICAgICAgICAgICAgICBjZWxlYnJpdGllc0xpc3QubWFwKCBmdW5jdGlvbiggY2VsZWJyaXR5LCBpbmRleCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBjZWxlYnJpdHkuaWQgPT0gaWQgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQgPSBjZWxlYnJpdGllc0xpc3Quc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoIGNlbGVicml0aWVzTGlzdCApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZGVsZXRlZDtcclxuICAgICAgICB9LFxyXG5cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gc2VydmljZTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2VsZWJyaXRpZXNTZXJ2aWNlO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2FwcC9zZXJ2aWNlcy9jZWxlYnJpdGllcy5zZXJ2aWNlLmpzXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImFuZ3VsYXIubW9kdWxlKCdob2xseXdvb2RTdGFycycpXG4gICAgLmNvbnRyb2xsZXIoJ2hvbWVDb250cm9sbGVyJywgcmVxdWlyZSgnLi9ob21lLmNvbnRyb2xsZXInKSlcbiAgICAuY29udHJvbGxlcignY2VsZWJyaXR5Q29udHJvbGxlcicsIHJlcXVpcmUoJy4vY2VsZWJyaXR5LmNvbnRyb2xsZXInKSlcbiAgICAuY29udHJvbGxlcignYWRkQ2VsZWJyaXR5Q29udHJvbGxlcicsIHJlcXVpcmUoJy4vYWRkLWNlbGVicml0eS5jb250cm9sbGVyJykpXG4gICAgLmNvbnRyb2xsZXIoJ2VkaXRDZWxlYnJpdHlDb250cm9sbGVyJywgcmVxdWlyZSgnLi9lZGl0LWNlbGVicml0eS5jb250cm9sbGVyJykpXG4gICAgLmNvbnRyb2xsZXIoJ2xpc3RDZWxlYnJpdHlDb250cm9sbGVyJywgcmVxdWlyZSgnLi9saXN0LWNlbGVicml0eS5jb250cm9sbGVyJykpXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYXBwL2NvbnRyb2xsZXJzL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmZ1bmN0aW9uIGhvbWVDb250cm9sbGVyKCAkc2NvcGUsIENlbGVicml0aWVzU2VydmljZSApIHtcclxuICAgICRzY29wZS50aXRsZSA9ICdSZWNlbnRseSBhZGRlZCBjZWxlYnJpdGllczonO1xyXG5cclxuICAgICRzY29wZS5jZWxlYnJpdHlMaXN0ID0gQ2VsZWJyaXRpZXNTZXJ2aWNlLmdldENlbGVicml0aWVzKCk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gaG9tZUNvbnRyb2xsZXI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYXBwL2NvbnRyb2xsZXJzL2hvbWUuY29udHJvbGxlci5qc1xuLy8gbW9kdWxlIGlkID0gNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJmdW5jdGlvbiBjZWxlYnJpdHlDb250cm9sbGVyKCAkc2NvcGUsICRyb3V0ZVBhcmFtcywgQ2VsZWJyaXRpZXNTZXJ2aWNlLCAkd2luZG93ICkge1xyXG5cclxuICAgIGNvbnNvbGUubG9nKCdwYXJzZUludCggJHJvdXRlUGFyYW1zLmlkICk6ICcsIENlbGVicml0aWVzU2VydmljZS5zZWFyY2goIHBhcnNlSW50KCAkcm91dGVQYXJhbXMuaWQgKSkgKTtcclxuICAgICRzY29wZS5jZWxlYnJpdHkgPSBDZWxlYnJpdGllc1NlcnZpY2Uuc2VhcmNoKCBwYXJzZUludCggJHJvdXRlUGFyYW1zLmlkICkgKTtcclxuXHJcbiAgICAkc2NvcGUuc2hvd01lc3NhZ2UgPSBmYWxzZTtcclxuICAgICRzY29wZS5tZXNzYWdlID0gJHNjb3BlLmNlbGVicml0eS5uYW1lICsgJyByZW1vdmVkIHN1Y2Nlc3NmdWxseSc7XHJcblxyXG4gICAgJHNjb3BlLnJlbW92ZSA9IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgICAgIENlbGVicml0aWVzU2VydmljZS5kZWxldGUoaWQpO1xyXG4gICAgICAgICRzY29wZS5zaG93TWVzc2FnZSA9IHRydWU7XHJcblxyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICR3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvJztcclxuICAgICAgICB9LCAzMDAwKTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjZWxlYnJpdHlDb250cm9sbGVyO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2FwcC9jb250cm9sbGVycy9jZWxlYnJpdHkuY29udHJvbGxlci5qc1xuLy8gbW9kdWxlIGlkID0gN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJmdW5jdGlvbiBhZGRDZWxlYnJpdHlDb250cm9sbGVyKCAkc2NvcGUsICRyb3V0ZVBhcmFtcywgQ2VsZWJyaXRpZXNTZXJ2aWNlICkge1xyXG5cclxuICAgICRzY29wZS50aXRsZSA9ICdBZGQgYSBuZXcgY2VsZWJyaXR5Oic7XHJcblxyXG4gICAgJHNjb3BlLmNlbGVicml0aWVzID0gQ2VsZWJyaXRpZXNTZXJ2aWNlLmdldENlbGVicml0aWVzKCk7XHJcbiAgICAkc2NvcGUudXBkYXRlQ2VsZWJyaXRpZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJHNjb3BlLmNlbGVicml0aWVzID0gQ2VsZWJyaXRpZXNTZXJ2aWNlLmdldENlbGVicml0aWVzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgJHNjb3BlLmNlbGVicml0eSA9IHtcclxuICAgICAgICBuYW1lOiB7XHJcbiAgICAgICAgICAgIGJpcnRoOiAnJyxcclxuICAgICAgICAgICAgYXJ0aXN0aWM6ICcnXHJcbiAgICAgICAgfSxcclxuICAgICAgICBpbWFnZTogJycsXHJcbiAgICAgICAgYmlydGhkYXRlOiAnJyxcclxuICAgICAgICBnZW5kZXI6ICcnLFxyXG4gICAgICAgIGhlaWdodDogJycsXHJcbiAgICAgICAgb2NjdXBhdGlvbjogJycsXHJcbiAgICAgICAgZGVzY3JpcHRpb246ICcnLFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAkc2NvcGUuZm9ybSA9IHtcclxuICAgICAgICBoYXNFcnJvcjogZmFsc2UsXHJcbiAgICAgICAgZGlzYWJsZVNhdmU6IHRydWUsXHJcblxyXG4gICAgICAgIHZhbGlkYXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5mZWVkYmFjay5tZXNzYWdlcyA9IFtdO1xyXG4gICAgXHJcbiAgICAgICAgICAgIGlmICgkc2NvcGUuY2VsZWJyaXR5Lm5hbWUuYXJ0aXN0aWMubGVuZ3RoIDwgMykge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmZlZWRiYWNrLm1lc3NhZ2VzLnB1c2goICdJbnZhbGlkIG5hbWUnICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgICAgICBpZiAoJHNjb3BlLmNlbGVicml0eS5kZXNjcmlwdGlvbi5sZW5ndGggPCAzKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuZmVlZGJhY2subWVzc2FnZXMucHVzaCggJ0ludmFsaWQgZGVzY3JpcHRpb24nICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgICAgICBpZiAoJHNjb3BlLmNlbGVicml0eS5pbWFnZS5sZW5ndGggPCAzKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuZmVlZGJhY2subWVzc2FnZXMucHVzaCggJ0ludmFsaWQgaW1hZ2UgcGF0aCcgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgXHJcbiAgICAgICAgICAgIHJldHVybiAkc2NvcGUuZmVlZGJhY2subWVzc2FnZXM7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgaGFuZGxlQmx1cjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBoYW5kbGVDaGFuZ2U6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHNjb3BlLmZvcm0uZGlzYWJsZVNhdmUgPSAkc2NvcGUuZm9ybS52YWxpZGF0ZSgpLmxlbmd0aCA+IDAgPyB0cnVlIDogZmFsc2U7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgYWRkOiBmdW5jdGlvbiAoJGZvcm0pIHtcclxuXHJcbiAgICAgICAgICAgIGlmICggISRmb3JtLiRpbnZhbGlkICkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLnVwZGF0ZUNlbGVicml0aWVzKCk7XHJcbiAgICBcclxuICAgICAgICAgICAgICAgICRzY29wZS5jZWxlYnJpdHkuaWQgICAgICA9ICRzY29wZS5jZWxlYnJpdGllcyA/ICRzY29wZS5jZWxlYnJpdGllcy5sZW5ndGggKyAxIDogMTtcclxuICAgICAgICAgICAgICAgICRzY29wZS5jZWxlYnJpdHkudXJsTmFtZSA9IENlbGVicml0aWVzU2VydmljZS50b1VybCggJHNjb3BlLmNlbGVicml0eS5uYW1lLmFydGlzdGljICk7XHJcbiAgICBcclxuICAgICAgICAgICAgICAgIENlbGVicml0aWVzU2VydmljZS5hZGQoICRzY29wZS5jZWxlYnJpdHkgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuZm9ybS5yZXNldCgpO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmZvcm0uaGFzRXJyb3IgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgICRzY29wZS5mZWVkYmFjay5tZXNzYWdlc0NsYXNzKCk7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuZmVlZGJhY2subWVzc2FnZXMucHVzaCggJHNjb3BlLmNlbGVicml0eS5uYW1lLmFydGlzdGljICsgJyBhZGRlZCBzdWNjZXNzZnVsbHkhJyApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmZvcm0uaGFzRXJyb3IgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgICRzY29wZS5mZWVkYmFjay5tZXNzYWdlc0NsYXNzKCk7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuZmVlZGJhY2subWVzc2FnZXMgPSBbXTtcclxuICAgICAgICAgICAgICAgICRzY29wZS5mZWVkYmFjay5tZXNzYWdlcy5wdXNoKCAnQ29tcGxldGUgdGhlIGZvcm0gdG8gYWRkIGEgbmV3IGNlbGVicml0eScgKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCRmb3JtLmFydGlzdGljTmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICByZXNldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkc2NvcGUuY2VsZWJyaXR5ID0ge1xyXG4gICAgICAgICAgICAgICAgbmFtZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGJpcnRoOiAnJyxcclxuICAgICAgICAgICAgICAgICAgICBhcnRpc3RpYzogJydcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBpbWFnZTogJycsXHJcbiAgICAgICAgICAgICAgICBiaXJ0aGRhdGU6ICcnLFxyXG4gICAgICAgICAgICAgICAgZ2VuZGVyOiAnJyxcclxuICAgICAgICAgICAgICAgIGhlaWdodDogJycsXHJcbiAgICAgICAgICAgICAgICBvY2N1cGF0aW9uOiAnJyxcclxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnJyxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAkc2NvcGUuZmVlZGJhY2sgPSB7XHJcbiAgICAgICAgbWVzc2FnZXM6IFtdLFxyXG4gICAgICAgIG1lc3NhZ2VzTW9kaWZpZXI6ICcnLFxyXG4gICAgICAgIG1lc3NhZ2VzQ2xhc3M6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHNjb3BlLmZlZWRiYWNrLm1lc3NhZ2VzTW9kaWZpZXIgPSAgJHNjb3BlLmZvcm0uaGFzRXJyb3IgPyAnZGFuZ2VyJyA6ICdzdWNjZXNzJztcclxuICAgICAgICB9LFxyXG4gICAgfVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhZGRDZWxlYnJpdHlDb250cm9sbGVyO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2FwcC9jb250cm9sbGVycy9hZGQtY2VsZWJyaXR5LmNvbnRyb2xsZXIuanNcbi8vIG1vZHVsZSBpZCA9IDhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZnVuY3Rpb24gZWRpdENlbGVicml0eUNvbnRyb2xsZXIoICRzY29wZSwgJHdpbmRvdywgJHJvdXRlUGFyYW1zLCBDZWxlYnJpdGllc1NlcnZpY2UgKSB7XHJcblxyXG4gICAgJHNjb3BlLnRpdGxlID0gJ0VkaXQgQ2VsZWJyaXR5J1xyXG4gICAgJHNjb3BlLmNlbGVicml0eSA9IENlbGVicml0aWVzU2VydmljZS5zZWFyY2goICRyb3V0ZVBhcmFtcy5pZCApO1xyXG5cclxuXHJcbiAgICAkc2NvcGUuZm9ybSA9IHtcclxuICAgICAgICBoYXNFcnJvcjogZmFsc2UsXHJcbiAgICAgICAgZGlzYWJsZVNhdmU6IHRydWUsXHJcblxyXG4gICAgICAgIHZhbGlkYXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5mZWVkYmFjay5tZXNzYWdlcyA9IFtdO1xyXG4gICAgXHJcbiAgICAgICAgICAgIGlmICgkc2NvcGUuY2VsZWJyaXR5Lm5hbWUubGVuZ3RoIDwgMykge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmZlZWRiYWNrLm1lc3NhZ2VzLnB1c2goICdJbnZhbGlkIG5hbWUnICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgICAgICBpZiAoJHNjb3BlLmNlbGVicml0eS5kZXNjcmlwdGlvbi5sZW5ndGggPCAzKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuZmVlZGJhY2subWVzc2FnZXMucHVzaCggJ0ludmFsaWQgZGVzY3JpcHRpb24nICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgICAgICBpZiAoJHNjb3BlLmNlbGVicml0eS5pbWFnZS5sZW5ndGggPCAzKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuZmVlZGJhY2subWVzc2FnZXMucHVzaCggJ0ludmFsaWQgaW1hZ2UgcGF0aCcgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgXHJcbiAgICAgICAgICAgIHJldHVybiAkc2NvcGUuZmVlZGJhY2subWVzc2FnZXM7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgaGFuZGxlQ2hhbmdlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5mb3JtLmRpc2FibGVTYXZlID0gJHNjb3BlLmZvcm0udmFsaWRhdGUoKS5sZW5ndGggPiAwID8gdHJ1ZSA6IGZhbHNlO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgdmFyIG5ld0NlbGVicml0eSA9ICRzY29wZS5jZWxlYnJpdHk7XHJcbiAgICBcclxuICAgICAgICAgICAgdmFyIG1lc3NhZ2VzID0gJHNjb3BlLmZvcm0udmFsaWRhdGUoKTtcclxuICAgIFxyXG4gICAgICAgICAgICBpZiAoIG1lc3NhZ2VzLmxlbmd0aCA9PSAwICkge1xyXG4gICAgXHJcbiAgICAgICAgICAgICAgICBDZWxlYnJpdGllc1NlcnZpY2UuZWRpdCggbmV3Q2VsZWJyaXR5ICk7XHJcbiAgICBcclxuICAgICAgICAgICAgICAgICRzY29wZS5mb3JtLmhhc0Vycm9yID0gZmFsc2U7XHJcbiAgICBcclxuICAgICAgICAgICAgICAgICRzY29wZS5mZWVkYmFjay5tZXNzYWdlc0NsYXNzKCk7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuZmVlZGJhY2subWVzc2FnZXMgPSBbXTtcclxuICAgICAgICAgICAgICAgICRzY29wZS5mZWVkYmFjay5tZXNzYWdlcy5wdXNoKCAkc2NvcGUuY2VsZWJyaXR5Lm5hbWUuYXJ0aXN0aWMgKyAnIHVwZGF0ZWQgc3VjY2Vzc2Z1bGx5IScgKTtcclxuICAgIFxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgXHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuZm9ybS5oYXNFcnJvciA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuZmVlZGJhY2subWVzc2FnZXNDbGFzcygpO1xyXG4gICAgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5mZWVkYmFjayA9IHtcclxuICAgICAgICBtZXNzYWdlczogW10sXHJcbiAgICAgICAgbWVzc2FnZXNNb2RpZmllcjogJycsXHJcbiAgICAgICAgbWVzc2FnZXNDbGFzczogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkc2NvcGUuZmVlZGJhY2subWVzc2FnZXNNb2RpZmllciA9ICAkc2NvcGUuZm9ybS5oYXNFcnJvciA/ICdlcnJvcicgOiAnc3VjY2Vzcyc7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBlZGl0Q2VsZWJyaXR5Q29udHJvbGxlcjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9hcHAvY29udHJvbGxlcnMvZWRpdC1jZWxlYnJpdHkuY29udHJvbGxlci5qc1xuLy8gbW9kdWxlIGlkID0gOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJmdW5jdGlvbiBsaXN0Q2VsZWJyaXR5Q29udHJvbGxlciggJHNjb3BlLCBDZWxlYnJpdGllc1NlcnZpY2UgKSB7XHJcblxyXG4gICAgJHNjb3BlLmNlbGVicml0eUxpc3QgPSBDZWxlYnJpdGllc1NlcnZpY2UuZ2V0Q2VsZWJyaXRpZXMoKTtcclxuXHJcbiAgICAkc2NvcGUuc2VsZWN0T3B0aW9ucyA9IFtcclxuICAgICAgICB7IG5hbWU6ICdOYW1lJywgdmFsdWU6ICduYW1lJyB9LFxyXG4gICAgICAgIHsgbmFtZTogJ0FnZScsIHZhbHVlOiAnYWdlJyB9XHJcbiAgICBdXHJcblxyXG4gICAgJHNjb3BlLnJlbW92ZSA9IGZ1bmN0aW9uKGlkKSB7XHJcbiAgICAgICAgQ2VsZWJyaXRpZXNTZXJ2aWNlLmRlbGV0ZShpZCk7XHJcbiAgICAgICAgJHNjb3BlLmNlbGVicml0eUxpc3QgPSBDZWxlYnJpdGllc1NlcnZpY2UuZ2V0Q2VsZWJyaXRpZXMoKTtcclxuICAgIH1cclxuXHJcbiAgICAkc2NvcGUudGl0bGUgPSAnQWxsIGNlbGVicml0aWVzJ1xyXG5cclxuICAgIHZhciByZWcgPSAvXlxcZHs0LDV9LVxcZHs0fSQvO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGxpc3RDZWxlYnJpdHlDb250cm9sbGVyO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2FwcC9jb250cm9sbGVycy9saXN0LWNlbGVicml0eS5jb250cm9sbGVyLmpzXG4vLyBtb2R1bGUgaWQgPSAxMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJhbmd1bGFyLm1vZHVsZSgnaG9sbHl3b29kU3RhcnMnKVxuICAgIC5kaXJlY3RpdmUoJ2NhcGl0YWxpemUnLCByZXF1aXJlKCcuL2NhcGl0YWxpemUuZGlyZWN0aXZlJykpXG4gICAgLmRpcmVjdGl2ZSgnZGF0ZScsIHJlcXVpcmUoJy4vZGF0ZS5kaXJlY3RpdmUnKSlcbiAgICAuZGlyZWN0aXZlKCdoZWlnaHQnLCByZXF1aXJlKCcuL2hlaWdodC5kaXJlY3RpdmUnKSlcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9hcHAvZGlyZWN0aXZlcy9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gMTFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZnVuY3Rpb24gY2FwaXRhbGl6ZURpcmVjdGl2ZSAoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHJlcXVpcmU6ICduZ01vZGVsJyxcclxuICAgICAgICByZXN0cmljdDogJ0EnLFxyXG4gICAgICAgIGxpbms6IGxpbmtcclxuICAgIH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjdHJsKSB7XHJcbiAgICBcclxuICAgIHZhciBfY2FwaXRhbGl6ZSA9IGZ1bmN0aW9uICh0ZXh0KSB7XHJcbiAgICAgICAgdmFyIHdvcmRzQXJyYXkgPSB0ZXh0LnNwbGl0KCcgJyk7XHJcblxyXG4gICAgICAgIHZhciBjYXBpdGFsaXplZFdvcmRzID0gd29yZHNBcnJheS5tYXAoZnVuY3Rpb24gKHdvcmQpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICgvKGRhfGRlKS8udGVzdCh3b3JkKSkgcmV0dXJuIHdvcmQ7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gd29yZC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHdvcmQuc3Vic3RyaW5nKDEpLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIGNhcGl0YWxpemVkV29yZHMuam9pbignICcpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBlbGVtZW50LmJpbmQoXCJibHVyXCIsIGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgdmFyIGNoZWNrTWluTGVuZ3RoID0gKGN0cmwuJHZpZXdWYWx1ZS5sZW5ndGggPj0gYXR0cnMubmdNaW5sZW5ndGgpID8gdHJ1ZSA6IGZhbHNlO1xyXG4gICAgICAgIHZhciBjaGVja01heExlbmd0aCA9IChjdHJsLiR2aWV3VmFsdWUubGVuZ3RoIDw9IGF0dHJzLm5nTWF4bGVuZ3RoKSA/IHRydWUgOiBmYWxzZTtcclxuXHJcbiAgICAgICAgaWYgKCBjaGVja01pbkxlbmd0aCAmJiBjaGVja01heExlbmd0aCApIHtcclxuICAgICAgICAgICAgY3RybC4kc2V0Vmlld1ZhbHVlKF9jYXBpdGFsaXplKGN0cmwuJHZpZXdWYWx1ZSkpO1xyXG4gICAgICAgICAgICBjdHJsLiRyZW5kZXIoKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjYXBpdGFsaXplRGlyZWN0aXZlO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2FwcC9kaXJlY3RpdmVzL2NhcGl0YWxpemUuZGlyZWN0aXZlLmpzXG4vLyBtb2R1bGUgaWQgPSAxMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJmdW5jdGlvbiBkYXRlRGlyZWN0aXZlICgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcmVxdWlyZTogJ25nTW9kZWwnLFxyXG4gICAgICAgIHJlc3RyaWN0OiAnQScsXHJcbiAgICAgICAgbGluazogbGlua1xyXG4gICAgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMsIGN0cmwpIHtcclxuXHJcbiAgICB2YXIgX2Zvcm1hdERhdGUgPSBmdW5jdGlvbiAoaW5wdXQpIHtcclxuXHJcbiAgICAgICAgLy8gcmVwbGFjZSBldmVyeXRoaW5nIHRoYXQncyBub3QgYSBudW0gZm9yIFwiXCJcclxuICAgICAgICBpbnB1dCA9IGlucHV0LnJlcGxhY2UoL1teMC05XSsvZywgXCJcIik7XHJcblxyXG4gICAgICAgIGlmKGlucHV0Lmxlbmd0aCA+IDIpIHtcclxuICAgICAgICAgICAgaW5wdXQgPSBpbnB1dC5zdWJzdHJpbmcoMCwyKSArIFwiL1wiICsgaW5wdXQuc3Vic3RyaW5nKDIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoaW5wdXQubGVuZ3RoID4gNSkge1xyXG4gICAgICAgICAgICBpbnB1dCA9IGlucHV0LnN1YnN0cmluZygwLDUpICsgXCIvXCIgKyBpbnB1dC5zdWJzdHJpbmcoNSw5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBpbnB1dDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZWxlbWVudC5iaW5kKFwia2V5dXBcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGN0cmwuJHNldFZpZXdWYWx1ZShfZm9ybWF0RGF0ZShjdHJsLiR2aWV3VmFsdWUpKTtcclxuICAgICAgICBjdHJsLiRyZW5kZXIoKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGRhdGVEaXJlY3RpdmU7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYXBwL2RpcmVjdGl2ZXMvZGF0ZS5kaXJlY3RpdmUuanNcbi8vIG1vZHVsZSBpZCA9IDEzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImZ1bmN0aW9uIGhlaWdodERpcmVjdGl2ZSAoKSB7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByZXF1aXJlOiAnbmdNb2RlbCcsXHJcbiAgICAgICAgcmVzdHJpY3Q6ICdBJyxcclxuICAgICAgICBsaW5rOiBsaW5rXHJcbiAgICB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY3RybCkge1xyXG4gICAgXHJcbiAgICB2YXIgX2Zvcm1hdEhlaWdodCA9IGZ1bmN0aW9uIChoZWlnaHQpIHtcclxuXHJcbiAgICAgICAgLy8gUmVtb3ZlcyBldmVyeXRoaW5nIHRoYXQncyBub3QgYSBudW1iZXIgb3IgYSBjb21tYVxyXG4gICAgICAgIGhlaWdodCA9IGhlaWdodC5yZXBsYWNlKC9bXjAtOV0rL2csIFwiXCIpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICggaGVpZ2h0Lmxlbmd0aCA+IDEgKSB7XHJcbiAgICAgICAgICAgIGhlaWdodCA9IGhlaWdodC5zdWJzdHJpbmcoMCwgMSkgKyAnLCcgKyBoZWlnaHQuc3Vic3RyaW5nKDEsMyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gaGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIGVsZW1lbnQuYmluZChcImtleXVwXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhfZm9ybWF0SGVpZ2h0KGN0cmwuJHZpZXdWYWx1ZSkpO1xyXG4gICAgICAgIGN0cmwuJHNldFZpZXdWYWx1ZShfZm9ybWF0SGVpZ2h0KGN0cmwuJHZpZXdWYWx1ZSkpO1xyXG4gICAgICAgIGN0cmwuJHJlbmRlcigpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gaGVpZ2h0RGlyZWN0aXZlO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2FwcC9kaXJlY3RpdmVzL2hlaWdodC5kaXJlY3RpdmUuanNcbi8vIG1vZHVsZSBpZCA9IDE0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImFuZ3VsYXIubW9kdWxlKCdob2xseXdvb2RTdGFycycpXHJcbiAgICAuY29tcG9uZW50KCdhcHBIZWFkZXInLCByZXF1aXJlKCcuL2FwcC1oZWFkZXIuY29tcG9uZW50JykpXHJcbiAgICAuY29tcG9uZW50KCdhcHBOYXYnLCByZXF1aXJlKCcuL2FwcC1uYXYuY29tcG9uZW50JykpXHJcbiAgICAuY29tcG9uZW50KCdjYXJkQ2VsZWJyaXR5JywgcmVxdWlyZSgnLi9jZWxlYnJpdHktY2FyZC5jb21wb25lbnQnKSlcclxuICAgIC5jb21wb25lbnQoJ2ZlZWRiYWNrTWVzc2FnZXMnLCByZXF1aXJlKCcuL2ZlZWRiYWNrLW1lc3NhZ2VzLmNvbXBvbmVudCcpKVxyXG4gICAgXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYXBwL2NvbXBvbmVudHMvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDE1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImZ1bmN0aW9uIGFwcEhlYWRlckNvbnRyb2xsZXIgKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycykge1xyXG4gICAgXHJcbn1cclxuXHJcbnZhciBhcHBIZWFkZXJDb21wb25lbnQgPSB7XHJcbiAgICB0ZW1wbGF0ZVVybDogJy9hc3NldHMvdmlld3MvcGFydGlhbHMvYXBwLWhlYWRlci50ZW1wbGF0ZS5odG1sJyxcclxuICAgIGNvbnRyb2xsZXI6IGFwcEhlYWRlckNvbnRyb2xsZXIsXHJcbiAgICBiaW5kaW5nczoge1xyXG4gICAgICAgIHRpdGxlOiAnQCcsXHJcbiAgICAgICAgZGVzY3JpcHRpb246ICdAJ1xyXG4gICAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhcHBIZWFkZXJDb21wb25lbnQ7XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2FwcC9jb21wb25lbnRzL2FwcC1oZWFkZXIuY29tcG9uZW50LmpzXG4vLyBtb2R1bGUgaWQgPSAxNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJmdW5jdGlvbiBhcHBOYXZDb250cm9sbGVyICgkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMpIHtcclxuICAgICRzY29wZS5uYXZMaW5rcyA9IHtcclxuICAgICAgICBob21lOiB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdIb21lJyxcclxuICAgICAgICAgICAgbGluazogJy8nXHJcbiAgICAgICAgfSxcclxuICAgICAgICBjZWxlYnJpdGllczoge1xyXG4gICAgICAgICAgICBuYW1lOiAnQ2VsZWJyaXRpZXMnLFxyXG4gICAgICAgICAgICBsaW5rOiAnY2VsZWJyaXRpZXMnXHJcbiAgICAgICAgfSxcclxuICAgICAgICBhZGQ6IHtcclxuICAgICAgICAgICAgbmFtZTogJ0FkZCcsXHJcbiAgICAgICAgICAgIGxpbms6ICdjZWxlYnJpdHkvYWRkJ1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxudmFyIGFwcE5hdkNvbXBvbmVudCA9IHtcclxuICAgIHRlbXBsYXRlVXJsOiAnL2Fzc2V0cy92aWV3cy9wYXJ0aWFscy9hcHAtbmF2LnRlbXBsYXRlLmh0bWwnLFxyXG4gICAgY29udHJvbGxlcjogYXBwTmF2Q29udHJvbGxlclxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhcHBOYXZDb21wb25lbnQ7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYXBwL2NvbXBvbmVudHMvYXBwLW5hdi5jb21wb25lbnQuanNcbi8vIG1vZHVsZSBpZCA9IDE3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImZ1bmN0aW9uIGNlbGVicml0eUNhcmRDb250cm9sbGVyICgkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMpIHtcclxuICAgICRzY29wZS5yZW1vdmUgPSAkc2NvcGUuJHBhcmVudC5yZW1vdmU7XHJcbiAgICBcclxuICAgIHRoaXMuJG9uSW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmZhbGxiYWNrQ29udGVudCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZmFsbGJhY2tDb250ZW50ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJHNjb3BlLm5hbWUgICAgICAgID0gdGhpcy5jZWxlYnJpdHkubmFtZS5hcnRpc3RpYyA/IHRoaXMuY2VsZWJyaXR5Lm5hbWUuYXJ0aXN0aWMgOiAnTm8gbmFtZSBwcm92aWRlZCc7XHJcbiAgICAgICAgJHNjb3BlLmltYWdlICAgICAgID0gdGhpcy5jZWxlYnJpdHkuaW1hZ2UgPyB0aGlzLmNlbGVicml0eS5pbWFnZSA6ICdodHRwOi8vdmlhLnBsYWNlaG9sZGVyLmNvbS80NTB4MzAwJztcclxuICAgICAgICAkc2NvcGUuZGVzY3JpcHRpb24gPSB0aGlzLmNlbGVicml0eS5kZXNjcmlwdGlvbiA/IHRoaXMuY2VsZWJyaXR5LmRlc2NyaXB0aW9uIDogJ1lvdSBzaG91bGQgaW5mb3JtIGEgc2hvcnQgZGVzY3JpcHRpb24gZm9yIHRoaXMgY2VsZWJyaXR5JztcclxuICAgIH1cclxufVxyXG5cclxudmFyIGNlbGVicml0eUNhcmRDb21wb25lbnQgPSB7XHJcbiAgICB0ZW1wbGF0ZVVybDogJy9hc3NldHMvdmlld3MvY29tcG9uZW50cy9jZWxlYnJpdHktY2FyZC50ZW1wbGF0ZS5odG1sJyxcclxuICAgIGNvbnRyb2xsZXI6IGNlbGVicml0eUNhcmRDb250cm9sbGVyLFxyXG4gICAgYmluZGluZ3M6IHtcclxuICAgICAgICBjZWxlYnJpdHk6ICc8J1xyXG4gICAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjZWxlYnJpdHlDYXJkQ29tcG9uZW50O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2FwcC9jb21wb25lbnRzL2NlbGVicml0eS1jYXJkLmNvbXBvbmVudC5qc1xuLy8gbW9kdWxlIGlkID0gMThcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZnVuY3Rpb24gZmVlZGJhY2tNZXNzYWdlc0NvbnRyb2xsZXIgKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycykge1xyXG4gICAgLy8gdGhpcy4kb25Jbml0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAvLyAgICAgY29uc29sZS5sb2codGhpcylcclxuICAgIC8vIH1cclxufVxyXG5cclxudmFyIGZlZWRiYWNrTWVzc2FnZXNDb21wb25lbnQgPSB7XHJcbiAgICB0ZW1wbGF0ZVVybDogJy9hc3NldHMvdmlld3MvY29tcG9uZW50cy9mZWVkYmFjay1tZXNzYWdlcy50ZW1wbGF0ZS5odG1sJyxcclxuICAgIGNvbnRyb2xsZXI6IGZlZWRiYWNrTWVzc2FnZXNDb250cm9sbGVyLFxyXG4gICAgYmluZGluZ3M6IHtcclxuICAgICAgICBtb2RpZmllcjogJzwnLFxyXG4gICAgICAgIG1lc3NhZ2VzOiAnPCdcclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZmVlZGJhY2tNZXNzYWdlc0NvbXBvbmVudDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9hcHAvY29tcG9uZW50cy9mZWVkYmFjay1tZXNzYWdlcy5jb21wb25lbnQuanNcbi8vIG1vZHVsZSBpZCA9IDE5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcIi4uL2Nzcy9tYWluLmNzc1wiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2FwcC9zdHlsZXMvbWFpbi5sZXNzXG4vLyBtb2R1bGUgaWQgPSAyMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9