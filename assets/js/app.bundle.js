webpackJsonp([0],[
/* 0 */,
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(2);
module.exports = __webpack_require__(11);


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(3);

angular.module('hollywoodStars', [
    'ngRoute'
]);

__webpack_require__(5);

__webpack_require__(17)

__webpack_require__(6);

__webpack_require__(10);
__webpack_require__(15);


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
/* 5 */
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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var angular = __webpack_require__(0);

angular.module('hollywoodStars')
    .controller('homeController', __webpack_require__(13));

angular.module('hollywoodStars')
    .controller('celebrityController', __webpack_require__(16));

/***/ }),
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */
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
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "../css/main.css";

/***/ }),
/* 12 */,
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function homeController( $scope, CelebritiesService ) {
    $scope.title = 'Top Celebrities:';

    $scope.celebrityList = CelebritiesService;
}

module.exports = homeController;

/***/ }),
/* 14 */,
/* 15 */
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
/* 16 */
/***/ (function(module, exports) {

function celebrityController( $scope, $routeParams, CelebritiesService ) {

    $scope.toCapitalize = function(string) {
        var slices = string.split('-');
        var capitalizedSlices = [];

        slices.forEach( function(word) {
            capitalizedSlices.push( word.charAt(0).toUpperCase() + word.slice(1) );
        });

        return capitalizedSlices.join(' ');
    }

    $scope.celebrityList = CelebritiesService;
    $scope.celebrityName = $scope.toCapitalize( $routeParams.name );

    $scope.celebrityList.map(function(celebrity) {
        if ( celebrity.name == $scope.celebrityName ) {
            $scope.celebrity = celebrity;
        }
    });
}

module.exports = celebrityController;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var angular = __webpack_require__(0);

angular.module('hollywoodStars')
       .service('CelebritiesService', __webpack_require__(18));

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function CelebritiesService() {

    var toUrl = function(string) {
        return string.trim().toLowerCase().split(' ').join('-');
    }

    var celebrities = [
        {
            id: 1,
            name: 'Sandy Lima',
            urlName: toUrl('Sandy Lima'),
            description: 'cantora, compositora e atriz brasileira. Cantora desde a infância, Sandy começou sua carreira em 1990, quando formou com o irmão, o músico Junior Lima, a dupla vocal Sandy & Junior.',
            image: 'http://images.virgula.com.br/2015/02/sandy.jpg',
        }, {
            id: 2,
            name: 'Manu Gavassi',
            urlName: toUrl('Manu Gavassi'),
            description: 'Manoela Latini Gavassi Francisco, mais conhecida como Manu Gavassi, é uma cantora, compositora, atriz e autora brasileira',
            image: 'http://metropolitanafm.com.br/wp-content/uploads/2016/07/capa-manu-gavassi.jpg',
        }, {
            id: 3,
            name: 'Paula Fernandes',
            urlName: toUrl('Paula Fernandes'),
            description: 'cantora e compositora brasileira. Cantora desde a infância, Fernandes começou a cantar profissionalmente aos oito anos de idade',
            image: 'http://www.assisnews.com.br/wp-content/uploads/2017/12/paula_fernandes-1.jpg',
        }, {
            id: 4,
            name: 'Joana Borges',
            urlName: toUrl('Joana Borges'),
            description: 'é uma jovem actriz portuguesa. Começou por fazer parte do coro infantil " Jovens Cantores de Lisboa" para ingressar no grupo musical " OndaChoc".',
            image: 'http://s2.glbimg.com/fYMxgE75WaHjEhWzSz1ID0LXZAw=/475x475/top/i.glbimg.com/og/ig/infoglobo/f/original/2017/01/09/joanaborges.png',
        }, {
            id: 5,
            name: 'Paola Oliveira',
            urlName: toUrl('Paola Oliveira'),
            description: 'Paolla Oliveira é descendente de espanhóis, italianos e portugueses. Ela é filha de um policial militar aposentado e de uma ex-auxiliar de enfermagem',
            image: 'https://patricinhaesperta.com.br/wp-content/uploads/2013/05/paola-oliveira.jpg',
        }, {
            id: 6,
            name: 'Marina Ruy Barbosa',
            urlName: toUrl('Marina Ruy Barbosa'),
            description: 'Marina Souza Ruy Barbosa Negrão é uma atriz brasileira. Começou a atuar ainda criança, e fez seu primeiro trabalho de destaque no papel de Aninha na telenovela Começar de Novo.',
            image: 'http://s2.glbimg.com/Zpl4bjt56sjaF0zb9x3pK4-oPWM=/e.glbimg.com/og/ed/f/original/2017/08/07/marn.jpg',
        }
    ];

    return celebrities;
};

module.exports = CelebritiesService;

/***/ })
],[1]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvYXBwL2FwcC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYW5ndWxhci1yb3V0ZS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYW5ndWxhci1yb3V0ZS9hbmd1bGFyLXJvdXRlLmpzIiwid2VicGFjazovLy8uL3NyYy9hcHAvYXBwLmNvbmZpZy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwL2NvbnRyb2xsZXJzL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9hcHAvY29tcG9uZW50cy9hcHAtaGVhZGVyL2FwcC1oZWFkZXIuY29tcG9uZW50LmpzIiwid2VicGFjazovLy8uL3NyYy9hcHAvc3R5bGVzL21haW4ubGVzcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwL2NvbnRyb2xsZXJzL2hvbWUuY29udHJvbGxlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwL2NvbXBvbmVudHMvY2VsZWJyaXR5L2NlbGVicml0eS1jYXJkLmNvbXBvbmVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwL2NvbnRyb2xsZXJzL2NlbGVicml0eS5jb250cm9sbGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9hcHAvc2VydmljZXMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC9zZXJ2aWNlcy9jZWxlYnJpdGllcy5zZXJ2aWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7Ozs7OztBQ2JBO0FBQ0E7Ozs7Ozs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCOztBQUU1Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG9DQUFvQyxRQUFRO0FBQzVDO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7O0FBRWpCO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7O0FBRVg7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQSxhQUFhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0EsQ0FBQzs7Ozs7OztBQ3ZzQ0Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjs7QUFFakI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNOzs7Ozs7O0FDdkJBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxnRTs7Ozs7Ozs7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOzs7Ozs7OztBQ3BCRCwyRDs7Ozs7Ozs7QUNBQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsZ0M7Ozs7Ozs7QUNSQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOzs7Ozs7OztBQ1ZEOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUEscUM7Ozs7Ozs7QUN2QkE7O0FBRUE7O0FBRUE7QUFDQSwrRDs7Ozs7OztBQ0xBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsb0MiLCJmaWxlIjoiYXBwLmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJ2FuZ3VsYXItcm91dGUnKTtcblxuYW5ndWxhci5tb2R1bGUoJ2hvbGx5d29vZFN0YXJzJywgW1xuICAgICduZ1JvdXRlJ1xuXSk7XG5cbnJlcXVpcmUoJy4vYXBwLmNvbmZpZycpO1xuXG5yZXF1aXJlKCcuL3NlcnZpY2VzLycpXG5cbnJlcXVpcmUoJy4vY29udHJvbGxlcnMnKTtcblxucmVxdWlyZSgnLi9jb21wb25lbnRzL2FwcC1oZWFkZXIvYXBwLWhlYWRlci5jb21wb25lbnQnKTtcbnJlcXVpcmUoJy4vY29tcG9uZW50cy9jZWxlYnJpdHkvY2VsZWJyaXR5LWNhcmQuY29tcG9uZW50Jyk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9hcHAvYXBwLmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInJlcXVpcmUoJy4vYW5ndWxhci1yb3V0ZScpO1xubW9kdWxlLmV4cG9ydHMgPSAnbmdSb3V0ZSc7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9hbmd1bGFyLXJvdXRlL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuICogQGxpY2Vuc2UgQW5ndWxhckpTIHYxLjYuOFxuICogKGMpIDIwMTAtMjAxNyBHb29nbGUsIEluYy4gaHR0cDovL2FuZ3VsYXJqcy5vcmdcbiAqIExpY2Vuc2U6IE1JVFxuICovXG4oZnVuY3Rpb24od2luZG93LCBhbmd1bGFyKSB7J3VzZSBzdHJpY3QnO1xuXG4vKiBnbG9iYWwgc2hhbGxvd0NvcHk6IHRydWUgKi9cblxuLyoqXG4gKiBDcmVhdGVzIGEgc2hhbGxvdyBjb3B5IG9mIGFuIG9iamVjdCwgYW4gYXJyYXkgb3IgYSBwcmltaXRpdmUuXG4gKlxuICogQXNzdW1lcyB0aGF0IHRoZXJlIGFyZSBubyBwcm90byBwcm9wZXJ0aWVzIGZvciBvYmplY3RzLlxuICovXG5mdW5jdGlvbiBzaGFsbG93Q29weShzcmMsIGRzdCkge1xuICBpZiAoaXNBcnJheShzcmMpKSB7XG4gICAgZHN0ID0gZHN0IHx8IFtdO1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIGlpID0gc3JjLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgIGRzdFtpXSA9IHNyY1tpXTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNPYmplY3Qoc3JjKSkge1xuICAgIGRzdCA9IGRzdCB8fCB7fTtcblxuICAgIGZvciAodmFyIGtleSBpbiBzcmMpIHtcbiAgICAgIGlmICghKGtleS5jaGFyQXQoMCkgPT09ICckJyAmJiBrZXkuY2hhckF0KDEpID09PSAnJCcpKSB7XG4gICAgICAgIGRzdFtrZXldID0gc3JjW2tleV07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGRzdCB8fCBzcmM7XG59XG5cbi8qIGdsb2JhbCBzaGFsbG93Q29weTogZmFsc2UgKi9cblxuLy8gYGlzQXJyYXlgIGFuZCBgaXNPYmplY3RgIGFyZSBuZWNlc3NhcnkgZm9yIGBzaGFsbG93Q29weSgpYCAoaW5jbHVkZWQgdmlhIGBzcmMvc2hhbGxvd0NvcHkuanNgKS5cbi8vIFRoZXkgYXJlIGluaXRpYWxpemVkIGluc2lkZSB0aGUgYCRSb3V0ZVByb3ZpZGVyYCwgdG8gZW5zdXJlIGB3aW5kb3cuYW5ndWxhcmAgaXMgYXZhaWxhYmxlLlxudmFyIGlzQXJyYXk7XG52YXIgaXNPYmplY3Q7XG52YXIgaXNEZWZpbmVkO1xudmFyIG5vb3A7XG5cbi8qKlxuICogQG5nZG9jIG1vZHVsZVxuICogQG5hbWUgbmdSb3V0ZVxuICogQGRlc2NyaXB0aW9uXG4gKlxuICogVGhlIGBuZ1JvdXRlYCBtb2R1bGUgcHJvdmlkZXMgcm91dGluZyBhbmQgZGVlcGxpbmtpbmcgc2VydmljZXMgYW5kIGRpcmVjdGl2ZXMgZm9yIEFuZ3VsYXJKUyBhcHBzLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIFNlZSB7QGxpbmsgbmdSb3V0ZS4kcm91dGUjZXhhbXBsZXMgJHJvdXRlfSBmb3IgYW4gZXhhbXBsZSBvZiBjb25maWd1cmluZyBhbmQgdXNpbmcgYG5nUm91dGVgLlxuICpcbiAqL1xuLyogZ2xvYmFsIC1uZ1JvdXRlTW9kdWxlICovXG52YXIgbmdSb3V0ZU1vZHVsZSA9IGFuZ3VsYXIuXG4gIG1vZHVsZSgnbmdSb3V0ZScsIFtdKS5cbiAgaW5mbyh7IGFuZ3VsYXJWZXJzaW9uOiAnMS42LjgnIH0pLlxuICBwcm92aWRlcignJHJvdXRlJywgJFJvdXRlUHJvdmlkZXIpLlxuICAvLyBFbnN1cmUgYCRyb3V0ZWAgd2lsbCBiZSBpbnN0YW50aWF0ZWQgaW4gdGltZSB0byBjYXB0dXJlIHRoZSBpbml0aWFsIGAkbG9jYXRpb25DaGFuZ2VTdWNjZXNzYFxuICAvLyBldmVudCAodW5sZXNzIGV4cGxpY2l0bHkgZGlzYWJsZWQpLiBUaGlzIGlzIG5lY2Vzc2FyeSBpbiBjYXNlIGBuZ1ZpZXdgIGlzIGluY2x1ZGVkIGluIGFuXG4gIC8vIGFzeW5jaHJvbm91c2x5IGxvYWRlZCB0ZW1wbGF0ZS5cbiAgcnVuKGluc3RhbnRpYXRlUm91dGUpO1xudmFyICRyb3V0ZU1pbkVyciA9IGFuZ3VsYXIuJCRtaW5FcnIoJ25nUm91dGUnKTtcbnZhciBpc0VhZ2VySW5zdGFudGlhdGlvbkVuYWJsZWQ7XG5cblxuLyoqXG4gKiBAbmdkb2MgcHJvdmlkZXJcbiAqIEBuYW1lICRyb3V0ZVByb3ZpZGVyXG4gKiBAdGhpc1xuICpcbiAqIEBkZXNjcmlwdGlvblxuICpcbiAqIFVzZWQgZm9yIGNvbmZpZ3VyaW5nIHJvdXRlcy5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBTZWUge0BsaW5rIG5nUm91dGUuJHJvdXRlI2V4YW1wbGVzICRyb3V0ZX0gZm9yIGFuIGV4YW1wbGUgb2YgY29uZmlndXJpbmcgYW5kIHVzaW5nIGBuZ1JvdXRlYC5cbiAqXG4gKiAjIyBEZXBlbmRlbmNpZXNcbiAqIFJlcXVpcmVzIHRoZSB7QGxpbmsgbmdSb3V0ZSBgbmdSb3V0ZWB9IG1vZHVsZSB0byBiZSBpbnN0YWxsZWQuXG4gKi9cbmZ1bmN0aW9uICRSb3V0ZVByb3ZpZGVyKCkge1xuICBpc0FycmF5ID0gYW5ndWxhci5pc0FycmF5O1xuICBpc09iamVjdCA9IGFuZ3VsYXIuaXNPYmplY3Q7XG4gIGlzRGVmaW5lZCA9IGFuZ3VsYXIuaXNEZWZpbmVkO1xuICBub29wID0gYW5ndWxhci5ub29wO1xuXG4gIGZ1bmN0aW9uIGluaGVyaXQocGFyZW50LCBleHRyYSkge1xuICAgIHJldHVybiBhbmd1bGFyLmV4dGVuZChPYmplY3QuY3JlYXRlKHBhcmVudCksIGV4dHJhKTtcbiAgfVxuXG4gIHZhciByb3V0ZXMgPSB7fTtcblxuICAvKipcbiAgICogQG5nZG9jIG1ldGhvZFxuICAgKiBAbmFtZSAkcm91dGVQcm92aWRlciN3aGVuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIFJvdXRlIHBhdGggKG1hdGNoZWQgYWdhaW5zdCBgJGxvY2F0aW9uLnBhdGhgKS4gSWYgYCRsb2NhdGlvbi5wYXRoYFxuICAgKiAgICBjb250YWlucyByZWR1bmRhbnQgdHJhaWxpbmcgc2xhc2ggb3IgaXMgbWlzc2luZyBvbmUsIHRoZSByb3V0ZSB3aWxsIHN0aWxsIG1hdGNoIGFuZCB0aGVcbiAgICogICAgYCRsb2NhdGlvbi5wYXRoYCB3aWxsIGJlIHVwZGF0ZWQgdG8gYWRkIG9yIGRyb3AgdGhlIHRyYWlsaW5nIHNsYXNoIHRvIGV4YWN0bHkgbWF0Y2ggdGhlXG4gICAqICAgIHJvdXRlIGRlZmluaXRpb24uXG4gICAqXG4gICAqICAgICogYHBhdGhgIGNhbiBjb250YWluIG5hbWVkIGdyb3VwcyBzdGFydGluZyB3aXRoIGEgY29sb246IGUuZy4gYDpuYW1lYC4gQWxsIGNoYXJhY3RlcnMgdXBcbiAgICogICAgICAgIHRvIHRoZSBuZXh0IHNsYXNoIGFyZSBtYXRjaGVkIGFuZCBzdG9yZWQgaW4gYCRyb3V0ZVBhcmFtc2AgdW5kZXIgdGhlIGdpdmVuIGBuYW1lYFxuICAgKiAgICAgICAgd2hlbiB0aGUgcm91dGUgbWF0Y2hlcy5cbiAgICogICAgKiBgcGF0aGAgY2FuIGNvbnRhaW4gbmFtZWQgZ3JvdXBzIHN0YXJ0aW5nIHdpdGggYSBjb2xvbiBhbmQgZW5kaW5nIHdpdGggYSBzdGFyOlxuICAgKiAgICAgICAgZS5nLmA6bmFtZSpgLiBBbGwgY2hhcmFjdGVycyBhcmUgZWFnZXJseSBzdG9yZWQgaW4gYCRyb3V0ZVBhcmFtc2AgdW5kZXIgdGhlIGdpdmVuIGBuYW1lYFxuICAgKiAgICAgICAgd2hlbiB0aGUgcm91dGUgbWF0Y2hlcy5cbiAgICogICAgKiBgcGF0aGAgY2FuIGNvbnRhaW4gb3B0aW9uYWwgbmFtZWQgZ3JvdXBzIHdpdGggYSBxdWVzdGlvbiBtYXJrOiBlLmcuYDpuYW1lP2AuXG4gICAqXG4gICAqICAgIEZvciBleGFtcGxlLCByb3V0ZXMgbGlrZSBgL2NvbG9yLzpjb2xvci9sYXJnZWNvZGUvOmxhcmdlY29kZSpcXC9lZGl0YCB3aWxsIG1hdGNoXG4gICAqICAgIGAvY29sb3IvYnJvd24vbGFyZ2Vjb2RlL2NvZGUvd2l0aC9zbGFzaGVzL2VkaXRgIGFuZCBleHRyYWN0OlxuICAgKlxuICAgKiAgICAqIGBjb2xvcjogYnJvd25gXG4gICAqICAgICogYGxhcmdlY29kZTogY29kZS93aXRoL3NsYXNoZXNgLlxuICAgKlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcm91dGUgTWFwcGluZyBpbmZvcm1hdGlvbiB0byBiZSBhc3NpZ25lZCB0byBgJHJvdXRlLmN1cnJlbnRgIG9uIHJvdXRlXG4gICAqICAgIG1hdGNoLlxuICAgKlxuICAgKiAgICBPYmplY3QgcHJvcGVydGllczpcbiAgICpcbiAgICogICAgLSBgY29udHJvbGxlcmAg4oCTIGB7KHN0cmluZ3xGdW5jdGlvbik9fWAg4oCTIENvbnRyb2xsZXIgZm4gdGhhdCBzaG91bGQgYmUgYXNzb2NpYXRlZCB3aXRoXG4gICAqICAgICAgbmV3bHkgY3JlYXRlZCBzY29wZSBvciB0aGUgbmFtZSBvZiBhIHtAbGluayBhbmd1bGFyLk1vZHVsZSNjb250cm9sbGVyIHJlZ2lzdGVyZWRcbiAgICogICAgICBjb250cm9sbGVyfSBpZiBwYXNzZWQgYXMgYSBzdHJpbmcuXG4gICAqICAgIC0gYGNvbnRyb2xsZXJBc2Ag4oCTIGB7c3RyaW5nPX1gIOKAkyBBbiBpZGVudGlmaWVyIG5hbWUgZm9yIGEgcmVmZXJlbmNlIHRvIHRoZSBjb250cm9sbGVyLlxuICAgKiAgICAgIElmIHByZXNlbnQsIHRoZSBjb250cm9sbGVyIHdpbGwgYmUgcHVibGlzaGVkIHRvIHNjb3BlIHVuZGVyIHRoZSBgY29udHJvbGxlckFzYCBuYW1lLlxuICAgKiAgICAtIGB0ZW1wbGF0ZWAg4oCTIGB7KHN0cmluZ3xGdW5jdGlvbik9fWAg4oCTIGh0bWwgdGVtcGxhdGUgYXMgYSBzdHJpbmcgb3IgYSBmdW5jdGlvbiB0aGF0XG4gICAqICAgICAgcmV0dXJucyBhbiBodG1sIHRlbXBsYXRlIGFzIGEgc3RyaW5nIHdoaWNoIHNob3VsZCBiZSB1c2VkIGJ5IHtAbGlua1xuICAgKiAgICAgIG5nUm91dGUuZGlyZWN0aXZlOm5nVmlldyBuZ1ZpZXd9IG9yIHtAbGluayBuZy5kaXJlY3RpdmU6bmdJbmNsdWRlIG5nSW5jbHVkZX0gZGlyZWN0aXZlcy5cbiAgICogICAgICBUaGlzIHByb3BlcnR5IHRha2VzIHByZWNlZGVuY2Ugb3ZlciBgdGVtcGxhdGVVcmxgLlxuICAgKlxuICAgKiAgICAgIElmIGB0ZW1wbGF0ZWAgaXMgYSBmdW5jdGlvbiwgaXQgd2lsbCBiZSBjYWxsZWQgd2l0aCB0aGUgZm9sbG93aW5nIHBhcmFtZXRlcnM6XG4gICAqXG4gICAqICAgICAgLSBge0FycmF5LjxPYmplY3Q+fWAgLSByb3V0ZSBwYXJhbWV0ZXJzIGV4dHJhY3RlZCBmcm9tIHRoZSBjdXJyZW50XG4gICAqICAgICAgICBgJGxvY2F0aW9uLnBhdGgoKWAgYnkgYXBwbHlpbmcgdGhlIGN1cnJlbnQgcm91dGVcbiAgICpcbiAgICogICAgICBPbmUgb2YgYHRlbXBsYXRlYCBvciBgdGVtcGxhdGVVcmxgIGlzIHJlcXVpcmVkLlxuICAgKlxuICAgKiAgICAtIGB0ZW1wbGF0ZVVybGAg4oCTIGB7KHN0cmluZ3xGdW5jdGlvbik9fWAg4oCTIHBhdGggb3IgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgcGF0aCB0byBhbiBodG1sXG4gICAqICAgICAgdGVtcGxhdGUgdGhhdCBzaG91bGQgYmUgdXNlZCBieSB7QGxpbmsgbmdSb3V0ZS5kaXJlY3RpdmU6bmdWaWV3IG5nVmlld30uXG4gICAqXG4gICAqICAgICAgSWYgYHRlbXBsYXRlVXJsYCBpcyBhIGZ1bmN0aW9uLCBpdCB3aWxsIGJlIGNhbGxlZCB3aXRoIHRoZSBmb2xsb3dpbmcgcGFyYW1ldGVyczpcbiAgICpcbiAgICogICAgICAtIGB7QXJyYXkuPE9iamVjdD59YCAtIHJvdXRlIHBhcmFtZXRlcnMgZXh0cmFjdGVkIGZyb20gdGhlIGN1cnJlbnRcbiAgICogICAgICAgIGAkbG9jYXRpb24ucGF0aCgpYCBieSBhcHBseWluZyB0aGUgY3VycmVudCByb3V0ZVxuICAgKlxuICAgKiAgICAgIE9uZSBvZiBgdGVtcGxhdGVVcmxgIG9yIGB0ZW1wbGF0ZWAgaXMgcmVxdWlyZWQuXG4gICAqXG4gICAqICAgIC0gYHJlc29sdmVgIC0gYHtPYmplY3QuPHN0cmluZywgRnVuY3Rpb24+PX1gIC0gQW4gb3B0aW9uYWwgbWFwIG9mIGRlcGVuZGVuY2llcyB3aGljaCBzaG91bGRcbiAgICogICAgICBiZSBpbmplY3RlZCBpbnRvIHRoZSBjb250cm9sbGVyLiBJZiBhbnkgb2YgdGhlc2UgZGVwZW5kZW5jaWVzIGFyZSBwcm9taXNlcywgdGhlIHJvdXRlclxuICAgKiAgICAgIHdpbGwgd2FpdCBmb3IgdGhlbSBhbGwgdG8gYmUgcmVzb2x2ZWQgb3Igb25lIHRvIGJlIHJlamVjdGVkIGJlZm9yZSB0aGUgY29udHJvbGxlciBpc1xuICAgKiAgICAgIGluc3RhbnRpYXRlZC5cbiAgICogICAgICBJZiBhbGwgdGhlIHByb21pc2VzIGFyZSByZXNvbHZlZCBzdWNjZXNzZnVsbHksIHRoZSB2YWx1ZXMgb2YgdGhlIHJlc29sdmVkIHByb21pc2VzIGFyZVxuICAgKiAgICAgIGluamVjdGVkIGFuZCB7QGxpbmsgbmdSb3V0ZS4kcm91dGUjJHJvdXRlQ2hhbmdlU3VjY2VzcyAkcm91dGVDaGFuZ2VTdWNjZXNzfSBldmVudCBpc1xuICAgKiAgICAgIGZpcmVkLiBJZiBhbnkgb2YgdGhlIHByb21pc2VzIGFyZSByZWplY3RlZCB0aGVcbiAgICogICAgICB7QGxpbmsgbmdSb3V0ZS4kcm91dGUjJHJvdXRlQ2hhbmdlRXJyb3IgJHJvdXRlQ2hhbmdlRXJyb3J9IGV2ZW50IGlzIGZpcmVkLlxuICAgKiAgICAgIEZvciBlYXNpZXIgYWNjZXNzIHRvIHRoZSByZXNvbHZlZCBkZXBlbmRlbmNpZXMgZnJvbSB0aGUgdGVtcGxhdGUsIHRoZSBgcmVzb2x2ZWAgbWFwIHdpbGxcbiAgICogICAgICBiZSBhdmFpbGFibGUgb24gdGhlIHNjb3BlIG9mIHRoZSByb3V0ZSwgdW5kZXIgYCRyZXNvbHZlYCAoYnkgZGVmYXVsdCkgb3IgYSBjdXN0b20gbmFtZVxuICAgKiAgICAgIHNwZWNpZmllZCBieSB0aGUgYHJlc29sdmVBc2AgcHJvcGVydHkgKHNlZSBiZWxvdykuIFRoaXMgY2FuIGJlIHBhcnRpY3VsYXJseSB1c2VmdWwsIHdoZW5cbiAgICogICAgICB3b3JraW5nIHdpdGgge0BsaW5rIGFuZ3VsYXIuTW9kdWxlI2NvbXBvbmVudCBjb21wb25lbnRzfSBhcyByb3V0ZSB0ZW1wbGF0ZXMuPGJyIC8+XG4gICAqICAgICAgPGRpdiBjbGFzcz1cImFsZXJ0IGFsZXJ0LXdhcm5pbmdcIj5cbiAgICogICAgICAgICoqTm90ZToqKiBJZiB5b3VyIHNjb3BlIGFscmVhZHkgY29udGFpbnMgYSBwcm9wZXJ0eSB3aXRoIHRoaXMgbmFtZSwgaXQgd2lsbCBiZSBoaWRkZW5cbiAgICogICAgICAgIG9yIG92ZXJ3cml0dGVuLiBNYWtlIHN1cmUsIHlvdSBzcGVjaWZ5IGFuIGFwcHJvcHJpYXRlIG5hbWUgZm9yIHRoaXMgcHJvcGVydHksIHRoYXRcbiAgICogICAgICAgIGRvZXMgbm90IGNvbGxpZGUgd2l0aCBvdGhlciBwcm9wZXJ0aWVzIG9uIHRoZSBzY29wZS5cbiAgICogICAgICA8L2Rpdj5cbiAgICogICAgICBUaGUgbWFwIG9iamVjdCBpczpcbiAgICpcbiAgICogICAgICAtIGBrZXlgIOKAkyBge3N0cmluZ31gOiBhIG5hbWUgb2YgYSBkZXBlbmRlbmN5IHRvIGJlIGluamVjdGVkIGludG8gdGhlIGNvbnRyb2xsZXIuXG4gICAqICAgICAgLSBgZmFjdG9yeWAgLSBge3N0cmluZ3xGdW5jdGlvbn1gOiBJZiBgc3RyaW5nYCB0aGVuIGl0IGlzIGFuIGFsaWFzIGZvciBhIHNlcnZpY2UuXG4gICAqICAgICAgICBPdGhlcndpc2UgaWYgZnVuY3Rpb24sIHRoZW4gaXQgaXMge0BsaW5rIGF1dG8uJGluamVjdG9yI2ludm9rZSBpbmplY3RlZH1cbiAgICogICAgICAgIGFuZCB0aGUgcmV0dXJuIHZhbHVlIGlzIHRyZWF0ZWQgYXMgdGhlIGRlcGVuZGVuY3kuIElmIHRoZSByZXN1bHQgaXMgYSBwcm9taXNlLCBpdCBpc1xuICAgKiAgICAgICAgcmVzb2x2ZWQgYmVmb3JlIGl0cyB2YWx1ZSBpcyBpbmplY3RlZCBpbnRvIHRoZSBjb250cm9sbGVyLiBCZSBhd2FyZSB0aGF0XG4gICAqICAgICAgICBgbmdSb3V0ZS4kcm91dGVQYXJhbXNgIHdpbGwgc3RpbGwgcmVmZXIgdG8gdGhlIHByZXZpb3VzIHJvdXRlIHdpdGhpbiB0aGVzZSByZXNvbHZlXG4gICAqICAgICAgICBmdW5jdGlvbnMuICBVc2UgYCRyb3V0ZS5jdXJyZW50LnBhcmFtc2AgdG8gYWNjZXNzIHRoZSBuZXcgcm91dGUgcGFyYW1ldGVycywgaW5zdGVhZC5cbiAgICpcbiAgICogICAgLSBgcmVzb2x2ZUFzYCAtIGB7c3RyaW5nPX1gIC0gVGhlIG5hbWUgdW5kZXIgd2hpY2ggdGhlIGByZXNvbHZlYCBtYXAgd2lsbCBiZSBhdmFpbGFibGUgb25cbiAgICogICAgICB0aGUgc2NvcGUgb2YgdGhlIHJvdXRlLiBJZiBvbWl0dGVkLCBkZWZhdWx0cyB0byBgJHJlc29sdmVgLlxuICAgKlxuICAgKiAgICAtIGByZWRpcmVjdFRvYCDigJMgYHsoc3RyaW5nfEZ1bmN0aW9uKT19YCDigJMgdmFsdWUgdG8gdXBkYXRlXG4gICAqICAgICAge0BsaW5rIG5nLiRsb2NhdGlvbiAkbG9jYXRpb259IHBhdGggd2l0aCBhbmQgdHJpZ2dlciByb3V0ZSByZWRpcmVjdGlvbi5cbiAgICpcbiAgICogICAgICBJZiBgcmVkaXJlY3RUb2AgaXMgYSBmdW5jdGlvbiwgaXQgd2lsbCBiZSBjYWxsZWQgd2l0aCB0aGUgZm9sbG93aW5nIHBhcmFtZXRlcnM6XG4gICAqXG4gICAqICAgICAgLSBge09iamVjdC48c3RyaW5nPn1gIC0gcm91dGUgcGFyYW1ldGVycyBleHRyYWN0ZWQgZnJvbSB0aGUgY3VycmVudFxuICAgKiAgICAgICAgYCRsb2NhdGlvbi5wYXRoKClgIGJ5IGFwcGx5aW5nIHRoZSBjdXJyZW50IHJvdXRlIHRlbXBsYXRlVXJsLlxuICAgKiAgICAgIC0gYHtzdHJpbmd9YCAtIGN1cnJlbnQgYCRsb2NhdGlvbi5wYXRoKClgXG4gICAqICAgICAgLSBge09iamVjdH1gIC0gY3VycmVudCBgJGxvY2F0aW9uLnNlYXJjaCgpYFxuICAgKlxuICAgKiAgICAgIFRoZSBjdXN0b20gYHJlZGlyZWN0VG9gIGZ1bmN0aW9uIGlzIGV4cGVjdGVkIHRvIHJldHVybiBhIHN0cmluZyB3aGljaCB3aWxsIGJlIHVzZWRcbiAgICogICAgICB0byB1cGRhdGUgYCRsb2NhdGlvbi51cmwoKWAuIElmIHRoZSBmdW5jdGlvbiB0aHJvd3MgYW4gZXJyb3IsIG5vIGZ1cnRoZXIgcHJvY2Vzc2luZyB3aWxsXG4gICAqICAgICAgdGFrZSBwbGFjZSBhbmQgdGhlIHtAbGluayBuZ1JvdXRlLiRyb3V0ZSMkcm91dGVDaGFuZ2VFcnJvciAkcm91dGVDaGFuZ2VFcnJvcn0gZXZlbnQgd2lsbFxuICAgKiAgICAgIGJlIGZpcmVkLlxuICAgKlxuICAgKiAgICAgIFJvdXRlcyB0aGF0IHNwZWNpZnkgYHJlZGlyZWN0VG9gIHdpbGwgbm90IGhhdmUgdGhlaXIgY29udHJvbGxlcnMsIHRlbXBsYXRlIGZ1bmN0aW9uc1xuICAgKiAgICAgIG9yIHJlc29sdmVzIGNhbGxlZCwgdGhlIGAkbG9jYXRpb25gIHdpbGwgYmUgY2hhbmdlZCB0byB0aGUgcmVkaXJlY3QgdXJsIGFuZCByb3V0ZVxuICAgKiAgICAgIHByb2Nlc3Npbmcgd2lsbCBzdG9wLiBUaGUgZXhjZXB0aW9uIHRvIHRoaXMgaXMgaWYgdGhlIGByZWRpcmVjdFRvYCBpcyBhIGZ1bmN0aW9uIHRoYXRcbiAgICogICAgICByZXR1cm5zIGB1bmRlZmluZWRgLiBJbiB0aGlzIGNhc2UgdGhlIHJvdXRlIHRyYW5zaXRpb24gb2NjdXJzIGFzIHRob3VnaCB0aGVyZSB3YXMgbm9cbiAgICogICAgICByZWRpcmVjdGlvbi5cbiAgICpcbiAgICogICAgLSBgcmVzb2x2ZVJlZGlyZWN0VG9gIOKAkyBge0Z1bmN0aW9uPX1gIOKAkyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCAoZXZlbnR1YWxseSkgcmV0dXJuIHRoZSB2YWx1ZVxuICAgKiAgICAgIHRvIHVwZGF0ZSB7QGxpbmsgbmcuJGxvY2F0aW9uICRsb2NhdGlvbn0gVVJMIHdpdGggYW5kIHRyaWdnZXIgcm91dGUgcmVkaXJlY3Rpb24uIEluXG4gICAqICAgICAgY29udHJhc3QgdG8gYHJlZGlyZWN0VG9gLCBkZXBlbmRlbmNpZXMgY2FuIGJlIGluamVjdGVkIGludG8gYHJlc29sdmVSZWRpcmVjdFRvYCBhbmQgdGhlXG4gICAqICAgICAgcmV0dXJuIHZhbHVlIGNhbiBiZSBlaXRoZXIgYSBzdHJpbmcgb3IgYSBwcm9taXNlIHRoYXQgd2lsbCBiZSByZXNvbHZlZCB0byBhIHN0cmluZy5cbiAgICpcbiAgICogICAgICBTaW1pbGFyIHRvIGByZWRpcmVjdFRvYCwgaWYgdGhlIHJldHVybiB2YWx1ZSBpcyBgdW5kZWZpbmVkYCAob3IgYSBwcm9taXNlIHRoYXQgZ2V0c1xuICAgKiAgICAgIHJlc29sdmVkIHRvIGB1bmRlZmluZWRgKSwgbm8gcmVkaXJlY3Rpb24gdGFrZXMgcGxhY2UgYW5kIHRoZSByb3V0ZSB0cmFuc2l0aW9uIG9jY3VycyBhc1xuICAgKiAgICAgIHRob3VnaCB0aGVyZSB3YXMgbm8gcmVkaXJlY3Rpb24uXG4gICAqXG4gICAqICAgICAgSWYgdGhlIGZ1bmN0aW9uIHRocm93cyBhbiBlcnJvciBvciB0aGUgcmV0dXJuZWQgcHJvbWlzZSBnZXRzIHJlamVjdGVkLCBubyBmdXJ0aGVyXG4gICAqICAgICAgcHJvY2Vzc2luZyB3aWxsIHRha2UgcGxhY2UgYW5kIHRoZVxuICAgKiAgICAgIHtAbGluayBuZ1JvdXRlLiRyb3V0ZSMkcm91dGVDaGFuZ2VFcnJvciAkcm91dGVDaGFuZ2VFcnJvcn0gZXZlbnQgd2lsbCBiZSBmaXJlZC5cbiAgICpcbiAgICogICAgICBgcmVkaXJlY3RUb2AgdGFrZXMgcHJlY2VkZW5jZSBvdmVyIGByZXNvbHZlUmVkaXJlY3RUb2AsIHNvIHNwZWNpZnlpbmcgYm90aCBvbiB0aGUgc2FtZVxuICAgKiAgICAgIHJvdXRlIGRlZmluaXRpb24sIHdpbGwgY2F1c2UgdGhlIGxhdHRlciB0byBiZSBpZ25vcmVkLlxuICAgKlxuICAgKiAgICAtIGBbcmVsb2FkT25TZWFyY2g9dHJ1ZV1gIC0gYHtib29sZWFuPX1gIC0gcmVsb2FkIHJvdXRlIHdoZW4gb25seSBgJGxvY2F0aW9uLnNlYXJjaCgpYFxuICAgKiAgICAgIG9yIGAkbG9jYXRpb24uaGFzaCgpYCBjaGFuZ2VzLlxuICAgKlxuICAgKiAgICAgIElmIHRoZSBvcHRpb24gaXMgc2V0IHRvIGBmYWxzZWAgYW5kIHVybCBpbiB0aGUgYnJvd3NlciBjaGFuZ2VzLCB0aGVuXG4gICAqICAgICAgYCRyb3V0ZVVwZGF0ZWAgZXZlbnQgaXMgYnJvYWRjYXN0ZWQgb24gdGhlIHJvb3Qgc2NvcGUuXG4gICAqXG4gICAqICAgIC0gYFtjYXNlSW5zZW5zaXRpdmVNYXRjaD1mYWxzZV1gIC0gYHtib29sZWFuPX1gIC0gbWF0Y2ggcm91dGVzIHdpdGhvdXQgYmVpbmcgY2FzZSBzZW5zaXRpdmVcbiAgICpcbiAgICogICAgICBJZiB0aGUgb3B0aW9uIGlzIHNldCB0byBgdHJ1ZWAsIHRoZW4gdGhlIHBhcnRpY3VsYXIgcm91dGUgY2FuIGJlIG1hdGNoZWQgd2l0aG91dCBiZWluZ1xuICAgKiAgICAgIGNhc2Ugc2Vuc2l0aXZlXG4gICAqXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IHNlbGZcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIEFkZHMgYSBuZXcgcm91dGUgZGVmaW5pdGlvbiB0byB0aGUgYCRyb3V0ZWAgc2VydmljZS5cbiAgICovXG4gIHRoaXMud2hlbiA9IGZ1bmN0aW9uKHBhdGgsIHJvdXRlKSB7XG4gICAgLy9jb3B5IG9yaWdpbmFsIHJvdXRlIG9iamVjdCB0byBwcmVzZXJ2ZSBwYXJhbXMgaW5oZXJpdGVkIGZyb20gcHJvdG8gY2hhaW5cbiAgICB2YXIgcm91dGVDb3B5ID0gc2hhbGxvd0NvcHkocm91dGUpO1xuICAgIGlmIChhbmd1bGFyLmlzVW5kZWZpbmVkKHJvdXRlQ29weS5yZWxvYWRPblNlYXJjaCkpIHtcbiAgICAgIHJvdXRlQ29weS5yZWxvYWRPblNlYXJjaCA9IHRydWU7XG4gICAgfVxuICAgIGlmIChhbmd1bGFyLmlzVW5kZWZpbmVkKHJvdXRlQ29weS5jYXNlSW5zZW5zaXRpdmVNYXRjaCkpIHtcbiAgICAgIHJvdXRlQ29weS5jYXNlSW5zZW5zaXRpdmVNYXRjaCA9IHRoaXMuY2FzZUluc2Vuc2l0aXZlTWF0Y2g7XG4gICAgfVxuICAgIHJvdXRlc1twYXRoXSA9IGFuZ3VsYXIuZXh0ZW5kKFxuICAgICAgcm91dGVDb3B5LFxuICAgICAgcGF0aCAmJiBwYXRoUmVnRXhwKHBhdGgsIHJvdXRlQ29weSlcbiAgICApO1xuXG4gICAgLy8gY3JlYXRlIHJlZGlyZWN0aW9uIGZvciB0cmFpbGluZyBzbGFzaGVzXG4gICAgaWYgKHBhdGgpIHtcbiAgICAgIHZhciByZWRpcmVjdFBhdGggPSAocGF0aFtwYXRoLmxlbmd0aCAtIDFdID09PSAnLycpXG4gICAgICAgICAgICA/IHBhdGguc3Vic3RyKDAsIHBhdGgubGVuZ3RoIC0gMSlcbiAgICAgICAgICAgIDogcGF0aCArICcvJztcblxuICAgICAgcm91dGVzW3JlZGlyZWN0UGF0aF0gPSBhbmd1bGFyLmV4dGVuZChcbiAgICAgICAge3JlZGlyZWN0VG86IHBhdGh9LFxuICAgICAgICBwYXRoUmVnRXhwKHJlZGlyZWN0UGF0aCwgcm91dGVDb3B5KVxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogQG5nZG9jIHByb3BlcnR5XG4gICAqIEBuYW1lICRyb3V0ZVByb3ZpZGVyI2Nhc2VJbnNlbnNpdGl2ZU1hdGNoXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKlxuICAgKiBBIGJvb2xlYW4gcHJvcGVydHkgaW5kaWNhdGluZyBpZiByb3V0ZXMgZGVmaW5lZFxuICAgKiB1c2luZyB0aGlzIHByb3ZpZGVyIHNob3VsZCBiZSBtYXRjaGVkIHVzaW5nIGEgY2FzZSBpbnNlbnNpdGl2ZVxuICAgKiBhbGdvcml0aG0uIERlZmF1bHRzIHRvIGBmYWxzZWAuXG4gICAqL1xuICB0aGlzLmNhc2VJbnNlbnNpdGl2ZU1hdGNoID0gZmFsc2U7XG5cbiAgIC8qKlxuICAgICogQHBhcmFtIHBhdGgge3N0cmluZ30gcGF0aFxuICAgICogQHBhcmFtIG9wdHMge09iamVjdH0gb3B0aW9uc1xuICAgICogQHJldHVybiB7P09iamVjdH1cbiAgICAqXG4gICAgKiBAZGVzY3JpcHRpb25cbiAgICAqIE5vcm1hbGl6ZXMgdGhlIGdpdmVuIHBhdGgsIHJldHVybmluZyBhIHJlZ3VsYXIgZXhwcmVzc2lvblxuICAgICogYW5kIHRoZSBvcmlnaW5hbCBwYXRoLlxuICAgICpcbiAgICAqIEluc3BpcmVkIGJ5IHBhdGhSZXhwIGluIHZpc2lvbm1lZGlhL2V4cHJlc3MvbGliL3V0aWxzLmpzLlxuICAgICovXG4gIGZ1bmN0aW9uIHBhdGhSZWdFeHAocGF0aCwgb3B0cykge1xuICAgIHZhciBpbnNlbnNpdGl2ZSA9IG9wdHMuY2FzZUluc2Vuc2l0aXZlTWF0Y2gsXG4gICAgICAgIHJldCA9IHtcbiAgICAgICAgICBvcmlnaW5hbFBhdGg6IHBhdGgsXG4gICAgICAgICAgcmVnZXhwOiBwYXRoXG4gICAgICAgIH0sXG4gICAgICAgIGtleXMgPSByZXQua2V5cyA9IFtdO1xuXG4gICAgcGF0aCA9IHBhdGhcbiAgICAgIC5yZXBsYWNlKC8oWygpLl0pL2csICdcXFxcJDEnKVxuICAgICAgLnJlcGxhY2UoLyhcXC8pPzooXFx3KykoXFwqXFw/fFs/Kl0pPy9nLCBmdW5jdGlvbihfLCBzbGFzaCwga2V5LCBvcHRpb24pIHtcbiAgICAgICAgdmFyIG9wdGlvbmFsID0gKG9wdGlvbiA9PT0gJz8nIHx8IG9wdGlvbiA9PT0gJyo/JykgPyAnPycgOiBudWxsO1xuICAgICAgICB2YXIgc3RhciA9IChvcHRpb24gPT09ICcqJyB8fCBvcHRpb24gPT09ICcqPycpID8gJyonIDogbnVsbDtcbiAgICAgICAga2V5cy5wdXNoKHsgbmFtZToga2V5LCBvcHRpb25hbDogISFvcHRpb25hbCB9KTtcbiAgICAgICAgc2xhc2ggPSBzbGFzaCB8fCAnJztcbiAgICAgICAgcmV0dXJuICcnXG4gICAgICAgICAgKyAob3B0aW9uYWwgPyAnJyA6IHNsYXNoKVxuICAgICAgICAgICsgJyg/OidcbiAgICAgICAgICArIChvcHRpb25hbCA/IHNsYXNoIDogJycpXG4gICAgICAgICAgKyAoc3RhciAmJiAnKC4rPyknIHx8ICcoW14vXSspJylcbiAgICAgICAgICArIChvcHRpb25hbCB8fCAnJylcbiAgICAgICAgICArICcpJ1xuICAgICAgICAgICsgKG9wdGlvbmFsIHx8ICcnKTtcbiAgICAgIH0pXG4gICAgICAucmVwbGFjZSgvKFsvJCpdKS9nLCAnXFxcXCQxJyk7XG5cbiAgICByZXQucmVnZXhwID0gbmV3IFJlZ0V4cCgnXicgKyBwYXRoICsgJyQnLCBpbnNlbnNpdGl2ZSA/ICdpJyA6ICcnKTtcbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBtZXRob2RcbiAgICogQG5hbWUgJHJvdXRlUHJvdmlkZXIjb3RoZXJ3aXNlXG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBTZXRzIHJvdXRlIGRlZmluaXRpb24gdGhhdCB3aWxsIGJlIHVzZWQgb24gcm91dGUgY2hhbmdlIHdoZW4gbm8gb3RoZXIgcm91dGUgZGVmaW5pdGlvblxuICAgKiBpcyBtYXRjaGVkLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdHxzdHJpbmd9IHBhcmFtcyBNYXBwaW5nIGluZm9ybWF0aW9uIHRvIGJlIGFzc2lnbmVkIHRvIGAkcm91dGUuY3VycmVudGAuXG4gICAqIElmIGNhbGxlZCB3aXRoIGEgc3RyaW5nLCB0aGUgdmFsdWUgbWFwcyB0byBgcmVkaXJlY3RUb2AuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IHNlbGZcbiAgICovXG4gIHRoaXMub3RoZXJ3aXNlID0gZnVuY3Rpb24ocGFyYW1zKSB7XG4gICAgaWYgKHR5cGVvZiBwYXJhbXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICBwYXJhbXMgPSB7cmVkaXJlY3RUbzogcGFyYW1zfTtcbiAgICB9XG4gICAgdGhpcy53aGVuKG51bGwsIHBhcmFtcyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBtZXRob2RcbiAgICogQG5hbWUgJHJvdXRlUHJvdmlkZXIjZWFnZXJJbnN0YW50aWF0aW9uRW5hYmxlZFxuICAgKiBAa2luZCBmdW5jdGlvblxuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogQ2FsbCB0aGlzIG1ldGhvZCBhcyBhIHNldHRlciB0byBlbmFibGUvZGlzYWJsZSBlYWdlciBpbnN0YW50aWF0aW9uIG9mIHRoZVxuICAgKiB7QGxpbmsgbmdSb3V0ZS4kcm91dGUgJHJvdXRlfSBzZXJ2aWNlIHVwb24gYXBwbGljYXRpb24gYm9vdHN0cmFwLiBZb3UgY2FuIGFsc28gY2FsbCBpdCBhcyBhXG4gICAqIGdldHRlciAoaS5lLiB3aXRob3V0IGFueSBhcmd1bWVudHMpIHRvIGdldCB0aGUgY3VycmVudCB2YWx1ZSBvZiB0aGVcbiAgICogYGVhZ2VySW5zdGFudGlhdGlvbkVuYWJsZWRgIGZsYWcuXG4gICAqXG4gICAqIEluc3RhbnRpYXRpbmcgYCRyb3V0ZWAgZWFybHkgaXMgbmVjZXNzYXJ5IGZvciBjYXB0dXJpbmcgdGhlIGluaXRpYWxcbiAgICoge0BsaW5rIG5nLiRsb2NhdGlvbiMkbG9jYXRpb25DaGFuZ2VTdGFydCAkbG9jYXRpb25DaGFuZ2VTdGFydH0gZXZlbnQgYW5kIG5hdmlnYXRpbmcgdG8gdGhlXG4gICAqIGFwcHJvcHJpYXRlIHJvdXRlLiBVc3VhbGx5LCBgJHJvdXRlYCBpcyBpbnN0YW50aWF0ZWQgaW4gdGltZSBieSB0aGVcbiAgICoge0BsaW5rIG5nUm91dGUubmdWaWV3IG5nVmlld30gZGlyZWN0aXZlLiBZZXQsIGluIGNhc2VzIHdoZXJlIGBuZ1ZpZXdgIGlzIGluY2x1ZGVkIGluIGFuXG4gICAqIGFzeW5jaHJvbm91c2x5IGxvYWRlZCB0ZW1wbGF0ZSAoZS5nLiBpbiBhbm90aGVyIGRpcmVjdGl2ZSdzIHRlbXBsYXRlKSwgdGhlIGRpcmVjdGl2ZSBmYWN0b3J5XG4gICAqIG1pZ2h0IG5vdCBiZSBjYWxsZWQgc29vbiBlbm91Z2ggZm9yIGAkcm91dGVgIHRvIGJlIGluc3RhbnRpYXRlZCBfYmVmb3JlXyB0aGUgaW5pdGlhbFxuICAgKiBgJGxvY2F0aW9uQ2hhbmdlU3VjY2Vzc2AgZXZlbnQgaXMgZmlyZWQuIEVhZ2VyIGluc3RhbnRpYXRpb24gZW5zdXJlcyB0aGF0IGAkcm91dGVgIGlzIGFsd2F5c1xuICAgKiBpbnN0YW50aWF0ZWQgaW4gdGltZSwgcmVnYXJkbGVzcyBvZiB3aGVuIGBuZ1ZpZXdgIHdpbGwgYmUgbG9hZGVkLlxuICAgKlxuICAgKiBUaGUgZGVmYXVsdCB2YWx1ZSBpcyB0cnVlLlxuICAgKlxuICAgKiAqKk5vdGUqKjo8YnIgLz5cbiAgICogWW91IG1heSB3YW50IHRvIGRpc2FibGUgdGhlIGRlZmF1bHQgYmVoYXZpb3Igd2hlbiB1bml0LXRlc3RpbmcgbW9kdWxlcyB0aGF0IGRlcGVuZCBvblxuICAgKiBgbmdSb3V0ZWAsIGluIG9yZGVyIHRvIGF2b2lkIGFuIHVuZXhwZWN0ZWQgcmVxdWVzdCBmb3IgdGhlIGRlZmF1bHQgcm91dGUncyB0ZW1wbGF0ZS5cbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFuPX0gZW5hYmxlZCAtIElmIHByb3ZpZGVkLCB1cGRhdGUgdGhlIGludGVybmFsIGBlYWdlckluc3RhbnRpYXRpb25FbmFibGVkYCBmbGFnLlxuICAgKlxuICAgKiBAcmV0dXJucyB7Kn0gVGhlIGN1cnJlbnQgdmFsdWUgb2YgdGhlIGBlYWdlckluc3RhbnRpYXRpb25FbmFibGVkYCBmbGFnIGlmIHVzZWQgYXMgYSBnZXR0ZXIgb3JcbiAgICogICAgIGl0c2VsZiAoZm9yIGNoYWluaW5nKSBpZiB1c2VkIGFzIGEgc2V0dGVyLlxuICAgKi9cbiAgaXNFYWdlckluc3RhbnRpYXRpb25FbmFibGVkID0gdHJ1ZTtcbiAgdGhpcy5lYWdlckluc3RhbnRpYXRpb25FbmFibGVkID0gZnVuY3Rpb24gZWFnZXJJbnN0YW50aWF0aW9uRW5hYmxlZChlbmFibGVkKSB7XG4gICAgaWYgKGlzRGVmaW5lZChlbmFibGVkKSkge1xuICAgICAgaXNFYWdlckluc3RhbnRpYXRpb25FbmFibGVkID0gZW5hYmxlZDtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHJldHVybiBpc0VhZ2VySW5zdGFudGlhdGlvbkVuYWJsZWQ7XG4gIH07XG5cblxuICB0aGlzLiRnZXQgPSBbJyRyb290U2NvcGUnLFxuICAgICAgICAgICAgICAgJyRsb2NhdGlvbicsXG4gICAgICAgICAgICAgICAnJHJvdXRlUGFyYW1zJyxcbiAgICAgICAgICAgICAgICckcScsXG4gICAgICAgICAgICAgICAnJGluamVjdG9yJyxcbiAgICAgICAgICAgICAgICckdGVtcGxhdGVSZXF1ZXN0JyxcbiAgICAgICAgICAgICAgICckc2NlJyxcbiAgICAgICAgICAgICAgICckYnJvd3NlcicsXG4gICAgICBmdW5jdGlvbigkcm9vdFNjb3BlLCAkbG9jYXRpb24sICRyb3V0ZVBhcmFtcywgJHEsICRpbmplY3RvciwgJHRlbXBsYXRlUmVxdWVzdCwgJHNjZSwgJGJyb3dzZXIpIHtcblxuICAgIC8qKlxuICAgICAqIEBuZ2RvYyBzZXJ2aWNlXG4gICAgICogQG5hbWUgJHJvdXRlXG4gICAgICogQHJlcXVpcmVzICRsb2NhdGlvblxuICAgICAqIEByZXF1aXJlcyAkcm91dGVQYXJhbXNcbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBjdXJyZW50IFJlZmVyZW5jZSB0byB0aGUgY3VycmVudCByb3V0ZSBkZWZpbml0aW9uLlxuICAgICAqIFRoZSByb3V0ZSBkZWZpbml0aW9uIGNvbnRhaW5zOlxuICAgICAqXG4gICAgICogICAtIGBjb250cm9sbGVyYDogVGhlIGNvbnRyb2xsZXIgY29uc3RydWN0b3IgYXMgZGVmaW5lZCBpbiB0aGUgcm91dGUgZGVmaW5pdGlvbi5cbiAgICAgKiAgIC0gYGxvY2Fsc2A6IEEgbWFwIG9mIGxvY2FscyB3aGljaCBpcyB1c2VkIGJ5IHtAbGluayBuZy4kY29udHJvbGxlciAkY29udHJvbGxlcn0gc2VydmljZSBmb3JcbiAgICAgKiAgICAgY29udHJvbGxlciBpbnN0YW50aWF0aW9uLiBUaGUgYGxvY2Fsc2AgY29udGFpblxuICAgICAqICAgICB0aGUgcmVzb2x2ZWQgdmFsdWVzIG9mIHRoZSBgcmVzb2x2ZWAgbWFwLiBBZGRpdGlvbmFsbHkgdGhlIGBsb2NhbHNgIGFsc28gY29udGFpbjpcbiAgICAgKlxuICAgICAqICAgICAtIGAkc2NvcGVgIC0gVGhlIGN1cnJlbnQgcm91dGUgc2NvcGUuXG4gICAgICogICAgIC0gYCR0ZW1wbGF0ZWAgLSBUaGUgY3VycmVudCByb3V0ZSB0ZW1wbGF0ZSBIVE1MLlxuICAgICAqXG4gICAgICogICAgIFRoZSBgbG9jYWxzYCB3aWxsIGJlIGFzc2lnbmVkIHRvIHRoZSByb3V0ZSBzY29wZSdzIGAkcmVzb2x2ZWAgcHJvcGVydHkuIFlvdSBjYW4gb3ZlcnJpZGVcbiAgICAgKiAgICAgdGhlIHByb3BlcnR5IG5hbWUsIHVzaW5nIGByZXNvbHZlQXNgIGluIHRoZSByb3V0ZSBkZWZpbml0aW9uLiBTZWVcbiAgICAgKiAgICAge0BsaW5rIG5nUm91dGUuJHJvdXRlUHJvdmlkZXIgJHJvdXRlUHJvdmlkZXJ9IGZvciBtb3JlIGluZm8uXG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkge09iamVjdH0gcm91dGVzIE9iamVjdCB3aXRoIGFsbCByb3V0ZSBjb25maWd1cmF0aW9uIE9iamVjdHMgYXMgaXRzIHByb3BlcnRpZXMuXG4gICAgICpcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBgJHJvdXRlYCBpcyB1c2VkIGZvciBkZWVwLWxpbmtpbmcgVVJMcyB0byBjb250cm9sbGVycyBhbmQgdmlld3MgKEhUTUwgcGFydGlhbHMpLlxuICAgICAqIEl0IHdhdGNoZXMgYCRsb2NhdGlvbi51cmwoKWAgYW5kIHRyaWVzIHRvIG1hcCB0aGUgcGF0aCB0byBhbiBleGlzdGluZyByb3V0ZSBkZWZpbml0aW9uLlxuICAgICAqXG4gICAgICogUmVxdWlyZXMgdGhlIHtAbGluayBuZ1JvdXRlIGBuZ1JvdXRlYH0gbW9kdWxlIHRvIGJlIGluc3RhbGxlZC5cbiAgICAgKlxuICAgICAqIFlvdSBjYW4gZGVmaW5lIHJvdXRlcyB0aHJvdWdoIHtAbGluayBuZ1JvdXRlLiRyb3V0ZVByb3ZpZGVyICRyb3V0ZVByb3ZpZGVyfSdzIEFQSS5cbiAgICAgKlxuICAgICAqIFRoZSBgJHJvdXRlYCBzZXJ2aWNlIGlzIHR5cGljYWxseSB1c2VkIGluIGNvbmp1bmN0aW9uIHdpdGggdGhlXG4gICAgICoge0BsaW5rIG5nUm91dGUuZGlyZWN0aXZlOm5nVmlldyBgbmdWaWV3YH0gZGlyZWN0aXZlIGFuZCB0aGVcbiAgICAgKiB7QGxpbmsgbmdSb3V0ZS4kcm91dGVQYXJhbXMgYCRyb3V0ZVBhcmFtc2B9IHNlcnZpY2UuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIFRoaXMgZXhhbXBsZSBzaG93cyBob3cgY2hhbmdpbmcgdGhlIFVSTCBoYXNoIGNhdXNlcyB0aGUgYCRyb3V0ZWAgdG8gbWF0Y2ggYSByb3V0ZSBhZ2FpbnN0IHRoZVxuICAgICAqIFVSTCwgYW5kIHRoZSBgbmdWaWV3YCBwdWxscyBpbiB0aGUgcGFydGlhbC5cbiAgICAgKlxuICAgICAqIDxleGFtcGxlIG5hbWU9XCIkcm91dGUtc2VydmljZVwiIG1vZHVsZT1cIm5nUm91dGVFeGFtcGxlXCJcbiAgICAgKiAgICAgICAgICBkZXBzPVwiYW5ndWxhci1yb3V0ZS5qc1wiIGZpeEJhc2U9XCJ0cnVlXCI+XG4gICAgICogICA8ZmlsZSBuYW1lPVwiaW5kZXguaHRtbFwiPlxuICAgICAqICAgICA8ZGl2IG5nLWNvbnRyb2xsZXI9XCJNYWluQ29udHJvbGxlclwiPlxuICAgICAqICAgICAgIENob29zZTpcbiAgICAgKiAgICAgICA8YSBocmVmPVwiQm9vay9Nb2J5XCI+TW9ieTwvYT4gfFxuICAgICAqICAgICAgIDxhIGhyZWY9XCJCb29rL01vYnkvY2gvMVwiPk1vYnk6IENoMTwvYT4gfFxuICAgICAqICAgICAgIDxhIGhyZWY9XCJCb29rL0dhdHNieVwiPkdhdHNieTwvYT4gfFxuICAgICAqICAgICAgIDxhIGhyZWY9XCJCb29rL0dhdHNieS9jaC80P2tleT12YWx1ZVwiPkdhdHNieTogQ2g0PC9hPiB8XG4gICAgICogICAgICAgPGEgaHJlZj1cIkJvb2svU2NhcmxldFwiPlNjYXJsZXQgTGV0dGVyPC9hPjxici8+XG4gICAgICpcbiAgICAgKiAgICAgICA8ZGl2IG5nLXZpZXc+PC9kaXY+XG4gICAgICpcbiAgICAgKiAgICAgICA8aHIgLz5cbiAgICAgKlxuICAgICAqICAgICAgIDxwcmU+JGxvY2F0aW9uLnBhdGgoKSA9IHt7JGxvY2F0aW9uLnBhdGgoKX19PC9wcmU+XG4gICAgICogICAgICAgPHByZT4kcm91dGUuY3VycmVudC50ZW1wbGF0ZVVybCA9IHt7JHJvdXRlLmN1cnJlbnQudGVtcGxhdGVVcmx9fTwvcHJlPlxuICAgICAqICAgICAgIDxwcmU+JHJvdXRlLmN1cnJlbnQucGFyYW1zID0ge3skcm91dGUuY3VycmVudC5wYXJhbXN9fTwvcHJlPlxuICAgICAqICAgICAgIDxwcmU+JHJvdXRlLmN1cnJlbnQuc2NvcGUubmFtZSA9IHt7JHJvdXRlLmN1cnJlbnQuc2NvcGUubmFtZX19PC9wcmU+XG4gICAgICogICAgICAgPHByZT4kcm91dGVQYXJhbXMgPSB7eyRyb3V0ZVBhcmFtc319PC9wcmU+XG4gICAgICogICAgIDwvZGl2PlxuICAgICAqICAgPC9maWxlPlxuICAgICAqXG4gICAgICogICA8ZmlsZSBuYW1lPVwiYm9vay5odG1sXCI+XG4gICAgICogICAgIGNvbnRyb2xsZXI6IHt7bmFtZX19PGJyIC8+XG4gICAgICogICAgIEJvb2sgSWQ6IHt7cGFyYW1zLmJvb2tJZH19PGJyIC8+XG4gICAgICogICA8L2ZpbGU+XG4gICAgICpcbiAgICAgKiAgIDxmaWxlIG5hbWU9XCJjaGFwdGVyLmh0bWxcIj5cbiAgICAgKiAgICAgY29udHJvbGxlcjoge3tuYW1lfX08YnIgLz5cbiAgICAgKiAgICAgQm9vayBJZDoge3twYXJhbXMuYm9va0lkfX08YnIgLz5cbiAgICAgKiAgICAgQ2hhcHRlciBJZDoge3twYXJhbXMuY2hhcHRlcklkfX1cbiAgICAgKiAgIDwvZmlsZT5cbiAgICAgKlxuICAgICAqICAgPGZpbGUgbmFtZT1cInNjcmlwdC5qc1wiPlxuICAgICAqICAgICBhbmd1bGFyLm1vZHVsZSgnbmdSb3V0ZUV4YW1wbGUnLCBbJ25nUm91dGUnXSlcbiAgICAgKlxuICAgICAqICAgICAgLmNvbnRyb2xsZXIoJ01haW5Db250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCAkcm91dGUsICRyb3V0ZVBhcmFtcywgJGxvY2F0aW9uKSB7XG4gICAgICogICAgICAgICAgJHNjb3BlLiRyb3V0ZSA9ICRyb3V0ZTtcbiAgICAgKiAgICAgICAgICAkc2NvcGUuJGxvY2F0aW9uID0gJGxvY2F0aW9uO1xuICAgICAqICAgICAgICAgICRzY29wZS4kcm91dGVQYXJhbXMgPSAkcm91dGVQYXJhbXM7XG4gICAgICogICAgICB9KVxuICAgICAqXG4gICAgICogICAgICAuY29udHJvbGxlcignQm9va0NvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsICRyb3V0ZVBhcmFtcykge1xuICAgICAqICAgICAgICAgICRzY29wZS5uYW1lID0gJ0Jvb2tDb250cm9sbGVyJztcbiAgICAgKiAgICAgICAgICAkc2NvcGUucGFyYW1zID0gJHJvdXRlUGFyYW1zO1xuICAgICAqICAgICAgfSlcbiAgICAgKlxuICAgICAqICAgICAgLmNvbnRyb2xsZXIoJ0NoYXB0ZXJDb250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCAkcm91dGVQYXJhbXMpIHtcbiAgICAgKiAgICAgICAgICAkc2NvcGUubmFtZSA9ICdDaGFwdGVyQ29udHJvbGxlcic7XG4gICAgICogICAgICAgICAgJHNjb3BlLnBhcmFtcyA9ICRyb3V0ZVBhcmFtcztcbiAgICAgKiAgICAgIH0pXG4gICAgICpcbiAgICAgKiAgICAgLmNvbmZpZyhmdW5jdGlvbigkcm91dGVQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIpIHtcbiAgICAgKiAgICAgICAkcm91dGVQcm92aWRlclxuICAgICAqICAgICAgICAud2hlbignL0Jvb2svOmJvb2tJZCcsIHtcbiAgICAgKiAgICAgICAgIHRlbXBsYXRlVXJsOiAnYm9vay5odG1sJyxcbiAgICAgKiAgICAgICAgIGNvbnRyb2xsZXI6ICdCb29rQ29udHJvbGxlcicsXG4gICAgICogICAgICAgICByZXNvbHZlOiB7XG4gICAgICogICAgICAgICAgIC8vIEkgd2lsbCBjYXVzZSBhIDEgc2Vjb25kIGRlbGF5XG4gICAgICogICAgICAgICAgIGRlbGF5OiBmdW5jdGlvbigkcSwgJHRpbWVvdXQpIHtcbiAgICAgKiAgICAgICAgICAgICB2YXIgZGVsYXkgPSAkcS5kZWZlcigpO1xuICAgICAqICAgICAgICAgICAgICR0aW1lb3V0KGRlbGF5LnJlc29sdmUsIDEwMDApO1xuICAgICAqICAgICAgICAgICAgIHJldHVybiBkZWxheS5wcm9taXNlO1xuICAgICAqICAgICAgICAgICB9XG4gICAgICogICAgICAgICB9XG4gICAgICogICAgICAgfSlcbiAgICAgKiAgICAgICAud2hlbignL0Jvb2svOmJvb2tJZC9jaC86Y2hhcHRlcklkJywge1xuICAgICAqICAgICAgICAgdGVtcGxhdGVVcmw6ICdjaGFwdGVyLmh0bWwnLFxuICAgICAqICAgICAgICAgY29udHJvbGxlcjogJ0NoYXB0ZXJDb250cm9sbGVyJ1xuICAgICAqICAgICAgIH0pO1xuICAgICAqXG4gICAgICogICAgICAgLy8gY29uZmlndXJlIGh0bWw1IHRvIGdldCBsaW5rcyB3b3JraW5nIG9uIGpzZmlkZGxlXG4gICAgICogICAgICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xuICAgICAqICAgICB9KTtcbiAgICAgKlxuICAgICAqICAgPC9maWxlPlxuICAgICAqXG4gICAgICogICA8ZmlsZSBuYW1lPVwicHJvdHJhY3Rvci5qc1wiIHR5cGU9XCJwcm90cmFjdG9yXCI+XG4gICAgICogICAgIGl0KCdzaG91bGQgbG9hZCBhbmQgY29tcGlsZSBjb3JyZWN0IHRlbXBsYXRlJywgZnVuY3Rpb24oKSB7XG4gICAgICogICAgICAgZWxlbWVudChieS5saW5rVGV4dCgnTW9ieTogQ2gxJykpLmNsaWNrKCk7XG4gICAgICogICAgICAgdmFyIGNvbnRlbnQgPSBlbGVtZW50KGJ5LmNzcygnW25nLXZpZXddJykpLmdldFRleHQoKTtcbiAgICAgKiAgICAgICBleHBlY3QoY29udGVudCkudG9NYXRjaCgvY29udHJvbGxlcjogQ2hhcHRlckNvbnRyb2xsZXIvKTtcbiAgICAgKiAgICAgICBleHBlY3QoY29udGVudCkudG9NYXRjaCgvQm9vayBJZDogTW9ieS8pO1xuICAgICAqICAgICAgIGV4cGVjdChjb250ZW50KS50b01hdGNoKC9DaGFwdGVyIElkOiAxLyk7XG4gICAgICpcbiAgICAgKiAgICAgICBlbGVtZW50KGJ5LnBhcnRpYWxMaW5rVGV4dCgnU2NhcmxldCcpKS5jbGljaygpO1xuICAgICAqXG4gICAgICogICAgICAgY29udGVudCA9IGVsZW1lbnQoYnkuY3NzKCdbbmctdmlld10nKSkuZ2V0VGV4dCgpO1xuICAgICAqICAgICAgIGV4cGVjdChjb250ZW50KS50b01hdGNoKC9jb250cm9sbGVyOiBCb29rQ29udHJvbGxlci8pO1xuICAgICAqICAgICAgIGV4cGVjdChjb250ZW50KS50b01hdGNoKC9Cb29rIElkOiBTY2FybGV0Lyk7XG4gICAgICogICAgIH0pO1xuICAgICAqICAgPC9maWxlPlxuICAgICAqIDwvZXhhbXBsZT5cbiAgICAgKi9cblxuICAgIC8qKlxuICAgICAqIEBuZ2RvYyBldmVudFxuICAgICAqIEBuYW1lICRyb3V0ZSMkcm91dGVDaGFuZ2VTdGFydFxuICAgICAqIEBldmVudFR5cGUgYnJvYWRjYXN0IG9uIHJvb3Qgc2NvcGVcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBCcm9hZGNhc3RlZCBiZWZvcmUgYSByb3V0ZSBjaGFuZ2UuIEF0IHRoaXMgIHBvaW50IHRoZSByb3V0ZSBzZXJ2aWNlcyBzdGFydHNcbiAgICAgKiByZXNvbHZpbmcgYWxsIG9mIHRoZSBkZXBlbmRlbmNpZXMgbmVlZGVkIGZvciB0aGUgcm91dGUgY2hhbmdlIHRvIG9jY3VyLlxuICAgICAqIFR5cGljYWxseSB0aGlzIGludm9sdmVzIGZldGNoaW5nIHRoZSB2aWV3IHRlbXBsYXRlIGFzIHdlbGwgYXMgYW55IGRlcGVuZGVuY2llc1xuICAgICAqIGRlZmluZWQgaW4gYHJlc29sdmVgIHJvdXRlIHByb3BlcnR5LiBPbmNlICBhbGwgb2YgdGhlIGRlcGVuZGVuY2llcyBhcmUgcmVzb2x2ZWRcbiAgICAgKiBgJHJvdXRlQ2hhbmdlU3VjY2Vzc2AgaXMgZmlyZWQuXG4gICAgICpcbiAgICAgKiBUaGUgcm91dGUgY2hhbmdlIChhbmQgdGhlIGAkbG9jYXRpb25gIGNoYW5nZSB0aGF0IHRyaWdnZXJlZCBpdCkgY2FuIGJlIHByZXZlbnRlZFxuICAgICAqIGJ5IGNhbGxpbmcgYHByZXZlbnREZWZhdWx0YCBtZXRob2Qgb2YgdGhlIGV2ZW50LiBTZWUge0BsaW5rIG5nLiRyb290U2NvcGUuU2NvcGUjJG9ufVxuICAgICAqIGZvciBtb3JlIGRldGFpbHMgYWJvdXQgZXZlbnQgb2JqZWN0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGFuZ3VsYXJFdmVudCBTeW50aGV0aWMgZXZlbnQgb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7Um91dGV9IG5leHQgRnV0dXJlIHJvdXRlIGluZm9ybWF0aW9uLlxuICAgICAqIEBwYXJhbSB7Um91dGV9IGN1cnJlbnQgQ3VycmVudCByb3V0ZSBpbmZvcm1hdGlvbi5cbiAgICAgKi9cblxuICAgIC8qKlxuICAgICAqIEBuZ2RvYyBldmVudFxuICAgICAqIEBuYW1lICRyb3V0ZSMkcm91dGVDaGFuZ2VTdWNjZXNzXG4gICAgICogQGV2ZW50VHlwZSBicm9hZGNhc3Qgb24gcm9vdCBzY29wZVxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIEJyb2FkY2FzdGVkIGFmdGVyIGEgcm91dGUgY2hhbmdlIGhhcyBoYXBwZW5lZCBzdWNjZXNzZnVsbHkuXG4gICAgICogVGhlIGByZXNvbHZlYCBkZXBlbmRlbmNpZXMgYXJlIG5vdyBhdmFpbGFibGUgaW4gdGhlIGBjdXJyZW50LmxvY2Fsc2AgcHJvcGVydHkuXG4gICAgICpcbiAgICAgKiB7QGxpbmsgbmdSb3V0ZS5kaXJlY3RpdmU6bmdWaWV3IG5nVmlld30gbGlzdGVucyBmb3IgdGhlIGRpcmVjdGl2ZVxuICAgICAqIHRvIGluc3RhbnRpYXRlIHRoZSBjb250cm9sbGVyIGFuZCByZW5kZXIgdGhlIHZpZXcuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYW5ndWxhckV2ZW50IFN5bnRoZXRpYyBldmVudCBvYmplY3QuXG4gICAgICogQHBhcmFtIHtSb3V0ZX0gY3VycmVudCBDdXJyZW50IHJvdXRlIGluZm9ybWF0aW9uLlxuICAgICAqIEBwYXJhbSB7Um91dGV8VW5kZWZpbmVkfSBwcmV2aW91cyBQcmV2aW91cyByb3V0ZSBpbmZvcm1hdGlvbiwgb3IgdW5kZWZpbmVkIGlmIGN1cnJlbnQgaXNcbiAgICAgKiBmaXJzdCByb3V0ZSBlbnRlcmVkLlxuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogQG5nZG9jIGV2ZW50XG4gICAgICogQG5hbWUgJHJvdXRlIyRyb3V0ZUNoYW5nZUVycm9yXG4gICAgICogQGV2ZW50VHlwZSBicm9hZGNhc3Qgb24gcm9vdCBzY29wZVxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIEJyb2FkY2FzdGVkIGlmIGEgcmVkaXJlY3Rpb24gZnVuY3Rpb24gZmFpbHMgb3IgYW55IHJlZGlyZWN0aW9uIG9yIHJlc29sdmUgcHJvbWlzZXMgYXJlXG4gICAgICogcmVqZWN0ZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYW5ndWxhckV2ZW50IFN5bnRoZXRpYyBldmVudCBvYmplY3RcbiAgICAgKiBAcGFyYW0ge1JvdXRlfSBjdXJyZW50IEN1cnJlbnQgcm91dGUgaW5mb3JtYXRpb24uXG4gICAgICogQHBhcmFtIHtSb3V0ZX0gcHJldmlvdXMgUHJldmlvdXMgcm91dGUgaW5mb3JtYXRpb24uXG4gICAgICogQHBhcmFtIHtSb3V0ZX0gcmVqZWN0aW9uIFRoZSB0aHJvd24gZXJyb3Igb3IgdGhlIHJlamVjdGlvbiByZWFzb24gb2YgdGhlIHByb21pc2UuIFVzdWFsbHlcbiAgICAgKiB0aGUgcmVqZWN0aW9uIHJlYXNvbiBpcyB0aGUgZXJyb3IgdGhhdCBjYXVzZWQgdGhlIHByb21pc2UgdG8gZ2V0IHJlamVjdGVkLlxuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogQG5nZG9jIGV2ZW50XG4gICAgICogQG5hbWUgJHJvdXRlIyRyb3V0ZVVwZGF0ZVxuICAgICAqIEBldmVudFR5cGUgYnJvYWRjYXN0IG9uIHJvb3Qgc2NvcGVcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBUaGUgYHJlbG9hZE9uU2VhcmNoYCBwcm9wZXJ0eSBoYXMgYmVlbiBzZXQgdG8gZmFsc2UsIGFuZCB3ZSBhcmUgcmV1c2luZyB0aGUgc2FtZVxuICAgICAqIGluc3RhbmNlIG9mIHRoZSBDb250cm9sbGVyLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGFuZ3VsYXJFdmVudCBTeW50aGV0aWMgZXZlbnQgb2JqZWN0XG4gICAgICogQHBhcmFtIHtSb3V0ZX0gY3VycmVudCBDdXJyZW50L3ByZXZpb3VzIHJvdXRlIGluZm9ybWF0aW9uLlxuICAgICAqL1xuXG4gICAgdmFyIGZvcmNlUmVsb2FkID0gZmFsc2UsXG4gICAgICAgIHByZXBhcmVkUm91dGUsXG4gICAgICAgIHByZXBhcmVkUm91dGVJc1VwZGF0ZU9ubHksXG4gICAgICAgICRyb3V0ZSA9IHtcbiAgICAgICAgICByb3V0ZXM6IHJvdXRlcyxcblxuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIEBuZ2RvYyBtZXRob2RcbiAgICAgICAgICAgKiBAbmFtZSAkcm91dGUjcmVsb2FkXG4gICAgICAgICAgICpcbiAgICAgICAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgICAgICAgKiBDYXVzZXMgYCRyb3V0ZWAgc2VydmljZSB0byByZWxvYWQgdGhlIGN1cnJlbnQgcm91dGUgZXZlbiBpZlxuICAgICAgICAgICAqIHtAbGluayBuZy4kbG9jYXRpb24gJGxvY2F0aW9ufSBoYXNuJ3QgY2hhbmdlZC5cbiAgICAgICAgICAgKlxuICAgICAgICAgICAqIEFzIGEgcmVzdWx0IG9mIHRoYXQsIHtAbGluayBuZ1JvdXRlLmRpcmVjdGl2ZTpuZ1ZpZXcgbmdWaWV3fVxuICAgICAgICAgICAqIGNyZWF0ZXMgbmV3IHNjb3BlIGFuZCByZWluc3RhbnRpYXRlcyB0aGUgY29udHJvbGxlci5cbiAgICAgICAgICAgKi9cbiAgICAgICAgICByZWxvYWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZm9yY2VSZWxvYWQgPSB0cnVlO1xuXG4gICAgICAgICAgICB2YXIgZmFrZUxvY2F0aW9uRXZlbnQgPSB7XG4gICAgICAgICAgICAgIGRlZmF1bHRQcmV2ZW50ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICBwcmV2ZW50RGVmYXVsdDogZnVuY3Rpb24gZmFrZVByZXZlbnREZWZhdWx0KCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZGVmYXVsdFByZXZlbnRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgZm9yY2VSZWxvYWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJHJvb3RTY29wZS4kZXZhbEFzeW5jKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICBwcmVwYXJlUm91dGUoZmFrZUxvY2F0aW9uRXZlbnQpO1xuICAgICAgICAgICAgICBpZiAoIWZha2VMb2NhdGlvbkV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIGNvbW1pdFJvdXRlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogQG5nZG9jIG1ldGhvZFxuICAgICAgICAgICAqIEBuYW1lICRyb3V0ZSN1cGRhdGVQYXJhbXNcbiAgICAgICAgICAgKlxuICAgICAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICAgICAqIENhdXNlcyBgJHJvdXRlYCBzZXJ2aWNlIHRvIHVwZGF0ZSB0aGUgY3VycmVudCBVUkwsIHJlcGxhY2luZ1xuICAgICAgICAgICAqIGN1cnJlbnQgcm91dGUgcGFyYW1ldGVycyB3aXRoIHRob3NlIHNwZWNpZmllZCBpbiBgbmV3UGFyYW1zYC5cbiAgICAgICAgICAgKiBQcm92aWRlZCBwcm9wZXJ0eSBuYW1lcyB0aGF0IG1hdGNoIHRoZSByb3V0ZSdzIHBhdGggc2VnbWVudFxuICAgICAgICAgICAqIGRlZmluaXRpb25zIHdpbGwgYmUgaW50ZXJwb2xhdGVkIGludG8gdGhlIGxvY2F0aW9uJ3MgcGF0aCwgd2hpbGVcbiAgICAgICAgICAgKiByZW1haW5pbmcgcHJvcGVydGllcyB3aWxsIGJlIHRyZWF0ZWQgYXMgcXVlcnkgcGFyYW1zLlxuICAgICAgICAgICAqXG4gICAgICAgICAgICogQHBhcmFtIHshT2JqZWN0PHN0cmluZywgc3RyaW5nPn0gbmV3UGFyYW1zIG1hcHBpbmcgb2YgVVJMIHBhcmFtZXRlciBuYW1lcyB0byB2YWx1ZXNcbiAgICAgICAgICAgKi9cbiAgICAgICAgICB1cGRhdGVQYXJhbXM6IGZ1bmN0aW9uKG5ld1BhcmFtcykge1xuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudCAmJiB0aGlzLmN1cnJlbnQuJCRyb3V0ZSkge1xuICAgICAgICAgICAgICBuZXdQYXJhbXMgPSBhbmd1bGFyLmV4dGVuZCh7fSwgdGhpcy5jdXJyZW50LnBhcmFtcywgbmV3UGFyYW1zKTtcbiAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoaW50ZXJwb2xhdGUodGhpcy5jdXJyZW50LiQkcm91dGUub3JpZ2luYWxQYXRoLCBuZXdQYXJhbXMpKTtcbiAgICAgICAgICAgICAgLy8gaW50ZXJwb2xhdGUgbW9kaWZpZXMgbmV3UGFyYW1zLCBvbmx5IHF1ZXJ5IHBhcmFtcyBhcmUgbGVmdFxuICAgICAgICAgICAgICAkbG9jYXRpb24uc2VhcmNoKG5ld1BhcmFtcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aHJvdyAkcm91dGVNaW5FcnIoJ25vcm91dCcsICdUcmllZCB1cGRhdGluZyByb3V0ZSB3aGVuIHdpdGggbm8gY3VycmVudCByb3V0ZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICRyb290U2NvcGUuJG9uKCckbG9jYXRpb25DaGFuZ2VTdGFydCcsIHByZXBhcmVSb3V0ZSk7XG4gICAgJHJvb3RTY29wZS4kb24oJyRsb2NhdGlvbkNoYW5nZVN1Y2Nlc3MnLCBjb21taXRSb3V0ZSk7XG5cbiAgICByZXR1cm4gJHJvdXRlO1xuXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBvbiB7c3RyaW5nfSBjdXJyZW50IHVybFxuICAgICAqIEBwYXJhbSByb3V0ZSB7T2JqZWN0fSByb3V0ZSByZWdleHAgdG8gbWF0Y2ggdGhlIHVybCBhZ2FpbnN0XG4gICAgICogQHJldHVybiB7P09iamVjdH1cbiAgICAgKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIENoZWNrIGlmIHRoZSByb3V0ZSBtYXRjaGVzIHRoZSBjdXJyZW50IHVybC5cbiAgICAgKlxuICAgICAqIEluc3BpcmVkIGJ5IG1hdGNoIGluXG4gICAgICogdmlzaW9ubWVkaWEvZXhwcmVzcy9saWIvcm91dGVyL3JvdXRlci5qcy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzd2l0Y2hSb3V0ZU1hdGNoZXIob24sIHJvdXRlKSB7XG4gICAgICB2YXIga2V5cyA9IHJvdXRlLmtleXMsXG4gICAgICAgICAgcGFyYW1zID0ge307XG5cbiAgICAgIGlmICghcm91dGUucmVnZXhwKSByZXR1cm4gbnVsbDtcblxuICAgICAgdmFyIG0gPSByb3V0ZS5yZWdleHAuZXhlYyhvbik7XG4gICAgICBpZiAoIW0pIHJldHVybiBudWxsO1xuXG4gICAgICBmb3IgKHZhciBpID0gMSwgbGVuID0gbS5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgICB2YXIga2V5ID0ga2V5c1tpIC0gMV07XG5cbiAgICAgICAgdmFyIHZhbCA9IG1baV07XG5cbiAgICAgICAgaWYgKGtleSAmJiB2YWwpIHtcbiAgICAgICAgICBwYXJhbXNba2V5Lm5hbWVdID0gdmFsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcGFyYW1zO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHByZXBhcmVSb3V0ZSgkbG9jYXRpb25FdmVudCkge1xuICAgICAgdmFyIGxhc3RSb3V0ZSA9ICRyb3V0ZS5jdXJyZW50O1xuXG4gICAgICBwcmVwYXJlZFJvdXRlID0gcGFyc2VSb3V0ZSgpO1xuICAgICAgcHJlcGFyZWRSb3V0ZUlzVXBkYXRlT25seSA9IHByZXBhcmVkUm91dGUgJiYgbGFzdFJvdXRlICYmIHByZXBhcmVkUm91dGUuJCRyb3V0ZSA9PT0gbGFzdFJvdXRlLiQkcm91dGVcbiAgICAgICAgICAmJiBhbmd1bGFyLmVxdWFscyhwcmVwYXJlZFJvdXRlLnBhdGhQYXJhbXMsIGxhc3RSb3V0ZS5wYXRoUGFyYW1zKVxuICAgICAgICAgICYmICFwcmVwYXJlZFJvdXRlLnJlbG9hZE9uU2VhcmNoICYmICFmb3JjZVJlbG9hZDtcblxuICAgICAgaWYgKCFwcmVwYXJlZFJvdXRlSXNVcGRhdGVPbmx5ICYmIChsYXN0Um91dGUgfHwgcHJlcGFyZWRSb3V0ZSkpIHtcbiAgICAgICAgaWYgKCRyb290U2NvcGUuJGJyb2FkY2FzdCgnJHJvdXRlQ2hhbmdlU3RhcnQnLCBwcmVwYXJlZFJvdXRlLCBsYXN0Um91dGUpLmRlZmF1bHRQcmV2ZW50ZWQpIHtcbiAgICAgICAgICBpZiAoJGxvY2F0aW9uRXZlbnQpIHtcbiAgICAgICAgICAgICRsb2NhdGlvbkV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29tbWl0Um91dGUoKSB7XG4gICAgICB2YXIgbGFzdFJvdXRlID0gJHJvdXRlLmN1cnJlbnQ7XG4gICAgICB2YXIgbmV4dFJvdXRlID0gcHJlcGFyZWRSb3V0ZTtcblxuICAgICAgaWYgKHByZXBhcmVkUm91dGVJc1VwZGF0ZU9ubHkpIHtcbiAgICAgICAgbGFzdFJvdXRlLnBhcmFtcyA9IG5leHRSb3V0ZS5wYXJhbXM7XG4gICAgICAgIGFuZ3VsYXIuY29weShsYXN0Um91dGUucGFyYW1zLCAkcm91dGVQYXJhbXMpO1xuICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJyRyb3V0ZVVwZGF0ZScsIGxhc3RSb3V0ZSk7XG4gICAgICB9IGVsc2UgaWYgKG5leHRSb3V0ZSB8fCBsYXN0Um91dGUpIHtcbiAgICAgICAgZm9yY2VSZWxvYWQgPSBmYWxzZTtcbiAgICAgICAgJHJvdXRlLmN1cnJlbnQgPSBuZXh0Um91dGU7XG5cbiAgICAgICAgdmFyIG5leHRSb3V0ZVByb21pc2UgPSAkcS5yZXNvbHZlKG5leHRSb3V0ZSk7XG5cbiAgICAgICAgJGJyb3dzZXIuJCRpbmNPdXRzdGFuZGluZ1JlcXVlc3RDb3VudCgpO1xuXG4gICAgICAgIG5leHRSb3V0ZVByb21pc2UuXG4gICAgICAgICAgdGhlbihnZXRSZWRpcmVjdGlvbkRhdGEpLlxuICAgICAgICAgIHRoZW4oaGFuZGxlUG9zc2libGVSZWRpcmVjdGlvbikuXG4gICAgICAgICAgdGhlbihmdW5jdGlvbihrZWVwUHJvY2Vzc2luZ1JvdXRlKSB7XG4gICAgICAgICAgICByZXR1cm4ga2VlcFByb2Nlc3NpbmdSb3V0ZSAmJiBuZXh0Um91dGVQcm9taXNlLlxuICAgICAgICAgICAgICB0aGVuKHJlc29sdmVMb2NhbHMpLlxuICAgICAgICAgICAgICB0aGVuKGZ1bmN0aW9uKGxvY2Fscykge1xuICAgICAgICAgICAgICAgIC8vIGFmdGVyIHJvdXRlIGNoYW5nZVxuICAgICAgICAgICAgICAgIGlmIChuZXh0Um91dGUgPT09ICRyb3V0ZS5jdXJyZW50KSB7XG4gICAgICAgICAgICAgICAgICBpZiAobmV4dFJvdXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIG5leHRSb3V0ZS5sb2NhbHMgPSBsb2NhbHM7XG4gICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuY29weShuZXh0Um91dGUucGFyYW1zLCAkcm91dGVQYXJhbXMpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCckcm91dGVDaGFuZ2VTdWNjZXNzJywgbmV4dFJvdXRlLCBsYXN0Um91dGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgIGlmIChuZXh0Um91dGUgPT09ICRyb3V0ZS5jdXJyZW50KSB7XG4gICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnJHJvdXRlQ2hhbmdlRXJyb3InLCBuZXh0Um91dGUsIGxhc3RSb3V0ZSwgZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pLmZpbmFsbHkoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvLyBCZWNhdXNlIGBjb21taXRSb3V0ZSgpYCBpcyBjYWxsZWQgZnJvbSBhIGAkcm9vdFNjb3BlLiRldmFsQXN5bmNgIGJsb2NrIChzZWVcbiAgICAgICAgICAgIC8vIGAkbG9jYXRpb25XYXRjaGApLCB0aGlzIGAkJGNvbXBsZXRlT3V0c3RhbmRpbmdSZXF1ZXN0KClgIGNhbGwgd2lsbCBub3QgY2F1c2VcbiAgICAgICAgICAgIC8vIGBvdXRzdGFuZGluZ1JlcXVlc3RDb3VudGAgdG8gaGl0IHplcm8uICBUaGlzIGlzIGltcG9ydGFudCBpbiBjYXNlIHdlIGFyZSByZWRpcmVjdGluZ1xuICAgICAgICAgICAgLy8gdG8gYSBuZXcgcm91dGUgd2hpY2ggYWxzbyByZXF1aXJlcyBzb21lIGFzeW5jaHJvbm91cyB3b3JrLlxuXG4gICAgICAgICAgICAkYnJvd3Nlci4kJGNvbXBsZXRlT3V0c3RhbmRpbmdSZXF1ZXN0KG5vb3ApO1xuICAgICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFJlZGlyZWN0aW9uRGF0YShyb3V0ZSkge1xuICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgIHJvdXRlOiByb3V0ZSxcbiAgICAgICAgaGFzUmVkaXJlY3Rpb246IGZhbHNlXG4gICAgICB9O1xuXG4gICAgICBpZiAocm91dGUpIHtcbiAgICAgICAgaWYgKHJvdXRlLnJlZGlyZWN0VG8pIHtcbiAgICAgICAgICBpZiAoYW5ndWxhci5pc1N0cmluZyhyb3V0ZS5yZWRpcmVjdFRvKSkge1xuICAgICAgICAgICAgZGF0YS5wYXRoID0gaW50ZXJwb2xhdGUocm91dGUucmVkaXJlY3RUbywgcm91dGUucGFyYW1zKTtcbiAgICAgICAgICAgIGRhdGEuc2VhcmNoID0gcm91dGUucGFyYW1zO1xuICAgICAgICAgICAgZGF0YS5oYXNSZWRpcmVjdGlvbiA9IHRydWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBvbGRQYXRoID0gJGxvY2F0aW9uLnBhdGgoKTtcbiAgICAgICAgICAgIHZhciBvbGRTZWFyY2ggPSAkbG9jYXRpb24uc2VhcmNoKCk7XG4gICAgICAgICAgICB2YXIgbmV3VXJsID0gcm91dGUucmVkaXJlY3RUbyhyb3V0ZS5wYXRoUGFyYW1zLCBvbGRQYXRoLCBvbGRTZWFyY2gpO1xuXG4gICAgICAgICAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQobmV3VXJsKSkge1xuICAgICAgICAgICAgICBkYXRhLnVybCA9IG5ld1VybDtcbiAgICAgICAgICAgICAgZGF0YS5oYXNSZWRpcmVjdGlvbiA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHJvdXRlLnJlc29sdmVSZWRpcmVjdFRvKSB7XG4gICAgICAgICAgcmV0dXJuICRxLlxuICAgICAgICAgICAgcmVzb2x2ZSgkaW5qZWN0b3IuaW52b2tlKHJvdXRlLnJlc29sdmVSZWRpcmVjdFRvKSkuXG4gICAgICAgICAgICB0aGVuKGZ1bmN0aW9uKG5ld1VybCkge1xuICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQobmV3VXJsKSkge1xuICAgICAgICAgICAgICAgIGRhdGEudXJsID0gbmV3VXJsO1xuICAgICAgICAgICAgICAgIGRhdGEuaGFzUmVkaXJlY3Rpb24gPSB0cnVlO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoYW5kbGVQb3NzaWJsZVJlZGlyZWN0aW9uKGRhdGEpIHtcbiAgICAgIHZhciBrZWVwUHJvY2Vzc2luZ1JvdXRlID0gdHJ1ZTtcblxuICAgICAgaWYgKGRhdGEucm91dGUgIT09ICRyb3V0ZS5jdXJyZW50KSB7XG4gICAgICAgIGtlZXBQcm9jZXNzaW5nUm91dGUgPSBmYWxzZTtcbiAgICAgIH0gZWxzZSBpZiAoZGF0YS5oYXNSZWRpcmVjdGlvbikge1xuICAgICAgICB2YXIgb2xkVXJsID0gJGxvY2F0aW9uLnVybCgpO1xuICAgICAgICB2YXIgbmV3VXJsID0gZGF0YS51cmw7XG5cbiAgICAgICAgaWYgKG5ld1VybCkge1xuICAgICAgICAgICRsb2NhdGlvbi5cbiAgICAgICAgICAgIHVybChuZXdVcmwpLlxuICAgICAgICAgICAgcmVwbGFjZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5ld1VybCA9ICRsb2NhdGlvbi5cbiAgICAgICAgICAgIHBhdGgoZGF0YS5wYXRoKS5cbiAgICAgICAgICAgIHNlYXJjaChkYXRhLnNlYXJjaCkuXG4gICAgICAgICAgICByZXBsYWNlKCkuXG4gICAgICAgICAgICB1cmwoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChuZXdVcmwgIT09IG9sZFVybCkge1xuICAgICAgICAgIC8vIEV4aXQgb3V0IGFuZCBkb24ndCBwcm9jZXNzIGN1cnJlbnQgbmV4dCB2YWx1ZSxcbiAgICAgICAgICAvLyB3YWl0IGZvciBuZXh0IGxvY2F0aW9uIGNoYW5nZSBmcm9tIHJlZGlyZWN0XG4gICAgICAgICAga2VlcFByb2Nlc3NpbmdSb3V0ZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBrZWVwUHJvY2Vzc2luZ1JvdXRlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlc29sdmVMb2NhbHMocm91dGUpIHtcbiAgICAgIGlmIChyb3V0ZSkge1xuICAgICAgICB2YXIgbG9jYWxzID0gYW5ndWxhci5leHRlbmQoe30sIHJvdXRlLnJlc29sdmUpO1xuICAgICAgICBhbmd1bGFyLmZvckVhY2gobG9jYWxzLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgbG9jYWxzW2tleV0gPSBhbmd1bGFyLmlzU3RyaW5nKHZhbHVlKSA/XG4gICAgICAgICAgICAgICRpbmplY3Rvci5nZXQodmFsdWUpIDpcbiAgICAgICAgICAgICAgJGluamVjdG9yLmludm9rZSh2YWx1ZSwgbnVsbCwgbnVsbCwga2V5KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciB0ZW1wbGF0ZSA9IGdldFRlbXBsYXRlRm9yKHJvdXRlKTtcbiAgICAgICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKHRlbXBsYXRlKSkge1xuICAgICAgICAgIGxvY2Fsc1snJHRlbXBsYXRlJ10gPSB0ZW1wbGF0ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJHEuYWxsKGxvY2Fscyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0VGVtcGxhdGVGb3Iocm91dGUpIHtcbiAgICAgIHZhciB0ZW1wbGF0ZSwgdGVtcGxhdGVVcmw7XG4gICAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQodGVtcGxhdGUgPSByb3V0ZS50ZW1wbGF0ZSkpIHtcbiAgICAgICAgaWYgKGFuZ3VsYXIuaXNGdW5jdGlvbih0ZW1wbGF0ZSkpIHtcbiAgICAgICAgICB0ZW1wbGF0ZSA9IHRlbXBsYXRlKHJvdXRlLnBhcmFtcyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoYW5ndWxhci5pc0RlZmluZWQodGVtcGxhdGVVcmwgPSByb3V0ZS50ZW1wbGF0ZVVybCkpIHtcbiAgICAgICAgaWYgKGFuZ3VsYXIuaXNGdW5jdGlvbih0ZW1wbGF0ZVVybCkpIHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybCA9IHRlbXBsYXRlVXJsKHJvdXRlLnBhcmFtcyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKHRlbXBsYXRlVXJsKSkge1xuICAgICAgICAgIHJvdXRlLmxvYWRlZFRlbXBsYXRlVXJsID0gJHNjZS52YWx1ZU9mKHRlbXBsYXRlVXJsKTtcbiAgICAgICAgICB0ZW1wbGF0ZSA9ICR0ZW1wbGF0ZVJlcXVlc3QodGVtcGxhdGVVcmwpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdGVtcGxhdGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHJldHVybnMge09iamVjdH0gdGhlIGN1cnJlbnQgYWN0aXZlIHJvdXRlLCBieSBtYXRjaGluZyBpdCBhZ2FpbnN0IHRoZSBVUkxcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBwYXJzZVJvdXRlKCkge1xuICAgICAgLy8gTWF0Y2ggYSByb3V0ZVxuICAgICAgdmFyIHBhcmFtcywgbWF0Y2g7XG4gICAgICBhbmd1bGFyLmZvckVhY2gocm91dGVzLCBmdW5jdGlvbihyb3V0ZSwgcGF0aCkge1xuICAgICAgICBpZiAoIW1hdGNoICYmIChwYXJhbXMgPSBzd2l0Y2hSb3V0ZU1hdGNoZXIoJGxvY2F0aW9uLnBhdGgoKSwgcm91dGUpKSkge1xuICAgICAgICAgIG1hdGNoID0gaW5oZXJpdChyb3V0ZSwge1xuICAgICAgICAgICAgcGFyYW1zOiBhbmd1bGFyLmV4dGVuZCh7fSwgJGxvY2F0aW9uLnNlYXJjaCgpLCBwYXJhbXMpLFxuICAgICAgICAgICAgcGF0aFBhcmFtczogcGFyYW1zfSk7XG4gICAgICAgICAgbWF0Y2guJCRyb3V0ZSA9IHJvdXRlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIC8vIE5vIHJvdXRlIG1hdGNoZWQ7IGZhbGxiYWNrIHRvIFwib3RoZXJ3aXNlXCIgcm91dGVcbiAgICAgIHJldHVybiBtYXRjaCB8fCByb3V0ZXNbbnVsbF0gJiYgaW5oZXJpdChyb3V0ZXNbbnVsbF0sIHtwYXJhbXM6IHt9LCBwYXRoUGFyYW1zOnt9fSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHJldHVybnMge3N0cmluZ30gaW50ZXJwb2xhdGlvbiBvZiB0aGUgcmVkaXJlY3QgcGF0aCB3aXRoIHRoZSBwYXJhbWV0ZXJzXG4gICAgICovXG4gICAgZnVuY3Rpb24gaW50ZXJwb2xhdGUoc3RyaW5nLCBwYXJhbXMpIHtcbiAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgIGFuZ3VsYXIuZm9yRWFjaCgoc3RyaW5nIHx8ICcnKS5zcGxpdCgnOicpLCBmdW5jdGlvbihzZWdtZW50LCBpKSB7XG4gICAgICAgIGlmIChpID09PSAwKSB7XG4gICAgICAgICAgcmVzdWx0LnB1c2goc2VnbWVudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIHNlZ21lbnRNYXRjaCA9IHNlZ21lbnQubWF0Y2goLyhcXHcrKSg/Ols/Kl0pPyguKikvKTtcbiAgICAgICAgICB2YXIga2V5ID0gc2VnbWVudE1hdGNoWzFdO1xuICAgICAgICAgIHJlc3VsdC5wdXNoKHBhcmFtc1trZXldKTtcbiAgICAgICAgICByZXN1bHQucHVzaChzZWdtZW50TWF0Y2hbMl0gfHwgJycpO1xuICAgICAgICAgIGRlbGV0ZSBwYXJhbXNba2V5XTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzdWx0LmpvaW4oJycpO1xuICAgIH1cbiAgfV07XG59XG5cbmluc3RhbnRpYXRlUm91dGUuJGluamVjdCA9IFsnJGluamVjdG9yJ107XG5mdW5jdGlvbiBpbnN0YW50aWF0ZVJvdXRlKCRpbmplY3Rvcikge1xuICBpZiAoaXNFYWdlckluc3RhbnRpYXRpb25FbmFibGVkKSB7XG4gICAgLy8gSW5zdGFudGlhdGUgYCRyb3V0ZWBcbiAgICAkaW5qZWN0b3IuZ2V0KCckcm91dGUnKTtcbiAgfVxufVxuXG5uZ1JvdXRlTW9kdWxlLnByb3ZpZGVyKCckcm91dGVQYXJhbXMnLCAkUm91dGVQYXJhbXNQcm92aWRlcik7XG5cblxuLyoqXG4gKiBAbmdkb2Mgc2VydmljZVxuICogQG5hbWUgJHJvdXRlUGFyYW1zXG4gKiBAcmVxdWlyZXMgJHJvdXRlXG4gKiBAdGhpc1xuICpcbiAqIEBkZXNjcmlwdGlvblxuICogVGhlIGAkcm91dGVQYXJhbXNgIHNlcnZpY2UgYWxsb3dzIHlvdSB0byByZXRyaWV2ZSB0aGUgY3VycmVudCBzZXQgb2Ygcm91dGUgcGFyYW1ldGVycy5cbiAqXG4gKiBSZXF1aXJlcyB0aGUge0BsaW5rIG5nUm91dGUgYG5nUm91dGVgfSBtb2R1bGUgdG8gYmUgaW5zdGFsbGVkLlxuICpcbiAqIFRoZSByb3V0ZSBwYXJhbWV0ZXJzIGFyZSBhIGNvbWJpbmF0aW9uIG9mIHtAbGluayBuZy4kbG9jYXRpb24gYCRsb2NhdGlvbmB9J3NcbiAqIHtAbGluayBuZy4kbG9jYXRpb24jc2VhcmNoIGBzZWFyY2goKWB9IGFuZCB7QGxpbmsgbmcuJGxvY2F0aW9uI3BhdGggYHBhdGgoKWB9LlxuICogVGhlIGBwYXRoYCBwYXJhbWV0ZXJzIGFyZSBleHRyYWN0ZWQgd2hlbiB0aGUge0BsaW5rIG5nUm91dGUuJHJvdXRlIGAkcm91dGVgfSBwYXRoIGlzIG1hdGNoZWQuXG4gKlxuICogSW4gY2FzZSBvZiBwYXJhbWV0ZXIgbmFtZSBjb2xsaXNpb24sIGBwYXRoYCBwYXJhbXMgdGFrZSBwcmVjZWRlbmNlIG92ZXIgYHNlYXJjaGAgcGFyYW1zLlxuICpcbiAqIFRoZSBzZXJ2aWNlIGd1YXJhbnRlZXMgdGhhdCB0aGUgaWRlbnRpdHkgb2YgdGhlIGAkcm91dGVQYXJhbXNgIG9iamVjdCB3aWxsIHJlbWFpbiB1bmNoYW5nZWRcbiAqIChidXQgaXRzIHByb3BlcnRpZXMgd2lsbCBsaWtlbHkgY2hhbmdlKSBldmVuIHdoZW4gYSByb3V0ZSBjaGFuZ2Ugb2NjdXJzLlxuICpcbiAqIE5vdGUgdGhhdCB0aGUgYCRyb3V0ZVBhcmFtc2AgYXJlIG9ubHkgdXBkYXRlZCAqYWZ0ZXIqIGEgcm91dGUgY2hhbmdlIGNvbXBsZXRlcyBzdWNjZXNzZnVsbHkuXG4gKiBUaGlzIG1lYW5zIHRoYXQgeW91IGNhbm5vdCByZWx5IG9uIGAkcm91dGVQYXJhbXNgIGJlaW5nIGNvcnJlY3QgaW4gcm91dGUgcmVzb2x2ZSBmdW5jdGlvbnMuXG4gKiBJbnN0ZWFkIHlvdSBjYW4gdXNlIGAkcm91dGUuY3VycmVudC5wYXJhbXNgIHRvIGFjY2VzcyB0aGUgbmV3IHJvdXRlJ3MgcGFyYW1ldGVycy5cbiAqXG4gKiBAZXhhbXBsZVxuICogYGBganNcbiAqICAvLyBHaXZlbjpcbiAqICAvLyBVUkw6IGh0dHA6Ly9zZXJ2ZXIuY29tL2luZGV4Lmh0bWwjL0NoYXB0ZXIvMS9TZWN0aW9uLzI/c2VhcmNoPW1vYnlcbiAqICAvLyBSb3V0ZTogL0NoYXB0ZXIvOmNoYXB0ZXJJZC9TZWN0aW9uLzpzZWN0aW9uSWRcbiAqICAvL1xuICogIC8vIFRoZW5cbiAqICAkcm91dGVQYXJhbXMgPT0+IHtjaGFwdGVySWQ6JzEnLCBzZWN0aW9uSWQ6JzInLCBzZWFyY2g6J21vYnknfVxuICogYGBgXG4gKi9cbmZ1bmN0aW9uICRSb3V0ZVBhcmFtc1Byb3ZpZGVyKCkge1xuICB0aGlzLiRnZXQgPSBmdW5jdGlvbigpIHsgcmV0dXJuIHt9OyB9O1xufVxuXG5uZ1JvdXRlTW9kdWxlLmRpcmVjdGl2ZSgnbmdWaWV3JywgbmdWaWV3RmFjdG9yeSk7XG5uZ1JvdXRlTW9kdWxlLmRpcmVjdGl2ZSgnbmdWaWV3JywgbmdWaWV3RmlsbENvbnRlbnRGYWN0b3J5KTtcblxuXG4vKipcbiAqIEBuZ2RvYyBkaXJlY3RpdmVcbiAqIEBuYW1lIG5nVmlld1xuICogQHJlc3RyaWN0IEVDQVxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogYG5nVmlld2AgaXMgYSBkaXJlY3RpdmUgdGhhdCBjb21wbGVtZW50cyB0aGUge0BsaW5rIG5nUm91dGUuJHJvdXRlICRyb3V0ZX0gc2VydmljZSBieVxuICogaW5jbHVkaW5nIHRoZSByZW5kZXJlZCB0ZW1wbGF0ZSBvZiB0aGUgY3VycmVudCByb3V0ZSBpbnRvIHRoZSBtYWluIGxheW91dCAoYGluZGV4Lmh0bWxgKSBmaWxlLlxuICogRXZlcnkgdGltZSB0aGUgY3VycmVudCByb3V0ZSBjaGFuZ2VzLCB0aGUgaW5jbHVkZWQgdmlldyBjaGFuZ2VzIHdpdGggaXQgYWNjb3JkaW5nIHRvIHRoZVxuICogY29uZmlndXJhdGlvbiBvZiB0aGUgYCRyb3V0ZWAgc2VydmljZS5cbiAqXG4gKiBSZXF1aXJlcyB0aGUge0BsaW5rIG5nUm91dGUgYG5nUm91dGVgfSBtb2R1bGUgdG8gYmUgaW5zdGFsbGVkLlxuICpcbiAqIEBhbmltYXRpb25zXG4gKiB8IEFuaW1hdGlvbiAgICAgICAgICAgICAgICAgICAgICAgIHwgT2NjdXJzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICogfC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS18LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLXxcbiAqIHwge0BsaW5rIG5nLiRhbmltYXRlI2VudGVyIGVudGVyfSAgfCB3aGVuIHRoZSBuZXcgZWxlbWVudCBpcyBpbnNlcnRlZCB0byB0aGUgRE9NIHxcbiAqIHwge0BsaW5rIG5nLiRhbmltYXRlI2xlYXZlIGxlYXZlfSAgfCB3aGVuIHRoZSBvbGQgZWxlbWVudCBpcyByZW1vdmVkIGZyb20gdG8gdGhlIERPTSAgfFxuICpcbiAqIFRoZSBlbnRlciBhbmQgbGVhdmUgYW5pbWF0aW9uIG9jY3VyIGNvbmN1cnJlbnRseS5cbiAqXG4gKiBAc2NvcGVcbiAqIEBwcmlvcml0eSA0MDBcbiAqIEBwYXJhbSB7c3RyaW5nPX0gb25sb2FkIEV4cHJlc3Npb24gdG8gZXZhbHVhdGUgd2hlbmV2ZXIgdGhlIHZpZXcgdXBkYXRlcy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZz19IGF1dG9zY3JvbGwgV2hldGhlciBgbmdWaWV3YCBzaG91bGQgY2FsbCB7QGxpbmsgbmcuJGFuY2hvclNjcm9sbFxuICogICAgICAgICAgICAgICAgICAkYW5jaG9yU2Nyb2xsfSB0byBzY3JvbGwgdGhlIHZpZXdwb3J0IGFmdGVyIHRoZSB2aWV3IGlzIHVwZGF0ZWQuXG4gKlxuICogICAgICAgICAgICAgICAgICAtIElmIHRoZSBhdHRyaWJ1dGUgaXMgbm90IHNldCwgZGlzYWJsZSBzY3JvbGxpbmcuXG4gKiAgICAgICAgICAgICAgICAgIC0gSWYgdGhlIGF0dHJpYnV0ZSBpcyBzZXQgd2l0aG91dCB2YWx1ZSwgZW5hYmxlIHNjcm9sbGluZy5cbiAqICAgICAgICAgICAgICAgICAgLSBPdGhlcndpc2UgZW5hYmxlIHNjcm9sbGluZyBvbmx5IGlmIHRoZSBgYXV0b3Njcm9sbGAgYXR0cmlidXRlIHZhbHVlIGV2YWx1YXRlZFxuICogICAgICAgICAgICAgICAgICAgIGFzIGFuIGV4cHJlc3Npb24geWllbGRzIGEgdHJ1dGh5IHZhbHVlLlxuICogQGV4YW1wbGVcbiAgICA8ZXhhbXBsZSBuYW1lPVwibmdWaWV3LWRpcmVjdGl2ZVwiIG1vZHVsZT1cIm5nVmlld0V4YW1wbGVcIlxuICAgICAgICAgICAgIGRlcHM9XCJhbmd1bGFyLXJvdXRlLmpzO2FuZ3VsYXItYW5pbWF0ZS5qc1wiXG4gICAgICAgICAgICAgYW5pbWF0aW9ucz1cInRydWVcIiBmaXhCYXNlPVwidHJ1ZVwiPlxuICAgICAgPGZpbGUgbmFtZT1cImluZGV4Lmh0bWxcIj5cbiAgICAgICAgPGRpdiBuZy1jb250cm9sbGVyPVwiTWFpbkN0cmwgYXMgbWFpblwiPlxuICAgICAgICAgIENob29zZTpcbiAgICAgICAgICA8YSBocmVmPVwiQm9vay9Nb2J5XCI+TW9ieTwvYT4gfFxuICAgICAgICAgIDxhIGhyZWY9XCJCb29rL01vYnkvY2gvMVwiPk1vYnk6IENoMTwvYT4gfFxuICAgICAgICAgIDxhIGhyZWY9XCJCb29rL0dhdHNieVwiPkdhdHNieTwvYT4gfFxuICAgICAgICAgIDxhIGhyZWY9XCJCb29rL0dhdHNieS9jaC80P2tleT12YWx1ZVwiPkdhdHNieTogQ2g0PC9hPiB8XG4gICAgICAgICAgPGEgaHJlZj1cIkJvb2svU2NhcmxldFwiPlNjYXJsZXQgTGV0dGVyPC9hPjxici8+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwidmlldy1hbmltYXRlLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgPGRpdiBuZy12aWV3IGNsYXNzPVwidmlldy1hbmltYXRlXCI+PC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGhyIC8+XG5cbiAgICAgICAgICA8cHJlPiRsb2NhdGlvbi5wYXRoKCkgPSB7e21haW4uJGxvY2F0aW9uLnBhdGgoKX19PC9wcmU+XG4gICAgICAgICAgPHByZT4kcm91dGUuY3VycmVudC50ZW1wbGF0ZVVybCA9IHt7bWFpbi4kcm91dGUuY3VycmVudC50ZW1wbGF0ZVVybH19PC9wcmU+XG4gICAgICAgICAgPHByZT4kcm91dGUuY3VycmVudC5wYXJhbXMgPSB7e21haW4uJHJvdXRlLmN1cnJlbnQucGFyYW1zfX08L3ByZT5cbiAgICAgICAgICA8cHJlPiRyb3V0ZVBhcmFtcyA9IHt7bWFpbi4kcm91dGVQYXJhbXN9fTwvcHJlPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZmlsZT5cblxuICAgICAgPGZpbGUgbmFtZT1cImJvb2suaHRtbFwiPlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIGNvbnRyb2xsZXI6IHt7Ym9vay5uYW1lfX08YnIgLz5cbiAgICAgICAgICBCb29rIElkOiB7e2Jvb2sucGFyYW1zLmJvb2tJZH19PGJyIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9maWxlPlxuXG4gICAgICA8ZmlsZSBuYW1lPVwiY2hhcHRlci5odG1sXCI+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgY29udHJvbGxlcjoge3tjaGFwdGVyLm5hbWV9fTxiciAvPlxuICAgICAgICAgIEJvb2sgSWQ6IHt7Y2hhcHRlci5wYXJhbXMuYm9va0lkfX08YnIgLz5cbiAgICAgICAgICBDaGFwdGVyIElkOiB7e2NoYXB0ZXIucGFyYW1zLmNoYXB0ZXJJZH19XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9maWxlPlxuXG4gICAgICA8ZmlsZSBuYW1lPVwiYW5pbWF0aW9ucy5jc3NcIj5cbiAgICAgICAgLnZpZXctYW5pbWF0ZS1jb250YWluZXIge1xuICAgICAgICAgIHBvc2l0aW9uOnJlbGF0aXZlO1xuICAgICAgICAgIGhlaWdodDoxMDBweCFpbXBvcnRhbnQ7XG4gICAgICAgICAgYmFja2dyb3VuZDp3aGl0ZTtcbiAgICAgICAgICBib3JkZXI6MXB4IHNvbGlkIGJsYWNrO1xuICAgICAgICAgIGhlaWdodDo0MHB4O1xuICAgICAgICAgIG92ZXJmbG93OmhpZGRlbjtcbiAgICAgICAgfVxuXG4gICAgICAgIC52aWV3LWFuaW1hdGUge1xuICAgICAgICAgIHBhZGRpbmc6MTBweDtcbiAgICAgICAgfVxuXG4gICAgICAgIC52aWV3LWFuaW1hdGUubmctZW50ZXIsIC52aWV3LWFuaW1hdGUubmctbGVhdmUge1xuICAgICAgICAgIHRyYW5zaXRpb246YWxsIGN1YmljLWJlemllcigwLjI1MCwgMC40NjAsIDAuNDUwLCAwLjk0MCkgMS41cztcblxuICAgICAgICAgIGRpc3BsYXk6YmxvY2s7XG4gICAgICAgICAgd2lkdGg6MTAwJTtcbiAgICAgICAgICBib3JkZXItbGVmdDoxcHggc29saWQgYmxhY2s7XG5cbiAgICAgICAgICBwb3NpdGlvbjphYnNvbHV0ZTtcbiAgICAgICAgICB0b3A6MDtcbiAgICAgICAgICBsZWZ0OjA7XG4gICAgICAgICAgcmlnaHQ6MDtcbiAgICAgICAgICBib3R0b206MDtcbiAgICAgICAgICBwYWRkaW5nOjEwcHg7XG4gICAgICAgIH1cblxuICAgICAgICAudmlldy1hbmltYXRlLm5nLWVudGVyIHtcbiAgICAgICAgICBsZWZ0OjEwMCU7XG4gICAgICAgIH1cbiAgICAgICAgLnZpZXctYW5pbWF0ZS5uZy1lbnRlci5uZy1lbnRlci1hY3RpdmUge1xuICAgICAgICAgIGxlZnQ6MDtcbiAgICAgICAgfVxuICAgICAgICAudmlldy1hbmltYXRlLm5nLWxlYXZlLm5nLWxlYXZlLWFjdGl2ZSB7XG4gICAgICAgICAgbGVmdDotMTAwJTtcbiAgICAgICAgfVxuICAgICAgPC9maWxlPlxuXG4gICAgICA8ZmlsZSBuYW1lPVwic2NyaXB0LmpzXCI+XG4gICAgICAgIGFuZ3VsYXIubW9kdWxlKCduZ1ZpZXdFeGFtcGxlJywgWyduZ1JvdXRlJywgJ25nQW5pbWF0ZSddKVxuICAgICAgICAgIC5jb25maWcoWyckcm91dGVQcm92aWRlcicsICckbG9jYXRpb25Qcm92aWRlcicsXG4gICAgICAgICAgICBmdW5jdGlvbigkcm91dGVQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIpIHtcbiAgICAgICAgICAgICAgJHJvdXRlUHJvdmlkZXJcbiAgICAgICAgICAgICAgICAud2hlbignL0Jvb2svOmJvb2tJZCcsIHtcbiAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYm9vay5odG1sJyxcbiAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdCb29rQ3RybCcsXG4gICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdib29rJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLndoZW4oJy9Cb29rLzpib29rSWQvY2gvOmNoYXB0ZXJJZCcsIHtcbiAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY2hhcHRlci5odG1sJyxcbiAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDaGFwdGVyQ3RybCcsXG4gICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjaGFwdGVyJ1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcbiAgICAgICAgICB9XSlcbiAgICAgICAgICAuY29udHJvbGxlcignTWFpbkN0cmwnLCBbJyRyb3V0ZScsICckcm91dGVQYXJhbXMnLCAnJGxvY2F0aW9uJyxcbiAgICAgICAgICAgIGZ1bmN0aW9uIE1haW5DdHJsKCRyb3V0ZSwgJHJvdXRlUGFyYW1zLCAkbG9jYXRpb24pIHtcbiAgICAgICAgICAgICAgdGhpcy4kcm91dGUgPSAkcm91dGU7XG4gICAgICAgICAgICAgIHRoaXMuJGxvY2F0aW9uID0gJGxvY2F0aW9uO1xuICAgICAgICAgICAgICB0aGlzLiRyb3V0ZVBhcmFtcyA9ICRyb3V0ZVBhcmFtcztcbiAgICAgICAgICB9XSlcbiAgICAgICAgICAuY29udHJvbGxlcignQm9va0N0cmwnLCBbJyRyb3V0ZVBhcmFtcycsIGZ1bmN0aW9uIEJvb2tDdHJsKCRyb3V0ZVBhcmFtcykge1xuICAgICAgICAgICAgdGhpcy5uYW1lID0gJ0Jvb2tDdHJsJztcbiAgICAgICAgICAgIHRoaXMucGFyYW1zID0gJHJvdXRlUGFyYW1zO1xuICAgICAgICAgIH1dKVxuICAgICAgICAgIC5jb250cm9sbGVyKCdDaGFwdGVyQ3RybCcsIFsnJHJvdXRlUGFyYW1zJywgZnVuY3Rpb24gQ2hhcHRlckN0cmwoJHJvdXRlUGFyYW1zKSB7XG4gICAgICAgICAgICB0aGlzLm5hbWUgPSAnQ2hhcHRlckN0cmwnO1xuICAgICAgICAgICAgdGhpcy5wYXJhbXMgPSAkcm91dGVQYXJhbXM7XG4gICAgICAgICAgfV0pO1xuXG4gICAgICA8L2ZpbGU+XG5cbiAgICAgIDxmaWxlIG5hbWU9XCJwcm90cmFjdG9yLmpzXCIgdHlwZT1cInByb3RyYWN0b3JcIj5cbiAgICAgICAgaXQoJ3Nob3VsZCBsb2FkIGFuZCBjb21waWxlIGNvcnJlY3QgdGVtcGxhdGUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBlbGVtZW50KGJ5LmxpbmtUZXh0KCdNb2J5OiBDaDEnKSkuY2xpY2soKTtcbiAgICAgICAgICB2YXIgY29udGVudCA9IGVsZW1lbnQoYnkuY3NzKCdbbmctdmlld10nKSkuZ2V0VGV4dCgpO1xuICAgICAgICAgIGV4cGVjdChjb250ZW50KS50b01hdGNoKC9jb250cm9sbGVyOiBDaGFwdGVyQ3RybC8pO1xuICAgICAgICAgIGV4cGVjdChjb250ZW50KS50b01hdGNoKC9Cb29rIElkOiBNb2J5Lyk7XG4gICAgICAgICAgZXhwZWN0KGNvbnRlbnQpLnRvTWF0Y2goL0NoYXB0ZXIgSWQ6IDEvKTtcblxuICAgICAgICAgIGVsZW1lbnQoYnkucGFydGlhbExpbmtUZXh0KCdTY2FybGV0JykpLmNsaWNrKCk7XG5cbiAgICAgICAgICBjb250ZW50ID0gZWxlbWVudChieS5jc3MoJ1tuZy12aWV3XScpKS5nZXRUZXh0KCk7XG4gICAgICAgICAgZXhwZWN0KGNvbnRlbnQpLnRvTWF0Y2goL2NvbnRyb2xsZXI6IEJvb2tDdHJsLyk7XG4gICAgICAgICAgZXhwZWN0KGNvbnRlbnQpLnRvTWF0Y2goL0Jvb2sgSWQ6IFNjYXJsZXQvKTtcbiAgICAgICAgfSk7XG4gICAgICA8L2ZpbGU+XG4gICAgPC9leGFtcGxlPlxuICovXG5cblxuLyoqXG4gKiBAbmdkb2MgZXZlbnRcbiAqIEBuYW1lIG5nVmlldyMkdmlld0NvbnRlbnRMb2FkZWRcbiAqIEBldmVudFR5cGUgZW1pdCBvbiB0aGUgY3VycmVudCBuZ1ZpZXcgc2NvcGVcbiAqIEBkZXNjcmlwdGlvblxuICogRW1pdHRlZCBldmVyeSB0aW1lIHRoZSBuZ1ZpZXcgY29udGVudCBpcyByZWxvYWRlZC5cbiAqL1xubmdWaWV3RmFjdG9yeS4kaW5qZWN0ID0gWyckcm91dGUnLCAnJGFuY2hvclNjcm9sbCcsICckYW5pbWF0ZSddO1xuZnVuY3Rpb24gbmdWaWV3RmFjdG9yeSgkcm91dGUsICRhbmNob3JTY3JvbGwsICRhbmltYXRlKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFQ0EnLFxuICAgIHRlcm1pbmFsOiB0cnVlLFxuICAgIHByaW9yaXR5OiA0MDAsXG4gICAgdHJhbnNjbHVkZTogJ2VsZW1lbnQnLFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCAkZWxlbWVudCwgYXR0ciwgY3RybCwgJHRyYW5zY2x1ZGUpIHtcbiAgICAgICAgdmFyIGN1cnJlbnRTY29wZSxcbiAgICAgICAgICAgIGN1cnJlbnRFbGVtZW50LFxuICAgICAgICAgICAgcHJldmlvdXNMZWF2ZUFuaW1hdGlvbixcbiAgICAgICAgICAgIGF1dG9TY3JvbGxFeHAgPSBhdHRyLmF1dG9zY3JvbGwsXG4gICAgICAgICAgICBvbmxvYWRFeHAgPSBhdHRyLm9ubG9hZCB8fCAnJztcblxuICAgICAgICBzY29wZS4kb24oJyRyb3V0ZUNoYW5nZVN1Y2Nlc3MnLCB1cGRhdGUpO1xuICAgICAgICB1cGRhdGUoKTtcblxuICAgICAgICBmdW5jdGlvbiBjbGVhbnVwTGFzdFZpZXcoKSB7XG4gICAgICAgICAgaWYgKHByZXZpb3VzTGVhdmVBbmltYXRpb24pIHtcbiAgICAgICAgICAgICRhbmltYXRlLmNhbmNlbChwcmV2aW91c0xlYXZlQW5pbWF0aW9uKTtcbiAgICAgICAgICAgIHByZXZpb3VzTGVhdmVBbmltYXRpb24gPSBudWxsO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChjdXJyZW50U2NvcGUpIHtcbiAgICAgICAgICAgIGN1cnJlbnRTY29wZS4kZGVzdHJveSgpO1xuICAgICAgICAgICAgY3VycmVudFNjb3BlID0gbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGN1cnJlbnRFbGVtZW50KSB7XG4gICAgICAgICAgICBwcmV2aW91c0xlYXZlQW5pbWF0aW9uID0gJGFuaW1hdGUubGVhdmUoY3VycmVudEVsZW1lbnQpO1xuICAgICAgICAgICAgcHJldmlvdXNMZWF2ZUFuaW1hdGlvbi5kb25lKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgIGlmIChyZXNwb25zZSAhPT0gZmFsc2UpIHByZXZpb3VzTGVhdmVBbmltYXRpb24gPSBudWxsO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjdXJyZW50RWxlbWVudCA9IG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlKCkge1xuICAgICAgICAgIHZhciBsb2NhbHMgPSAkcm91dGUuY3VycmVudCAmJiAkcm91dGUuY3VycmVudC5sb2NhbHMsXG4gICAgICAgICAgICAgIHRlbXBsYXRlID0gbG9jYWxzICYmIGxvY2Fscy4kdGVtcGxhdGU7XG5cbiAgICAgICAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQodGVtcGxhdGUpKSB7XG4gICAgICAgICAgICB2YXIgbmV3U2NvcGUgPSBzY29wZS4kbmV3KCk7XG4gICAgICAgICAgICB2YXIgY3VycmVudCA9ICRyb3V0ZS5jdXJyZW50O1xuXG4gICAgICAgICAgICAvLyBOb3RlOiBUaGlzIHdpbGwgYWxzbyBsaW5rIGFsbCBjaGlsZHJlbiBvZiBuZy12aWV3IHRoYXQgd2VyZSBjb250YWluZWQgaW4gdGhlIG9yaWdpbmFsXG4gICAgICAgICAgICAvLyBodG1sLiBJZiB0aGF0IGNvbnRlbnQgY29udGFpbnMgY29udHJvbGxlcnMsIC4uLiB0aGV5IGNvdWxkIHBvbGx1dGUvY2hhbmdlIHRoZSBzY29wZS5cbiAgICAgICAgICAgIC8vIEhvd2V2ZXIsIHVzaW5nIG5nLXZpZXcgb24gYW4gZWxlbWVudCB3aXRoIGFkZGl0aW9uYWwgY29udGVudCBkb2VzIG5vdCBtYWtlIHNlbnNlLi4uXG4gICAgICAgICAgICAvLyBOb3RlOiBXZSBjYW4ndCByZW1vdmUgdGhlbSBpbiB0aGUgY2xvbmVBdHRjaEZuIG9mICR0cmFuc2NsdWRlIGFzIHRoYXRcbiAgICAgICAgICAgIC8vIGZ1bmN0aW9uIGlzIGNhbGxlZCBiZWZvcmUgbGlua2luZyB0aGUgY29udGVudCwgd2hpY2ggd291bGQgYXBwbHkgY2hpbGRcbiAgICAgICAgICAgIC8vIGRpcmVjdGl2ZXMgdG8gbm9uIGV4aXN0aW5nIGVsZW1lbnRzLlxuICAgICAgICAgICAgdmFyIGNsb25lID0gJHRyYW5zY2x1ZGUobmV3U2NvcGUsIGZ1bmN0aW9uKGNsb25lKSB7XG4gICAgICAgICAgICAgICRhbmltYXRlLmVudGVyKGNsb25lLCBudWxsLCBjdXJyZW50RWxlbWVudCB8fCAkZWxlbWVudCkuZG9uZShmdW5jdGlvbiBvbk5nVmlld0VudGVyKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlICE9PSBmYWxzZSAmJiBhbmd1bGFyLmlzRGVmaW5lZChhdXRvU2Nyb2xsRXhwKVxuICAgICAgICAgICAgICAgICAgJiYgKCFhdXRvU2Nyb2xsRXhwIHx8IHNjb3BlLiRldmFsKGF1dG9TY3JvbGxFeHApKSkge1xuICAgICAgICAgICAgICAgICAgJGFuY2hvclNjcm9sbCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIGNsZWFudXBMYXN0VmlldygpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGN1cnJlbnRFbGVtZW50ID0gY2xvbmU7XG4gICAgICAgICAgICBjdXJyZW50U2NvcGUgPSBjdXJyZW50LnNjb3BlID0gbmV3U2NvcGU7XG4gICAgICAgICAgICBjdXJyZW50U2NvcGUuJGVtaXQoJyR2aWV3Q29udGVudExvYWRlZCcpO1xuICAgICAgICAgICAgY3VycmVudFNjb3BlLiRldmFsKG9ubG9hZEV4cCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNsZWFudXBMYXN0VmlldygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgfTtcbn1cblxuLy8gVGhpcyBkaXJlY3RpdmUgaXMgY2FsbGVkIGR1cmluZyB0aGUgJHRyYW5zY2x1ZGUgY2FsbCBvZiB0aGUgZmlyc3QgYG5nVmlld2AgZGlyZWN0aXZlLlxuLy8gSXQgd2lsbCByZXBsYWNlIGFuZCBjb21waWxlIHRoZSBjb250ZW50IG9mIHRoZSBlbGVtZW50IHdpdGggdGhlIGxvYWRlZCB0ZW1wbGF0ZS5cbi8vIFdlIG5lZWQgdGhpcyBkaXJlY3RpdmUgc28gdGhhdCB0aGUgZWxlbWVudCBjb250ZW50IGlzIGFscmVhZHkgZmlsbGVkIHdoZW5cbi8vIHRoZSBsaW5rIGZ1bmN0aW9uIG9mIGFub3RoZXIgZGlyZWN0aXZlIG9uIHRoZSBzYW1lIGVsZW1lbnQgYXMgbmdWaWV3XG4vLyBpcyBjYWxsZWQuXG5uZ1ZpZXdGaWxsQ29udGVudEZhY3RvcnkuJGluamVjdCA9IFsnJGNvbXBpbGUnLCAnJGNvbnRyb2xsZXInLCAnJHJvdXRlJ107XG5mdW5jdGlvbiBuZ1ZpZXdGaWxsQ29udGVudEZhY3RvcnkoJGNvbXBpbGUsICRjb250cm9sbGVyLCAkcm91dGUpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0VDQScsXG4gICAgcHJpb3JpdHk6IC00MDAsXG4gICAgbGluazogZnVuY3Rpb24oc2NvcGUsICRlbGVtZW50KSB7XG4gICAgICB2YXIgY3VycmVudCA9ICRyb3V0ZS5jdXJyZW50LFxuICAgICAgICAgIGxvY2FscyA9IGN1cnJlbnQubG9jYWxzO1xuXG4gICAgICAkZWxlbWVudC5odG1sKGxvY2Fscy4kdGVtcGxhdGUpO1xuXG4gICAgICB2YXIgbGluayA9ICRjb21waWxlKCRlbGVtZW50LmNvbnRlbnRzKCkpO1xuXG4gICAgICBpZiAoY3VycmVudC5jb250cm9sbGVyKSB7XG4gICAgICAgIGxvY2Fscy4kc2NvcGUgPSBzY29wZTtcbiAgICAgICAgdmFyIGNvbnRyb2xsZXIgPSAkY29udHJvbGxlcihjdXJyZW50LmNvbnRyb2xsZXIsIGxvY2Fscyk7XG4gICAgICAgIGlmIChjdXJyZW50LmNvbnRyb2xsZXJBcykge1xuICAgICAgICAgIHNjb3BlW2N1cnJlbnQuY29udHJvbGxlckFzXSA9IGNvbnRyb2xsZXI7XG4gICAgICAgIH1cbiAgICAgICAgJGVsZW1lbnQuZGF0YSgnJG5nQ29udHJvbGxlckNvbnRyb2xsZXInLCBjb250cm9sbGVyKTtcbiAgICAgICAgJGVsZW1lbnQuY2hpbGRyZW4oKS5kYXRhKCckbmdDb250cm9sbGVyQ29udHJvbGxlcicsIGNvbnRyb2xsZXIpO1xuICAgICAgfVxuICAgICAgc2NvcGVbY3VycmVudC5yZXNvbHZlQXMgfHwgJyRyZXNvbHZlJ10gPSBsb2NhbHM7XG5cbiAgICAgIGxpbmsoc2NvcGUpO1xuICAgIH1cbiAgfTtcbn1cblxuXG59KSh3aW5kb3csIHdpbmRvdy5hbmd1bGFyKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2FuZ3VsYXItcm91dGUvYW5ndWxhci1yb3V0ZS5qc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJhbmd1bGFyXHJcbiAgICAubW9kdWxlKCdob2xseXdvb2RTdGFycycpXHJcbiAgICAuY29uZmlnKFxyXG4gICAgICAgIGZ1bmN0aW9uKCAkcm91dGVQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIgKSB7XHJcblxyXG4gICAgICAgICAgICAkcm91dGVQcm92aWRlclxyXG4gICAgICAgICAgICAgICAgLndoZW4oJy8nLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvYXNzZXRzL3ZpZXdzL3BhZ2VzL2hvbWUudGVtcGxhdGUuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2hvbWVDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC53aGVuKCcvY2VsZWJyaXR5LzpuYW1lJywge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL2Fzc2V0cy92aWV3cy9wYWdlcy9jZWxlYnJpdHkudGVtcGxhdGUuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2NlbGVicml0eUNvbnRyb2xsZXInXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLm90aGVyd2lzZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVkaXJlY3RUbzogJy8nLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdob21lQ29udHJvbGxlcidcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gUmVtb3ZlIG8gLyMhLyBkYSBVUkxcclxuICAgICAgICAgICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xyXG4gICAgICAgICAgICAkbG9jYXRpb25Qcm92aWRlci5oYXNoUHJlZml4KCcnKTtcclxuICAgICAgICB9XHJcbiAgICApO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2FwcC9hcHAuY29uZmlnLmpzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxudmFyIGFuZ3VsYXIgPSByZXF1aXJlKCdhbmd1bGFyJyk7XG5cbmFuZ3VsYXIubW9kdWxlKCdob2xseXdvb2RTdGFycycpXG4gICAgLmNvbnRyb2xsZXIoJ2hvbWVDb250cm9sbGVyJywgcmVxdWlyZSgnLi9ob21lLmNvbnRyb2xsZXInKSk7XG5cbmFuZ3VsYXIubW9kdWxlKCdob2xseXdvb2RTdGFycycpXG4gICAgLmNvbnRyb2xsZXIoJ2NlbGVicml0eUNvbnRyb2xsZXInLCByZXF1aXJlKCcuL2NlbGVicml0eS5jb250cm9sbGVyJykpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2FwcC9jb250cm9sbGVycy9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJmdW5jdGlvbiBhcHBIZWFkZXJDb250cm9sbGVyICgkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMpIHtcclxuICAgICRzY29wZS5uYXZMaW5rcyA9IHtcclxuICAgICAgICBob21lOiB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdIb21lJyxcclxuICAgICAgICAgICAgbGluazogJy8nXHJcbiAgICAgICAgfSxcclxuICAgICAgICBjZWxlYnJpdGllczoge1xyXG4gICAgICAgICAgICBuYW1lOiAnQ2VsZWJyaXRpZXMnLFxyXG4gICAgICAgICAgICBsaW5rOiAnY2VsZWJyaXRpZXMvbGlzdCdcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdob2xseXdvb2RTdGFycycpLmNvbXBvbmVudCgnYXBwSGVhZGVyJywge1xyXG4gICAgdGVtcGxhdGVVcmw6ICcvYXNzZXRzL3ZpZXdzL3BhcnRpYWxzL2FwcC1oZWFkZXIudGVtcGxhdGUuaHRtbCcsXHJcbiAgICBjb250cm9sbGVyOiBhcHBIZWFkZXJDb250cm9sbGVyLFxyXG4gICAgYmluZGluZ3M6IHtcclxuICAgICAgICB0aXRsZTogJ0AnLFxyXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnQCdcclxuICAgIH1cclxufSk7XHJcblxyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9hcHAvY29tcG9uZW50cy9hcHAtaGVhZGVyL2FwcC1oZWFkZXIuY29tcG9uZW50LmpzXG4vLyBtb2R1bGUgaWQgPSAxMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCIuLi9jc3MvbWFpbi5jc3NcIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9hcHAvc3R5bGVzL21haW4ubGVzc1xuLy8gbW9kdWxlIGlkID0gMTFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuZnVuY3Rpb24gaG9tZUNvbnRyb2xsZXIoICRzY29wZSwgQ2VsZWJyaXRpZXNTZXJ2aWNlICkge1xyXG4gICAgJHNjb3BlLnRpdGxlID0gJ1RvcCBDZWxlYnJpdGllczonO1xyXG5cclxuICAgICRzY29wZS5jZWxlYnJpdHlMaXN0ID0gQ2VsZWJyaXRpZXNTZXJ2aWNlO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGhvbWVDb250cm9sbGVyO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2FwcC9jb250cm9sbGVycy9ob21lLmNvbnRyb2xsZXIuanNcbi8vIG1vZHVsZSBpZCA9IDEzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImZ1bmN0aW9uIGNlbGVicml0eUNhcmRDb250cm9sbGVyICgkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMpIHtcclxuICAgIFxyXG59XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnaG9sbHl3b29kU3RhcnMnKS5jb21wb25lbnQoJ2NhcmRDZWxlYnJpdHknLCB7XHJcbiAgICB0ZW1wbGF0ZVVybDogJy9hc3NldHMvdmlld3MvY29tcG9uZW50cy9jZWxlYnJpdHktY2FyZC50ZW1wbGF0ZS5odG1sJyxcclxuICAgIGNvbnRyb2xsZXI6IGNlbGVicml0eUNhcmRDb250cm9sbGVyLFxyXG4gICAgYmluZGluZ3M6IHtcclxuICAgICAgICBjZWxlYnJpdHk6ICc8J1xyXG4gICAgfVxyXG59KTtcclxuXHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2FwcC9jb21wb25lbnRzL2NlbGVicml0eS9jZWxlYnJpdHktY2FyZC5jb21wb25lbnQuanNcbi8vIG1vZHVsZSBpZCA9IDE1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImZ1bmN0aW9uIGNlbGVicml0eUNvbnRyb2xsZXIoICRzY29wZSwgJHJvdXRlUGFyYW1zLCBDZWxlYnJpdGllc1NlcnZpY2UgKSB7XHJcblxyXG4gICAgJHNjb3BlLnRvQ2FwaXRhbGl6ZSA9IGZ1bmN0aW9uKHN0cmluZykge1xyXG4gICAgICAgIHZhciBzbGljZXMgPSBzdHJpbmcuc3BsaXQoJy0nKTtcclxuICAgICAgICB2YXIgY2FwaXRhbGl6ZWRTbGljZXMgPSBbXTtcclxuXHJcbiAgICAgICAgc2xpY2VzLmZvckVhY2goIGZ1bmN0aW9uKHdvcmQpIHtcclxuICAgICAgICAgICAgY2FwaXRhbGl6ZWRTbGljZXMucHVzaCggd29yZC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHdvcmQuc2xpY2UoMSkgKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGNhcGl0YWxpemVkU2xpY2VzLmpvaW4oJyAnKTtcclxuICAgIH1cclxuXHJcbiAgICAkc2NvcGUuY2VsZWJyaXR5TGlzdCA9IENlbGVicml0aWVzU2VydmljZTtcclxuICAgICRzY29wZS5jZWxlYnJpdHlOYW1lID0gJHNjb3BlLnRvQ2FwaXRhbGl6ZSggJHJvdXRlUGFyYW1zLm5hbWUgKTtcclxuXHJcbiAgICAkc2NvcGUuY2VsZWJyaXR5TGlzdC5tYXAoZnVuY3Rpb24oY2VsZWJyaXR5KSB7XHJcbiAgICAgICAgaWYgKCBjZWxlYnJpdHkubmFtZSA9PSAkc2NvcGUuY2VsZWJyaXR5TmFtZSApIHtcclxuICAgICAgICAgICAgJHNjb3BlLmNlbGVicml0eSA9IGNlbGVicml0eTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjZWxlYnJpdHlDb250cm9sbGVyO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2FwcC9jb250cm9sbGVycy9jZWxlYnJpdHkuY29udHJvbGxlci5qc1xuLy8gbW9kdWxlIGlkID0gMTZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYW5ndWxhciA9IHJlcXVpcmUoJ2FuZ3VsYXInKTtcblxuYW5ndWxhci5tb2R1bGUoJ2hvbGx5d29vZFN0YXJzJylcbiAgICAgICAuc2VydmljZSgnQ2VsZWJyaXRpZXNTZXJ2aWNlJywgcmVxdWlyZSgnLi9jZWxlYnJpdGllcy5zZXJ2aWNlJykpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2FwcC9zZXJ2aWNlcy9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gMTdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuZnVuY3Rpb24gQ2VsZWJyaXRpZXNTZXJ2aWNlKCkge1xyXG5cclxuICAgIHZhciB0b1VybCA9IGZ1bmN0aW9uKHN0cmluZykge1xyXG4gICAgICAgIHJldHVybiBzdHJpbmcudHJpbSgpLnRvTG93ZXJDYXNlKCkuc3BsaXQoJyAnKS5qb2luKCctJyk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGNlbGVicml0aWVzID0gW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWQ6IDEsXHJcbiAgICAgICAgICAgIG5hbWU6ICdTYW5keSBMaW1hJyxcclxuICAgICAgICAgICAgdXJsTmFtZTogdG9VcmwoJ1NhbmR5IExpbWEnKSxcclxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdjYW50b3JhLCBjb21wb3NpdG9yYSBlIGF0cml6IGJyYXNpbGVpcmEuIENhbnRvcmEgZGVzZGUgYSBpbmbDom5jaWEsIFNhbmR5IGNvbWXDp291IHN1YSBjYXJyZWlyYSBlbSAxOTkwLCBxdWFuZG8gZm9ybW91IGNvbSBvIGlybcOjbywgbyBtw7pzaWNvIEp1bmlvciBMaW1hLCBhIGR1cGxhIHZvY2FsIFNhbmR5ICYgSnVuaW9yLicsXHJcbiAgICAgICAgICAgIGltYWdlOiAnaHR0cDovL2ltYWdlcy52aXJndWxhLmNvbS5ici8yMDE1LzAyL3NhbmR5LmpwZycsXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICBpZDogMixcclxuICAgICAgICAgICAgbmFtZTogJ01hbnUgR2F2YXNzaScsXHJcbiAgICAgICAgICAgIHVybE5hbWU6IHRvVXJsKCdNYW51IEdhdmFzc2knKSxcclxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdNYW5vZWxhIExhdGluaSBHYXZhc3NpIEZyYW5jaXNjbywgbWFpcyBjb25oZWNpZGEgY29tbyBNYW51IEdhdmFzc2ksIMOpIHVtYSBjYW50b3JhLCBjb21wb3NpdG9yYSwgYXRyaXogZSBhdXRvcmEgYnJhc2lsZWlyYScsXHJcbiAgICAgICAgICAgIGltYWdlOiAnaHR0cDovL21ldHJvcG9saXRhbmFmbS5jb20uYnIvd3AtY29udGVudC91cGxvYWRzLzIwMTYvMDcvY2FwYS1tYW51LWdhdmFzc2kuanBnJyxcclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIGlkOiAzLFxyXG4gICAgICAgICAgICBuYW1lOiAnUGF1bGEgRmVybmFuZGVzJyxcclxuICAgICAgICAgICAgdXJsTmFtZTogdG9VcmwoJ1BhdWxhIEZlcm5hbmRlcycpLFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ2NhbnRvcmEgZSBjb21wb3NpdG9yYSBicmFzaWxlaXJhLiBDYW50b3JhIGRlc2RlIGEgaW5mw6JuY2lhLCBGZXJuYW5kZXMgY29tZcOnb3UgYSBjYW50YXIgcHJvZmlzc2lvbmFsbWVudGUgYW9zIG9pdG8gYW5vcyBkZSBpZGFkZScsXHJcbiAgICAgICAgICAgIGltYWdlOiAnaHR0cDovL3d3dy5hc3Npc25ld3MuY29tLmJyL3dwLWNvbnRlbnQvdXBsb2Fkcy8yMDE3LzEyL3BhdWxhX2Zlcm5hbmRlcy0xLmpwZycsXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICBpZDogNCxcclxuICAgICAgICAgICAgbmFtZTogJ0pvYW5hIEJvcmdlcycsXHJcbiAgICAgICAgICAgIHVybE5hbWU6IHRvVXJsKCdKb2FuYSBCb3JnZXMnKSxcclxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICfDqSB1bWEgam92ZW0gYWN0cml6IHBvcnR1Z3Vlc2EuIENvbWXDp291IHBvciBmYXplciBwYXJ0ZSBkbyBjb3JvIGluZmFudGlsIFwiIEpvdmVucyBDYW50b3JlcyBkZSBMaXNib2FcIiBwYXJhIGluZ3Jlc3NhciBubyBncnVwbyBtdXNpY2FsIFwiIE9uZGFDaG9jXCIuJyxcclxuICAgICAgICAgICAgaW1hZ2U6ICdodHRwOi8vczIuZ2xiaW1nLmNvbS9mWU14Z0U3NVdhSGpFaFd6U3oxSUQwTFhaQXc9LzQ3NXg0NzUvdG9wL2kuZ2xiaW1nLmNvbS9vZy9pZy9pbmZvZ2xvYm8vZi9vcmlnaW5hbC8yMDE3LzAxLzA5L2pvYW5hYm9yZ2VzLnBuZycsXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICBpZDogNSxcclxuICAgICAgICAgICAgbmFtZTogJ1Bhb2xhIE9saXZlaXJhJyxcclxuICAgICAgICAgICAgdXJsTmFtZTogdG9VcmwoJ1Bhb2xhIE9saXZlaXJhJyksXHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnUGFvbGxhIE9saXZlaXJhIMOpIGRlc2NlbmRlbnRlIGRlIGVzcGFuaMOzaXMsIGl0YWxpYW5vcyBlIHBvcnR1Z3Vlc2VzLiBFbGEgw6kgZmlsaGEgZGUgdW0gcG9saWNpYWwgbWlsaXRhciBhcG9zZW50YWRvIGUgZGUgdW1hIGV4LWF1eGlsaWFyIGRlIGVuZmVybWFnZW0nLFxyXG4gICAgICAgICAgICBpbWFnZTogJ2h0dHBzOi8vcGF0cmljaW5oYWVzcGVydGEuY29tLmJyL3dwLWNvbnRlbnQvdXBsb2Fkcy8yMDEzLzA1L3Bhb2xhLW9saXZlaXJhLmpwZycsXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICBpZDogNixcclxuICAgICAgICAgICAgbmFtZTogJ01hcmluYSBSdXkgQmFyYm9zYScsXHJcbiAgICAgICAgICAgIHVybE5hbWU6IHRvVXJsKCdNYXJpbmEgUnV5IEJhcmJvc2EnKSxcclxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdNYXJpbmEgU291emEgUnV5IEJhcmJvc2EgTmVncsOjbyDDqSB1bWEgYXRyaXogYnJhc2lsZWlyYS4gQ29tZcOnb3UgYSBhdHVhciBhaW5kYSBjcmlhbsOnYSwgZSBmZXogc2V1IHByaW1laXJvIHRyYWJhbGhvIGRlIGRlc3RhcXVlIG5vIHBhcGVsIGRlIEFuaW5oYSBuYSB0ZWxlbm92ZWxhIENvbWXDp2FyIGRlIE5vdm8uJyxcclxuICAgICAgICAgICAgaW1hZ2U6ICdodHRwOi8vczIuZ2xiaW1nLmNvbS9acGw0Ymp0NTZzamFGMHpiOXgzcEs0LW9QV009L2UuZ2xiaW1nLmNvbS9vZy9lZC9mL29yaWdpbmFsLzIwMTcvMDgvMDcvbWFybi5qcGcnLFxyXG4gICAgICAgIH1cclxuICAgIF07XHJcblxyXG4gICAgcmV0dXJuIGNlbGVicml0aWVzO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDZWxlYnJpdGllc1NlcnZpY2U7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYXBwL3NlcnZpY2VzL2NlbGVicml0aWVzLnNlcnZpY2UuanNcbi8vIG1vZHVsZSBpZCA9IDE4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=