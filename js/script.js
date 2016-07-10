angular.module('HeartApp', ['ngRoute', 'ngAnimate'])
.config(function($routeProvider, $locationProvider){
	$routeProvider
		.when('/', {
			controller: 'MainController',
			templateUrl: '/main.html',
		})
		.when('/projects', {
			controller: 'ProjectsController',
			templateUrl: '/projects.html',
		})
		.otherwise({
			redirectTo: '/'
		});
	$locationProvider.html5Mode({ 
		enabled: true,
		requireBase: false
	}), 
	$locationProvider.html5Mode(true);	
})
.controller('MainController', function($scope){ 
	
	$scope.goSection = function(anchorItem){
		if (anchorItem != '' && typeof($(anchorItem)) === "object") {	
			$("html, body").animate({ 
				scrollTop: $('#'+anchorItem).position().top 
			}, 500);
		}
	}

})
.controller('ProjectsController', function($scope){
			
})

					
.directive('navigation', function(){
	return {
		restrict: 'E',
		repalce: true,
		transclude: true,
		templateUrl: 'navigation.html',
		controller: function($scope, $element, $attrs){
			this.closeAll = function(){
				$scope.$broadcast('close-all');
			}
			
		}
	}
})
	
// пункт с выпадающей менюшкой
.directive('item', function(){
	return {
		restrict: 'E',
		repalce: true,
		transclude: true,
		require: '^navigation',
		template: '<li ng-class="class"><a href="" ng-click="clickMenu()"><span class="arrow" ng-show="showMenu"></span>{{title}}</a><div class="info" ng-show="showMenu"><div class="close" ng-click="closeMenu()"></div><span ng-transclude></span></div></li>',
		scope: {},		
		link: function(scope, element, attrs, ctrl){
			scope.title = attrs.name;
			scope.class = attrs.class;
			scope.showMenu = false;
			scope.clickMenu = function() {
				ctrl.closeAll();
				scope.showMenu = !scope.showMenu;
				element.find('.info').show(); // что б перекрыть hide в close-all
			}
			scope.closeMenu = function() {
				scope.showMenu = false;
			}
			scope.$on('close-all', function() { 
				scope.showMenu = false;	
				element.find('.info').hide();	// что б остальные пункты закрылись сразу а не постепенно
			});
			/*
			а такой способ (без ng-click) не работает
			element.find('a').bind('click', function(){
				scope.showMenu = !scope.showMenu;
			});
			*/			
				
		}	
	}
})

// пункт со ссылкой 
.directive('itemHref', function(){
	return {
		restrict: 'E',
		repalce: true,
		scope: {},
		template: '<li><a ng-href="{{href}}">{{title}}</a></li>',
		link: function(scope, element, attrs, ctrl){
			scope.title = attrs.name;
			scope.href = attrs.href;
		}	
	}
})

.directive("scroll", function ($window) {
	return function(scope, element, attrs) {
		scope.showAside = false;
		angular.element($window).bind("scroll", function() {
			var section = element.find('section');
			var anchorItem = section.eq(0).attr('id');
			angular.forEach(section, function(_this) {
				// позиции секции
				var _this = angular.element(_this);
				var top_pos = _this.prop('offsetTop') - (_this.height() / 2);
				var bottom_pos = +_this.prop('offsetTop') + (_this.height() / 2);
				// проверка, совпадают ли позиции секции с позицией окна
				if($window.pageYOffset >= top_pos && $window.pageYOffset < bottom_pos) {
					anchorItem = _this.attr('id');
					return false;	
				}
			
			});		
			// активный класс соответствующему пункту
			element.find('.aside_menu a').removeClass('active');		
			element.find('.aside_menu a.'+anchorItem).addClass('active');
			
		
			// aside menu show
			if(anchorItem == 'main') {
				scope.showAside = false;
			} else {
				scope.showAside = true;
			}			
			scope.$apply();
		});
	}
})	