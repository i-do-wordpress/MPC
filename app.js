;(function(){
    
    /*global angular*/
    
    window.onload = function(){
      
      
      
      //ng include issue / closure
      var preloader = function(){
        var stop = setInterval(function(){
          var text = angular.element(document).find('#lessIsMoreText');
          var view = angular.element(document).find('#viewWrapper')
          var wrapper = text.parent().parent();
          if(text.length && view.length && wrapper.length){
            text.fadeIn(3000).delay(2000).fadeOut(1000);
            wrapper.delay(5000).fadeOut(2000, function(){
              view.fadeIn(800);          
              clearInterval(stop)
            });
          }
        }, 1000/60);
      };
      preloader();
      
      
      
      
      
      
      
      
    }
    
    
    
    
    
    
    var pix = angular.module('pix', ['ngRoute']);
    
    
    
    
    pix
      
      .config(['$routeProvider', function($routeProvider){
        $routeProvider
          
          .when('/', {
            templateUrl: 'view/view.splash.html',
            //controller: 'CtrlSplash',
            //controllerAs: 'CS'
          })
          
          .otherwise({redirectTo: '/'});
      }]);
      
      
      
      
      pix
        .config(['$locationProvider', function($locationProvider){
          $locationProvider.hashPrefix('');
        }]);
      
      
      
      
      
      
      pix.controller('CtrlRoot', CtrlRoot);
      
      CtrlRoot.$inject = [];
      
      function CtrlRoot(){
        
        var self = this;
        
        
        
        
        
        
        
        
        
        
      }//end CtrlRoot
      
      
      

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
})();