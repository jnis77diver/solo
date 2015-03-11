angular.module('shortly.services', [])

.factory('Dashboard', function ($http, $location, $window) {
  // Your code here

  var sanitizeDate = function(str) {
    var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    if( str === undefined ) { return ""; }
    var mapObj = {
      '%20':' ',
      '%3A':' ',
      '%03':' '
    };
    // if(currentRoom !== "main room"){
    //   debugger;
    // }
    str = str.replace(/(%20)|(%3A)|(%03)/g, function(matched){
      return mapObj[matched];
    });
    var rearrange = str.replace(/(\w\w) (\w\w) (\w\w) (\w\w) (\w\w\w) (\w\w\w\w) (\w\w\w)/g, "$6 $5 $4 $1 $2 $3");
    rearrange = rearrange.split(' ');
    rearrange[1] = month.indexOf(rearrange[1]);
    return rearrange.map(function(elem) {
      return Number(elem);
    }).join(' ');
  };

  var showData = function() {
    return $http({
      method: 'GET',
      url: '/api/links'
    })
      .then(function (resp) {
        //console.log("response.data is \n", resp.data);
        return resp.data;
      });
  };

  return {
    sanitizeDate : sanitizeDate,
    showData: showData
  };
})


.factory('Links', function ($http, $location, $window) {
  // Your code here
  var getLinks = function() {
    return $http({
      method: 'GET',
      url: '/api/links'
    })
      .then(function (resp) {
        //console.log("response.data is \n", resp.data);
        return resp.data;
      });
  };

  var addLink = function(link) {
    return $http({
      method: 'POST',
      url: '/api/links',
      data: link
    })
    .then(function(resp) {
      console.log(resp.data);
      return resp.data;
    });
  };

  var navToLink = function(code){
    var addOn = $location.path();
    console.log("addOn", addOn);
    return $http({
      method: 'GET',
      url: '/api/links' + addOn
    })
    .then(function(resp) {
      return resp.data.url;
    });

  };

  return {getLinks : getLinks,
          addLink : addLink,
          navToLink : navToLink};
})

.factory('Auth', function ($http, $location, $window) {
  // Don't touch this Auth service!!!
  // it is responsible for authenticating our user
  // by exchanging the user's username and password
  // for a JWT from the server
  // that JWT is then stored in localStorage as 'com.shortly'
  // after you signin/signup open devtools, click resources,
  // then localStorage and you'll see your token from the server
  var signin = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signin',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };

  var signup = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signup',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };

  var isAuth = function () {
    return !!$window.localStorage.getItem('com.shortly');
  };

  var signout = function () {
    $window.localStorage.removeItem('com.shortly');
    $location.path('/signin');
  };


  return {
    signin: signin,
    signup: signup,
    isAuth: isAuth,
    signout: signout
  };
});
