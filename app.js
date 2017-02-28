;(function(){
    
    /*global angular*/
    
    window.onload = function(){
      
      
      
      /* fixes ng include issue + closure */
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
      
      
      
      
      
      
      
      
    }//end window.onload
    
    
    
  /*-----------------------config, routes-----------------------------------------------*/    
    
    
    var pix = angular.module('pix', ['ngRoute', 'ngCookies', 'ngTouch']);
    
    
    
    
    
    pix
      
      .config(['$routeProvider', function($routeProvider){
        
        $routeProvider
          
          .when('/', {
            templateUrl: 'view/view.splash.html',
            //controller: 'CtrlSplash',
            //controllerAs: 'CS',
            middlewares: ['guest'],
          })
          .when('/home', {
            templateUrl: 'view/view.home.html',
            //controller: 'CtrlSplash',
            //controllerAs: 'CS'
            middlewares: ['auth']
          })

          

          .otherwise({redirectTo: '/'});
      }]);
      
      
      
       
      
      
      
      
      pix
        .config(['$locationProvider', function($locationProvider){
          $locationProvider.hashPrefix('');
        }]);
      
      
      
      pix.config(['$httpProvider', function($httpProvider){
        
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        
        
        $httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
        
      }]);
      
      
      
      //factory in run thus no need to ctrl     
      pix.run(['$rootScope', '$location', 'factoryRoot',
        function($rootScope, $location, factoryRoot){
          
          $rootScope.$on('$routeChangeStart', function(event, next, current){
            
            if(next.$$route && !next.$$route.redirectTo && next.$$route.middlewares){
              var ms = next.$$route.middlewares;
              if(ms.length){
                for(var i=0, len=ms.length; i<len; i++){
                
                  if(ms[i]==='auth'){

                    if(!factoryRoot.canGo()){
                      $location.path('/');
                    }else{
                      //$location.path(next.$$route.originalPath); //no need
                    }
                  }else if(ms[i]==='guest'){
                    if(factoryRoot.canGo()){
                      $location.path('/home');
                    }
                  }  
                
                }
              }
            
            }  
          
            
          });
        }
      ]);
      
      
      
      
      
      
      
      
  /*--------------------------------end config, routes--------------------------------------------*/    
      
      
      
      
      
      
      
      
  /*---------------------------------------CTRLs------------------------------------------------------*/    
      
      pix.controller('CtrlRoot', CtrlRoot);
      
      CtrlRoot.$inject = ['$http', '$cookies', 'factoryRoot', '$timeout', '$location'];
      
      function CtrlRoot($http, $cookies, factoryRoot, $timeout, $location){
        
        var self = this;
        
        self.factoryRoot = factoryRoot;
        self.checking = false;
        self.loginErr = false;
        self.pixel = {};
        self.pixel.PIN = '';
        
        //no need to follow and cancel
        var setLoginErr = function(){
          self.loginErr = true;
          $timeout(function(){
            self.loginErr = false;
          }, 3000);
        };
        
        
        
        self.auth = function(form){
          self.checking = true;
          self.loginErr = false;
          if(form.$valid && self.pixel.PIN){
            
            //checking details vs dummy data endpoint
            $http.get("http://jsonplaceholder.typicode.com/comments/"+self.pixel.PIN+"")
              .then(function(response){
                self.checking = false;
                var bit = response.data.body;  
                var logged = factoryRoot.login(bit);
                if(!logged){
                  setLoginErr();
                  return false;
                }else{
                  //self.pixel.PIN = '';
                  $location.path('/home');
                  return true;
                }
              }, function(response){
                  self.checking = false;
                  setLoginErr();
                  return false;
            });
          }else{
            self.checking = false;
            setLoginErr();
            return false; 
          }
        }//end self.auth
        

        
        self.logout = function(){
          self.pixel.PIN = '';
          factoryRoot.logout();
          $location.path('/');
          
          //some-mobile-incognito-mode-browzers fix
          //if stuck on logout
          //force redirect if cookie removed
          if(window.location.hash !== '#/'){
            window.location.hash = '#/';
          }  
        };
      
        
        
        
        self.toggleBio = function(){
          angular.element(document).find('#bio').slideToggle(300);
        };
        
        
        
        
      }//end CtrlRoot
      
      
      

    
  /*--------------------------------end CTRLs-----------------------------------------------*/  
    
    
  
  
  
  
  
  
    
    
    
  /*-------------------------------------factory-------------------------------------------------------*/  
  pix.factory('factoryRoot', factoryRoot);
  
  factoryRoot.$inject = ['$cookies'];
  
  function factoryRoot($cookies){
    
    var root = {};
    
    //root.go = false;
    //root.cookies = [];

    //is Logged
    root.canGo = function(){
      return  $cookies.get('go') ? true : false;
    };
    
    
    root.login = function(bit){
      if(bit.charAt(150) === "i" && bit.charAt(12) === 'o'){
        var cook = $cookies.get('go');
        if(!cook){
          $cookies.put('go', true);
        }
        return true;
      }else{
        return false;
      }  
    };
    
    
    root.logout = function(){
      root.removeAllCookies();
    };
    
    
    
    root.removeAllCookies = function(){
      var c = $cookies.getAll();
      if(c){
        angular.forEach(c, function (v, k){
          $cookies.remove(k);
        });
      }
    };
    
    
    //keep one line
    //put some watch?
    
    
    return root;
    
  }//end rootFactory
  
  
  
  
  
  
  
  
  
  
  
  
  
  /*---------------------------------end factory-------------------------------------------------------*/  
  
  
  
  
  
  
  
  
  
  /*----------------------------------------------------------------------------------------*/  
  /*----------------------------------------------------------------------------------------*/  
    
    
    
    
    
    
    
    
    
    
})();//end iffe