angular.module('shortly.shorten', [])

.controller('ShortenController', function ($scope, $location, Links, Auth) {
  // Your code here
  $scope.link = {};

  $scope.fake = function(){
    if(!Auth.isAuth()){
      $location.path('/');
    }
  };

  $scope.fake();

  $scope.addLink = function(){
    console.log("addLink called here");
    Links.addLink($scope.link)
      .then(function(data){
        $scope.link.title = data.title;
        $scope.link.uri = data.url;
        $scope.link.base_url = data.base_url;
        $scope.link.visits = data.visits;
        $scope.link.code = data.code;
      })
  };
});

