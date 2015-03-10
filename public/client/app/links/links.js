angular.module('shortly.links', [])

.controller('LinksController', function ($scope, $location, Links, Auth) {
  $scope.data = {};

  $scope.getLinks = function() {
    if(!Auth.isAuth()){
      $location.path('/signin')
    } else {
      Links.getLinks()
      .then(function (data) {
        console.log("data is \n", data);
        $scope.data.links = data;
      })
      .catch(function (error) {
        console.error(error);
      });
    }
  };

  $scope.getLinks();

  $scope.logout = function() {
    console.log('signout 1');

    Auth.signout();
  };
});
