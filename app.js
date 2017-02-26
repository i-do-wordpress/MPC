;(function(){
    
    /*global angular*/
    
    window.onload = function(){
      
      
      
      //ng include issue / closure
      var preloader = function(){
        var stop = setInterval(function(){
          var text = angular.element(document).find('#lessIsMoreText');
          var view = angular.element(document).find('#viewWrapper')
          var wrapper = text.parent().parent();
          
          /*
          if(text.length && view.length && wrapper.length){
            text.fadeIn(3000).delay(2000).fadeOut(1000);
            wrapper.delay(5000).fadeOut(2000, function(){
              view.fadeIn(800);          
              clearInterval(stop)
            });
          }
          */
          if(text.length && view.length && wrapper.length){
            text.fadeIn(3).delay(2).fadeOut(1);
            wrapper.delay(5).fadeOut(2, function(){
              view.fadeIn(8);          
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
      
      CtrlRoot.$inject = ['$http'];
      
      function CtrlRoot($http){
        
        var self = this;
        
        self.checking = false;
        
        self.pixel = {};
        self.pixel.pass = '';
        
        self.auth = function(form){
          
          if(form.$valid && self.pixel.pass){
            
            self.checking = true;
            
            $http.post("https://useless-space.comli.com/auth.php", self.pixel.pass).then(function(response){
              
              console.log(response);
              
              
            }, function(response){
              
              console.log(response);
              
            });
            
            
            
          }
        }
        
        
        
        
        
        
        
      }//end CtrlRoot
      
      
      

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
})();