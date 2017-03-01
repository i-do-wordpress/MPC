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
            middlewares: ['guest']
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
      pix.run(['$rootScope', '$location', 'factoryRoot', '$cookies', '$window',
        function($rootScope, $location, factoryRoot, $cookies, $window){
          
          $rootScope.$on('$routeChangeStart', function(event,next,current){
            
            var isLogged = factoryRoot.isLogged();
            
            if(next.$$route && !next.$$route.redirectTo && next.$$route.middlewares){
              var ms = next.$$route.middlewares;
              if(ms.length){
                for(var i=0, len=ms.length; i<len; i++){
                
                  if(ms[i]==='auth'){

                    if(!isLogged){
                      $location.path('/');
                    }else{
                      //$location.path(next.$$route.originalPath); //no need
                    }
                  }else if(ms[i]==='guest'){
                    if(isLogged){
                      $location.path('/home'); //or other next/intended
                    }
                  }  
                }
              }
            }
          });
        }  
      ]); //end run
      
      
      
      
  /*--------------------------------end config, routes--------------------------------------------*/    
      
      
      
      
      
      
      
      
  /*---------------------------------------CTRLs------------------------------------------------------*/    
      
      pix.controller('CtrlRoot', CtrlRoot);
      
      CtrlRoot.$inject = ['$http', '$cookies', 'factoryRoot', '$timeout', '$location', '$window'];
      
      function CtrlRoot($http, $cookies, factoryRoot, $timeout, $location, $window){
        
        //console.log('$location',$location.$$absUrl);
        //console.log(window.location.origin+window.location.pathname);
        //if(!window.location.origin){
          //window.location.origin = window.location.protocol + "//" + window.location.host;
        //}  
        
        var self = this;
        
        self.factoryRoot = factoryRoot;
        self.checking = false;
        self.loginErr = false;
        self.pixel = {};
        self.pixel.PIN = '';
        self.isMobile = factoryRoot.isMobile();
        self.baseUrl = factoryRoot.getBaseUrl();
        self.pathName = factoryRoot.getPathName();
        
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
            
            /*checking details dummy data endpoint ajax call
            normally should also be POST not GET
            */
            $http.get("http://jsonplaceholder.typicode.com/comments/"+self.pixel.PIN+"")
              .then(function(response){
                self.checking = false;
                var bit = response.data.body;  
                var pinOk = factoryRoot.checkPin(bit);
                if(!pinOk){
                  setLoginErr();
                  return false;
                }else{
                  //self.pixel.PIN = ''; //on logout, stops flickering
                  $window.sessionStorage.setItem('go', '_someTokenFromRest');
                  $location.path('/home');
                  
                  //also ok
                  //$window.localStorage.setItem('storage',true);
                  
                  //note:
                  //$cookie tested vs mobile browsers failed big time!
                  //especially when incognito mode was on
                  //sessionStorage seems bulletproof
                  //$window.sessionStorage.setItem("sessionstorage", angular.toJson(session));
                  
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
          $window.location.replace(self.pathName); //reload & no history
          //$location.path('/');
          //$window.location.reload(); 
          //window.close();
        };
      
    
        self.toggleBio = function(){
          angular.element(document).find('#bio').slideToggle(300);
        };
        
        
        
        
      }//end CtrlRoot
      
      
      

    
  /*--------------------------------end CTRLs-----------------------------------------------*/  
    
    
  
  
  
  
  
  
    
    
    
  /*-------------------------------------factory-------------------------------------------------------*/  
  pix.factory('factoryRoot', factoryRoot);
  
  factoryRoot.$inject = ['$cookies', '$window', '$location'];
  
  function factoryRoot($cookies, $window, $location){
    
    var root = {};
  
    root.isLogged = function(){
      var logged = Boolean($window.sessionStorage.getItem('go')); //str
      return logged;
    }
    
    root.checkPin = function(bit){
      if(bit.charAt(150) === "i" && bit.charAt(12) === 'o'){
        return true;
      }else{
        return false;
      }  
    };
    
    
    root.logout = function(){
      $window.sessionStorage.removeItem('go');
      //root.removeAllCookies(); //not in use
    }
    
    
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
    
    
    root.isMobile = function(){
      if(typeof window.orientation !== 'undefined'){
        return true;
      }
    };
    
    
    root.getBaseUrl = function(){
      //1hardcde
      
      //2.
      /*
      if(window.location.pathname){
        return window.location.origin+window.location.pathname;
      }else{
        return window.location.origin;
      }
      */
      //3
      return $location.$$absUrl.split('#')[0];
      
      //4 $window
    };
    
    
    root.getPathName = function(){
      return window.location.pathname.split('#')[0]; //no need 
      //return window.location.pathname; //ok
    };    
    
    
    
    return root;
    
  }//end rootFactory
  
  
  
  
  
  
  
  
  
  
  
  
  
  /*---------------------------------end factory-------------------------------------------------------*/  
  
  
  
  
  
  
  
  
  
  /*----------------------------------------------------------------------------------------*/  
  /*----------------------------------------------------------------------------------------*/  
    
    
    
    
    
    
    
    
    
    
})();//end iffe