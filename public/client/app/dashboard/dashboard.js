angular.module('shortly.links', [])

  .controller('DashboardController', function ($scope, $location, Dashboard, Links, Auth) {
    $scope.data = {};

    $scope.showData = function() {
      Paypal.showData()
        .then(function (data) {
          console.log("data is \n", data);
          $scope.data = data;
        })
        .catch(function (error) {
          console.error(error);
        });
    };

    $scope.showData();


    $scope.graphData = function() {

    };
  });
