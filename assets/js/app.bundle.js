webpackJsonp([0],[
/* 0 */,
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(2);
module.exports = __webpack_require__(18);


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(3);

angular.module('hollywoodStars', [
    'ngRoute'
]);

__webpack_require__(7);

__webpack_require__(8)

__webpack_require__(11);

__webpack_require__(15);
__webpack_require__(16);
__webpack_require__(17);


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(4);
module.exports = 'ngRoute';


/***/ }),
/* 4 */
/***/ (function(module, exports) {

/**
 * @license AngularJS v1.6.8
 * (c) 2010-2017 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, angular) {'use strict';

/* global shallowCopy: true */

/**
 * Creates a shallow copy of an object, an array or a primitive.
 *
 * Assumes that there are no proto properties for objects.
 */
function shallowCopy(src, dst) {
  if (isArray(src)) {
    dst = dst || [];

    for (var i = 0, ii = src.length; i < ii; i++) {
      dst[i] = src[i];
    }
  } else if (isObject(src)) {
    dst = dst || {};

    for (var key in src) {
      if (!(key.charAt(0) === '$' && key.charAt(1) === '$')) {
        dst[key] = src[key];
      }
    }
  }

  return dst || src;
}

/* global shallowCopy: false */

// `isArray` and `isObject` are necessary for `shallowCopy()` (included via `src/shallowCopy.js`).
// They are initialized inside the `$RouteProvider`, to ensure `window.angular` is available.
var isArray;
var isObject;
var isDefined;
var noop;

/**
 * @ngdoc module
 * @name ngRoute
 * @description
 *
 * The `ngRoute` module provides routing and deeplinking services and directives for AngularJS apps.
 *
 * ## Example
 * See {@link ngRoute.$route#examples $route} for an example of configuring and using `ngRoute`.
 *
 */
/* global -ngRouteModule */
var ngRouteModule = angular.
  module('ngRoute', []).
  info({ angularVersion: '1.6.8' }).
  provider('$route', $RouteProvider).
  // Ensure `$route` will be instantiated in time to capture the initial `$locationChangeSuccess`
  // event (unless explicitly disabled). This is necessary in case `ngView` is included in an
  // asynchronously loaded template.
  run(instantiateRoute);
var $routeMinErr = angular.$$minErr('ngRoute');
var isEagerInstantiationEnabled;


/**
 * @ngdoc provider
 * @name $routeProvider
 * @this
 *
 * @description
 *
 * Used for configuring routes.
 *
 * ## Example
 * See {@link ngRoute.$route#examples $route} for an example of configuring and using `ngRoute`.
 *
 * ## Dependencies
 * Requires the {@link ngRoute `ngRoute`} module to be installed.
 */
function $RouteProvider() {
  isArray = angular.isArray;
  isObject = angular.isObject;
  isDefined = angular.isDefined;
  noop = angular.noop;

  function inherit(parent, extra) {
    return angular.extend(Object.create(parent), extra);
  }

  var routes = {};

  /**
   * @ngdoc method
   * @name $routeProvider#when
   *
   * @param {string} path Route path (matched against `$location.path`). If `$location.path`
   *    contains redundant trailing slash or is missing one, the route will still match and the
   *    `$location.path` will be updated to add or drop the trailing slash to exactly match the
   *    route definition.
   *
   *    * `path` can contain named groups starting with a colon: e.g. `:name`. All characters up
   *        to the next slash are matched and stored in `$routeParams` under the given `name`
   *        when the route matches.
   *    * `path` can contain named groups starting with a colon and ending with a star:
   *        e.g.`:name*`. All characters are eagerly stored in `$routeParams` under the given `name`
   *        when the route matches.
   *    * `path` can contain optional named groups with a question mark: e.g.`:name?`.
   *
   *    For example, routes like `/color/:color/largecode/:largecode*\/edit` will match
   *    `/color/brown/largecode/code/with/slashes/edit` and extract:
   *
   *    * `color: brown`
   *    * `largecode: code/with/slashes`.
   *
   *
   * @param {Object} route Mapping information to be assigned to `$route.current` on route
   *    match.
   *
   *    Object properties:
   *
   *    - `controller` – `{(string|Function)=}` – Controller fn that should be associated with
   *      newly created scope or the name of a {@link angular.Module#controller registered
   *      controller} if passed as a string.
   *    - `controllerAs` – `{string=}` – An identifier name for a reference to the controller.
   *      If present, the controller will be published to scope under the `controllerAs` name.
   *    - `template` – `{(string|Function)=}` – html template as a string or a function that
   *      returns an html template as a string which should be used by {@link
   *      ngRoute.directive:ngView ngView} or {@link ng.directive:ngInclude ngInclude} directives.
   *      This property takes precedence over `templateUrl`.
   *
   *      If `template` is a function, it will be called with the following parameters:
   *
   *      - `{Array.<Object>}` - route parameters extracted from the current
   *        `$location.path()` by applying the current route
   *
   *      One of `template` or `templateUrl` is required.
   *
   *    - `templateUrl` – `{(string|Function)=}` – path or function that returns a path to an html
   *      template that should be used by {@link ngRoute.directive:ngView ngView}.
   *
   *      If `templateUrl` is a function, it will be called with the following parameters:
   *
   *      - `{Array.<Object>}` - route parameters extracted from the current
   *        `$location.path()` by applying the current route
   *
   *      One of `templateUrl` or `template` is required.
   *
   *    - `resolve` - `{Object.<string, Function>=}` - An optional map of dependencies which should
   *      be injected into the controller. If any of these dependencies are promises, the router
   *      will wait for them all to be resolved or one to be rejected before the controller is
   *      instantiated.
   *      If all the promises are resolved successfully, the values of the resolved promises are
   *      injected and {@link ngRoute.$route#$routeChangeSuccess $routeChangeSuccess} event is
   *      fired. If any of the promises are rejected the
   *      {@link ngRoute.$route#$routeChangeError $routeChangeError} event is fired.
   *      For easier access to the resolved dependencies from the template, the `resolve` map will
   *      be available on the scope of the route, under `$resolve` (by default) or a custom name
   *      specified by the `resolveAs` property (see below). This can be particularly useful, when
   *      working with {@link angular.Module#component components} as route templates.<br />
   *      <div class="alert alert-warning">
   *        **Note:** If your scope already contains a property with this name, it will be hidden
   *        or overwritten. Make sure, you specify an appropriate name for this property, that
   *        does not collide with other properties on the scope.
   *      </div>
   *      The map object is:
   *
   *      - `key` – `{string}`: a name of a dependency to be injected into the controller.
   *      - `factory` - `{string|Function}`: If `string` then it is an alias for a service.
   *        Otherwise if function, then it is {@link auto.$injector#invoke injected}
   *        and the return value is treated as the dependency. If the result is a promise, it is
   *        resolved before its value is injected into the controller. Be aware that
   *        `ngRoute.$routeParams` will still refer to the previous route within these resolve
   *        functions.  Use `$route.current.params` to access the new route parameters, instead.
   *
   *    - `resolveAs` - `{string=}` - The name under which the `resolve` map will be available on
   *      the scope of the route. If omitted, defaults to `$resolve`.
   *
   *    - `redirectTo` – `{(string|Function)=}` – value to update
   *      {@link ng.$location $location} path with and trigger route redirection.
   *
   *      If `redirectTo` is a function, it will be called with the following parameters:
   *
   *      - `{Object.<string>}` - route parameters extracted from the current
   *        `$location.path()` by applying the current route templateUrl.
   *      - `{string}` - current `$location.path()`
   *      - `{Object}` - current `$location.search()`
   *
   *      The custom `redirectTo` function is expected to return a string which will be used
   *      to update `$location.url()`. If the function throws an error, no further processing will
   *      take place and the {@link ngRoute.$route#$routeChangeError $routeChangeError} event will
   *      be fired.
   *
   *      Routes that specify `redirectTo` will not have their controllers, template functions
   *      or resolves called, the `$location` will be changed to the redirect url and route
   *      processing will stop. The exception to this is if the `redirectTo` is a function that
   *      returns `undefined`. In this case the route transition occurs as though there was no
   *      redirection.
   *
   *    - `resolveRedirectTo` – `{Function=}` – a function that will (eventually) return the value
   *      to update {@link ng.$location $location} URL with and trigger route redirection. In
   *      contrast to `redirectTo`, dependencies can be injected into `resolveRedirectTo` and the
   *      return value can be either a string or a promise that will be resolved to a string.
   *
   *      Similar to `redirectTo`, if the return value is `undefined` (or a promise that gets
   *      resolved to `undefined`), no redirection takes place and the route transition occurs as
   *      though there was no redirection.
   *
   *      If the function throws an error or the returned promise gets rejected, no further
   *      processing will take place and the
   *      {@link ngRoute.$route#$routeChangeError $routeChangeError} event will be fired.
   *
   *      `redirectTo` takes precedence over `resolveRedirectTo`, so specifying both on the same
   *      route definition, will cause the latter to be ignored.
   *
   *    - `[reloadOnSearch=true]` - `{boolean=}` - reload route when only `$location.search()`
   *      or `$location.hash()` changes.
   *
   *      If the option is set to `false` and url in the browser changes, then
   *      `$routeUpdate` event is broadcasted on the root scope.
   *
   *    - `[caseInsensitiveMatch=false]` - `{boolean=}` - match routes without being case sensitive
   *
   *      If the option is set to `true`, then the particular route can be matched without being
   *      case sensitive
   *
   * @returns {Object} self
   *
   * @description
   * Adds a new route definition to the `$route` service.
   */
  this.when = function(path, route) {
    //copy original route object to preserve params inherited from proto chain
    var routeCopy = shallowCopy(route);
    if (angular.isUndefined(routeCopy.reloadOnSearch)) {
      routeCopy.reloadOnSearch = true;
    }
    if (angular.isUndefined(routeCopy.caseInsensitiveMatch)) {
      routeCopy.caseInsensitiveMatch = this.caseInsensitiveMatch;
    }
    routes[path] = angular.extend(
      routeCopy,
      path && pathRegExp(path, routeCopy)
    );

    // create redirection for trailing slashes
    if (path) {
      var redirectPath = (path[path.length - 1] === '/')
            ? path.substr(0, path.length - 1)
            : path + '/';

      routes[redirectPath] = angular.extend(
        {redirectTo: path},
        pathRegExp(redirectPath, routeCopy)
      );
    }

    return this;
  };

  /**
   * @ngdoc property
   * @name $routeProvider#caseInsensitiveMatch
   * @description
   *
   * A boolean property indicating if routes defined
   * using this provider should be matched using a case insensitive
   * algorithm. Defaults to `false`.
   */
  this.caseInsensitiveMatch = false;

   /**
    * @param path {string} path
    * @param opts {Object} options
    * @return {?Object}
    *
    * @description
    * Normalizes the given path, returning a regular expression
    * and the original path.
    *
    * Inspired by pathRexp in visionmedia/express/lib/utils.js.
    */
  function pathRegExp(path, opts) {
    var insensitive = opts.caseInsensitiveMatch,
        ret = {
          originalPath: path,
          regexp: path
        },
        keys = ret.keys = [];

    path = path
      .replace(/([().])/g, '\\$1')
      .replace(/(\/)?:(\w+)(\*\?|[?*])?/g, function(_, slash, key, option) {
        var optional = (option === '?' || option === '*?') ? '?' : null;
        var star = (option === '*' || option === '*?') ? '*' : null;
        keys.push({ name: key, optional: !!optional });
        slash = slash || '';
        return ''
          + (optional ? '' : slash)
          + '(?:'
          + (optional ? slash : '')
          + (star && '(.+?)' || '([^/]+)')
          + (optional || '')
          + ')'
          + (optional || '');
      })
      .replace(/([/$*])/g, '\\$1');

    ret.regexp = new RegExp('^' + path + '$', insensitive ? 'i' : '');
    return ret;
  }

  /**
   * @ngdoc method
   * @name $routeProvider#otherwise
   *
   * @description
   * Sets route definition that will be used on route change when no other route definition
   * is matched.
   *
   * @param {Object|string} params Mapping information to be assigned to `$route.current`.
   * If called with a string, the value maps to `redirectTo`.
   * @returns {Object} self
   */
  this.otherwise = function(params) {
    if (typeof params === 'string') {
      params = {redirectTo: params};
    }
    this.when(null, params);
    return this;
  };

  /**
   * @ngdoc method
   * @name $routeProvider#eagerInstantiationEnabled
   * @kind function
   *
   * @description
   * Call this method as a setter to enable/disable eager instantiation of the
   * {@link ngRoute.$route $route} service upon application bootstrap. You can also call it as a
   * getter (i.e. without any arguments) to get the current value of the
   * `eagerInstantiationEnabled` flag.
   *
   * Instantiating `$route` early is necessary for capturing the initial
   * {@link ng.$location#$locationChangeStart $locationChangeStart} event and navigating to the
   * appropriate route. Usually, `$route` is instantiated in time by the
   * {@link ngRoute.ngView ngView} directive. Yet, in cases where `ngView` is included in an
   * asynchronously loaded template (e.g. in another directive's template), the directive factory
   * might not be called soon enough for `$route` to be instantiated _before_ the initial
   * `$locationChangeSuccess` event is fired. Eager instantiation ensures that `$route` is always
   * instantiated in time, regardless of when `ngView` will be loaded.
   *
   * The default value is true.
   *
   * **Note**:<br />
   * You may want to disable the default behavior when unit-testing modules that depend on
   * `ngRoute`, in order to avoid an unexpected request for the default route's template.
   *
   * @param {boolean=} enabled - If provided, update the internal `eagerInstantiationEnabled` flag.
   *
   * @returns {*} The current value of the `eagerInstantiationEnabled` flag if used as a getter or
   *     itself (for chaining) if used as a setter.
   */
  isEagerInstantiationEnabled = true;
  this.eagerInstantiationEnabled = function eagerInstantiationEnabled(enabled) {
    if (isDefined(enabled)) {
      isEagerInstantiationEnabled = enabled;
      return this;
    }

    return isEagerInstantiationEnabled;
  };


  this.$get = ['$rootScope',
               '$location',
               '$routeParams',
               '$q',
               '$injector',
               '$templateRequest',
               '$sce',
               '$browser',
      function($rootScope, $location, $routeParams, $q, $injector, $templateRequest, $sce, $browser) {

    /**
     * @ngdoc service
     * @name $route
     * @requires $location
     * @requires $routeParams
     *
     * @property {Object} current Reference to the current route definition.
     * The route definition contains:
     *
     *   - `controller`: The controller constructor as defined in the route definition.
     *   - `locals`: A map of locals which is used by {@link ng.$controller $controller} service for
     *     controller instantiation. The `locals` contain
     *     the resolved values of the `resolve` map. Additionally the `locals` also contain:
     *
     *     - `$scope` - The current route scope.
     *     - `$template` - The current route template HTML.
     *
     *     The `locals` will be assigned to the route scope's `$resolve` property. You can override
     *     the property name, using `resolveAs` in the route definition. See
     *     {@link ngRoute.$routeProvider $routeProvider} for more info.
     *
     * @property {Object} routes Object with all route configuration Objects as its properties.
     *
     * @description
     * `$route` is used for deep-linking URLs to controllers and views (HTML partials).
     * It watches `$location.url()` and tries to map the path to an existing route definition.
     *
     * Requires the {@link ngRoute `ngRoute`} module to be installed.
     *
     * You can define routes through {@link ngRoute.$routeProvider $routeProvider}'s API.
     *
     * The `$route` service is typically used in conjunction with the
     * {@link ngRoute.directive:ngView `ngView`} directive and the
     * {@link ngRoute.$routeParams `$routeParams`} service.
     *
     * @example
     * This example shows how changing the URL hash causes the `$route` to match a route against the
     * URL, and the `ngView` pulls in the partial.
     *
     * <example name="$route-service" module="ngRouteExample"
     *          deps="angular-route.js" fixBase="true">
     *   <file name="index.html">
     *     <div ng-controller="MainController">
     *       Choose:
     *       <a href="Book/Moby">Moby</a> |
     *       <a href="Book/Moby/ch/1">Moby: Ch1</a> |
     *       <a href="Book/Gatsby">Gatsby</a> |
     *       <a href="Book/Gatsby/ch/4?key=value">Gatsby: Ch4</a> |
     *       <a href="Book/Scarlet">Scarlet Letter</a><br/>
     *
     *       <div ng-view></div>
     *
     *       <hr />
     *
     *       <pre>$location.path() = {{$location.path()}}</pre>
     *       <pre>$route.current.templateUrl = {{$route.current.templateUrl}}</pre>
     *       <pre>$route.current.params = {{$route.current.params}}</pre>
     *       <pre>$route.current.scope.name = {{$route.current.scope.name}}</pre>
     *       <pre>$routeParams = {{$routeParams}}</pre>
     *     </div>
     *   </file>
     *
     *   <file name="book.html">
     *     controller: {{name}}<br />
     *     Book Id: {{params.bookId}}<br />
     *   </file>
     *
     *   <file name="chapter.html">
     *     controller: {{name}}<br />
     *     Book Id: {{params.bookId}}<br />
     *     Chapter Id: {{params.chapterId}}
     *   </file>
     *
     *   <file name="script.js">
     *     angular.module('ngRouteExample', ['ngRoute'])
     *
     *      .controller('MainController', function($scope, $route, $routeParams, $location) {
     *          $scope.$route = $route;
     *          $scope.$location = $location;
     *          $scope.$routeParams = $routeParams;
     *      })
     *
     *      .controller('BookController', function($scope, $routeParams) {
     *          $scope.name = 'BookController';
     *          $scope.params = $routeParams;
     *      })
     *
     *      .controller('ChapterController', function($scope, $routeParams) {
     *          $scope.name = 'ChapterController';
     *          $scope.params = $routeParams;
     *      })
     *
     *     .config(function($routeProvider, $locationProvider) {
     *       $routeProvider
     *        .when('/Book/:bookId', {
     *         templateUrl: 'book.html',
     *         controller: 'BookController',
     *         resolve: {
     *           // I will cause a 1 second delay
     *           delay: function($q, $timeout) {
     *             var delay = $q.defer();
     *             $timeout(delay.resolve, 1000);
     *             return delay.promise;
     *           }
     *         }
     *       })
     *       .when('/Book/:bookId/ch/:chapterId', {
     *         templateUrl: 'chapter.html',
     *         controller: 'ChapterController'
     *       });
     *
     *       // configure html5 to get links working on jsfiddle
     *       $locationProvider.html5Mode(true);
     *     });
     *
     *   </file>
     *
     *   <file name="protractor.js" type="protractor">
     *     it('should load and compile correct template', function() {
     *       element(by.linkText('Moby: Ch1')).click();
     *       var content = element(by.css('[ng-view]')).getText();
     *       expect(content).toMatch(/controller: ChapterController/);
     *       expect(content).toMatch(/Book Id: Moby/);
     *       expect(content).toMatch(/Chapter Id: 1/);
     *
     *       element(by.partialLinkText('Scarlet')).click();
     *
     *       content = element(by.css('[ng-view]')).getText();
     *       expect(content).toMatch(/controller: BookController/);
     *       expect(content).toMatch(/Book Id: Scarlet/);
     *     });
     *   </file>
     * </example>
     */

    /**
     * @ngdoc event
     * @name $route#$routeChangeStart
     * @eventType broadcast on root scope
     * @description
     * Broadcasted before a route change. At this  point the route services starts
     * resolving all of the dependencies needed for the route change to occur.
     * Typically this involves fetching the view template as well as any dependencies
     * defined in `resolve` route property. Once  all of the dependencies are resolved
     * `$routeChangeSuccess` is fired.
     *
     * The route change (and the `$location` change that triggered it) can be prevented
     * by calling `preventDefault` method of the event. See {@link ng.$rootScope.Scope#$on}
     * for more details about event object.
     *
     * @param {Object} angularEvent Synthetic event object.
     * @param {Route} next Future route information.
     * @param {Route} current Current route information.
     */

    /**
     * @ngdoc event
     * @name $route#$routeChangeSuccess
     * @eventType broadcast on root scope
     * @description
     * Broadcasted after a route change has happened successfully.
     * The `resolve` dependencies are now available in the `current.locals` property.
     *
     * {@link ngRoute.directive:ngView ngView} listens for the directive
     * to instantiate the controller and render the view.
     *
     * @param {Object} angularEvent Synthetic event object.
     * @param {Route} current Current route information.
     * @param {Route|Undefined} previous Previous route information, or undefined if current is
     * first route entered.
     */

    /**
     * @ngdoc event
     * @name $route#$routeChangeError
     * @eventType broadcast on root scope
     * @description
     * Broadcasted if a redirection function fails or any redirection or resolve promises are
     * rejected.
     *
     * @param {Object} angularEvent Synthetic event object
     * @param {Route} current Current route information.
     * @param {Route} previous Previous route information.
     * @param {Route} rejection The thrown error or the rejection reason of the promise. Usually
     * the rejection reason is the error that caused the promise to get rejected.
     */

    /**
     * @ngdoc event
     * @name $route#$routeUpdate
     * @eventType broadcast on root scope
     * @description
     * The `reloadOnSearch` property has been set to false, and we are reusing the same
     * instance of the Controller.
     *
     * @param {Object} angularEvent Synthetic event object
     * @param {Route} current Current/previous route information.
     */

    var forceReload = false,
        preparedRoute,
        preparedRouteIsUpdateOnly,
        $route = {
          routes: routes,

          /**
           * @ngdoc method
           * @name $route#reload
           *
           * @description
           * Causes `$route` service to reload the current route even if
           * {@link ng.$location $location} hasn't changed.
           *
           * As a result of that, {@link ngRoute.directive:ngView ngView}
           * creates new scope and reinstantiates the controller.
           */
          reload: function() {
            forceReload = true;

            var fakeLocationEvent = {
              defaultPrevented: false,
              preventDefault: function fakePreventDefault() {
                this.defaultPrevented = true;
                forceReload = false;
              }
            };

            $rootScope.$evalAsync(function() {
              prepareRoute(fakeLocationEvent);
              if (!fakeLocationEvent.defaultPrevented) commitRoute();
            });
          },

          /**
           * @ngdoc method
           * @name $route#updateParams
           *
           * @description
           * Causes `$route` service to update the current URL, replacing
           * current route parameters with those specified in `newParams`.
           * Provided property names that match the route's path segment
           * definitions will be interpolated into the location's path, while
           * remaining properties will be treated as query params.
           *
           * @param {!Object<string, string>} newParams mapping of URL parameter names to values
           */
          updateParams: function(newParams) {
            if (this.current && this.current.$$route) {
              newParams = angular.extend({}, this.current.params, newParams);
              $location.path(interpolate(this.current.$$route.originalPath, newParams));
              // interpolate modifies newParams, only query params are left
              $location.search(newParams);
            } else {
              throw $routeMinErr('norout', 'Tried updating route when with no current route');
            }
          }
        };

    $rootScope.$on('$locationChangeStart', prepareRoute);
    $rootScope.$on('$locationChangeSuccess', commitRoute);

    return $route;

    /////////////////////////////////////////////////////

    /**
     * @param on {string} current url
     * @param route {Object} route regexp to match the url against
     * @return {?Object}
     *
     * @description
     * Check if the route matches the current url.
     *
     * Inspired by match in
     * visionmedia/express/lib/router/router.js.
     */
    function switchRouteMatcher(on, route) {
      var keys = route.keys,
          params = {};

      if (!route.regexp) return null;

      var m = route.regexp.exec(on);
      if (!m) return null;

      for (var i = 1, len = m.length; i < len; ++i) {
        var key = keys[i - 1];

        var val = m[i];

        if (key && val) {
          params[key.name] = val;
        }
      }
      return params;
    }

    function prepareRoute($locationEvent) {
      var lastRoute = $route.current;

      preparedRoute = parseRoute();
      preparedRouteIsUpdateOnly = preparedRoute && lastRoute && preparedRoute.$$route === lastRoute.$$route
          && angular.equals(preparedRoute.pathParams, lastRoute.pathParams)
          && !preparedRoute.reloadOnSearch && !forceReload;

      if (!preparedRouteIsUpdateOnly && (lastRoute || preparedRoute)) {
        if ($rootScope.$broadcast('$routeChangeStart', preparedRoute, lastRoute).defaultPrevented) {
          if ($locationEvent) {
            $locationEvent.preventDefault();
          }
        }
      }
    }

    function commitRoute() {
      var lastRoute = $route.current;
      var nextRoute = preparedRoute;

      if (preparedRouteIsUpdateOnly) {
        lastRoute.params = nextRoute.params;
        angular.copy(lastRoute.params, $routeParams);
        $rootScope.$broadcast('$routeUpdate', lastRoute);
      } else if (nextRoute || lastRoute) {
        forceReload = false;
        $route.current = nextRoute;

        var nextRoutePromise = $q.resolve(nextRoute);

        $browser.$$incOutstandingRequestCount();

        nextRoutePromise.
          then(getRedirectionData).
          then(handlePossibleRedirection).
          then(function(keepProcessingRoute) {
            return keepProcessingRoute && nextRoutePromise.
              then(resolveLocals).
              then(function(locals) {
                // after route change
                if (nextRoute === $route.current) {
                  if (nextRoute) {
                    nextRoute.locals = locals;
                    angular.copy(nextRoute.params, $routeParams);
                  }
                  $rootScope.$broadcast('$routeChangeSuccess', nextRoute, lastRoute);
                }
              });
          }).catch(function(error) {
            if (nextRoute === $route.current) {
              $rootScope.$broadcast('$routeChangeError', nextRoute, lastRoute, error);
            }
          }).finally(function() {
            // Because `commitRoute()` is called from a `$rootScope.$evalAsync` block (see
            // `$locationWatch`), this `$$completeOutstandingRequest()` call will not cause
            // `outstandingRequestCount` to hit zero.  This is important in case we are redirecting
            // to a new route which also requires some asynchronous work.

            $browser.$$completeOutstandingRequest(noop);
          });
      }
    }

    function getRedirectionData(route) {
      var data = {
        route: route,
        hasRedirection: false
      };

      if (route) {
        if (route.redirectTo) {
          if (angular.isString(route.redirectTo)) {
            data.path = interpolate(route.redirectTo, route.params);
            data.search = route.params;
            data.hasRedirection = true;
          } else {
            var oldPath = $location.path();
            var oldSearch = $location.search();
            var newUrl = route.redirectTo(route.pathParams, oldPath, oldSearch);

            if (angular.isDefined(newUrl)) {
              data.url = newUrl;
              data.hasRedirection = true;
            }
          }
        } else if (route.resolveRedirectTo) {
          return $q.
            resolve($injector.invoke(route.resolveRedirectTo)).
            then(function(newUrl) {
              if (angular.isDefined(newUrl)) {
                data.url = newUrl;
                data.hasRedirection = true;
              }

              return data;
            });
        }
      }

      return data;
    }

    function handlePossibleRedirection(data) {
      var keepProcessingRoute = true;

      if (data.route !== $route.current) {
        keepProcessingRoute = false;
      } else if (data.hasRedirection) {
        var oldUrl = $location.url();
        var newUrl = data.url;

        if (newUrl) {
          $location.
            url(newUrl).
            replace();
        } else {
          newUrl = $location.
            path(data.path).
            search(data.search).
            replace().
            url();
        }

        if (newUrl !== oldUrl) {
          // Exit out and don't process current next value,
          // wait for next location change from redirect
          keepProcessingRoute = false;
        }
      }

      return keepProcessingRoute;
    }

    function resolveLocals(route) {
      if (route) {
        var locals = angular.extend({}, route.resolve);
        angular.forEach(locals, function(value, key) {
          locals[key] = angular.isString(value) ?
              $injector.get(value) :
              $injector.invoke(value, null, null, key);
        });
        var template = getTemplateFor(route);
        if (angular.isDefined(template)) {
          locals['$template'] = template;
        }
        return $q.all(locals);
      }
    }

    function getTemplateFor(route) {
      var template, templateUrl;
      if (angular.isDefined(template = route.template)) {
        if (angular.isFunction(template)) {
          template = template(route.params);
        }
      } else if (angular.isDefined(templateUrl = route.templateUrl)) {
        if (angular.isFunction(templateUrl)) {
          templateUrl = templateUrl(route.params);
        }
        if (angular.isDefined(templateUrl)) {
          route.loadedTemplateUrl = $sce.valueOf(templateUrl);
          template = $templateRequest(templateUrl);
        }
      }
      return template;
    }

    /**
     * @returns {Object} the current active route, by matching it against the URL
     */
    function parseRoute() {
      // Match a route
      var params, match;
      angular.forEach(routes, function(route, path) {
        if (!match && (params = switchRouteMatcher($location.path(), route))) {
          match = inherit(route, {
            params: angular.extend({}, $location.search(), params),
            pathParams: params});
          match.$$route = route;
        }
      });
      // No route matched; fallback to "otherwise" route
      return match || routes[null] && inherit(routes[null], {params: {}, pathParams:{}});
    }

    /**
     * @returns {string} interpolation of the redirect path with the parameters
     */
    function interpolate(string, params) {
      var result = [];
      angular.forEach((string || '').split(':'), function(segment, i) {
        if (i === 0) {
          result.push(segment);
        } else {
          var segmentMatch = segment.match(/(\w+)(?:[?*])?(.*)/);
          var key = segmentMatch[1];
          result.push(params[key]);
          result.push(segmentMatch[2] || '');
          delete params[key];
        }
      });
      return result.join('');
    }
  }];
}

instantiateRoute.$inject = ['$injector'];
function instantiateRoute($injector) {
  if (isEagerInstantiationEnabled) {
    // Instantiate `$route`
    $injector.get('$route');
  }
}

ngRouteModule.provider('$routeParams', $RouteParamsProvider);


/**
 * @ngdoc service
 * @name $routeParams
 * @requires $route
 * @this
 *
 * @description
 * The `$routeParams` service allows you to retrieve the current set of route parameters.
 *
 * Requires the {@link ngRoute `ngRoute`} module to be installed.
 *
 * The route parameters are a combination of {@link ng.$location `$location`}'s
 * {@link ng.$location#search `search()`} and {@link ng.$location#path `path()`}.
 * The `path` parameters are extracted when the {@link ngRoute.$route `$route`} path is matched.
 *
 * In case of parameter name collision, `path` params take precedence over `search` params.
 *
 * The service guarantees that the identity of the `$routeParams` object will remain unchanged
 * (but its properties will likely change) even when a route change occurs.
 *
 * Note that the `$routeParams` are only updated *after* a route change completes successfully.
 * This means that you cannot rely on `$routeParams` being correct in route resolve functions.
 * Instead you can use `$route.current.params` to access the new route's parameters.
 *
 * @example
 * ```js
 *  // Given:
 *  // URL: http://server.com/index.html#/Chapter/1/Section/2?search=moby
 *  // Route: /Chapter/:chapterId/Section/:sectionId
 *  //
 *  // Then
 *  $routeParams ==> {chapterId:'1', sectionId:'2', search:'moby'}
 * ```
 */
function $RouteParamsProvider() {
  this.$get = function() { return {}; };
}

ngRouteModule.directive('ngView', ngViewFactory);
ngRouteModule.directive('ngView', ngViewFillContentFactory);


/**
 * @ngdoc directive
 * @name ngView
 * @restrict ECA
 *
 * @description
 * `ngView` is a directive that complements the {@link ngRoute.$route $route} service by
 * including the rendered template of the current route into the main layout (`index.html`) file.
 * Every time the current route changes, the included view changes with it according to the
 * configuration of the `$route` service.
 *
 * Requires the {@link ngRoute `ngRoute`} module to be installed.
 *
 * @animations
 * | Animation                        | Occurs                              |
 * |----------------------------------|-------------------------------------|
 * | {@link ng.$animate#enter enter}  | when the new element is inserted to the DOM |
 * | {@link ng.$animate#leave leave}  | when the old element is removed from to the DOM  |
 *
 * The enter and leave animation occur concurrently.
 *
 * @scope
 * @priority 400
 * @param {string=} onload Expression to evaluate whenever the view updates.
 *
 * @param {string=} autoscroll Whether `ngView` should call {@link ng.$anchorScroll
 *                  $anchorScroll} to scroll the viewport after the view is updated.
 *
 *                  - If the attribute is not set, disable scrolling.
 *                  - If the attribute is set without value, enable scrolling.
 *                  - Otherwise enable scrolling only if the `autoscroll` attribute value evaluated
 *                    as an expression yields a truthy value.
 * @example
    <example name="ngView-directive" module="ngViewExample"
             deps="angular-route.js;angular-animate.js"
             animations="true" fixBase="true">
      <file name="index.html">
        <div ng-controller="MainCtrl as main">
          Choose:
          <a href="Book/Moby">Moby</a> |
          <a href="Book/Moby/ch/1">Moby: Ch1</a> |
          <a href="Book/Gatsby">Gatsby</a> |
          <a href="Book/Gatsby/ch/4?key=value">Gatsby: Ch4</a> |
          <a href="Book/Scarlet">Scarlet Letter</a><br/>

          <div class="view-animate-container">
            <div ng-view class="view-animate"></div>
          </div>
          <hr />

          <pre>$location.path() = {{main.$location.path()}}</pre>
          <pre>$route.current.templateUrl = {{main.$route.current.templateUrl}}</pre>
          <pre>$route.current.params = {{main.$route.current.params}}</pre>
          <pre>$routeParams = {{main.$routeParams}}</pre>
        </div>
      </file>

      <file name="book.html">
        <div>
          controller: {{book.name}}<br />
          Book Id: {{book.params.bookId}}<br />
        </div>
      </file>

      <file name="chapter.html">
        <div>
          controller: {{chapter.name}}<br />
          Book Id: {{chapter.params.bookId}}<br />
          Chapter Id: {{chapter.params.chapterId}}
        </div>
      </file>

      <file name="animations.css">
        .view-animate-container {
          position:relative;
          height:100px!important;
          background:white;
          border:1px solid black;
          height:40px;
          overflow:hidden;
        }

        .view-animate {
          padding:10px;
        }

        .view-animate.ng-enter, .view-animate.ng-leave {
          transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 1.5s;

          display:block;
          width:100%;
          border-left:1px solid black;

          position:absolute;
          top:0;
          left:0;
          right:0;
          bottom:0;
          padding:10px;
        }

        .view-animate.ng-enter {
          left:100%;
        }
        .view-animate.ng-enter.ng-enter-active {
          left:0;
        }
        .view-animate.ng-leave.ng-leave-active {
          left:-100%;
        }
      </file>

      <file name="script.js">
        angular.module('ngViewExample', ['ngRoute', 'ngAnimate'])
          .config(['$routeProvider', '$locationProvider',
            function($routeProvider, $locationProvider) {
              $routeProvider
                .when('/Book/:bookId', {
                  templateUrl: 'book.html',
                  controller: 'BookCtrl',
                  controllerAs: 'book'
                })
                .when('/Book/:bookId/ch/:chapterId', {
                  templateUrl: 'chapter.html',
                  controller: 'ChapterCtrl',
                  controllerAs: 'chapter'
                });

              $locationProvider.html5Mode(true);
          }])
          .controller('MainCtrl', ['$route', '$routeParams', '$location',
            function MainCtrl($route, $routeParams, $location) {
              this.$route = $route;
              this.$location = $location;
              this.$routeParams = $routeParams;
          }])
          .controller('BookCtrl', ['$routeParams', function BookCtrl($routeParams) {
            this.name = 'BookCtrl';
            this.params = $routeParams;
          }])
          .controller('ChapterCtrl', ['$routeParams', function ChapterCtrl($routeParams) {
            this.name = 'ChapterCtrl';
            this.params = $routeParams;
          }]);

      </file>

      <file name="protractor.js" type="protractor">
        it('should load and compile correct template', function() {
          element(by.linkText('Moby: Ch1')).click();
          var content = element(by.css('[ng-view]')).getText();
          expect(content).toMatch(/controller: ChapterCtrl/);
          expect(content).toMatch(/Book Id: Moby/);
          expect(content).toMatch(/Chapter Id: 1/);

          element(by.partialLinkText('Scarlet')).click();

          content = element(by.css('[ng-view]')).getText();
          expect(content).toMatch(/controller: BookCtrl/);
          expect(content).toMatch(/Book Id: Scarlet/);
        });
      </file>
    </example>
 */


/**
 * @ngdoc event
 * @name ngView#$viewContentLoaded
 * @eventType emit on the current ngView scope
 * @description
 * Emitted every time the ngView content is reloaded.
 */
ngViewFactory.$inject = ['$route', '$anchorScroll', '$animate'];
function ngViewFactory($route, $anchorScroll, $animate) {
  return {
    restrict: 'ECA',
    terminal: true,
    priority: 400,
    transclude: 'element',
    link: function(scope, $element, attr, ctrl, $transclude) {
        var currentScope,
            currentElement,
            previousLeaveAnimation,
            autoScrollExp = attr.autoscroll,
            onloadExp = attr.onload || '';

        scope.$on('$routeChangeSuccess', update);
        update();

        function cleanupLastView() {
          if (previousLeaveAnimation) {
            $animate.cancel(previousLeaveAnimation);
            previousLeaveAnimation = null;
          }

          if (currentScope) {
            currentScope.$destroy();
            currentScope = null;
          }
          if (currentElement) {
            previousLeaveAnimation = $animate.leave(currentElement);
            previousLeaveAnimation.done(function(response) {
              if (response !== false) previousLeaveAnimation = null;
            });
            currentElement = null;
          }
        }

        function update() {
          var locals = $route.current && $route.current.locals,
              template = locals && locals.$template;

          if (angular.isDefined(template)) {
            var newScope = scope.$new();
            var current = $route.current;

            // Note: This will also link all children of ng-view that were contained in the original
            // html. If that content contains controllers, ... they could pollute/change the scope.
            // However, using ng-view on an element with additional content does not make sense...
            // Note: We can't remove them in the cloneAttchFn of $transclude as that
            // function is called before linking the content, which would apply child
            // directives to non existing elements.
            var clone = $transclude(newScope, function(clone) {
              $animate.enter(clone, null, currentElement || $element).done(function onNgViewEnter(response) {
                if (response !== false && angular.isDefined(autoScrollExp)
                  && (!autoScrollExp || scope.$eval(autoScrollExp))) {
                  $anchorScroll();
                }
              });
              cleanupLastView();
            });

            currentElement = clone;
            currentScope = current.scope = newScope;
            currentScope.$emit('$viewContentLoaded');
            currentScope.$eval(onloadExp);
          } else {
            cleanupLastView();
          }
        }
    }
  };
}

// This directive is called during the $transclude call of the first `ngView` directive.
// It will replace and compile the content of the element with the loaded template.
// We need this directive so that the element content is already filled when
// the link function of another directive on the same element as ngView
// is called.
ngViewFillContentFactory.$inject = ['$compile', '$controller', '$route'];
function ngViewFillContentFactory($compile, $controller, $route) {
  return {
    restrict: 'ECA',
    priority: -400,
    link: function(scope, $element) {
      var current = $route.current,
          locals = current.locals;

      $element.html(locals.$template);

      var link = $compile($element.contents());

      if (current.controller) {
        locals.$scope = scope;
        var controller = $controller(current.controller, locals);
        if (current.controllerAs) {
          scope[current.controllerAs] = controller;
        }
        $element.data('$ngControllerController', controller);
        $element.children().data('$ngControllerController', controller);
      }
      scope[current.resolveAs || '$resolve'] = locals;

      link(scope);
    }
  };
}


})(window, window.angular);


/***/ }),
/* 5 */,
/* 6 */,
/* 7 */
/***/ (function(module, exports) {

angular
    .module('hollywoodStars')
    .config(
        function( $routeProvider, $locationProvider ) {

            $routeProvider
                .when('/', {
                    templateUrl: '/assets/views/pages/home.template.html',
                    controller: 'homeController'
                })
                .when('/celebrity/add', {
                    templateUrl: '/assets/views/pages/add-celebrity.template.html',
                    controller: 'addCelebrityController'
                })
                .when('/celebrity/:name', {
                    templateUrl: '/assets/views/pages/celebrity.template.html',
                    controller: 'celebrityController'
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
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var angular = __webpack_require__(0);

angular.module('hollywoodStars')
       .service('CelebritiesService', __webpack_require__(10));

/***/ }),
/* 9 */,
/* 10 */
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
    ]

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

        add: function (celebrity) {
            celebrities.push( celebrity );
        },
    }

    return service;
};

module.exports = CelebritiesService;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var angular = __webpack_require__(0);

angular.module('hollywoodStars')
    .controller('homeController', __webpack_require__(12))
    .controller('celebrityController', __webpack_require__(13))
    .controller('addCelebrityController', __webpack_require__(14));

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function homeController( $scope, CelebritiesService ) {
    $scope.title = 'Top Celebrities:';

    $scope.celebrityList = CelebritiesService.getCelebrities();
}

module.exports = homeController;

/***/ }),
/* 13 */
/***/ (function(module, exports) {

function celebrityController( $scope, $routeParams, CelebritiesService ) {

    $scope.celebrityList = CelebritiesService.getCelebrities();
    $scope.celebrityName = CelebritiesService.toCapitalize( $routeParams.name );

    $scope.celebrityList.map( function( celebrity ) {
        if ( celebrity.name == $scope.celebrityName ) {
            $scope.celebrity = celebrity;
        }
    });
}

module.exports = celebrityController;

/***/ }),
/* 14 */
/***/ (function(module, exports) {

function addCelebrityController( $scope, $routeParams, CelebritiesService ) {

    $scope.celebrities = CelebritiesService.getCelebrities();

    $scope.celebrity = {
        name: '',
        description: '',
        image: ''
    }

    $scope.add = function () {
        $scope.celebrity.id = $scope.celebrities.length;
        $scope.celebrity.urlName = CelebritiesService.toUrl( $scope.celebrity.name );

        console.log('celebrity to add ->', $scope.celebrity);

        CelebritiesService.add($scope.celebrity);
        console.log(CelebritiesService.getCelebrities())
    }
    
}

module.exports = addCelebrityController;

/***/ }),
/* 15 */
/***/ (function(module, exports) {

function appHeaderController ($scope, $element, $attrs) {
    $scope.navLinks = {
        home: {
            name: 'Home',
            link: '/'
        },
        celebrities: {
            name: 'Celebrities',
            link: 'celebrities/list'
        }
    }
}

angular.module('hollywoodStars').component('appHeader', {
    templateUrl: '/assets/views/partials/app-header.template.html',
    controller: appHeaderController,
    bindings: {
        title: '@',
        description: '@'
    }
});



/***/ }),
/* 16 */
/***/ (function(module, exports) {

function appNavController ($scope, $element, $attrs) {
    $scope.navLinks = {
        home: {
            name: 'Home',
            link: '/'
        },
        celebrities: {
            name: 'Celebrities',
            link: 'celebrities/list'
        },
        add: {
            name: 'Add',
            link: 'celebrity/add'
        }
    }
}

angular.module('hollywoodStars').component('appNav', {
    templateUrl: '/assets/views/partials/app-nav.template.html',
    controller: appNavController
});



/***/ }),
/* 17 */
/***/ (function(module, exports) {

function celebrityCardController ($scope, $element, $attrs) {
    
}

angular.module('hollywoodStars').component('cardCelebrity', {
    templateUrl: '/assets/views/components/celebrity-card.template.html',
    controller: celebrityCardController,
    bindings: {
        celebrity: '<'
    }
});



/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "../css/main.css";

/***/ })
],[1]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvYXBwL2FwcC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYW5ndWxhci1yb3V0ZS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYW5ndWxhci1yb3V0ZS9hbmd1bGFyLXJvdXRlLmpzIiwid2VicGFjazovLy8uL3NyYy9hcHAvYXBwLmNvbmZpZy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwL3NlcnZpY2VzL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9hcHAvc2VydmljZXMvY2VsZWJyaXRpZXMuc2VydmljZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwL2NvbnRyb2xsZXJzL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9hcHAvY29udHJvbGxlcnMvaG9tZS5jb250cm9sbGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9hcHAvY29udHJvbGxlcnMvY2VsZWJyaXR5LmNvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC9jb250cm9sbGVycy9hZGQtY2VsZWJyaXR5LmNvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC9jb21wb25lbnRzL2FwcC1oZWFkZXIvYXBwLWhlYWRlci5jb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC9jb21wb25lbnRzL2FwcC1uYXYvYXBwLW5hdi5jb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC9jb21wb25lbnRzL2NlbGVicml0eS9jZWxlYnJpdHktY2FyZC5jb21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC9zdHlsZXMvbWFpbi5sZXNzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7O0FDZEE7QUFDQTs7Ozs7OztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBLHFDOzs7Ozs7QUNaQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsd0M7Ozs7OztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7Ozs7Ozs7O0FDcEJEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOzs7Ozs7OztBQ3BCRDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOzs7Ozs7OztBQ1ZELDJEIiwiZmlsZSI6ImFwcC5idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCdhbmd1bGFyLXJvdXRlJyk7XG5cbmFuZ3VsYXIubW9kdWxlKCdob2xseXdvb2RTdGFycycsIFtcbiAgICAnbmdSb3V0ZSdcbl0pO1xuXG5yZXF1aXJlKCcuL2FwcC5jb25maWcnKTtcblxucmVxdWlyZSgnLi9zZXJ2aWNlcy8nKVxuXG5yZXF1aXJlKCcuL2NvbnRyb2xsZXJzJyk7XG5cbnJlcXVpcmUoJy4vY29tcG9uZW50cy9hcHAtaGVhZGVyL2FwcC1oZWFkZXIuY29tcG9uZW50Jyk7XG5yZXF1aXJlKCcuL2NvbXBvbmVudHMvYXBwLW5hdi9hcHAtbmF2LmNvbXBvbmVudCcpO1xucmVxdWlyZSgnLi9jb21wb25lbnRzL2NlbGVicml0eS9jZWxlYnJpdHktY2FyZC5jb21wb25lbnQnKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2FwcC9hcHAuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwicmVxdWlyZSgnLi9hbmd1bGFyLXJvdXRlJyk7XG5tb2R1bGUuZXhwb3J0cyA9ICduZ1JvdXRlJztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2FuZ3VsYXItcm91dGUvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXG4gKiBAbGljZW5zZSBBbmd1bGFySlMgdjEuNi44XG4gKiAoYykgMjAxMC0yMDE3IEdvb2dsZSwgSW5jLiBodHRwOi8vYW5ndWxhcmpzLm9yZ1xuICogTGljZW5zZTogTUlUXG4gKi9cbihmdW5jdGlvbih3aW5kb3csIGFuZ3VsYXIpIHsndXNlIHN0cmljdCc7XG5cbi8qIGdsb2JhbCBzaGFsbG93Q29weTogdHJ1ZSAqL1xuXG4vKipcbiAqIENyZWF0ZXMgYSBzaGFsbG93IGNvcHkgb2YgYW4gb2JqZWN0LCBhbiBhcnJheSBvciBhIHByaW1pdGl2ZS5cbiAqXG4gKiBBc3N1bWVzIHRoYXQgdGhlcmUgYXJlIG5vIHByb3RvIHByb3BlcnRpZXMgZm9yIG9iamVjdHMuXG4gKi9cbmZ1bmN0aW9uIHNoYWxsb3dDb3B5KHNyYywgZHN0KSB7XG4gIGlmIChpc0FycmF5KHNyYykpIHtcbiAgICBkc3QgPSBkc3QgfHwgW107XG5cbiAgICBmb3IgKHZhciBpID0gMCwgaWkgPSBzcmMubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgZHN0W2ldID0gc3JjW2ldO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc09iamVjdChzcmMpKSB7XG4gICAgZHN0ID0gZHN0IHx8IHt9O1xuXG4gICAgZm9yICh2YXIga2V5IGluIHNyYykge1xuICAgICAgaWYgKCEoa2V5LmNoYXJBdCgwKSA9PT0gJyQnICYmIGtleS5jaGFyQXQoMSkgPT09ICckJykpIHtcbiAgICAgICAgZHN0W2tleV0gPSBzcmNba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gZHN0IHx8IHNyYztcbn1cblxuLyogZ2xvYmFsIHNoYWxsb3dDb3B5OiBmYWxzZSAqL1xuXG4vLyBgaXNBcnJheWAgYW5kIGBpc09iamVjdGAgYXJlIG5lY2Vzc2FyeSBmb3IgYHNoYWxsb3dDb3B5KClgIChpbmNsdWRlZCB2aWEgYHNyYy9zaGFsbG93Q29weS5qc2ApLlxuLy8gVGhleSBhcmUgaW5pdGlhbGl6ZWQgaW5zaWRlIHRoZSBgJFJvdXRlUHJvdmlkZXJgLCB0byBlbnN1cmUgYHdpbmRvdy5hbmd1bGFyYCBpcyBhdmFpbGFibGUuXG52YXIgaXNBcnJheTtcbnZhciBpc09iamVjdDtcbnZhciBpc0RlZmluZWQ7XG52YXIgbm9vcDtcblxuLyoqXG4gKiBAbmdkb2MgbW9kdWxlXG4gKiBAbmFtZSBuZ1JvdXRlXG4gKiBAZGVzY3JpcHRpb25cbiAqXG4gKiBUaGUgYG5nUm91dGVgIG1vZHVsZSBwcm92aWRlcyByb3V0aW5nIGFuZCBkZWVwbGlua2luZyBzZXJ2aWNlcyBhbmQgZGlyZWN0aXZlcyBmb3IgQW5ndWxhckpTIGFwcHMuXG4gKlxuICogIyMgRXhhbXBsZVxuICogU2VlIHtAbGluayBuZ1JvdXRlLiRyb3V0ZSNleGFtcGxlcyAkcm91dGV9IGZvciBhbiBleGFtcGxlIG9mIGNvbmZpZ3VyaW5nIGFuZCB1c2luZyBgbmdSb3V0ZWAuXG4gKlxuICovXG4vKiBnbG9iYWwgLW5nUm91dGVNb2R1bGUgKi9cbnZhciBuZ1JvdXRlTW9kdWxlID0gYW5ndWxhci5cbiAgbW9kdWxlKCduZ1JvdXRlJywgW10pLlxuICBpbmZvKHsgYW5ndWxhclZlcnNpb246ICcxLjYuOCcgfSkuXG4gIHByb3ZpZGVyKCckcm91dGUnLCAkUm91dGVQcm92aWRlcikuXG4gIC8vIEVuc3VyZSBgJHJvdXRlYCB3aWxsIGJlIGluc3RhbnRpYXRlZCBpbiB0aW1lIHRvIGNhcHR1cmUgdGhlIGluaXRpYWwgYCRsb2NhdGlvbkNoYW5nZVN1Y2Nlc3NgXG4gIC8vIGV2ZW50ICh1bmxlc3MgZXhwbGljaXRseSBkaXNhYmxlZCkuIFRoaXMgaXMgbmVjZXNzYXJ5IGluIGNhc2UgYG5nVmlld2AgaXMgaW5jbHVkZWQgaW4gYW5cbiAgLy8gYXN5bmNocm9ub3VzbHkgbG9hZGVkIHRlbXBsYXRlLlxuICBydW4oaW5zdGFudGlhdGVSb3V0ZSk7XG52YXIgJHJvdXRlTWluRXJyID0gYW5ndWxhci4kJG1pbkVycignbmdSb3V0ZScpO1xudmFyIGlzRWFnZXJJbnN0YW50aWF0aW9uRW5hYmxlZDtcblxuXG4vKipcbiAqIEBuZ2RvYyBwcm92aWRlclxuICogQG5hbWUgJHJvdXRlUHJvdmlkZXJcbiAqIEB0aGlzXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKlxuICogVXNlZCBmb3IgY29uZmlndXJpbmcgcm91dGVzLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIFNlZSB7QGxpbmsgbmdSb3V0ZS4kcm91dGUjZXhhbXBsZXMgJHJvdXRlfSBmb3IgYW4gZXhhbXBsZSBvZiBjb25maWd1cmluZyBhbmQgdXNpbmcgYG5nUm91dGVgLlxuICpcbiAqICMjIERlcGVuZGVuY2llc1xuICogUmVxdWlyZXMgdGhlIHtAbGluayBuZ1JvdXRlIGBuZ1JvdXRlYH0gbW9kdWxlIHRvIGJlIGluc3RhbGxlZC5cbiAqL1xuZnVuY3Rpb24gJFJvdXRlUHJvdmlkZXIoKSB7XG4gIGlzQXJyYXkgPSBhbmd1bGFyLmlzQXJyYXk7XG4gIGlzT2JqZWN0ID0gYW5ndWxhci5pc09iamVjdDtcbiAgaXNEZWZpbmVkID0gYW5ndWxhci5pc0RlZmluZWQ7XG4gIG5vb3AgPSBhbmd1bGFyLm5vb3A7XG5cbiAgZnVuY3Rpb24gaW5oZXJpdChwYXJlbnQsIGV4dHJhKSB7XG4gICAgcmV0dXJuIGFuZ3VsYXIuZXh0ZW5kKE9iamVjdC5jcmVhdGUocGFyZW50KSwgZXh0cmEpO1xuICB9XG5cbiAgdmFyIHJvdXRlcyA9IHt9O1xuXG4gIC8qKlxuICAgKiBAbmdkb2MgbWV0aG9kXG4gICAqIEBuYW1lICRyb3V0ZVByb3ZpZGVyI3doZW5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGggUm91dGUgcGF0aCAobWF0Y2hlZCBhZ2FpbnN0IGAkbG9jYXRpb24ucGF0aGApLiBJZiBgJGxvY2F0aW9uLnBhdGhgXG4gICAqICAgIGNvbnRhaW5zIHJlZHVuZGFudCB0cmFpbGluZyBzbGFzaCBvciBpcyBtaXNzaW5nIG9uZSwgdGhlIHJvdXRlIHdpbGwgc3RpbGwgbWF0Y2ggYW5kIHRoZVxuICAgKiAgICBgJGxvY2F0aW9uLnBhdGhgIHdpbGwgYmUgdXBkYXRlZCB0byBhZGQgb3IgZHJvcCB0aGUgdHJhaWxpbmcgc2xhc2ggdG8gZXhhY3RseSBtYXRjaCB0aGVcbiAgICogICAgcm91dGUgZGVmaW5pdGlvbi5cbiAgICpcbiAgICogICAgKiBgcGF0aGAgY2FuIGNvbnRhaW4gbmFtZWQgZ3JvdXBzIHN0YXJ0aW5nIHdpdGggYSBjb2xvbjogZS5nLiBgOm5hbWVgLiBBbGwgY2hhcmFjdGVycyB1cFxuICAgKiAgICAgICAgdG8gdGhlIG5leHQgc2xhc2ggYXJlIG1hdGNoZWQgYW5kIHN0b3JlZCBpbiBgJHJvdXRlUGFyYW1zYCB1bmRlciB0aGUgZ2l2ZW4gYG5hbWVgXG4gICAqICAgICAgICB3aGVuIHRoZSByb3V0ZSBtYXRjaGVzLlxuICAgKiAgICAqIGBwYXRoYCBjYW4gY29udGFpbiBuYW1lZCBncm91cHMgc3RhcnRpbmcgd2l0aCBhIGNvbG9uIGFuZCBlbmRpbmcgd2l0aCBhIHN0YXI6XG4gICAqICAgICAgICBlLmcuYDpuYW1lKmAuIEFsbCBjaGFyYWN0ZXJzIGFyZSBlYWdlcmx5IHN0b3JlZCBpbiBgJHJvdXRlUGFyYW1zYCB1bmRlciB0aGUgZ2l2ZW4gYG5hbWVgXG4gICAqICAgICAgICB3aGVuIHRoZSByb3V0ZSBtYXRjaGVzLlxuICAgKiAgICAqIGBwYXRoYCBjYW4gY29udGFpbiBvcHRpb25hbCBuYW1lZCBncm91cHMgd2l0aCBhIHF1ZXN0aW9uIG1hcms6IGUuZy5gOm5hbWU/YC5cbiAgICpcbiAgICogICAgRm9yIGV4YW1wbGUsIHJvdXRlcyBsaWtlIGAvY29sb3IvOmNvbG9yL2xhcmdlY29kZS86bGFyZ2Vjb2RlKlxcL2VkaXRgIHdpbGwgbWF0Y2hcbiAgICogICAgYC9jb2xvci9icm93bi9sYXJnZWNvZGUvY29kZS93aXRoL3NsYXNoZXMvZWRpdGAgYW5kIGV4dHJhY3Q6XG4gICAqXG4gICAqICAgICogYGNvbG9yOiBicm93bmBcbiAgICogICAgKiBgbGFyZ2Vjb2RlOiBjb2RlL3dpdGgvc2xhc2hlc2AuXG4gICAqXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSByb3V0ZSBNYXBwaW5nIGluZm9ybWF0aW9uIHRvIGJlIGFzc2lnbmVkIHRvIGAkcm91dGUuY3VycmVudGAgb24gcm91dGVcbiAgICogICAgbWF0Y2guXG4gICAqXG4gICAqICAgIE9iamVjdCBwcm9wZXJ0aWVzOlxuICAgKlxuICAgKiAgICAtIGBjb250cm9sbGVyYCDigJMgYHsoc3RyaW5nfEZ1bmN0aW9uKT19YCDigJMgQ29udHJvbGxlciBmbiB0aGF0IHNob3VsZCBiZSBhc3NvY2lhdGVkIHdpdGhcbiAgICogICAgICBuZXdseSBjcmVhdGVkIHNjb3BlIG9yIHRoZSBuYW1lIG9mIGEge0BsaW5rIGFuZ3VsYXIuTW9kdWxlI2NvbnRyb2xsZXIgcmVnaXN0ZXJlZFxuICAgKiAgICAgIGNvbnRyb2xsZXJ9IGlmIHBhc3NlZCBhcyBhIHN0cmluZy5cbiAgICogICAgLSBgY29udHJvbGxlckFzYCDigJMgYHtzdHJpbmc9fWAg4oCTIEFuIGlkZW50aWZpZXIgbmFtZSBmb3IgYSByZWZlcmVuY2UgdG8gdGhlIGNvbnRyb2xsZXIuXG4gICAqICAgICAgSWYgcHJlc2VudCwgdGhlIGNvbnRyb2xsZXIgd2lsbCBiZSBwdWJsaXNoZWQgdG8gc2NvcGUgdW5kZXIgdGhlIGBjb250cm9sbGVyQXNgIG5hbWUuXG4gICAqICAgIC0gYHRlbXBsYXRlYCDigJMgYHsoc3RyaW5nfEZ1bmN0aW9uKT19YCDigJMgaHRtbCB0ZW1wbGF0ZSBhcyBhIHN0cmluZyBvciBhIGZ1bmN0aW9uIHRoYXRcbiAgICogICAgICByZXR1cm5zIGFuIGh0bWwgdGVtcGxhdGUgYXMgYSBzdHJpbmcgd2hpY2ggc2hvdWxkIGJlIHVzZWQgYnkge0BsaW5rXG4gICAqICAgICAgbmdSb3V0ZS5kaXJlY3RpdmU6bmdWaWV3IG5nVmlld30gb3Ige0BsaW5rIG5nLmRpcmVjdGl2ZTpuZ0luY2x1ZGUgbmdJbmNsdWRlfSBkaXJlY3RpdmVzLlxuICAgKiAgICAgIFRoaXMgcHJvcGVydHkgdGFrZXMgcHJlY2VkZW5jZSBvdmVyIGB0ZW1wbGF0ZVVybGAuXG4gICAqXG4gICAqICAgICAgSWYgYHRlbXBsYXRlYCBpcyBhIGZ1bmN0aW9uLCBpdCB3aWxsIGJlIGNhbGxlZCB3aXRoIHRoZSBmb2xsb3dpbmcgcGFyYW1ldGVyczpcbiAgICpcbiAgICogICAgICAtIGB7QXJyYXkuPE9iamVjdD59YCAtIHJvdXRlIHBhcmFtZXRlcnMgZXh0cmFjdGVkIGZyb20gdGhlIGN1cnJlbnRcbiAgICogICAgICAgIGAkbG9jYXRpb24ucGF0aCgpYCBieSBhcHBseWluZyB0aGUgY3VycmVudCByb3V0ZVxuICAgKlxuICAgKiAgICAgIE9uZSBvZiBgdGVtcGxhdGVgIG9yIGB0ZW1wbGF0ZVVybGAgaXMgcmVxdWlyZWQuXG4gICAqXG4gICAqICAgIC0gYHRlbXBsYXRlVXJsYCDigJMgYHsoc3RyaW5nfEZ1bmN0aW9uKT19YCDigJMgcGF0aCBvciBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBwYXRoIHRvIGFuIGh0bWxcbiAgICogICAgICB0ZW1wbGF0ZSB0aGF0IHNob3VsZCBiZSB1c2VkIGJ5IHtAbGluayBuZ1JvdXRlLmRpcmVjdGl2ZTpuZ1ZpZXcgbmdWaWV3fS5cbiAgICpcbiAgICogICAgICBJZiBgdGVtcGxhdGVVcmxgIGlzIGEgZnVuY3Rpb24sIGl0IHdpbGwgYmUgY2FsbGVkIHdpdGggdGhlIGZvbGxvd2luZyBwYXJhbWV0ZXJzOlxuICAgKlxuICAgKiAgICAgIC0gYHtBcnJheS48T2JqZWN0Pn1gIC0gcm91dGUgcGFyYW1ldGVycyBleHRyYWN0ZWQgZnJvbSB0aGUgY3VycmVudFxuICAgKiAgICAgICAgYCRsb2NhdGlvbi5wYXRoKClgIGJ5IGFwcGx5aW5nIHRoZSBjdXJyZW50IHJvdXRlXG4gICAqXG4gICAqICAgICAgT25lIG9mIGB0ZW1wbGF0ZVVybGAgb3IgYHRlbXBsYXRlYCBpcyByZXF1aXJlZC5cbiAgICpcbiAgICogICAgLSBgcmVzb2x2ZWAgLSBge09iamVjdC48c3RyaW5nLCBGdW5jdGlvbj49fWAgLSBBbiBvcHRpb25hbCBtYXAgb2YgZGVwZW5kZW5jaWVzIHdoaWNoIHNob3VsZFxuICAgKiAgICAgIGJlIGluamVjdGVkIGludG8gdGhlIGNvbnRyb2xsZXIuIElmIGFueSBvZiB0aGVzZSBkZXBlbmRlbmNpZXMgYXJlIHByb21pc2VzLCB0aGUgcm91dGVyXG4gICAqICAgICAgd2lsbCB3YWl0IGZvciB0aGVtIGFsbCB0byBiZSByZXNvbHZlZCBvciBvbmUgdG8gYmUgcmVqZWN0ZWQgYmVmb3JlIHRoZSBjb250cm9sbGVyIGlzXG4gICAqICAgICAgaW5zdGFudGlhdGVkLlxuICAgKiAgICAgIElmIGFsbCB0aGUgcHJvbWlzZXMgYXJlIHJlc29sdmVkIHN1Y2Nlc3NmdWxseSwgdGhlIHZhbHVlcyBvZiB0aGUgcmVzb2x2ZWQgcHJvbWlzZXMgYXJlXG4gICAqICAgICAgaW5qZWN0ZWQgYW5kIHtAbGluayBuZ1JvdXRlLiRyb3V0ZSMkcm91dGVDaGFuZ2VTdWNjZXNzICRyb3V0ZUNoYW5nZVN1Y2Nlc3N9IGV2ZW50IGlzXG4gICAqICAgICAgZmlyZWQuIElmIGFueSBvZiB0aGUgcHJvbWlzZXMgYXJlIHJlamVjdGVkIHRoZVxuICAgKiAgICAgIHtAbGluayBuZ1JvdXRlLiRyb3V0ZSMkcm91dGVDaGFuZ2VFcnJvciAkcm91dGVDaGFuZ2VFcnJvcn0gZXZlbnQgaXMgZmlyZWQuXG4gICAqICAgICAgRm9yIGVhc2llciBhY2Nlc3MgdG8gdGhlIHJlc29sdmVkIGRlcGVuZGVuY2llcyBmcm9tIHRoZSB0ZW1wbGF0ZSwgdGhlIGByZXNvbHZlYCBtYXAgd2lsbFxuICAgKiAgICAgIGJlIGF2YWlsYWJsZSBvbiB0aGUgc2NvcGUgb2YgdGhlIHJvdXRlLCB1bmRlciBgJHJlc29sdmVgIChieSBkZWZhdWx0KSBvciBhIGN1c3RvbSBuYW1lXG4gICAqICAgICAgc3BlY2lmaWVkIGJ5IHRoZSBgcmVzb2x2ZUFzYCBwcm9wZXJ0eSAoc2VlIGJlbG93KS4gVGhpcyBjYW4gYmUgcGFydGljdWxhcmx5IHVzZWZ1bCwgd2hlblxuICAgKiAgICAgIHdvcmtpbmcgd2l0aCB7QGxpbmsgYW5ndWxhci5Nb2R1bGUjY29tcG9uZW50IGNvbXBvbmVudHN9IGFzIHJvdXRlIHRlbXBsYXRlcy48YnIgLz5cbiAgICogICAgICA8ZGl2IGNsYXNzPVwiYWxlcnQgYWxlcnQtd2FybmluZ1wiPlxuICAgKiAgICAgICAgKipOb3RlOioqIElmIHlvdXIgc2NvcGUgYWxyZWFkeSBjb250YWlucyBhIHByb3BlcnR5IHdpdGggdGhpcyBuYW1lLCBpdCB3aWxsIGJlIGhpZGRlblxuICAgKiAgICAgICAgb3Igb3ZlcndyaXR0ZW4uIE1ha2Ugc3VyZSwgeW91IHNwZWNpZnkgYW4gYXBwcm9wcmlhdGUgbmFtZSBmb3IgdGhpcyBwcm9wZXJ0eSwgdGhhdFxuICAgKiAgICAgICAgZG9lcyBub3QgY29sbGlkZSB3aXRoIG90aGVyIHByb3BlcnRpZXMgb24gdGhlIHNjb3BlLlxuICAgKiAgICAgIDwvZGl2PlxuICAgKiAgICAgIFRoZSBtYXAgb2JqZWN0IGlzOlxuICAgKlxuICAgKiAgICAgIC0gYGtleWAg4oCTIGB7c3RyaW5nfWA6IGEgbmFtZSBvZiBhIGRlcGVuZGVuY3kgdG8gYmUgaW5qZWN0ZWQgaW50byB0aGUgY29udHJvbGxlci5cbiAgICogICAgICAtIGBmYWN0b3J5YCAtIGB7c3RyaW5nfEZ1bmN0aW9ufWA6IElmIGBzdHJpbmdgIHRoZW4gaXQgaXMgYW4gYWxpYXMgZm9yIGEgc2VydmljZS5cbiAgICogICAgICAgIE90aGVyd2lzZSBpZiBmdW5jdGlvbiwgdGhlbiBpdCBpcyB7QGxpbmsgYXV0by4kaW5qZWN0b3IjaW52b2tlIGluamVjdGVkfVxuICAgKiAgICAgICAgYW5kIHRoZSByZXR1cm4gdmFsdWUgaXMgdHJlYXRlZCBhcyB0aGUgZGVwZW5kZW5jeS4gSWYgdGhlIHJlc3VsdCBpcyBhIHByb21pc2UsIGl0IGlzXG4gICAqICAgICAgICByZXNvbHZlZCBiZWZvcmUgaXRzIHZhbHVlIGlzIGluamVjdGVkIGludG8gdGhlIGNvbnRyb2xsZXIuIEJlIGF3YXJlIHRoYXRcbiAgICogICAgICAgIGBuZ1JvdXRlLiRyb3V0ZVBhcmFtc2Agd2lsbCBzdGlsbCByZWZlciB0byB0aGUgcHJldmlvdXMgcm91dGUgd2l0aGluIHRoZXNlIHJlc29sdmVcbiAgICogICAgICAgIGZ1bmN0aW9ucy4gIFVzZSBgJHJvdXRlLmN1cnJlbnQucGFyYW1zYCB0byBhY2Nlc3MgdGhlIG5ldyByb3V0ZSBwYXJhbWV0ZXJzLCBpbnN0ZWFkLlxuICAgKlxuICAgKiAgICAtIGByZXNvbHZlQXNgIC0gYHtzdHJpbmc9fWAgLSBUaGUgbmFtZSB1bmRlciB3aGljaCB0aGUgYHJlc29sdmVgIG1hcCB3aWxsIGJlIGF2YWlsYWJsZSBvblxuICAgKiAgICAgIHRoZSBzY29wZSBvZiB0aGUgcm91dGUuIElmIG9taXR0ZWQsIGRlZmF1bHRzIHRvIGAkcmVzb2x2ZWAuXG4gICAqXG4gICAqICAgIC0gYHJlZGlyZWN0VG9gIOKAkyBgeyhzdHJpbmd8RnVuY3Rpb24pPX1gIOKAkyB2YWx1ZSB0byB1cGRhdGVcbiAgICogICAgICB7QGxpbmsgbmcuJGxvY2F0aW9uICRsb2NhdGlvbn0gcGF0aCB3aXRoIGFuZCB0cmlnZ2VyIHJvdXRlIHJlZGlyZWN0aW9uLlxuICAgKlxuICAgKiAgICAgIElmIGByZWRpcmVjdFRvYCBpcyBhIGZ1bmN0aW9uLCBpdCB3aWxsIGJlIGNhbGxlZCB3aXRoIHRoZSBmb2xsb3dpbmcgcGFyYW1ldGVyczpcbiAgICpcbiAgICogICAgICAtIGB7T2JqZWN0LjxzdHJpbmc+fWAgLSByb3V0ZSBwYXJhbWV0ZXJzIGV4dHJhY3RlZCBmcm9tIHRoZSBjdXJyZW50XG4gICAqICAgICAgICBgJGxvY2F0aW9uLnBhdGgoKWAgYnkgYXBwbHlpbmcgdGhlIGN1cnJlbnQgcm91dGUgdGVtcGxhdGVVcmwuXG4gICAqICAgICAgLSBge3N0cmluZ31gIC0gY3VycmVudCBgJGxvY2F0aW9uLnBhdGgoKWBcbiAgICogICAgICAtIGB7T2JqZWN0fWAgLSBjdXJyZW50IGAkbG9jYXRpb24uc2VhcmNoKClgXG4gICAqXG4gICAqICAgICAgVGhlIGN1c3RvbSBgcmVkaXJlY3RUb2AgZnVuY3Rpb24gaXMgZXhwZWN0ZWQgdG8gcmV0dXJuIGEgc3RyaW5nIHdoaWNoIHdpbGwgYmUgdXNlZFxuICAgKiAgICAgIHRvIHVwZGF0ZSBgJGxvY2F0aW9uLnVybCgpYC4gSWYgdGhlIGZ1bmN0aW9uIHRocm93cyBhbiBlcnJvciwgbm8gZnVydGhlciBwcm9jZXNzaW5nIHdpbGxcbiAgICogICAgICB0YWtlIHBsYWNlIGFuZCB0aGUge0BsaW5rIG5nUm91dGUuJHJvdXRlIyRyb3V0ZUNoYW5nZUVycm9yICRyb3V0ZUNoYW5nZUVycm9yfSBldmVudCB3aWxsXG4gICAqICAgICAgYmUgZmlyZWQuXG4gICAqXG4gICAqICAgICAgUm91dGVzIHRoYXQgc3BlY2lmeSBgcmVkaXJlY3RUb2Agd2lsbCBub3QgaGF2ZSB0aGVpciBjb250cm9sbGVycywgdGVtcGxhdGUgZnVuY3Rpb25zXG4gICAqICAgICAgb3IgcmVzb2x2ZXMgY2FsbGVkLCB0aGUgYCRsb2NhdGlvbmAgd2lsbCBiZSBjaGFuZ2VkIHRvIHRoZSByZWRpcmVjdCB1cmwgYW5kIHJvdXRlXG4gICAqICAgICAgcHJvY2Vzc2luZyB3aWxsIHN0b3AuIFRoZSBleGNlcHRpb24gdG8gdGhpcyBpcyBpZiB0aGUgYHJlZGlyZWN0VG9gIGlzIGEgZnVuY3Rpb24gdGhhdFxuICAgKiAgICAgIHJldHVybnMgYHVuZGVmaW5lZGAuIEluIHRoaXMgY2FzZSB0aGUgcm91dGUgdHJhbnNpdGlvbiBvY2N1cnMgYXMgdGhvdWdoIHRoZXJlIHdhcyBub1xuICAgKiAgICAgIHJlZGlyZWN0aW9uLlxuICAgKlxuICAgKiAgICAtIGByZXNvbHZlUmVkaXJlY3RUb2Ag4oCTIGB7RnVuY3Rpb249fWAg4oCTIGEgZnVuY3Rpb24gdGhhdCB3aWxsIChldmVudHVhbGx5KSByZXR1cm4gdGhlIHZhbHVlXG4gICAqICAgICAgdG8gdXBkYXRlIHtAbGluayBuZy4kbG9jYXRpb24gJGxvY2F0aW9ufSBVUkwgd2l0aCBhbmQgdHJpZ2dlciByb3V0ZSByZWRpcmVjdGlvbi4gSW5cbiAgICogICAgICBjb250cmFzdCB0byBgcmVkaXJlY3RUb2AsIGRlcGVuZGVuY2llcyBjYW4gYmUgaW5qZWN0ZWQgaW50byBgcmVzb2x2ZVJlZGlyZWN0VG9gIGFuZCB0aGVcbiAgICogICAgICByZXR1cm4gdmFsdWUgY2FuIGJlIGVpdGhlciBhIHN0cmluZyBvciBhIHByb21pc2UgdGhhdCB3aWxsIGJlIHJlc29sdmVkIHRvIGEgc3RyaW5nLlxuICAgKlxuICAgKiAgICAgIFNpbWlsYXIgdG8gYHJlZGlyZWN0VG9gLCBpZiB0aGUgcmV0dXJuIHZhbHVlIGlzIGB1bmRlZmluZWRgIChvciBhIHByb21pc2UgdGhhdCBnZXRzXG4gICAqICAgICAgcmVzb2x2ZWQgdG8gYHVuZGVmaW5lZGApLCBubyByZWRpcmVjdGlvbiB0YWtlcyBwbGFjZSBhbmQgdGhlIHJvdXRlIHRyYW5zaXRpb24gb2NjdXJzIGFzXG4gICAqICAgICAgdGhvdWdoIHRoZXJlIHdhcyBubyByZWRpcmVjdGlvbi5cbiAgICpcbiAgICogICAgICBJZiB0aGUgZnVuY3Rpb24gdGhyb3dzIGFuIGVycm9yIG9yIHRoZSByZXR1cm5lZCBwcm9taXNlIGdldHMgcmVqZWN0ZWQsIG5vIGZ1cnRoZXJcbiAgICogICAgICBwcm9jZXNzaW5nIHdpbGwgdGFrZSBwbGFjZSBhbmQgdGhlXG4gICAqICAgICAge0BsaW5rIG5nUm91dGUuJHJvdXRlIyRyb3V0ZUNoYW5nZUVycm9yICRyb3V0ZUNoYW5nZUVycm9yfSBldmVudCB3aWxsIGJlIGZpcmVkLlxuICAgKlxuICAgKiAgICAgIGByZWRpcmVjdFRvYCB0YWtlcyBwcmVjZWRlbmNlIG92ZXIgYHJlc29sdmVSZWRpcmVjdFRvYCwgc28gc3BlY2lmeWluZyBib3RoIG9uIHRoZSBzYW1lXG4gICAqICAgICAgcm91dGUgZGVmaW5pdGlvbiwgd2lsbCBjYXVzZSB0aGUgbGF0dGVyIHRvIGJlIGlnbm9yZWQuXG4gICAqXG4gICAqICAgIC0gYFtyZWxvYWRPblNlYXJjaD10cnVlXWAgLSBge2Jvb2xlYW49fWAgLSByZWxvYWQgcm91dGUgd2hlbiBvbmx5IGAkbG9jYXRpb24uc2VhcmNoKClgXG4gICAqICAgICAgb3IgYCRsb2NhdGlvbi5oYXNoKClgIGNoYW5nZXMuXG4gICAqXG4gICAqICAgICAgSWYgdGhlIG9wdGlvbiBpcyBzZXQgdG8gYGZhbHNlYCBhbmQgdXJsIGluIHRoZSBicm93c2VyIGNoYW5nZXMsIHRoZW5cbiAgICogICAgICBgJHJvdXRlVXBkYXRlYCBldmVudCBpcyBicm9hZGNhc3RlZCBvbiB0aGUgcm9vdCBzY29wZS5cbiAgICpcbiAgICogICAgLSBgW2Nhc2VJbnNlbnNpdGl2ZU1hdGNoPWZhbHNlXWAgLSBge2Jvb2xlYW49fWAgLSBtYXRjaCByb3V0ZXMgd2l0aG91dCBiZWluZyBjYXNlIHNlbnNpdGl2ZVxuICAgKlxuICAgKiAgICAgIElmIHRoZSBvcHRpb24gaXMgc2V0IHRvIGB0cnVlYCwgdGhlbiB0aGUgcGFydGljdWxhciByb3V0ZSBjYW4gYmUgbWF0Y2hlZCB3aXRob3V0IGJlaW5nXG4gICAqICAgICAgY2FzZSBzZW5zaXRpdmVcbiAgICpcbiAgICogQHJldHVybnMge09iamVjdH0gc2VsZlxuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogQWRkcyBhIG5ldyByb3V0ZSBkZWZpbml0aW9uIHRvIHRoZSBgJHJvdXRlYCBzZXJ2aWNlLlxuICAgKi9cbiAgdGhpcy53aGVuID0gZnVuY3Rpb24ocGF0aCwgcm91dGUpIHtcbiAgICAvL2NvcHkgb3JpZ2luYWwgcm91dGUgb2JqZWN0IHRvIHByZXNlcnZlIHBhcmFtcyBpbmhlcml0ZWQgZnJvbSBwcm90byBjaGFpblxuICAgIHZhciByb3V0ZUNvcHkgPSBzaGFsbG93Q29weShyb3V0ZSk7XG4gICAgaWYgKGFuZ3VsYXIuaXNVbmRlZmluZWQocm91dGVDb3B5LnJlbG9hZE9uU2VhcmNoKSkge1xuICAgICAgcm91dGVDb3B5LnJlbG9hZE9uU2VhcmNoID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGFuZ3VsYXIuaXNVbmRlZmluZWQocm91dGVDb3B5LmNhc2VJbnNlbnNpdGl2ZU1hdGNoKSkge1xuICAgICAgcm91dGVDb3B5LmNhc2VJbnNlbnNpdGl2ZU1hdGNoID0gdGhpcy5jYXNlSW5zZW5zaXRpdmVNYXRjaDtcbiAgICB9XG4gICAgcm91dGVzW3BhdGhdID0gYW5ndWxhci5leHRlbmQoXG4gICAgICByb3V0ZUNvcHksXG4gICAgICBwYXRoICYmIHBhdGhSZWdFeHAocGF0aCwgcm91dGVDb3B5KVxuICAgICk7XG5cbiAgICAvLyBjcmVhdGUgcmVkaXJlY3Rpb24gZm9yIHRyYWlsaW5nIHNsYXNoZXNcbiAgICBpZiAocGF0aCkge1xuICAgICAgdmFyIHJlZGlyZWN0UGF0aCA9IChwYXRoW3BhdGgubGVuZ3RoIC0gMV0gPT09ICcvJylcbiAgICAgICAgICAgID8gcGF0aC5zdWJzdHIoMCwgcGF0aC5sZW5ndGggLSAxKVxuICAgICAgICAgICAgOiBwYXRoICsgJy8nO1xuXG4gICAgICByb3V0ZXNbcmVkaXJlY3RQYXRoXSA9IGFuZ3VsYXIuZXh0ZW5kKFxuICAgICAgICB7cmVkaXJlY3RUbzogcGF0aH0sXG4gICAgICAgIHBhdGhSZWdFeHAocmVkaXJlY3RQYXRoLCByb3V0ZUNvcHkpXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAbmdkb2MgcHJvcGVydHlcbiAgICogQG5hbWUgJHJvdXRlUHJvdmlkZXIjY2FzZUluc2Vuc2l0aXZlTWF0Y2hcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqXG4gICAqIEEgYm9vbGVhbiBwcm9wZXJ0eSBpbmRpY2F0aW5nIGlmIHJvdXRlcyBkZWZpbmVkXG4gICAqIHVzaW5nIHRoaXMgcHJvdmlkZXIgc2hvdWxkIGJlIG1hdGNoZWQgdXNpbmcgYSBjYXNlIGluc2Vuc2l0aXZlXG4gICAqIGFsZ29yaXRobS4gRGVmYXVsdHMgdG8gYGZhbHNlYC5cbiAgICovXG4gIHRoaXMuY2FzZUluc2Vuc2l0aXZlTWF0Y2ggPSBmYWxzZTtcblxuICAgLyoqXG4gICAgKiBAcGFyYW0gcGF0aCB7c3RyaW5nfSBwYXRoXG4gICAgKiBAcGFyYW0gb3B0cyB7T2JqZWN0fSBvcHRpb25zXG4gICAgKiBAcmV0dXJuIHs/T2JqZWN0fVxuICAgICpcbiAgICAqIEBkZXNjcmlwdGlvblxuICAgICogTm9ybWFsaXplcyB0aGUgZ2l2ZW4gcGF0aCwgcmV0dXJuaW5nIGEgcmVndWxhciBleHByZXNzaW9uXG4gICAgKiBhbmQgdGhlIG9yaWdpbmFsIHBhdGguXG4gICAgKlxuICAgICogSW5zcGlyZWQgYnkgcGF0aFJleHAgaW4gdmlzaW9ubWVkaWEvZXhwcmVzcy9saWIvdXRpbHMuanMuXG4gICAgKi9cbiAgZnVuY3Rpb24gcGF0aFJlZ0V4cChwYXRoLCBvcHRzKSB7XG4gICAgdmFyIGluc2Vuc2l0aXZlID0gb3B0cy5jYXNlSW5zZW5zaXRpdmVNYXRjaCxcbiAgICAgICAgcmV0ID0ge1xuICAgICAgICAgIG9yaWdpbmFsUGF0aDogcGF0aCxcbiAgICAgICAgICByZWdleHA6IHBhdGhcbiAgICAgICAgfSxcbiAgICAgICAga2V5cyA9IHJldC5rZXlzID0gW107XG5cbiAgICBwYXRoID0gcGF0aFxuICAgICAgLnJlcGxhY2UoLyhbKCkuXSkvZywgJ1xcXFwkMScpXG4gICAgICAucmVwbGFjZSgvKFxcLyk/OihcXHcrKShcXCpcXD98Wz8qXSk/L2csIGZ1bmN0aW9uKF8sIHNsYXNoLCBrZXksIG9wdGlvbikge1xuICAgICAgICB2YXIgb3B0aW9uYWwgPSAob3B0aW9uID09PSAnPycgfHwgb3B0aW9uID09PSAnKj8nKSA/ICc/JyA6IG51bGw7XG4gICAgICAgIHZhciBzdGFyID0gKG9wdGlvbiA9PT0gJyonIHx8IG9wdGlvbiA9PT0gJyo/JykgPyAnKicgOiBudWxsO1xuICAgICAgICBrZXlzLnB1c2goeyBuYW1lOiBrZXksIG9wdGlvbmFsOiAhIW9wdGlvbmFsIH0pO1xuICAgICAgICBzbGFzaCA9IHNsYXNoIHx8ICcnO1xuICAgICAgICByZXR1cm4gJydcbiAgICAgICAgICArIChvcHRpb25hbCA/ICcnIDogc2xhc2gpXG4gICAgICAgICAgKyAnKD86J1xuICAgICAgICAgICsgKG9wdGlvbmFsID8gc2xhc2ggOiAnJylcbiAgICAgICAgICArIChzdGFyICYmICcoLis/KScgfHwgJyhbXi9dKyknKVxuICAgICAgICAgICsgKG9wdGlvbmFsIHx8ICcnKVxuICAgICAgICAgICsgJyknXG4gICAgICAgICAgKyAob3B0aW9uYWwgfHwgJycpO1xuICAgICAgfSlcbiAgICAgIC5yZXBsYWNlKC8oWy8kKl0pL2csICdcXFxcJDEnKTtcblxuICAgIHJldC5yZWdleHAgPSBuZXcgUmVnRXhwKCdeJyArIHBhdGggKyAnJCcsIGluc2Vuc2l0aXZlID8gJ2knIDogJycpO1xuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICAvKipcbiAgICogQG5nZG9jIG1ldGhvZFxuICAgKiBAbmFtZSAkcm91dGVQcm92aWRlciNvdGhlcndpc2VcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFNldHMgcm91dGUgZGVmaW5pdGlvbiB0aGF0IHdpbGwgYmUgdXNlZCBvbiByb3V0ZSBjaGFuZ2Ugd2hlbiBubyBvdGhlciByb3V0ZSBkZWZpbml0aW9uXG4gICAqIGlzIG1hdGNoZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fHN0cmluZ30gcGFyYW1zIE1hcHBpbmcgaW5mb3JtYXRpb24gdG8gYmUgYXNzaWduZWQgdG8gYCRyb3V0ZS5jdXJyZW50YC5cbiAgICogSWYgY2FsbGVkIHdpdGggYSBzdHJpbmcsIHRoZSB2YWx1ZSBtYXBzIHRvIGByZWRpcmVjdFRvYC5cbiAgICogQHJldHVybnMge09iamVjdH0gc2VsZlxuICAgKi9cbiAgdGhpcy5vdGhlcndpc2UgPSBmdW5jdGlvbihwYXJhbXMpIHtcbiAgICBpZiAodHlwZW9mIHBhcmFtcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHBhcmFtcyA9IHtyZWRpcmVjdFRvOiBwYXJhbXN9O1xuICAgIH1cbiAgICB0aGlzLndoZW4obnVsbCwgcGFyYW1zKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogQG5nZG9jIG1ldGhvZFxuICAgKiBAbmFtZSAkcm91dGVQcm92aWRlciNlYWdlckluc3RhbnRpYXRpb25FbmFibGVkXG4gICAqIEBraW5kIGZ1bmN0aW9uXG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBDYWxsIHRoaXMgbWV0aG9kIGFzIGEgc2V0dGVyIHRvIGVuYWJsZS9kaXNhYmxlIGVhZ2VyIGluc3RhbnRpYXRpb24gb2YgdGhlXG4gICAqIHtAbGluayBuZ1JvdXRlLiRyb3V0ZSAkcm91dGV9IHNlcnZpY2UgdXBvbiBhcHBsaWNhdGlvbiBib290c3RyYXAuIFlvdSBjYW4gYWxzbyBjYWxsIGl0IGFzIGFcbiAgICogZ2V0dGVyIChpLmUuIHdpdGhvdXQgYW55IGFyZ3VtZW50cykgdG8gZ2V0IHRoZSBjdXJyZW50IHZhbHVlIG9mIHRoZVxuICAgKiBgZWFnZXJJbnN0YW50aWF0aW9uRW5hYmxlZGAgZmxhZy5cbiAgICpcbiAgICogSW5zdGFudGlhdGluZyBgJHJvdXRlYCBlYXJseSBpcyBuZWNlc3NhcnkgZm9yIGNhcHR1cmluZyB0aGUgaW5pdGlhbFxuICAgKiB7QGxpbmsgbmcuJGxvY2F0aW9uIyRsb2NhdGlvbkNoYW5nZVN0YXJ0ICRsb2NhdGlvbkNoYW5nZVN0YXJ0fSBldmVudCBhbmQgbmF2aWdhdGluZyB0byB0aGVcbiAgICogYXBwcm9wcmlhdGUgcm91dGUuIFVzdWFsbHksIGAkcm91dGVgIGlzIGluc3RhbnRpYXRlZCBpbiB0aW1lIGJ5IHRoZVxuICAgKiB7QGxpbmsgbmdSb3V0ZS5uZ1ZpZXcgbmdWaWV3fSBkaXJlY3RpdmUuIFlldCwgaW4gY2FzZXMgd2hlcmUgYG5nVmlld2AgaXMgaW5jbHVkZWQgaW4gYW5cbiAgICogYXN5bmNocm9ub3VzbHkgbG9hZGVkIHRlbXBsYXRlIChlLmcuIGluIGFub3RoZXIgZGlyZWN0aXZlJ3MgdGVtcGxhdGUpLCB0aGUgZGlyZWN0aXZlIGZhY3RvcnlcbiAgICogbWlnaHQgbm90IGJlIGNhbGxlZCBzb29uIGVub3VnaCBmb3IgYCRyb3V0ZWAgdG8gYmUgaW5zdGFudGlhdGVkIF9iZWZvcmVfIHRoZSBpbml0aWFsXG4gICAqIGAkbG9jYXRpb25DaGFuZ2VTdWNjZXNzYCBldmVudCBpcyBmaXJlZC4gRWFnZXIgaW5zdGFudGlhdGlvbiBlbnN1cmVzIHRoYXQgYCRyb3V0ZWAgaXMgYWx3YXlzXG4gICAqIGluc3RhbnRpYXRlZCBpbiB0aW1lLCByZWdhcmRsZXNzIG9mIHdoZW4gYG5nVmlld2Agd2lsbCBiZSBsb2FkZWQuXG4gICAqXG4gICAqIFRoZSBkZWZhdWx0IHZhbHVlIGlzIHRydWUuXG4gICAqXG4gICAqICoqTm90ZSoqOjxiciAvPlxuICAgKiBZb3UgbWF5IHdhbnQgdG8gZGlzYWJsZSB0aGUgZGVmYXVsdCBiZWhhdmlvciB3aGVuIHVuaXQtdGVzdGluZyBtb2R1bGVzIHRoYXQgZGVwZW5kIG9uXG4gICAqIGBuZ1JvdXRlYCwgaW4gb3JkZXIgdG8gYXZvaWQgYW4gdW5leHBlY3RlZCByZXF1ZXN0IGZvciB0aGUgZGVmYXVsdCByb3V0ZSdzIHRlbXBsYXRlLlxuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBlbmFibGVkIC0gSWYgcHJvdmlkZWQsIHVwZGF0ZSB0aGUgaW50ZXJuYWwgYGVhZ2VySW5zdGFudGlhdGlvbkVuYWJsZWRgIGZsYWcuXG4gICAqXG4gICAqIEByZXR1cm5zIHsqfSBUaGUgY3VycmVudCB2YWx1ZSBvZiB0aGUgYGVhZ2VySW5zdGFudGlhdGlvbkVuYWJsZWRgIGZsYWcgaWYgdXNlZCBhcyBhIGdldHRlciBvclxuICAgKiAgICAgaXRzZWxmIChmb3IgY2hhaW5pbmcpIGlmIHVzZWQgYXMgYSBzZXR0ZXIuXG4gICAqL1xuICBpc0VhZ2VySW5zdGFudGlhdGlvbkVuYWJsZWQgPSB0cnVlO1xuICB0aGlzLmVhZ2VySW5zdGFudGlhdGlvbkVuYWJsZWQgPSBmdW5jdGlvbiBlYWdlckluc3RhbnRpYXRpb25FbmFibGVkKGVuYWJsZWQpIHtcbiAgICBpZiAoaXNEZWZpbmVkKGVuYWJsZWQpKSB7XG4gICAgICBpc0VhZ2VySW5zdGFudGlhdGlvbkVuYWJsZWQgPSBlbmFibGVkO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcmV0dXJuIGlzRWFnZXJJbnN0YW50aWF0aW9uRW5hYmxlZDtcbiAgfTtcblxuXG4gIHRoaXMuJGdldCA9IFsnJHJvb3RTY29wZScsXG4gICAgICAgICAgICAgICAnJGxvY2F0aW9uJyxcbiAgICAgICAgICAgICAgICckcm91dGVQYXJhbXMnLFxuICAgICAgICAgICAgICAgJyRxJyxcbiAgICAgICAgICAgICAgICckaW5qZWN0b3InLFxuICAgICAgICAgICAgICAgJyR0ZW1wbGF0ZVJlcXVlc3QnLFxuICAgICAgICAgICAgICAgJyRzY2UnLFxuICAgICAgICAgICAgICAgJyRicm93c2VyJyxcbiAgICAgIGZ1bmN0aW9uKCRyb290U2NvcGUsICRsb2NhdGlvbiwgJHJvdXRlUGFyYW1zLCAkcSwgJGluamVjdG9yLCAkdGVtcGxhdGVSZXF1ZXN0LCAkc2NlLCAkYnJvd3Nlcikge1xuXG4gICAgLyoqXG4gICAgICogQG5nZG9jIHNlcnZpY2VcbiAgICAgKiBAbmFtZSAkcm91dGVcbiAgICAgKiBAcmVxdWlyZXMgJGxvY2F0aW9uXG4gICAgICogQHJlcXVpcmVzICRyb3V0ZVBhcmFtc1xuICAgICAqXG4gICAgICogQHByb3BlcnR5IHtPYmplY3R9IGN1cnJlbnQgUmVmZXJlbmNlIHRvIHRoZSBjdXJyZW50IHJvdXRlIGRlZmluaXRpb24uXG4gICAgICogVGhlIHJvdXRlIGRlZmluaXRpb24gY29udGFpbnM6XG4gICAgICpcbiAgICAgKiAgIC0gYGNvbnRyb2xsZXJgOiBUaGUgY29udHJvbGxlciBjb25zdHJ1Y3RvciBhcyBkZWZpbmVkIGluIHRoZSByb3V0ZSBkZWZpbml0aW9uLlxuICAgICAqICAgLSBgbG9jYWxzYDogQSBtYXAgb2YgbG9jYWxzIHdoaWNoIGlzIHVzZWQgYnkge0BsaW5rIG5nLiRjb250cm9sbGVyICRjb250cm9sbGVyfSBzZXJ2aWNlIGZvclxuICAgICAqICAgICBjb250cm9sbGVyIGluc3RhbnRpYXRpb24uIFRoZSBgbG9jYWxzYCBjb250YWluXG4gICAgICogICAgIHRoZSByZXNvbHZlZCB2YWx1ZXMgb2YgdGhlIGByZXNvbHZlYCBtYXAuIEFkZGl0aW9uYWxseSB0aGUgYGxvY2Fsc2AgYWxzbyBjb250YWluOlxuICAgICAqXG4gICAgICogICAgIC0gYCRzY29wZWAgLSBUaGUgY3VycmVudCByb3V0ZSBzY29wZS5cbiAgICAgKiAgICAgLSBgJHRlbXBsYXRlYCAtIFRoZSBjdXJyZW50IHJvdXRlIHRlbXBsYXRlIEhUTUwuXG4gICAgICpcbiAgICAgKiAgICAgVGhlIGBsb2NhbHNgIHdpbGwgYmUgYXNzaWduZWQgdG8gdGhlIHJvdXRlIHNjb3BlJ3MgYCRyZXNvbHZlYCBwcm9wZXJ0eS4gWW91IGNhbiBvdmVycmlkZVxuICAgICAqICAgICB0aGUgcHJvcGVydHkgbmFtZSwgdXNpbmcgYHJlc29sdmVBc2AgaW4gdGhlIHJvdXRlIGRlZmluaXRpb24uIFNlZVxuICAgICAqICAgICB7QGxpbmsgbmdSb3V0ZS4kcm91dGVQcm92aWRlciAkcm91dGVQcm92aWRlcn0gZm9yIG1vcmUgaW5mby5cbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSByb3V0ZXMgT2JqZWN0IHdpdGggYWxsIHJvdXRlIGNvbmZpZ3VyYXRpb24gT2JqZWN0cyBhcyBpdHMgcHJvcGVydGllcy5cbiAgICAgKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIGAkcm91dGVgIGlzIHVzZWQgZm9yIGRlZXAtbGlua2luZyBVUkxzIHRvIGNvbnRyb2xsZXJzIGFuZCB2aWV3cyAoSFRNTCBwYXJ0aWFscykuXG4gICAgICogSXQgd2F0Y2hlcyBgJGxvY2F0aW9uLnVybCgpYCBhbmQgdHJpZXMgdG8gbWFwIHRoZSBwYXRoIHRvIGFuIGV4aXN0aW5nIHJvdXRlIGRlZmluaXRpb24uXG4gICAgICpcbiAgICAgKiBSZXF1aXJlcyB0aGUge0BsaW5rIG5nUm91dGUgYG5nUm91dGVgfSBtb2R1bGUgdG8gYmUgaW5zdGFsbGVkLlxuICAgICAqXG4gICAgICogWW91IGNhbiBkZWZpbmUgcm91dGVzIHRocm91Z2gge0BsaW5rIG5nUm91dGUuJHJvdXRlUHJvdmlkZXIgJHJvdXRlUHJvdmlkZXJ9J3MgQVBJLlxuICAgICAqXG4gICAgICogVGhlIGAkcm91dGVgIHNlcnZpY2UgaXMgdHlwaWNhbGx5IHVzZWQgaW4gY29uanVuY3Rpb24gd2l0aCB0aGVcbiAgICAgKiB7QGxpbmsgbmdSb3V0ZS5kaXJlY3RpdmU6bmdWaWV3IGBuZ1ZpZXdgfSBkaXJlY3RpdmUgYW5kIHRoZVxuICAgICAqIHtAbGluayBuZ1JvdXRlLiRyb3V0ZVBhcmFtcyBgJHJvdXRlUGFyYW1zYH0gc2VydmljZS5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogVGhpcyBleGFtcGxlIHNob3dzIGhvdyBjaGFuZ2luZyB0aGUgVVJMIGhhc2ggY2F1c2VzIHRoZSBgJHJvdXRlYCB0byBtYXRjaCBhIHJvdXRlIGFnYWluc3QgdGhlXG4gICAgICogVVJMLCBhbmQgdGhlIGBuZ1ZpZXdgIHB1bGxzIGluIHRoZSBwYXJ0aWFsLlxuICAgICAqXG4gICAgICogPGV4YW1wbGUgbmFtZT1cIiRyb3V0ZS1zZXJ2aWNlXCIgbW9kdWxlPVwibmdSb3V0ZUV4YW1wbGVcIlxuICAgICAqICAgICAgICAgIGRlcHM9XCJhbmd1bGFyLXJvdXRlLmpzXCIgZml4QmFzZT1cInRydWVcIj5cbiAgICAgKiAgIDxmaWxlIG5hbWU9XCJpbmRleC5odG1sXCI+XG4gICAgICogICAgIDxkaXYgbmctY29udHJvbGxlcj1cIk1haW5Db250cm9sbGVyXCI+XG4gICAgICogICAgICAgQ2hvb3NlOlxuICAgICAqICAgICAgIDxhIGhyZWY9XCJCb29rL01vYnlcIj5Nb2J5PC9hPiB8XG4gICAgICogICAgICAgPGEgaHJlZj1cIkJvb2svTW9ieS9jaC8xXCI+TW9ieTogQ2gxPC9hPiB8XG4gICAgICogICAgICAgPGEgaHJlZj1cIkJvb2svR2F0c2J5XCI+R2F0c2J5PC9hPiB8XG4gICAgICogICAgICAgPGEgaHJlZj1cIkJvb2svR2F0c2J5L2NoLzQ/a2V5PXZhbHVlXCI+R2F0c2J5OiBDaDQ8L2E+IHxcbiAgICAgKiAgICAgICA8YSBocmVmPVwiQm9vay9TY2FybGV0XCI+U2NhcmxldCBMZXR0ZXI8L2E+PGJyLz5cbiAgICAgKlxuICAgICAqICAgICAgIDxkaXYgbmctdmlldz48L2Rpdj5cbiAgICAgKlxuICAgICAqICAgICAgIDxociAvPlxuICAgICAqXG4gICAgICogICAgICAgPHByZT4kbG9jYXRpb24ucGF0aCgpID0ge3skbG9jYXRpb24ucGF0aCgpfX08L3ByZT5cbiAgICAgKiAgICAgICA8cHJlPiRyb3V0ZS5jdXJyZW50LnRlbXBsYXRlVXJsID0ge3skcm91dGUuY3VycmVudC50ZW1wbGF0ZVVybH19PC9wcmU+XG4gICAgICogICAgICAgPHByZT4kcm91dGUuY3VycmVudC5wYXJhbXMgPSB7eyRyb3V0ZS5jdXJyZW50LnBhcmFtc319PC9wcmU+XG4gICAgICogICAgICAgPHByZT4kcm91dGUuY3VycmVudC5zY29wZS5uYW1lID0ge3skcm91dGUuY3VycmVudC5zY29wZS5uYW1lfX08L3ByZT5cbiAgICAgKiAgICAgICA8cHJlPiRyb3V0ZVBhcmFtcyA9IHt7JHJvdXRlUGFyYW1zfX08L3ByZT5cbiAgICAgKiAgICAgPC9kaXY+XG4gICAgICogICA8L2ZpbGU+XG4gICAgICpcbiAgICAgKiAgIDxmaWxlIG5hbWU9XCJib29rLmh0bWxcIj5cbiAgICAgKiAgICAgY29udHJvbGxlcjoge3tuYW1lfX08YnIgLz5cbiAgICAgKiAgICAgQm9vayBJZDoge3twYXJhbXMuYm9va0lkfX08YnIgLz5cbiAgICAgKiAgIDwvZmlsZT5cbiAgICAgKlxuICAgICAqICAgPGZpbGUgbmFtZT1cImNoYXB0ZXIuaHRtbFwiPlxuICAgICAqICAgICBjb250cm9sbGVyOiB7e25hbWV9fTxiciAvPlxuICAgICAqICAgICBCb29rIElkOiB7e3BhcmFtcy5ib29rSWR9fTxiciAvPlxuICAgICAqICAgICBDaGFwdGVyIElkOiB7e3BhcmFtcy5jaGFwdGVySWR9fVxuICAgICAqICAgPC9maWxlPlxuICAgICAqXG4gICAgICogICA8ZmlsZSBuYW1lPVwic2NyaXB0LmpzXCI+XG4gICAgICogICAgIGFuZ3VsYXIubW9kdWxlKCduZ1JvdXRlRXhhbXBsZScsIFsnbmdSb3V0ZSddKVxuICAgICAqXG4gICAgICogICAgICAuY29udHJvbGxlcignTWFpbkNvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsICRyb3V0ZSwgJHJvdXRlUGFyYW1zLCAkbG9jYXRpb24pIHtcbiAgICAgKiAgICAgICAgICAkc2NvcGUuJHJvdXRlID0gJHJvdXRlO1xuICAgICAqICAgICAgICAgICRzY29wZS4kbG9jYXRpb24gPSAkbG9jYXRpb247XG4gICAgICogICAgICAgICAgJHNjb3BlLiRyb3V0ZVBhcmFtcyA9ICRyb3V0ZVBhcmFtcztcbiAgICAgKiAgICAgIH0pXG4gICAgICpcbiAgICAgKiAgICAgIC5jb250cm9sbGVyKCdCb29rQ29udHJvbGxlcicsIGZ1bmN0aW9uKCRzY29wZSwgJHJvdXRlUGFyYW1zKSB7XG4gICAgICogICAgICAgICAgJHNjb3BlLm5hbWUgPSAnQm9va0NvbnRyb2xsZXInO1xuICAgICAqICAgICAgICAgICRzY29wZS5wYXJhbXMgPSAkcm91dGVQYXJhbXM7XG4gICAgICogICAgICB9KVxuICAgICAqXG4gICAgICogICAgICAuY29udHJvbGxlcignQ2hhcHRlckNvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsICRyb3V0ZVBhcmFtcykge1xuICAgICAqICAgICAgICAgICRzY29wZS5uYW1lID0gJ0NoYXB0ZXJDb250cm9sbGVyJztcbiAgICAgKiAgICAgICAgICAkc2NvcGUucGFyYW1zID0gJHJvdXRlUGFyYW1zO1xuICAgICAqICAgICAgfSlcbiAgICAgKlxuICAgICAqICAgICAuY29uZmlnKGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlcikge1xuICAgICAqICAgICAgICRyb3V0ZVByb3ZpZGVyXG4gICAgICogICAgICAgIC53aGVuKCcvQm9vay86Ym9va0lkJywge1xuICAgICAqICAgICAgICAgdGVtcGxhdGVVcmw6ICdib29rLmh0bWwnLFxuICAgICAqICAgICAgICAgY29udHJvbGxlcjogJ0Jvb2tDb250cm9sbGVyJyxcbiAgICAgKiAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgKiAgICAgICAgICAgLy8gSSB3aWxsIGNhdXNlIGEgMSBzZWNvbmQgZGVsYXlcbiAgICAgKiAgICAgICAgICAgZGVsYXk6IGZ1bmN0aW9uKCRxLCAkdGltZW91dCkge1xuICAgICAqICAgICAgICAgICAgIHZhciBkZWxheSA9ICRxLmRlZmVyKCk7XG4gICAgICogICAgICAgICAgICAgJHRpbWVvdXQoZGVsYXkucmVzb2x2ZSwgMTAwMCk7XG4gICAgICogICAgICAgICAgICAgcmV0dXJuIGRlbGF5LnByb21pc2U7XG4gICAgICogICAgICAgICAgIH1cbiAgICAgKiAgICAgICAgIH1cbiAgICAgKiAgICAgICB9KVxuICAgICAqICAgICAgIC53aGVuKCcvQm9vay86Ym9va0lkL2NoLzpjaGFwdGVySWQnLCB7XG4gICAgICogICAgICAgICB0ZW1wbGF0ZVVybDogJ2NoYXB0ZXIuaHRtbCcsXG4gICAgICogICAgICAgICBjb250cm9sbGVyOiAnQ2hhcHRlckNvbnRyb2xsZXInXG4gICAgICogICAgICAgfSk7XG4gICAgICpcbiAgICAgKiAgICAgICAvLyBjb25maWd1cmUgaHRtbDUgdG8gZ2V0IGxpbmtzIHdvcmtpbmcgb24ganNmaWRkbGVcbiAgICAgKiAgICAgICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUodHJ1ZSk7XG4gICAgICogICAgIH0pO1xuICAgICAqXG4gICAgICogICA8L2ZpbGU+XG4gICAgICpcbiAgICAgKiAgIDxmaWxlIG5hbWU9XCJwcm90cmFjdG9yLmpzXCIgdHlwZT1cInByb3RyYWN0b3JcIj5cbiAgICAgKiAgICAgaXQoJ3Nob3VsZCBsb2FkIGFuZCBjb21waWxlIGNvcnJlY3QgdGVtcGxhdGUnLCBmdW5jdGlvbigpIHtcbiAgICAgKiAgICAgICBlbGVtZW50KGJ5LmxpbmtUZXh0KCdNb2J5OiBDaDEnKSkuY2xpY2soKTtcbiAgICAgKiAgICAgICB2YXIgY29udGVudCA9IGVsZW1lbnQoYnkuY3NzKCdbbmctdmlld10nKSkuZ2V0VGV4dCgpO1xuICAgICAqICAgICAgIGV4cGVjdChjb250ZW50KS50b01hdGNoKC9jb250cm9sbGVyOiBDaGFwdGVyQ29udHJvbGxlci8pO1xuICAgICAqICAgICAgIGV4cGVjdChjb250ZW50KS50b01hdGNoKC9Cb29rIElkOiBNb2J5Lyk7XG4gICAgICogICAgICAgZXhwZWN0KGNvbnRlbnQpLnRvTWF0Y2goL0NoYXB0ZXIgSWQ6IDEvKTtcbiAgICAgKlxuICAgICAqICAgICAgIGVsZW1lbnQoYnkucGFydGlhbExpbmtUZXh0KCdTY2FybGV0JykpLmNsaWNrKCk7XG4gICAgICpcbiAgICAgKiAgICAgICBjb250ZW50ID0gZWxlbWVudChieS5jc3MoJ1tuZy12aWV3XScpKS5nZXRUZXh0KCk7XG4gICAgICogICAgICAgZXhwZWN0KGNvbnRlbnQpLnRvTWF0Y2goL2NvbnRyb2xsZXI6IEJvb2tDb250cm9sbGVyLyk7XG4gICAgICogICAgICAgZXhwZWN0KGNvbnRlbnQpLnRvTWF0Y2goL0Jvb2sgSWQ6IFNjYXJsZXQvKTtcbiAgICAgKiAgICAgfSk7XG4gICAgICogICA8L2ZpbGU+XG4gICAgICogPC9leGFtcGxlPlxuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogQG5nZG9jIGV2ZW50XG4gICAgICogQG5hbWUgJHJvdXRlIyRyb3V0ZUNoYW5nZVN0YXJ0XG4gICAgICogQGV2ZW50VHlwZSBicm9hZGNhc3Qgb24gcm9vdCBzY29wZVxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIEJyb2FkY2FzdGVkIGJlZm9yZSBhIHJvdXRlIGNoYW5nZS4gQXQgdGhpcyAgcG9pbnQgdGhlIHJvdXRlIHNlcnZpY2VzIHN0YXJ0c1xuICAgICAqIHJlc29sdmluZyBhbGwgb2YgdGhlIGRlcGVuZGVuY2llcyBuZWVkZWQgZm9yIHRoZSByb3V0ZSBjaGFuZ2UgdG8gb2NjdXIuXG4gICAgICogVHlwaWNhbGx5IHRoaXMgaW52b2x2ZXMgZmV0Y2hpbmcgdGhlIHZpZXcgdGVtcGxhdGUgYXMgd2VsbCBhcyBhbnkgZGVwZW5kZW5jaWVzXG4gICAgICogZGVmaW5lZCBpbiBgcmVzb2x2ZWAgcm91dGUgcHJvcGVydHkuIE9uY2UgIGFsbCBvZiB0aGUgZGVwZW5kZW5jaWVzIGFyZSByZXNvbHZlZFxuICAgICAqIGAkcm91dGVDaGFuZ2VTdWNjZXNzYCBpcyBmaXJlZC5cbiAgICAgKlxuICAgICAqIFRoZSByb3V0ZSBjaGFuZ2UgKGFuZCB0aGUgYCRsb2NhdGlvbmAgY2hhbmdlIHRoYXQgdHJpZ2dlcmVkIGl0KSBjYW4gYmUgcHJldmVudGVkXG4gICAgICogYnkgY2FsbGluZyBgcHJldmVudERlZmF1bHRgIG1ldGhvZCBvZiB0aGUgZXZlbnQuIFNlZSB7QGxpbmsgbmcuJHJvb3RTY29wZS5TY29wZSMkb259XG4gICAgICogZm9yIG1vcmUgZGV0YWlscyBhYm91dCBldmVudCBvYmplY3QuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYW5ndWxhckV2ZW50IFN5bnRoZXRpYyBldmVudCBvYmplY3QuXG4gICAgICogQHBhcmFtIHtSb3V0ZX0gbmV4dCBGdXR1cmUgcm91dGUgaW5mb3JtYXRpb24uXG4gICAgICogQHBhcmFtIHtSb3V0ZX0gY3VycmVudCBDdXJyZW50IHJvdXRlIGluZm9ybWF0aW9uLlxuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogQG5nZG9jIGV2ZW50XG4gICAgICogQG5hbWUgJHJvdXRlIyRyb3V0ZUNoYW5nZVN1Y2Nlc3NcbiAgICAgKiBAZXZlbnRUeXBlIGJyb2FkY2FzdCBvbiByb290IHNjb3BlXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogQnJvYWRjYXN0ZWQgYWZ0ZXIgYSByb3V0ZSBjaGFuZ2UgaGFzIGhhcHBlbmVkIHN1Y2Nlc3NmdWxseS5cbiAgICAgKiBUaGUgYHJlc29sdmVgIGRlcGVuZGVuY2llcyBhcmUgbm93IGF2YWlsYWJsZSBpbiB0aGUgYGN1cnJlbnQubG9jYWxzYCBwcm9wZXJ0eS5cbiAgICAgKlxuICAgICAqIHtAbGluayBuZ1JvdXRlLmRpcmVjdGl2ZTpuZ1ZpZXcgbmdWaWV3fSBsaXN0ZW5zIGZvciB0aGUgZGlyZWN0aXZlXG4gICAgICogdG8gaW5zdGFudGlhdGUgdGhlIGNvbnRyb2xsZXIgYW5kIHJlbmRlciB0aGUgdmlldy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBhbmd1bGFyRXZlbnQgU3ludGhldGljIGV2ZW50IG9iamVjdC5cbiAgICAgKiBAcGFyYW0ge1JvdXRlfSBjdXJyZW50IEN1cnJlbnQgcm91dGUgaW5mb3JtYXRpb24uXG4gICAgICogQHBhcmFtIHtSb3V0ZXxVbmRlZmluZWR9IHByZXZpb3VzIFByZXZpb3VzIHJvdXRlIGluZm9ybWF0aW9uLCBvciB1bmRlZmluZWQgaWYgY3VycmVudCBpc1xuICAgICAqIGZpcnN0IHJvdXRlIGVudGVyZWQuXG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiBAbmdkb2MgZXZlbnRcbiAgICAgKiBAbmFtZSAkcm91dGUjJHJvdXRlQ2hhbmdlRXJyb3JcbiAgICAgKiBAZXZlbnRUeXBlIGJyb2FkY2FzdCBvbiByb290IHNjb3BlXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogQnJvYWRjYXN0ZWQgaWYgYSByZWRpcmVjdGlvbiBmdW5jdGlvbiBmYWlscyBvciBhbnkgcmVkaXJlY3Rpb24gb3IgcmVzb2x2ZSBwcm9taXNlcyBhcmVcbiAgICAgKiByZWplY3RlZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBhbmd1bGFyRXZlbnQgU3ludGhldGljIGV2ZW50IG9iamVjdFxuICAgICAqIEBwYXJhbSB7Um91dGV9IGN1cnJlbnQgQ3VycmVudCByb3V0ZSBpbmZvcm1hdGlvbi5cbiAgICAgKiBAcGFyYW0ge1JvdXRlfSBwcmV2aW91cyBQcmV2aW91cyByb3V0ZSBpbmZvcm1hdGlvbi5cbiAgICAgKiBAcGFyYW0ge1JvdXRlfSByZWplY3Rpb24gVGhlIHRocm93biBlcnJvciBvciB0aGUgcmVqZWN0aW9uIHJlYXNvbiBvZiB0aGUgcHJvbWlzZS4gVXN1YWxseVxuICAgICAqIHRoZSByZWplY3Rpb24gcmVhc29uIGlzIHRoZSBlcnJvciB0aGF0IGNhdXNlZCB0aGUgcHJvbWlzZSB0byBnZXQgcmVqZWN0ZWQuXG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiBAbmdkb2MgZXZlbnRcbiAgICAgKiBAbmFtZSAkcm91dGUjJHJvdXRlVXBkYXRlXG4gICAgICogQGV2ZW50VHlwZSBicm9hZGNhc3Qgb24gcm9vdCBzY29wZVxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFRoZSBgcmVsb2FkT25TZWFyY2hgIHByb3BlcnR5IGhhcyBiZWVuIHNldCB0byBmYWxzZSwgYW5kIHdlIGFyZSByZXVzaW5nIHRoZSBzYW1lXG4gICAgICogaW5zdGFuY2Ugb2YgdGhlIENvbnRyb2xsZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYW5ndWxhckV2ZW50IFN5bnRoZXRpYyBldmVudCBvYmplY3RcbiAgICAgKiBAcGFyYW0ge1JvdXRlfSBjdXJyZW50IEN1cnJlbnQvcHJldmlvdXMgcm91dGUgaW5mb3JtYXRpb24uXG4gICAgICovXG5cbiAgICB2YXIgZm9yY2VSZWxvYWQgPSBmYWxzZSxcbiAgICAgICAgcHJlcGFyZWRSb3V0ZSxcbiAgICAgICAgcHJlcGFyZWRSb3V0ZUlzVXBkYXRlT25seSxcbiAgICAgICAgJHJvdXRlID0ge1xuICAgICAgICAgIHJvdXRlczogcm91dGVzLFxuXG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogQG5nZG9jIG1ldGhvZFxuICAgICAgICAgICAqIEBuYW1lICRyb3V0ZSNyZWxvYWRcbiAgICAgICAgICAgKlxuICAgICAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICAgICAqIENhdXNlcyBgJHJvdXRlYCBzZXJ2aWNlIHRvIHJlbG9hZCB0aGUgY3VycmVudCByb3V0ZSBldmVuIGlmXG4gICAgICAgICAgICoge0BsaW5rIG5nLiRsb2NhdGlvbiAkbG9jYXRpb259IGhhc24ndCBjaGFuZ2VkLlxuICAgICAgICAgICAqXG4gICAgICAgICAgICogQXMgYSByZXN1bHQgb2YgdGhhdCwge0BsaW5rIG5nUm91dGUuZGlyZWN0aXZlOm5nVmlldyBuZ1ZpZXd9XG4gICAgICAgICAgICogY3JlYXRlcyBuZXcgc2NvcGUgYW5kIHJlaW5zdGFudGlhdGVzIHRoZSBjb250cm9sbGVyLlxuICAgICAgICAgICAqL1xuICAgICAgICAgIHJlbG9hZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBmb3JjZVJlbG9hZCA9IHRydWU7XG5cbiAgICAgICAgICAgIHZhciBmYWtlTG9jYXRpb25FdmVudCA9IHtcbiAgICAgICAgICAgICAgZGVmYXVsdFByZXZlbnRlZDogZmFsc2UsXG4gICAgICAgICAgICAgIHByZXZlbnREZWZhdWx0OiBmdW5jdGlvbiBmYWtlUHJldmVudERlZmF1bHQoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kZWZhdWx0UHJldmVudGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBmb3JjZVJlbG9hZCA9IGZhbHNlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRldmFsQXN5bmMoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHByZXBhcmVSb3V0ZShmYWtlTG9jYXRpb25FdmVudCk7XG4gICAgICAgICAgICAgIGlmICghZmFrZUxvY2F0aW9uRXZlbnQuZGVmYXVsdFByZXZlbnRlZCkgY29tbWl0Um91dGUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0sXG5cbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBAbmdkb2MgbWV0aG9kXG4gICAgICAgICAgICogQG5hbWUgJHJvdXRlI3VwZGF0ZVBhcmFtc1xuICAgICAgICAgICAqXG4gICAgICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgICAgICogQ2F1c2VzIGAkcm91dGVgIHNlcnZpY2UgdG8gdXBkYXRlIHRoZSBjdXJyZW50IFVSTCwgcmVwbGFjaW5nXG4gICAgICAgICAgICogY3VycmVudCByb3V0ZSBwYXJhbWV0ZXJzIHdpdGggdGhvc2Ugc3BlY2lmaWVkIGluIGBuZXdQYXJhbXNgLlxuICAgICAgICAgICAqIFByb3ZpZGVkIHByb3BlcnR5IG5hbWVzIHRoYXQgbWF0Y2ggdGhlIHJvdXRlJ3MgcGF0aCBzZWdtZW50XG4gICAgICAgICAgICogZGVmaW5pdGlvbnMgd2lsbCBiZSBpbnRlcnBvbGF0ZWQgaW50byB0aGUgbG9jYXRpb24ncyBwYXRoLCB3aGlsZVxuICAgICAgICAgICAqIHJlbWFpbmluZyBwcm9wZXJ0aWVzIHdpbGwgYmUgdHJlYXRlZCBhcyBxdWVyeSBwYXJhbXMuXG4gICAgICAgICAgICpcbiAgICAgICAgICAgKiBAcGFyYW0geyFPYmplY3Q8c3RyaW5nLCBzdHJpbmc+fSBuZXdQYXJhbXMgbWFwcGluZyBvZiBVUkwgcGFyYW1ldGVyIG5hbWVzIHRvIHZhbHVlc1xuICAgICAgICAgICAqL1xuICAgICAgICAgIHVwZGF0ZVBhcmFtczogZnVuY3Rpb24obmV3UGFyYW1zKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50ICYmIHRoaXMuY3VycmVudC4kJHJvdXRlKSB7XG4gICAgICAgICAgICAgIG5ld1BhcmFtcyA9IGFuZ3VsYXIuZXh0ZW5kKHt9LCB0aGlzLmN1cnJlbnQucGFyYW1zLCBuZXdQYXJhbXMpO1xuICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aChpbnRlcnBvbGF0ZSh0aGlzLmN1cnJlbnQuJCRyb3V0ZS5vcmlnaW5hbFBhdGgsIG5ld1BhcmFtcykpO1xuICAgICAgICAgICAgICAvLyBpbnRlcnBvbGF0ZSBtb2RpZmllcyBuZXdQYXJhbXMsIG9ubHkgcXVlcnkgcGFyYW1zIGFyZSBsZWZ0XG4gICAgICAgICAgICAgICRsb2NhdGlvbi5zZWFyY2gobmV3UGFyYW1zKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRocm93ICRyb3V0ZU1pbkVycignbm9yb3V0JywgJ1RyaWVkIHVwZGF0aW5nIHJvdXRlIHdoZW4gd2l0aCBubyBjdXJyZW50IHJvdXRlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgJHJvb3RTY29wZS4kb24oJyRsb2NhdGlvbkNoYW5nZVN0YXJ0JywgcHJlcGFyZVJvdXRlKTtcbiAgICAkcm9vdFNjb3BlLiRvbignJGxvY2F0aW9uQ2hhbmdlU3VjY2VzcycsIGNvbW1pdFJvdXRlKTtcblxuICAgIHJldHVybiAkcm91dGU7XG5cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIG9uIHtzdHJpbmd9IGN1cnJlbnQgdXJsXG4gICAgICogQHBhcmFtIHJvdXRlIHtPYmplY3R9IHJvdXRlIHJlZ2V4cCB0byBtYXRjaCB0aGUgdXJsIGFnYWluc3RcbiAgICAgKiBAcmV0dXJuIHs/T2JqZWN0fVxuICAgICAqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogQ2hlY2sgaWYgdGhlIHJvdXRlIG1hdGNoZXMgdGhlIGN1cnJlbnQgdXJsLlxuICAgICAqXG4gICAgICogSW5zcGlyZWQgYnkgbWF0Y2ggaW5cbiAgICAgKiB2aXNpb25tZWRpYS9leHByZXNzL2xpYi9yb3V0ZXIvcm91dGVyLmpzLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHN3aXRjaFJvdXRlTWF0Y2hlcihvbiwgcm91dGUpIHtcbiAgICAgIHZhciBrZXlzID0gcm91dGUua2V5cyxcbiAgICAgICAgICBwYXJhbXMgPSB7fTtcblxuICAgICAgaWYgKCFyb3V0ZS5yZWdleHApIHJldHVybiBudWxsO1xuXG4gICAgICB2YXIgbSA9IHJvdXRlLnJlZ2V4cC5leGVjKG9uKTtcbiAgICAgIGlmICghbSkgcmV0dXJuIG51bGw7XG5cbiAgICAgIGZvciAodmFyIGkgPSAxLCBsZW4gPSBtLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICAgIHZhciBrZXkgPSBrZXlzW2kgLSAxXTtcblxuICAgICAgICB2YXIgdmFsID0gbVtpXTtcblxuICAgICAgICBpZiAoa2V5ICYmIHZhbCkge1xuICAgICAgICAgIHBhcmFtc1trZXkubmFtZV0gPSB2YWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBwYXJhbXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHJlcGFyZVJvdXRlKCRsb2NhdGlvbkV2ZW50KSB7XG4gICAgICB2YXIgbGFzdFJvdXRlID0gJHJvdXRlLmN1cnJlbnQ7XG5cbiAgICAgIHByZXBhcmVkUm91dGUgPSBwYXJzZVJvdXRlKCk7XG4gICAgICBwcmVwYXJlZFJvdXRlSXNVcGRhdGVPbmx5ID0gcHJlcGFyZWRSb3V0ZSAmJiBsYXN0Um91dGUgJiYgcHJlcGFyZWRSb3V0ZS4kJHJvdXRlID09PSBsYXN0Um91dGUuJCRyb3V0ZVxuICAgICAgICAgICYmIGFuZ3VsYXIuZXF1YWxzKHByZXBhcmVkUm91dGUucGF0aFBhcmFtcywgbGFzdFJvdXRlLnBhdGhQYXJhbXMpXG4gICAgICAgICAgJiYgIXByZXBhcmVkUm91dGUucmVsb2FkT25TZWFyY2ggJiYgIWZvcmNlUmVsb2FkO1xuXG4gICAgICBpZiAoIXByZXBhcmVkUm91dGVJc1VwZGF0ZU9ubHkgJiYgKGxhc3RSb3V0ZSB8fCBwcmVwYXJlZFJvdXRlKSkge1xuICAgICAgICBpZiAoJHJvb3RTY29wZS4kYnJvYWRjYXN0KCckcm91dGVDaGFuZ2VTdGFydCcsIHByZXBhcmVkUm91dGUsIGxhc3RSb3V0ZSkuZGVmYXVsdFByZXZlbnRlZCkge1xuICAgICAgICAgIGlmICgkbG9jYXRpb25FdmVudCkge1xuICAgICAgICAgICAgJGxvY2F0aW9uRXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb21taXRSb3V0ZSgpIHtcbiAgICAgIHZhciBsYXN0Um91dGUgPSAkcm91dGUuY3VycmVudDtcbiAgICAgIHZhciBuZXh0Um91dGUgPSBwcmVwYXJlZFJvdXRlO1xuXG4gICAgICBpZiAocHJlcGFyZWRSb3V0ZUlzVXBkYXRlT25seSkge1xuICAgICAgICBsYXN0Um91dGUucGFyYW1zID0gbmV4dFJvdXRlLnBhcmFtcztcbiAgICAgICAgYW5ndWxhci5jb3B5KGxhc3RSb3V0ZS5wYXJhbXMsICRyb3V0ZVBhcmFtcyk7XG4gICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnJHJvdXRlVXBkYXRlJywgbGFzdFJvdXRlKTtcbiAgICAgIH0gZWxzZSBpZiAobmV4dFJvdXRlIHx8IGxhc3RSb3V0ZSkge1xuICAgICAgICBmb3JjZVJlbG9hZCA9IGZhbHNlO1xuICAgICAgICAkcm91dGUuY3VycmVudCA9IG5leHRSb3V0ZTtcblxuICAgICAgICB2YXIgbmV4dFJvdXRlUHJvbWlzZSA9ICRxLnJlc29sdmUobmV4dFJvdXRlKTtcblxuICAgICAgICAkYnJvd3Nlci4kJGluY091dHN0YW5kaW5nUmVxdWVzdENvdW50KCk7XG5cbiAgICAgICAgbmV4dFJvdXRlUHJvbWlzZS5cbiAgICAgICAgICB0aGVuKGdldFJlZGlyZWN0aW9uRGF0YSkuXG4gICAgICAgICAgdGhlbihoYW5kbGVQb3NzaWJsZVJlZGlyZWN0aW9uKS5cbiAgICAgICAgICB0aGVuKGZ1bmN0aW9uKGtlZXBQcm9jZXNzaW5nUm91dGUpIHtcbiAgICAgICAgICAgIHJldHVybiBrZWVwUHJvY2Vzc2luZ1JvdXRlICYmIG5leHRSb3V0ZVByb21pc2UuXG4gICAgICAgICAgICAgIHRoZW4ocmVzb2x2ZUxvY2FscykuXG4gICAgICAgICAgICAgIHRoZW4oZnVuY3Rpb24obG9jYWxzKSB7XG4gICAgICAgICAgICAgICAgLy8gYWZ0ZXIgcm91dGUgY2hhbmdlXG4gICAgICAgICAgICAgICAgaWYgKG5leHRSb3V0ZSA9PT0gJHJvdXRlLmN1cnJlbnQpIHtcbiAgICAgICAgICAgICAgICAgIGlmIChuZXh0Um91dGUpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV4dFJvdXRlLmxvY2FscyA9IGxvY2FscztcbiAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5jb3B5KG5leHRSb3V0ZS5wYXJhbXMsICRyb3V0ZVBhcmFtcyk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJyRyb3V0ZUNoYW5nZVN1Y2Nlc3MnLCBuZXh0Um91dGUsIGxhc3RSb3V0ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgICAgaWYgKG5leHRSb3V0ZSA9PT0gJHJvdXRlLmN1cnJlbnQpIHtcbiAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCckcm91dGVDaGFuZ2VFcnJvcicsIG5leHRSb3V0ZSwgbGFzdFJvdXRlLCBlcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSkuZmluYWxseShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vIEJlY2F1c2UgYGNvbW1pdFJvdXRlKClgIGlzIGNhbGxlZCBmcm9tIGEgYCRyb290U2NvcGUuJGV2YWxBc3luY2AgYmxvY2sgKHNlZVxuICAgICAgICAgICAgLy8gYCRsb2NhdGlvbldhdGNoYCksIHRoaXMgYCQkY29tcGxldGVPdXRzdGFuZGluZ1JlcXVlc3QoKWAgY2FsbCB3aWxsIG5vdCBjYXVzZVxuICAgICAgICAgICAgLy8gYG91dHN0YW5kaW5nUmVxdWVzdENvdW50YCB0byBoaXQgemVyby4gIFRoaXMgaXMgaW1wb3J0YW50IGluIGNhc2Ugd2UgYXJlIHJlZGlyZWN0aW5nXG4gICAgICAgICAgICAvLyB0byBhIG5ldyByb3V0ZSB3aGljaCBhbHNvIHJlcXVpcmVzIHNvbWUgYXN5bmNocm9ub3VzIHdvcmsuXG5cbiAgICAgICAgICAgICRicm93c2VyLiQkY29tcGxldGVPdXRzdGFuZGluZ1JlcXVlc3Qobm9vcCk7XG4gICAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0UmVkaXJlY3Rpb25EYXRhKHJvdXRlKSB7XG4gICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgcm91dGU6IHJvdXRlLFxuICAgICAgICBoYXNSZWRpcmVjdGlvbjogZmFsc2VcbiAgICAgIH07XG5cbiAgICAgIGlmIChyb3V0ZSkge1xuICAgICAgICBpZiAocm91dGUucmVkaXJlY3RUbykge1xuICAgICAgICAgIGlmIChhbmd1bGFyLmlzU3RyaW5nKHJvdXRlLnJlZGlyZWN0VG8pKSB7XG4gICAgICAgICAgICBkYXRhLnBhdGggPSBpbnRlcnBvbGF0ZShyb3V0ZS5yZWRpcmVjdFRvLCByb3V0ZS5wYXJhbXMpO1xuICAgICAgICAgICAgZGF0YS5zZWFyY2ggPSByb3V0ZS5wYXJhbXM7XG4gICAgICAgICAgICBkYXRhLmhhc1JlZGlyZWN0aW9uID0gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIG9sZFBhdGggPSAkbG9jYXRpb24ucGF0aCgpO1xuICAgICAgICAgICAgdmFyIG9sZFNlYXJjaCA9ICRsb2NhdGlvbi5zZWFyY2goKTtcbiAgICAgICAgICAgIHZhciBuZXdVcmwgPSByb3V0ZS5yZWRpcmVjdFRvKHJvdXRlLnBhdGhQYXJhbXMsIG9sZFBhdGgsIG9sZFNlYXJjaCk7XG5cbiAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZChuZXdVcmwpKSB7XG4gICAgICAgICAgICAgIGRhdGEudXJsID0gbmV3VXJsO1xuICAgICAgICAgICAgICBkYXRhLmhhc1JlZGlyZWN0aW9uID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAocm91dGUucmVzb2x2ZVJlZGlyZWN0VG8pIHtcbiAgICAgICAgICByZXR1cm4gJHEuXG4gICAgICAgICAgICByZXNvbHZlKCRpbmplY3Rvci5pbnZva2Uocm91dGUucmVzb2x2ZVJlZGlyZWN0VG8pKS5cbiAgICAgICAgICAgIHRoZW4oZnVuY3Rpb24obmV3VXJsKSB7XG4gICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZChuZXdVcmwpKSB7XG4gICAgICAgICAgICAgICAgZGF0YS51cmwgPSBuZXdVcmw7XG4gICAgICAgICAgICAgICAgZGF0YS5oYXNSZWRpcmVjdGlvbiA9IHRydWU7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhhbmRsZVBvc3NpYmxlUmVkaXJlY3Rpb24oZGF0YSkge1xuICAgICAgdmFyIGtlZXBQcm9jZXNzaW5nUm91dGUgPSB0cnVlO1xuXG4gICAgICBpZiAoZGF0YS5yb3V0ZSAhPT0gJHJvdXRlLmN1cnJlbnQpIHtcbiAgICAgICAga2VlcFByb2Nlc3NpbmdSb3V0ZSA9IGZhbHNlO1xuICAgICAgfSBlbHNlIGlmIChkYXRhLmhhc1JlZGlyZWN0aW9uKSB7XG4gICAgICAgIHZhciBvbGRVcmwgPSAkbG9jYXRpb24udXJsKCk7XG4gICAgICAgIHZhciBuZXdVcmwgPSBkYXRhLnVybDtcblxuICAgICAgICBpZiAobmV3VXJsKSB7XG4gICAgICAgICAgJGxvY2F0aW9uLlxuICAgICAgICAgICAgdXJsKG5ld1VybCkuXG4gICAgICAgICAgICByZXBsYWNlKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmV3VXJsID0gJGxvY2F0aW9uLlxuICAgICAgICAgICAgcGF0aChkYXRhLnBhdGgpLlxuICAgICAgICAgICAgc2VhcmNoKGRhdGEuc2VhcmNoKS5cbiAgICAgICAgICAgIHJlcGxhY2UoKS5cbiAgICAgICAgICAgIHVybCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5ld1VybCAhPT0gb2xkVXJsKSB7XG4gICAgICAgICAgLy8gRXhpdCBvdXQgYW5kIGRvbid0IHByb2Nlc3MgY3VycmVudCBuZXh0IHZhbHVlLFxuICAgICAgICAgIC8vIHdhaXQgZm9yIG5leHQgbG9jYXRpb24gY2hhbmdlIGZyb20gcmVkaXJlY3RcbiAgICAgICAgICBrZWVwUHJvY2Vzc2luZ1JvdXRlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGtlZXBQcm9jZXNzaW5nUm91dGU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVzb2x2ZUxvY2Fscyhyb3V0ZSkge1xuICAgICAgaWYgKHJvdXRlKSB7XG4gICAgICAgIHZhciBsb2NhbHMgPSBhbmd1bGFyLmV4dGVuZCh7fSwgcm91dGUucmVzb2x2ZSk7XG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaChsb2NhbHMsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICBsb2NhbHNba2V5XSA9IGFuZ3VsYXIuaXNTdHJpbmcodmFsdWUpID9cbiAgICAgICAgICAgICAgJGluamVjdG9yLmdldCh2YWx1ZSkgOlxuICAgICAgICAgICAgICAkaW5qZWN0b3IuaW52b2tlKHZhbHVlLCBudWxsLCBudWxsLCBrZXkpO1xuICAgICAgICB9KTtcbiAgICAgICAgdmFyIHRlbXBsYXRlID0gZ2V0VGVtcGxhdGVGb3Iocm91dGUpO1xuICAgICAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQodGVtcGxhdGUpKSB7XG4gICAgICAgICAgbG9jYWxzWyckdGVtcGxhdGUnXSA9IHRlbXBsYXRlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAkcS5hbGwobG9jYWxzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRUZW1wbGF0ZUZvcihyb3V0ZSkge1xuICAgICAgdmFyIHRlbXBsYXRlLCB0ZW1wbGF0ZVVybDtcbiAgICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZCh0ZW1wbGF0ZSA9IHJvdXRlLnRlbXBsYXRlKSkge1xuICAgICAgICBpZiAoYW5ndWxhci5pc0Z1bmN0aW9uKHRlbXBsYXRlKSkge1xuICAgICAgICAgIHRlbXBsYXRlID0gdGVtcGxhdGUocm91dGUucGFyYW1zKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChhbmd1bGFyLmlzRGVmaW5lZCh0ZW1wbGF0ZVVybCA9IHJvdXRlLnRlbXBsYXRlVXJsKSkge1xuICAgICAgICBpZiAoYW5ndWxhci5pc0Z1bmN0aW9uKHRlbXBsYXRlVXJsKSkge1xuICAgICAgICAgIHRlbXBsYXRlVXJsID0gdGVtcGxhdGVVcmwocm91dGUucGFyYW1zKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQodGVtcGxhdGVVcmwpKSB7XG4gICAgICAgICAgcm91dGUubG9hZGVkVGVtcGxhdGVVcmwgPSAkc2NlLnZhbHVlT2YodGVtcGxhdGVVcmwpO1xuICAgICAgICAgIHRlbXBsYXRlID0gJHRlbXBsYXRlUmVxdWVzdCh0ZW1wbGF0ZVVybCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSB0aGUgY3VycmVudCBhY3RpdmUgcm91dGUsIGJ5IG1hdGNoaW5nIGl0IGFnYWluc3QgdGhlIFVSTFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHBhcnNlUm91dGUoKSB7XG4gICAgICAvLyBNYXRjaCBhIHJvdXRlXG4gICAgICB2YXIgcGFyYW1zLCBtYXRjaDtcbiAgICAgIGFuZ3VsYXIuZm9yRWFjaChyb3V0ZXMsIGZ1bmN0aW9uKHJvdXRlLCBwYXRoKSB7XG4gICAgICAgIGlmICghbWF0Y2ggJiYgKHBhcmFtcyA9IHN3aXRjaFJvdXRlTWF0Y2hlcigkbG9jYXRpb24ucGF0aCgpLCByb3V0ZSkpKSB7XG4gICAgICAgICAgbWF0Y2ggPSBpbmhlcml0KHJvdXRlLCB7XG4gICAgICAgICAgICBwYXJhbXM6IGFuZ3VsYXIuZXh0ZW5kKHt9LCAkbG9jYXRpb24uc2VhcmNoKCksIHBhcmFtcyksXG4gICAgICAgICAgICBwYXRoUGFyYW1zOiBwYXJhbXN9KTtcbiAgICAgICAgICBtYXRjaC4kJHJvdXRlID0gcm91dGU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgLy8gTm8gcm91dGUgbWF0Y2hlZDsgZmFsbGJhY2sgdG8gXCJvdGhlcndpc2VcIiByb3V0ZVxuICAgICAgcmV0dXJuIG1hdGNoIHx8IHJvdXRlc1tudWxsXSAmJiBpbmhlcml0KHJvdXRlc1tudWxsXSwge3BhcmFtczoge30sIHBhdGhQYXJhbXM6e319KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBpbnRlcnBvbGF0aW9uIG9mIHRoZSByZWRpcmVjdCBwYXRoIHdpdGggdGhlIHBhcmFtZXRlcnNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpbnRlcnBvbGF0ZShzdHJpbmcsIHBhcmFtcykge1xuICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgYW5ndWxhci5mb3JFYWNoKChzdHJpbmcgfHwgJycpLnNwbGl0KCc6JyksIGZ1bmN0aW9uKHNlZ21lbnQsIGkpIHtcbiAgICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgICByZXN1bHQucHVzaChzZWdtZW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgc2VnbWVudE1hdGNoID0gc2VnbWVudC5tYXRjaCgvKFxcdyspKD86Wz8qXSk/KC4qKS8pO1xuICAgICAgICAgIHZhciBrZXkgPSBzZWdtZW50TWF0Y2hbMV07XG4gICAgICAgICAgcmVzdWx0LnB1c2gocGFyYW1zW2tleV0pO1xuICAgICAgICAgIHJlc3VsdC5wdXNoKHNlZ21lbnRNYXRjaFsyXSB8fCAnJyk7XG4gICAgICAgICAgZGVsZXRlIHBhcmFtc1trZXldO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXN1bHQuam9pbignJyk7XG4gICAgfVxuICB9XTtcbn1cblxuaW5zdGFudGlhdGVSb3V0ZS4kaW5qZWN0ID0gWyckaW5qZWN0b3InXTtcbmZ1bmN0aW9uIGluc3RhbnRpYXRlUm91dGUoJGluamVjdG9yKSB7XG4gIGlmIChpc0VhZ2VySW5zdGFudGlhdGlvbkVuYWJsZWQpIHtcbiAgICAvLyBJbnN0YW50aWF0ZSBgJHJvdXRlYFxuICAgICRpbmplY3Rvci5nZXQoJyRyb3V0ZScpO1xuICB9XG59XG5cbm5nUm91dGVNb2R1bGUucHJvdmlkZXIoJyRyb3V0ZVBhcmFtcycsICRSb3V0ZVBhcmFtc1Byb3ZpZGVyKTtcblxuXG4vKipcbiAqIEBuZ2RvYyBzZXJ2aWNlXG4gKiBAbmFtZSAkcm91dGVQYXJhbXNcbiAqIEByZXF1aXJlcyAkcm91dGVcbiAqIEB0aGlzXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBUaGUgYCRyb3V0ZVBhcmFtc2Agc2VydmljZSBhbGxvd3MgeW91IHRvIHJldHJpZXZlIHRoZSBjdXJyZW50IHNldCBvZiByb3V0ZSBwYXJhbWV0ZXJzLlxuICpcbiAqIFJlcXVpcmVzIHRoZSB7QGxpbmsgbmdSb3V0ZSBgbmdSb3V0ZWB9IG1vZHVsZSB0byBiZSBpbnN0YWxsZWQuXG4gKlxuICogVGhlIHJvdXRlIHBhcmFtZXRlcnMgYXJlIGEgY29tYmluYXRpb24gb2Yge0BsaW5rIG5nLiRsb2NhdGlvbiBgJGxvY2F0aW9uYH0nc1xuICoge0BsaW5rIG5nLiRsb2NhdGlvbiNzZWFyY2ggYHNlYXJjaCgpYH0gYW5kIHtAbGluayBuZy4kbG9jYXRpb24jcGF0aCBgcGF0aCgpYH0uXG4gKiBUaGUgYHBhdGhgIHBhcmFtZXRlcnMgYXJlIGV4dHJhY3RlZCB3aGVuIHRoZSB7QGxpbmsgbmdSb3V0ZS4kcm91dGUgYCRyb3V0ZWB9IHBhdGggaXMgbWF0Y2hlZC5cbiAqXG4gKiBJbiBjYXNlIG9mIHBhcmFtZXRlciBuYW1lIGNvbGxpc2lvbiwgYHBhdGhgIHBhcmFtcyB0YWtlIHByZWNlZGVuY2Ugb3ZlciBgc2VhcmNoYCBwYXJhbXMuXG4gKlxuICogVGhlIHNlcnZpY2UgZ3VhcmFudGVlcyB0aGF0IHRoZSBpZGVudGl0eSBvZiB0aGUgYCRyb3V0ZVBhcmFtc2Agb2JqZWN0IHdpbGwgcmVtYWluIHVuY2hhbmdlZFxuICogKGJ1dCBpdHMgcHJvcGVydGllcyB3aWxsIGxpa2VseSBjaGFuZ2UpIGV2ZW4gd2hlbiBhIHJvdXRlIGNoYW5nZSBvY2N1cnMuXG4gKlxuICogTm90ZSB0aGF0IHRoZSBgJHJvdXRlUGFyYW1zYCBhcmUgb25seSB1cGRhdGVkICphZnRlciogYSByb3V0ZSBjaGFuZ2UgY29tcGxldGVzIHN1Y2Nlc3NmdWxseS5cbiAqIFRoaXMgbWVhbnMgdGhhdCB5b3UgY2Fubm90IHJlbHkgb24gYCRyb3V0ZVBhcmFtc2AgYmVpbmcgY29ycmVjdCBpbiByb3V0ZSByZXNvbHZlIGZ1bmN0aW9ucy5cbiAqIEluc3RlYWQgeW91IGNhbiB1c2UgYCRyb3V0ZS5jdXJyZW50LnBhcmFtc2AgdG8gYWNjZXNzIHRoZSBuZXcgcm91dGUncyBwYXJhbWV0ZXJzLlxuICpcbiAqIEBleGFtcGxlXG4gKiBgYGBqc1xuICogIC8vIEdpdmVuOlxuICogIC8vIFVSTDogaHR0cDovL3NlcnZlci5jb20vaW5kZXguaHRtbCMvQ2hhcHRlci8xL1NlY3Rpb24vMj9zZWFyY2g9bW9ieVxuICogIC8vIFJvdXRlOiAvQ2hhcHRlci86Y2hhcHRlcklkL1NlY3Rpb24vOnNlY3Rpb25JZFxuICogIC8vXG4gKiAgLy8gVGhlblxuICogICRyb3V0ZVBhcmFtcyA9PT4ge2NoYXB0ZXJJZDonMScsIHNlY3Rpb25JZDonMicsIHNlYXJjaDonbW9ieSd9XG4gKiBgYGBcbiAqL1xuZnVuY3Rpb24gJFJvdXRlUGFyYW1zUHJvdmlkZXIoKSB7XG4gIHRoaXMuJGdldCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4ge307IH07XG59XG5cbm5nUm91dGVNb2R1bGUuZGlyZWN0aXZlKCduZ1ZpZXcnLCBuZ1ZpZXdGYWN0b3J5KTtcbm5nUm91dGVNb2R1bGUuZGlyZWN0aXZlKCduZ1ZpZXcnLCBuZ1ZpZXdGaWxsQ29udGVudEZhY3RvcnkpO1xuXG5cbi8qKlxuICogQG5nZG9jIGRpcmVjdGl2ZVxuICogQG5hbWUgbmdWaWV3XG4gKiBAcmVzdHJpY3QgRUNBXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBgbmdWaWV3YCBpcyBhIGRpcmVjdGl2ZSB0aGF0IGNvbXBsZW1lbnRzIHRoZSB7QGxpbmsgbmdSb3V0ZS4kcm91dGUgJHJvdXRlfSBzZXJ2aWNlIGJ5XG4gKiBpbmNsdWRpbmcgdGhlIHJlbmRlcmVkIHRlbXBsYXRlIG9mIHRoZSBjdXJyZW50IHJvdXRlIGludG8gdGhlIG1haW4gbGF5b3V0IChgaW5kZXguaHRtbGApIGZpbGUuXG4gKiBFdmVyeSB0aW1lIHRoZSBjdXJyZW50IHJvdXRlIGNoYW5nZXMsIHRoZSBpbmNsdWRlZCB2aWV3IGNoYW5nZXMgd2l0aCBpdCBhY2NvcmRpbmcgdG8gdGhlXG4gKiBjb25maWd1cmF0aW9uIG9mIHRoZSBgJHJvdXRlYCBzZXJ2aWNlLlxuICpcbiAqIFJlcXVpcmVzIHRoZSB7QGxpbmsgbmdSb3V0ZSBgbmdSb3V0ZWB9IG1vZHVsZSB0byBiZSBpbnN0YWxsZWQuXG4gKlxuICogQGFuaW1hdGlvbnNcbiAqIHwgQW5pbWF0aW9uICAgICAgICAgICAgICAgICAgICAgICAgfCBPY2N1cnMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gKiB8LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLXwtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tfFxuICogfCB7QGxpbmsgbmcuJGFuaW1hdGUjZW50ZXIgZW50ZXJ9ICB8IHdoZW4gdGhlIG5ldyBlbGVtZW50IGlzIGluc2VydGVkIHRvIHRoZSBET00gfFxuICogfCB7QGxpbmsgbmcuJGFuaW1hdGUjbGVhdmUgbGVhdmV9ICB8IHdoZW4gdGhlIG9sZCBlbGVtZW50IGlzIHJlbW92ZWQgZnJvbSB0byB0aGUgRE9NICB8XG4gKlxuICogVGhlIGVudGVyIGFuZCBsZWF2ZSBhbmltYXRpb24gb2NjdXIgY29uY3VycmVudGx5LlxuICpcbiAqIEBzY29wZVxuICogQHByaW9yaXR5IDQwMFxuICogQHBhcmFtIHtzdHJpbmc9fSBvbmxvYWQgRXhwcmVzc2lvbiB0byBldmFsdWF0ZSB3aGVuZXZlciB0aGUgdmlldyB1cGRhdGVzLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nPX0gYXV0b3Njcm9sbCBXaGV0aGVyIGBuZ1ZpZXdgIHNob3VsZCBjYWxsIHtAbGluayBuZy4kYW5jaG9yU2Nyb2xsXG4gKiAgICAgICAgICAgICAgICAgICRhbmNob3JTY3JvbGx9IHRvIHNjcm9sbCB0aGUgdmlld3BvcnQgYWZ0ZXIgdGhlIHZpZXcgaXMgdXBkYXRlZC5cbiAqXG4gKiAgICAgICAgICAgICAgICAgIC0gSWYgdGhlIGF0dHJpYnV0ZSBpcyBub3Qgc2V0LCBkaXNhYmxlIHNjcm9sbGluZy5cbiAqICAgICAgICAgICAgICAgICAgLSBJZiB0aGUgYXR0cmlidXRlIGlzIHNldCB3aXRob3V0IHZhbHVlLCBlbmFibGUgc2Nyb2xsaW5nLlxuICogICAgICAgICAgICAgICAgICAtIE90aGVyd2lzZSBlbmFibGUgc2Nyb2xsaW5nIG9ubHkgaWYgdGhlIGBhdXRvc2Nyb2xsYCBhdHRyaWJ1dGUgdmFsdWUgZXZhbHVhdGVkXG4gKiAgICAgICAgICAgICAgICAgICAgYXMgYW4gZXhwcmVzc2lvbiB5aWVsZHMgYSB0cnV0aHkgdmFsdWUuXG4gKiBAZXhhbXBsZVxuICAgIDxleGFtcGxlIG5hbWU9XCJuZ1ZpZXctZGlyZWN0aXZlXCIgbW9kdWxlPVwibmdWaWV3RXhhbXBsZVwiXG4gICAgICAgICAgICAgZGVwcz1cImFuZ3VsYXItcm91dGUuanM7YW5ndWxhci1hbmltYXRlLmpzXCJcbiAgICAgICAgICAgICBhbmltYXRpb25zPVwidHJ1ZVwiIGZpeEJhc2U9XCJ0cnVlXCI+XG4gICAgICA8ZmlsZSBuYW1lPVwiaW5kZXguaHRtbFwiPlxuICAgICAgICA8ZGl2IG5nLWNvbnRyb2xsZXI9XCJNYWluQ3RybCBhcyBtYWluXCI+XG4gICAgICAgICAgQ2hvb3NlOlxuICAgICAgICAgIDxhIGhyZWY9XCJCb29rL01vYnlcIj5Nb2J5PC9hPiB8XG4gICAgICAgICAgPGEgaHJlZj1cIkJvb2svTW9ieS9jaC8xXCI+TW9ieTogQ2gxPC9hPiB8XG4gICAgICAgICAgPGEgaHJlZj1cIkJvb2svR2F0c2J5XCI+R2F0c2J5PC9hPiB8XG4gICAgICAgICAgPGEgaHJlZj1cIkJvb2svR2F0c2J5L2NoLzQ/a2V5PXZhbHVlXCI+R2F0c2J5OiBDaDQ8L2E+IHxcbiAgICAgICAgICA8YSBocmVmPVwiQm9vay9TY2FybGV0XCI+U2NhcmxldCBMZXR0ZXI8L2E+PGJyLz5cblxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJ2aWV3LWFuaW1hdGUtY29udGFpbmVyXCI+XG4gICAgICAgICAgICA8ZGl2IG5nLXZpZXcgY2xhc3M9XCJ2aWV3LWFuaW1hdGVcIj48L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8aHIgLz5cblxuICAgICAgICAgIDxwcmU+JGxvY2F0aW9uLnBhdGgoKSA9IHt7bWFpbi4kbG9jYXRpb24ucGF0aCgpfX08L3ByZT5cbiAgICAgICAgICA8cHJlPiRyb3V0ZS5jdXJyZW50LnRlbXBsYXRlVXJsID0ge3ttYWluLiRyb3V0ZS5jdXJyZW50LnRlbXBsYXRlVXJsfX08L3ByZT5cbiAgICAgICAgICA8cHJlPiRyb3V0ZS5jdXJyZW50LnBhcmFtcyA9IHt7bWFpbi4kcm91dGUuY3VycmVudC5wYXJhbXN9fTwvcHJlPlxuICAgICAgICAgIDxwcmU+JHJvdXRlUGFyYW1zID0ge3ttYWluLiRyb3V0ZVBhcmFtc319PC9wcmU+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9maWxlPlxuXG4gICAgICA8ZmlsZSBuYW1lPVwiYm9vay5odG1sXCI+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgY29udHJvbGxlcjoge3tib29rLm5hbWV9fTxiciAvPlxuICAgICAgICAgIEJvb2sgSWQ6IHt7Ym9vay5wYXJhbXMuYm9va0lkfX08YnIgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2ZpbGU+XG5cbiAgICAgIDxmaWxlIG5hbWU9XCJjaGFwdGVyLmh0bWxcIj5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICBjb250cm9sbGVyOiB7e2NoYXB0ZXIubmFtZX19PGJyIC8+XG4gICAgICAgICAgQm9vayBJZDoge3tjaGFwdGVyLnBhcmFtcy5ib29rSWR9fTxiciAvPlxuICAgICAgICAgIENoYXB0ZXIgSWQ6IHt7Y2hhcHRlci5wYXJhbXMuY2hhcHRlcklkfX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2ZpbGU+XG5cbiAgICAgIDxmaWxlIG5hbWU9XCJhbmltYXRpb25zLmNzc1wiPlxuICAgICAgICAudmlldy1hbmltYXRlLWNvbnRhaW5lciB7XG4gICAgICAgICAgcG9zaXRpb246cmVsYXRpdmU7XG4gICAgICAgICAgaGVpZ2h0OjEwMHB4IWltcG9ydGFudDtcbiAgICAgICAgICBiYWNrZ3JvdW5kOndoaXRlO1xuICAgICAgICAgIGJvcmRlcjoxcHggc29saWQgYmxhY2s7XG4gICAgICAgICAgaGVpZ2h0OjQwcHg7XG4gICAgICAgICAgb3ZlcmZsb3c6aGlkZGVuO1xuICAgICAgICB9XG5cbiAgICAgICAgLnZpZXctYW5pbWF0ZSB7XG4gICAgICAgICAgcGFkZGluZzoxMHB4O1xuICAgICAgICB9XG5cbiAgICAgICAgLnZpZXctYW5pbWF0ZS5uZy1lbnRlciwgLnZpZXctYW5pbWF0ZS5uZy1sZWF2ZSB7XG4gICAgICAgICAgdHJhbnNpdGlvbjphbGwgY3ViaWMtYmV6aWVyKDAuMjUwLCAwLjQ2MCwgMC40NTAsIDAuOTQwKSAxLjVzO1xuXG4gICAgICAgICAgZGlzcGxheTpibG9jaztcbiAgICAgICAgICB3aWR0aDoxMDAlO1xuICAgICAgICAgIGJvcmRlci1sZWZ0OjFweCBzb2xpZCBibGFjaztcblxuICAgICAgICAgIHBvc2l0aW9uOmFic29sdXRlO1xuICAgICAgICAgIHRvcDowO1xuICAgICAgICAgIGxlZnQ6MDtcbiAgICAgICAgICByaWdodDowO1xuICAgICAgICAgIGJvdHRvbTowO1xuICAgICAgICAgIHBhZGRpbmc6MTBweDtcbiAgICAgICAgfVxuXG4gICAgICAgIC52aWV3LWFuaW1hdGUubmctZW50ZXIge1xuICAgICAgICAgIGxlZnQ6MTAwJTtcbiAgICAgICAgfVxuICAgICAgICAudmlldy1hbmltYXRlLm5nLWVudGVyLm5nLWVudGVyLWFjdGl2ZSB7XG4gICAgICAgICAgbGVmdDowO1xuICAgICAgICB9XG4gICAgICAgIC52aWV3LWFuaW1hdGUubmctbGVhdmUubmctbGVhdmUtYWN0aXZlIHtcbiAgICAgICAgICBsZWZ0Oi0xMDAlO1xuICAgICAgICB9XG4gICAgICA8L2ZpbGU+XG5cbiAgICAgIDxmaWxlIG5hbWU9XCJzY3JpcHQuanNcIj5cbiAgICAgICAgYW5ndWxhci5tb2R1bGUoJ25nVmlld0V4YW1wbGUnLCBbJ25nUm91dGUnLCAnbmdBbmltYXRlJ10pXG4gICAgICAgICAgLmNvbmZpZyhbJyRyb3V0ZVByb3ZpZGVyJywgJyRsb2NhdGlvblByb3ZpZGVyJyxcbiAgICAgICAgICAgIGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlcikge1xuICAgICAgICAgICAgICAkcm91dGVQcm92aWRlclxuICAgICAgICAgICAgICAgIC53aGVuKCcvQm9vay86Ym9va0lkJywge1xuICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdib29rLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0Jvb2tDdHJsJyxcbiAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2Jvb2snXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAud2hlbignL0Jvb2svOmJvb2tJZC9jaC86Y2hhcHRlcklkJywge1xuICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjaGFwdGVyLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0NoYXB0ZXJDdHJsJyxcbiAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2NoYXB0ZXInXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xuICAgICAgICAgIH1dKVxuICAgICAgICAgIC5jb250cm9sbGVyKCdNYWluQ3RybCcsIFsnJHJvdXRlJywgJyRyb3V0ZVBhcmFtcycsICckbG9jYXRpb24nLFxuICAgICAgICAgICAgZnVuY3Rpb24gTWFpbkN0cmwoJHJvdXRlLCAkcm91dGVQYXJhbXMsICRsb2NhdGlvbikge1xuICAgICAgICAgICAgICB0aGlzLiRyb3V0ZSA9ICRyb3V0ZTtcbiAgICAgICAgICAgICAgdGhpcy4kbG9jYXRpb24gPSAkbG9jYXRpb247XG4gICAgICAgICAgICAgIHRoaXMuJHJvdXRlUGFyYW1zID0gJHJvdXRlUGFyYW1zO1xuICAgICAgICAgIH1dKVxuICAgICAgICAgIC5jb250cm9sbGVyKCdCb29rQ3RybCcsIFsnJHJvdXRlUGFyYW1zJywgZnVuY3Rpb24gQm9va0N0cmwoJHJvdXRlUGFyYW1zKSB7XG4gICAgICAgICAgICB0aGlzLm5hbWUgPSAnQm9va0N0cmwnO1xuICAgICAgICAgICAgdGhpcy5wYXJhbXMgPSAkcm91dGVQYXJhbXM7XG4gICAgICAgICAgfV0pXG4gICAgICAgICAgLmNvbnRyb2xsZXIoJ0NoYXB0ZXJDdHJsJywgWyckcm91dGVQYXJhbXMnLCBmdW5jdGlvbiBDaGFwdGVyQ3RybCgkcm91dGVQYXJhbXMpIHtcbiAgICAgICAgICAgIHRoaXMubmFtZSA9ICdDaGFwdGVyQ3RybCc7XG4gICAgICAgICAgICB0aGlzLnBhcmFtcyA9ICRyb3V0ZVBhcmFtcztcbiAgICAgICAgICB9XSk7XG5cbiAgICAgIDwvZmlsZT5cblxuICAgICAgPGZpbGUgbmFtZT1cInByb3RyYWN0b3IuanNcIiB0eXBlPVwicHJvdHJhY3RvclwiPlxuICAgICAgICBpdCgnc2hvdWxkIGxvYWQgYW5kIGNvbXBpbGUgY29ycmVjdCB0ZW1wbGF0ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGVsZW1lbnQoYnkubGlua1RleHQoJ01vYnk6IENoMScpKS5jbGljaygpO1xuICAgICAgICAgIHZhciBjb250ZW50ID0gZWxlbWVudChieS5jc3MoJ1tuZy12aWV3XScpKS5nZXRUZXh0KCk7XG4gICAgICAgICAgZXhwZWN0KGNvbnRlbnQpLnRvTWF0Y2goL2NvbnRyb2xsZXI6IENoYXB0ZXJDdHJsLyk7XG4gICAgICAgICAgZXhwZWN0KGNvbnRlbnQpLnRvTWF0Y2goL0Jvb2sgSWQ6IE1vYnkvKTtcbiAgICAgICAgICBleHBlY3QoY29udGVudCkudG9NYXRjaCgvQ2hhcHRlciBJZDogMS8pO1xuXG4gICAgICAgICAgZWxlbWVudChieS5wYXJ0aWFsTGlua1RleHQoJ1NjYXJsZXQnKSkuY2xpY2soKTtcblxuICAgICAgICAgIGNvbnRlbnQgPSBlbGVtZW50KGJ5LmNzcygnW25nLXZpZXddJykpLmdldFRleHQoKTtcbiAgICAgICAgICBleHBlY3QoY29udGVudCkudG9NYXRjaCgvY29udHJvbGxlcjogQm9va0N0cmwvKTtcbiAgICAgICAgICBleHBlY3QoY29udGVudCkudG9NYXRjaCgvQm9vayBJZDogU2NhcmxldC8pO1xuICAgICAgICB9KTtcbiAgICAgIDwvZmlsZT5cbiAgICA8L2V4YW1wbGU+XG4gKi9cblxuXG4vKipcbiAqIEBuZ2RvYyBldmVudFxuICogQG5hbWUgbmdWaWV3IyR2aWV3Q29udGVudExvYWRlZFxuICogQGV2ZW50VHlwZSBlbWl0IG9uIHRoZSBjdXJyZW50IG5nVmlldyBzY29wZVxuICogQGRlc2NyaXB0aW9uXG4gKiBFbWl0dGVkIGV2ZXJ5IHRpbWUgdGhlIG5nVmlldyBjb250ZW50IGlzIHJlbG9hZGVkLlxuICovXG5uZ1ZpZXdGYWN0b3J5LiRpbmplY3QgPSBbJyRyb3V0ZScsICckYW5jaG9yU2Nyb2xsJywgJyRhbmltYXRlJ107XG5mdW5jdGlvbiBuZ1ZpZXdGYWN0b3J5KCRyb3V0ZSwgJGFuY2hvclNjcm9sbCwgJGFuaW1hdGUpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0VDQScsXG4gICAgdGVybWluYWw6IHRydWUsXG4gICAgcHJpb3JpdHk6IDQwMCxcbiAgICB0cmFuc2NsdWRlOiAnZWxlbWVudCcsXG4gICAgbGluazogZnVuY3Rpb24oc2NvcGUsICRlbGVtZW50LCBhdHRyLCBjdHJsLCAkdHJhbnNjbHVkZSkge1xuICAgICAgICB2YXIgY3VycmVudFNjb3BlLFxuICAgICAgICAgICAgY3VycmVudEVsZW1lbnQsXG4gICAgICAgICAgICBwcmV2aW91c0xlYXZlQW5pbWF0aW9uLFxuICAgICAgICAgICAgYXV0b1Njcm9sbEV4cCA9IGF0dHIuYXV0b3Njcm9sbCxcbiAgICAgICAgICAgIG9ubG9hZEV4cCA9IGF0dHIub25sb2FkIHx8ICcnO1xuXG4gICAgICAgIHNjb3BlLiRvbignJHJvdXRlQ2hhbmdlU3VjY2VzcycsIHVwZGF0ZSk7XG4gICAgICAgIHVwZGF0ZSgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGNsZWFudXBMYXN0VmlldygpIHtcbiAgICAgICAgICBpZiAocHJldmlvdXNMZWF2ZUFuaW1hdGlvbikge1xuICAgICAgICAgICAgJGFuaW1hdGUuY2FuY2VsKHByZXZpb3VzTGVhdmVBbmltYXRpb24pO1xuICAgICAgICAgICAgcHJldmlvdXNMZWF2ZUFuaW1hdGlvbiA9IG51bGw7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGN1cnJlbnRTY29wZSkge1xuICAgICAgICAgICAgY3VycmVudFNjb3BlLiRkZXN0cm95KCk7XG4gICAgICAgICAgICBjdXJyZW50U2NvcGUgPSBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoY3VycmVudEVsZW1lbnQpIHtcbiAgICAgICAgICAgIHByZXZpb3VzTGVhdmVBbmltYXRpb24gPSAkYW5pbWF0ZS5sZWF2ZShjdXJyZW50RWxlbWVudCk7XG4gICAgICAgICAgICBwcmV2aW91c0xlYXZlQW5pbWF0aW9uLmRvbmUoZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlICE9PSBmYWxzZSkgcHJldmlvdXNMZWF2ZUFuaW1hdGlvbiA9IG51bGw7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGN1cnJlbnRFbGVtZW50ID0gbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB1cGRhdGUoKSB7XG4gICAgICAgICAgdmFyIGxvY2FscyA9ICRyb3V0ZS5jdXJyZW50ICYmICRyb3V0ZS5jdXJyZW50LmxvY2FscyxcbiAgICAgICAgICAgICAgdGVtcGxhdGUgPSBsb2NhbHMgJiYgbG9jYWxzLiR0ZW1wbGF0ZTtcblxuICAgICAgICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZCh0ZW1wbGF0ZSkpIHtcbiAgICAgICAgICAgIHZhciBuZXdTY29wZSA9IHNjb3BlLiRuZXcoKTtcbiAgICAgICAgICAgIHZhciBjdXJyZW50ID0gJHJvdXRlLmN1cnJlbnQ7XG5cbiAgICAgICAgICAgIC8vIE5vdGU6IFRoaXMgd2lsbCBhbHNvIGxpbmsgYWxsIGNoaWxkcmVuIG9mIG5nLXZpZXcgdGhhdCB3ZXJlIGNvbnRhaW5lZCBpbiB0aGUgb3JpZ2luYWxcbiAgICAgICAgICAgIC8vIGh0bWwuIElmIHRoYXQgY29udGVudCBjb250YWlucyBjb250cm9sbGVycywgLi4uIHRoZXkgY291bGQgcG9sbHV0ZS9jaGFuZ2UgdGhlIHNjb3BlLlxuICAgICAgICAgICAgLy8gSG93ZXZlciwgdXNpbmcgbmctdmlldyBvbiBhbiBlbGVtZW50IHdpdGggYWRkaXRpb25hbCBjb250ZW50IGRvZXMgbm90IG1ha2Ugc2Vuc2UuLi5cbiAgICAgICAgICAgIC8vIE5vdGU6IFdlIGNhbid0IHJlbW92ZSB0aGVtIGluIHRoZSBjbG9uZUF0dGNoRm4gb2YgJHRyYW5zY2x1ZGUgYXMgdGhhdFxuICAgICAgICAgICAgLy8gZnVuY3Rpb24gaXMgY2FsbGVkIGJlZm9yZSBsaW5raW5nIHRoZSBjb250ZW50LCB3aGljaCB3b3VsZCBhcHBseSBjaGlsZFxuICAgICAgICAgICAgLy8gZGlyZWN0aXZlcyB0byBub24gZXhpc3RpbmcgZWxlbWVudHMuXG4gICAgICAgICAgICB2YXIgY2xvbmUgPSAkdHJhbnNjbHVkZShuZXdTY29wZSwgZnVuY3Rpb24oY2xvbmUpIHtcbiAgICAgICAgICAgICAgJGFuaW1hdGUuZW50ZXIoY2xvbmUsIG51bGwsIGN1cnJlbnRFbGVtZW50IHx8ICRlbGVtZW50KS5kb25lKGZ1bmN0aW9uIG9uTmdWaWV3RW50ZXIocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UgIT09IGZhbHNlICYmIGFuZ3VsYXIuaXNEZWZpbmVkKGF1dG9TY3JvbGxFeHApXG4gICAgICAgICAgICAgICAgICAmJiAoIWF1dG9TY3JvbGxFeHAgfHwgc2NvcGUuJGV2YWwoYXV0b1Njcm9sbEV4cCkpKSB7XG4gICAgICAgICAgICAgICAgICAkYW5jaG9yU2Nyb2xsKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgY2xlYW51cExhc3RWaWV3KCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY3VycmVudEVsZW1lbnQgPSBjbG9uZTtcbiAgICAgICAgICAgIGN1cnJlbnRTY29wZSA9IGN1cnJlbnQuc2NvcGUgPSBuZXdTY29wZTtcbiAgICAgICAgICAgIGN1cnJlbnRTY29wZS4kZW1pdCgnJHZpZXdDb250ZW50TG9hZGVkJyk7XG4gICAgICAgICAgICBjdXJyZW50U2NvcGUuJGV2YWwob25sb2FkRXhwKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2xlYW51cExhc3RWaWV3KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICB9O1xufVxuXG4vLyBUaGlzIGRpcmVjdGl2ZSBpcyBjYWxsZWQgZHVyaW5nIHRoZSAkdHJhbnNjbHVkZSBjYWxsIG9mIHRoZSBmaXJzdCBgbmdWaWV3YCBkaXJlY3RpdmUuXG4vLyBJdCB3aWxsIHJlcGxhY2UgYW5kIGNvbXBpbGUgdGhlIGNvbnRlbnQgb2YgdGhlIGVsZW1lbnQgd2l0aCB0aGUgbG9hZGVkIHRlbXBsYXRlLlxuLy8gV2UgbmVlZCB0aGlzIGRpcmVjdGl2ZSBzbyB0aGF0IHRoZSBlbGVtZW50IGNvbnRlbnQgaXMgYWxyZWFkeSBmaWxsZWQgd2hlblxuLy8gdGhlIGxpbmsgZnVuY3Rpb24gb2YgYW5vdGhlciBkaXJlY3RpdmUgb24gdGhlIHNhbWUgZWxlbWVudCBhcyBuZ1ZpZXdcbi8vIGlzIGNhbGxlZC5cbm5nVmlld0ZpbGxDb250ZW50RmFjdG9yeS4kaW5qZWN0ID0gWyckY29tcGlsZScsICckY29udHJvbGxlcicsICckcm91dGUnXTtcbmZ1bmN0aW9uIG5nVmlld0ZpbGxDb250ZW50RmFjdG9yeSgkY29tcGlsZSwgJGNvbnRyb2xsZXIsICRyb3V0ZSkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRUNBJyxcbiAgICBwcmlvcml0eTogLTQwMCxcbiAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgJGVsZW1lbnQpIHtcbiAgICAgIHZhciBjdXJyZW50ID0gJHJvdXRlLmN1cnJlbnQsXG4gICAgICAgICAgbG9jYWxzID0gY3VycmVudC5sb2NhbHM7XG5cbiAgICAgICRlbGVtZW50Lmh0bWwobG9jYWxzLiR0ZW1wbGF0ZSk7XG5cbiAgICAgIHZhciBsaW5rID0gJGNvbXBpbGUoJGVsZW1lbnQuY29udGVudHMoKSk7XG5cbiAgICAgIGlmIChjdXJyZW50LmNvbnRyb2xsZXIpIHtcbiAgICAgICAgbG9jYWxzLiRzY29wZSA9IHNjb3BlO1xuICAgICAgICB2YXIgY29udHJvbGxlciA9ICRjb250cm9sbGVyKGN1cnJlbnQuY29udHJvbGxlciwgbG9jYWxzKTtcbiAgICAgICAgaWYgKGN1cnJlbnQuY29udHJvbGxlckFzKSB7XG4gICAgICAgICAgc2NvcGVbY3VycmVudC5jb250cm9sbGVyQXNdID0gY29udHJvbGxlcjtcbiAgICAgICAgfVxuICAgICAgICAkZWxlbWVudC5kYXRhKCckbmdDb250cm9sbGVyQ29udHJvbGxlcicsIGNvbnRyb2xsZXIpO1xuICAgICAgICAkZWxlbWVudC5jaGlsZHJlbigpLmRhdGEoJyRuZ0NvbnRyb2xsZXJDb250cm9sbGVyJywgY29udHJvbGxlcik7XG4gICAgICB9XG4gICAgICBzY29wZVtjdXJyZW50LnJlc29sdmVBcyB8fCAnJHJlc29sdmUnXSA9IGxvY2FscztcblxuICAgICAgbGluayhzY29wZSk7XG4gICAgfVxuICB9O1xufVxuXG5cbn0pKHdpbmRvdywgd2luZG93LmFuZ3VsYXIpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvYW5ndWxhci1yb3V0ZS9hbmd1bGFyLXJvdXRlLmpzXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2hvbGx5d29vZFN0YXJzJylcclxuICAgIC5jb25maWcoXHJcbiAgICAgICAgZnVuY3Rpb24oICRyb3V0ZVByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlciApIHtcclxuXHJcbiAgICAgICAgICAgICRyb3V0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgICAgICAud2hlbignLycsIHtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9hc3NldHMvdmlld3MvcGFnZXMvaG9tZS50ZW1wbGF0ZS5odG1sJyxcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnaG9tZUNvbnRyb2xsZXInXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLndoZW4oJy9jZWxlYnJpdHkvYWRkJywge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL2Fzc2V0cy92aWV3cy9wYWdlcy9hZGQtY2VsZWJyaXR5LnRlbXBsYXRlLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdhZGRDZWxlYnJpdHlDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC53aGVuKCcvY2VsZWJyaXR5LzpuYW1lJywge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL2Fzc2V0cy92aWV3cy9wYWdlcy9jZWxlYnJpdHkudGVtcGxhdGUuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2NlbGVicml0eUNvbnRyb2xsZXInXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLm90aGVyd2lzZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVkaXJlY3RUbzogJy8nLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdob21lQ29udHJvbGxlcidcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gUmVtb3ZlIG8gLyMhLyBkYSBVUkxcclxuICAgICAgICAgICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xyXG4gICAgICAgICAgICAkbG9jYXRpb25Qcm92aWRlci5oYXNoUHJlZml4KCcnKTtcclxuICAgICAgICB9XHJcbiAgICApO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2FwcC9hcHAuY29uZmlnLmpzXG4vLyBtb2R1bGUgaWQgPSA3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxudmFyIGFuZ3VsYXIgPSByZXF1aXJlKCdhbmd1bGFyJyk7XG5cbmFuZ3VsYXIubW9kdWxlKCdob2xseXdvb2RTdGFycycpXG4gICAgICAgLnNlcnZpY2UoJ0NlbGVicml0aWVzU2VydmljZScsIHJlcXVpcmUoJy4vY2VsZWJyaXRpZXMuc2VydmljZScpKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9hcHAvc2VydmljZXMvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuZnVuY3Rpb24gQ2VsZWJyaXRpZXNTZXJ2aWNlKCkge1xyXG5cclxuICAgIHZhciBjZWxlYnJpdGllcyA9IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlkOiAxLFxyXG4gICAgICAgICAgICBuYW1lOiAnU2FuZHkgTGltYScsXHJcbiAgICAgICAgICAgIHVybE5hbWU6ICdzYW5keS1saW1hJyxcclxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdjYW50b3JhLCBjb21wb3NpdG9yYSBlIGF0cml6IGJyYXNpbGVpcmEuIENhbnRvcmEgZGVzZGUgYSBpbmbDom5jaWEsIFNhbmR5IGNvbWXDp291IHN1YSBjYXJyZWlyYSBlbSAxOTkwLCBxdWFuZG8gZm9ybW91IGNvbSBvIGlybcOjbywgbyBtw7pzaWNvIEp1bmlvciBMaW1hLCBhIGR1cGxhIHZvY2FsIFNhbmR5ICYgSnVuaW9yLicsXHJcbiAgICAgICAgICAgIGltYWdlOiAnaHR0cDovL2ltYWdlcy52aXJndWxhLmNvbS5ici8yMDE1LzAyL3NhbmR5LmpwZycsXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICBpZDogMixcclxuICAgICAgICAgICAgbmFtZTogJ01hbnUgR2F2YXNzaScsXHJcbiAgICAgICAgICAgIHVybE5hbWU6ICdtYW51LWdhdmFzc2knLFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ01hbm9lbGEgTGF0aW5pIEdhdmFzc2kgRnJhbmNpc2NvLCBtYWlzIGNvbmhlY2lkYSBjb21vIE1hbnUgR2F2YXNzaSwgw6kgdW1hIGNhbnRvcmEsIGNvbXBvc2l0b3JhLCBhdHJpeiBlIGF1dG9yYSBicmFzaWxlaXJhJyxcclxuICAgICAgICAgICAgaW1hZ2U6ICdodHRwOi8vbWV0cm9wb2xpdGFuYWZtLmNvbS5ici93cC1jb250ZW50L3VwbG9hZHMvMjAxNi8wNy9jYXBhLW1hbnUtZ2F2YXNzaS5qcGcnLFxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgICAgaWQ6IDMsXHJcbiAgICAgICAgICAgIG5hbWU6ICdQYXVsYSBGZXJuYW5kZXMnLFxyXG4gICAgICAgICAgICB1cmxOYW1lOiAncGF1bGEtZmVybmFuZGVzJyxcclxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdjYW50b3JhIGUgY29tcG9zaXRvcmEgYnJhc2lsZWlyYS4gQ2FudG9yYSBkZXNkZSBhIGluZsOibmNpYSwgRmVybmFuZGVzIGNvbWXDp291IGEgY2FudGFyIHByb2Zpc3Npb25hbG1lbnRlIGFvcyBvaXRvIGFub3MgZGUgaWRhZGUnLFxyXG4gICAgICAgICAgICBpbWFnZTogJ2h0dHA6Ly93d3cuYXNzaXNuZXdzLmNvbS5ici93cC1jb250ZW50L3VwbG9hZHMvMjAxNy8xMi9wYXVsYV9mZXJuYW5kZXMtMS5qcGcnLFxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgICAgaWQ6IDQsXHJcbiAgICAgICAgICAgIG5hbWU6ICdKb2FuYSBCb3JnZXMnLFxyXG4gICAgICAgICAgICB1cmxOYW1lOiAnam9hbmEtYm9yZ2VzJyxcclxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICfDqSB1bWEgam92ZW0gYWN0cml6IHBvcnR1Z3Vlc2EuIENvbWXDp291IHBvciBmYXplciBwYXJ0ZSBkbyBjb3JvIGluZmFudGlsIFwiIEpvdmVucyBDYW50b3JlcyBkZSBMaXNib2FcIiBwYXJhIGluZ3Jlc3NhciBubyBncnVwbyBtdXNpY2FsIFwiIE9uZGFDaG9jXCIuJyxcclxuICAgICAgICAgICAgaW1hZ2U6ICdodHRwOi8vczIuZ2xiaW1nLmNvbS9mWU14Z0U3NVdhSGpFaFd6U3oxSUQwTFhaQXc9LzQ3NXg0NzUvdG9wL2kuZ2xiaW1nLmNvbS9vZy9pZy9pbmZvZ2xvYm8vZi9vcmlnaW5hbC8yMDE3LzAxLzA5L2pvYW5hYm9yZ2VzLnBuZycsXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICBpZDogNSxcclxuICAgICAgICAgICAgbmFtZTogJ1Bhb2xhIE9saXZlaXJhJyxcclxuICAgICAgICAgICAgdXJsTmFtZTogJ3Bhb2xhLW9saXZlaXJhJyxcclxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdQYW9sbGEgT2xpdmVpcmEgw6kgZGVzY2VuZGVudGUgZGUgZXNwYW5ow7NpcywgaXRhbGlhbm9zIGUgcG9ydHVndWVzZXMuIEVsYSDDqSBmaWxoYSBkZSB1bSBwb2xpY2lhbCBtaWxpdGFyIGFwb3NlbnRhZG8gZSBkZSB1bWEgZXgtYXV4aWxpYXIgZGUgZW5mZXJtYWdlbScsXHJcbiAgICAgICAgICAgIGltYWdlOiAnaHR0cHM6Ly9wYXRyaWNpbmhhZXNwZXJ0YS5jb20uYnIvd3AtY29udGVudC91cGxvYWRzLzIwMTMvMDUvcGFvbGEtb2xpdmVpcmEuanBnJyxcclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIGlkOiA2LFxyXG4gICAgICAgICAgICBuYW1lOiAnTWFyaW5hIFJ1eSBCYXJib3NhJyxcclxuICAgICAgICAgICAgdXJsTmFtZTogJ21hcmluYS1ydXktYmFyYm9zYScsXHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnTWFyaW5hIFNvdXphIFJ1eSBCYXJib3NhIE5lZ3LDo28gw6kgdW1hIGF0cml6IGJyYXNpbGVpcmEuIENvbWXDp291IGEgYXR1YXIgYWluZGEgY3JpYW7Dp2EsIGUgZmV6IHNldSBwcmltZWlybyB0cmFiYWxobyBkZSBkZXN0YXF1ZSBubyBwYXBlbCBkZSBBbmluaGEgbmEgdGVsZW5vdmVsYSBDb21lw6dhciBkZSBOb3ZvLicsXHJcbiAgICAgICAgICAgIGltYWdlOiAnaHR0cDovL3MyLmdsYmltZy5jb20vWnBsNGJqdDU2c2phRjB6Yjl4M3BLNC1vUFdNPS9lLmdsYmltZy5jb20vb2cvZWQvZi9vcmlnaW5hbC8yMDE3LzA4LzA3L21hcm4uanBnJyxcclxuICAgICAgICB9XHJcbiAgICBdXHJcblxyXG4gICAgdmFyIHNlcnZpY2UgPSB7XHJcblxyXG4gICAgICAgIHRvVXJsOiBmdW5jdGlvbihzdHJpbmcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHN0cmluZy50cmltKCkudG9Mb3dlckNhc2UoKS5zcGxpdCgnICcpLmpvaW4oJy0nKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICB0b0NhcGl0YWxpemU6IGZ1bmN0aW9uKHN0cmluZykge1xyXG4gICAgICAgICAgICB2YXIgc2xpY2VzID0gc3RyaW5nLnNwbGl0KCctJyk7XHJcbiAgICAgICAgICAgIHZhciBjYXBpdGFsaXplZFNsaWNlcyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgc2xpY2VzLmZvckVhY2goIGZ1bmN0aW9uKHdvcmQpIHtcclxuICAgICAgICAgICAgICAgIGNhcGl0YWxpemVkU2xpY2VzLnB1c2goIHdvcmQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB3b3JkLnNsaWNlKDEpICk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGNhcGl0YWxpemVkU2xpY2VzLmpvaW4oJyAnKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBnZXRDZWxlYnJpdGllczogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gY2VsZWJyaXRpZXM7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgYWRkOiBmdW5jdGlvbiAoY2VsZWJyaXR5KSB7XHJcbiAgICAgICAgICAgIGNlbGVicml0aWVzLnB1c2goIGNlbGVicml0eSApO1xyXG4gICAgICAgIH0sXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHNlcnZpY2U7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENlbGVicml0aWVzU2VydmljZTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9hcHAvc2VydmljZXMvY2VsZWJyaXRpZXMuc2VydmljZS5qc1xuLy8gbW9kdWxlIGlkID0gMTBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYW5ndWxhciA9IHJlcXVpcmUoJ2FuZ3VsYXInKTtcblxuYW5ndWxhci5tb2R1bGUoJ2hvbGx5d29vZFN0YXJzJylcbiAgICAuY29udHJvbGxlcignaG9tZUNvbnRyb2xsZXInLCByZXF1aXJlKCcuL2hvbWUuY29udHJvbGxlcicpKVxuICAgIC5jb250cm9sbGVyKCdjZWxlYnJpdHlDb250cm9sbGVyJywgcmVxdWlyZSgnLi9jZWxlYnJpdHkuY29udHJvbGxlcicpKVxuICAgIC5jb250cm9sbGVyKCdhZGRDZWxlYnJpdHlDb250cm9sbGVyJywgcmVxdWlyZSgnLi9hZGQtY2VsZWJyaXR5LmNvbnRyb2xsZXInKSk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYXBwL2NvbnRyb2xsZXJzL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAxMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XHJcblxyXG5mdW5jdGlvbiBob21lQ29udHJvbGxlciggJHNjb3BlLCBDZWxlYnJpdGllc1NlcnZpY2UgKSB7XHJcbiAgICAkc2NvcGUudGl0bGUgPSAnVG9wIENlbGVicml0aWVzOic7XHJcblxyXG4gICAgJHNjb3BlLmNlbGVicml0eUxpc3QgPSBDZWxlYnJpdGllc1NlcnZpY2UuZ2V0Q2VsZWJyaXRpZXMoKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBob21lQ29udHJvbGxlcjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9hcHAvY29udHJvbGxlcnMvaG9tZS5jb250cm9sbGVyLmpzXG4vLyBtb2R1bGUgaWQgPSAxMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJmdW5jdGlvbiBjZWxlYnJpdHlDb250cm9sbGVyKCAkc2NvcGUsICRyb3V0ZVBhcmFtcywgQ2VsZWJyaXRpZXNTZXJ2aWNlICkge1xyXG5cclxuICAgICRzY29wZS5jZWxlYnJpdHlMaXN0ID0gQ2VsZWJyaXRpZXNTZXJ2aWNlLmdldENlbGVicml0aWVzKCk7XHJcbiAgICAkc2NvcGUuY2VsZWJyaXR5TmFtZSA9IENlbGVicml0aWVzU2VydmljZS50b0NhcGl0YWxpemUoICRyb3V0ZVBhcmFtcy5uYW1lICk7XHJcblxyXG4gICAgJHNjb3BlLmNlbGVicml0eUxpc3QubWFwKCBmdW5jdGlvbiggY2VsZWJyaXR5ICkge1xyXG4gICAgICAgIGlmICggY2VsZWJyaXR5Lm5hbWUgPT0gJHNjb3BlLmNlbGVicml0eU5hbWUgKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5jZWxlYnJpdHkgPSBjZWxlYnJpdHk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2VsZWJyaXR5Q29udHJvbGxlcjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9hcHAvY29udHJvbGxlcnMvY2VsZWJyaXR5LmNvbnRyb2xsZXIuanNcbi8vIG1vZHVsZSBpZCA9IDEzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImZ1bmN0aW9uIGFkZENlbGVicml0eUNvbnRyb2xsZXIoICRzY29wZSwgJHJvdXRlUGFyYW1zLCBDZWxlYnJpdGllc1NlcnZpY2UgKSB7XHJcblxyXG4gICAgJHNjb3BlLmNlbGVicml0aWVzID0gQ2VsZWJyaXRpZXNTZXJ2aWNlLmdldENlbGVicml0aWVzKCk7XHJcblxyXG4gICAgJHNjb3BlLmNlbGVicml0eSA9IHtcclxuICAgICAgICBuYW1lOiAnJyxcclxuICAgICAgICBkZXNjcmlwdGlvbjogJycsXHJcbiAgICAgICAgaW1hZ2U6ICcnXHJcbiAgICB9XHJcblxyXG4gICAgJHNjb3BlLmFkZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkc2NvcGUuY2VsZWJyaXR5LmlkID0gJHNjb3BlLmNlbGVicml0aWVzLmxlbmd0aDtcclxuICAgICAgICAkc2NvcGUuY2VsZWJyaXR5LnVybE5hbWUgPSBDZWxlYnJpdGllc1NlcnZpY2UudG9VcmwoICRzY29wZS5jZWxlYnJpdHkubmFtZSApO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZygnY2VsZWJyaXR5IHRvIGFkZCAtPicsICRzY29wZS5jZWxlYnJpdHkpO1xyXG5cclxuICAgICAgICBDZWxlYnJpdGllc1NlcnZpY2UuYWRkKCRzY29wZS5jZWxlYnJpdHkpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKENlbGVicml0aWVzU2VydmljZS5nZXRDZWxlYnJpdGllcygpKVxyXG4gICAgfVxyXG4gICAgXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYWRkQ2VsZWJyaXR5Q29udHJvbGxlcjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9hcHAvY29udHJvbGxlcnMvYWRkLWNlbGVicml0eS5jb250cm9sbGVyLmpzXG4vLyBtb2R1bGUgaWQgPSAxNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJmdW5jdGlvbiBhcHBIZWFkZXJDb250cm9sbGVyICgkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMpIHtcclxuICAgICRzY29wZS5uYXZMaW5rcyA9IHtcclxuICAgICAgICBob21lOiB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdIb21lJyxcclxuICAgICAgICAgICAgbGluazogJy8nXHJcbiAgICAgICAgfSxcclxuICAgICAgICBjZWxlYnJpdGllczoge1xyXG4gICAgICAgICAgICBuYW1lOiAnQ2VsZWJyaXRpZXMnLFxyXG4gICAgICAgICAgICBsaW5rOiAnY2VsZWJyaXRpZXMvbGlzdCdcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdob2xseXdvb2RTdGFycycpLmNvbXBvbmVudCgnYXBwSGVhZGVyJywge1xyXG4gICAgdGVtcGxhdGVVcmw6ICcvYXNzZXRzL3ZpZXdzL3BhcnRpYWxzL2FwcC1oZWFkZXIudGVtcGxhdGUuaHRtbCcsXHJcbiAgICBjb250cm9sbGVyOiBhcHBIZWFkZXJDb250cm9sbGVyLFxyXG4gICAgYmluZGluZ3M6IHtcclxuICAgICAgICB0aXRsZTogJ0AnLFxyXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnQCdcclxuICAgIH1cclxufSk7XHJcblxyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9hcHAvY29tcG9uZW50cy9hcHAtaGVhZGVyL2FwcC1oZWFkZXIuY29tcG9uZW50LmpzXG4vLyBtb2R1bGUgaWQgPSAxNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJmdW5jdGlvbiBhcHBOYXZDb250cm9sbGVyICgkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMpIHtcclxuICAgICRzY29wZS5uYXZMaW5rcyA9IHtcclxuICAgICAgICBob21lOiB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdIb21lJyxcclxuICAgICAgICAgICAgbGluazogJy8nXHJcbiAgICAgICAgfSxcclxuICAgICAgICBjZWxlYnJpdGllczoge1xyXG4gICAgICAgICAgICBuYW1lOiAnQ2VsZWJyaXRpZXMnLFxyXG4gICAgICAgICAgICBsaW5rOiAnY2VsZWJyaXRpZXMvbGlzdCdcclxuICAgICAgICB9LFxyXG4gICAgICAgIGFkZDoge1xyXG4gICAgICAgICAgICBuYW1lOiAnQWRkJyxcclxuICAgICAgICAgICAgbGluazogJ2NlbGVicml0eS9hZGQnXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnaG9sbHl3b29kU3RhcnMnKS5jb21wb25lbnQoJ2FwcE5hdicsIHtcclxuICAgIHRlbXBsYXRlVXJsOiAnL2Fzc2V0cy92aWV3cy9wYXJ0aWFscy9hcHAtbmF2LnRlbXBsYXRlLmh0bWwnLFxyXG4gICAgY29udHJvbGxlcjogYXBwTmF2Q29udHJvbGxlclxyXG59KTtcclxuXHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2FwcC9jb21wb25lbnRzL2FwcC1uYXYvYXBwLW5hdi5jb21wb25lbnQuanNcbi8vIG1vZHVsZSBpZCA9IDE2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImZ1bmN0aW9uIGNlbGVicml0eUNhcmRDb250cm9sbGVyICgkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMpIHtcclxuICAgIFxyXG59XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnaG9sbHl3b29kU3RhcnMnKS5jb21wb25lbnQoJ2NhcmRDZWxlYnJpdHknLCB7XHJcbiAgICB0ZW1wbGF0ZVVybDogJy9hc3NldHMvdmlld3MvY29tcG9uZW50cy9jZWxlYnJpdHktY2FyZC50ZW1wbGF0ZS5odG1sJyxcclxuICAgIGNvbnRyb2xsZXI6IGNlbGVicml0eUNhcmRDb250cm9sbGVyLFxyXG4gICAgYmluZGluZ3M6IHtcclxuICAgICAgICBjZWxlYnJpdHk6ICc8J1xyXG4gICAgfVxyXG59KTtcclxuXHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2FwcC9jb21wb25lbnRzL2NlbGVicml0eS9jZWxlYnJpdHktY2FyZC5jb21wb25lbnQuanNcbi8vIG1vZHVsZSBpZCA9IDE3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcIi4uL2Nzcy9tYWluLmNzc1wiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2FwcC9zdHlsZXMvbWFpbi5sZXNzXG4vLyBtb2R1bGUgaWQgPSAxOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9