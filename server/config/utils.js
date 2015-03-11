var request = require('request'),
    Q       = require('q'),
    rValidUrl = /^(?!mailto:)(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[0-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))|localhost)(?::\d{2,5})?(?:\/[^\s]*)?$/i;


module.exports = {
  getUrlTitle: function(url) {
    var defer = Q.defer();
    request(url, function(err, res, html) {
      if (err) {
        defer.reject(err);
      } else {
        var tag = /<title>(.*)<\/title>/;
        var match = html.match(tag);
        var title = match ? match[1] : url;
        defer.resolve(title);
      }
    });
    return defer.promise;
  },

  isValidUrl: function(url) {
    return url.match(rValidUrl);
  },

  sanitizeDate: function(str) {
    var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    if( str === undefined ) { return ""; }
    var mapObj = {
      '%20':' ',
      '%3A':' ',
      '%03':' ',
      '%2C':' '
    };

    str = str.replace(/(%20)|(%3A)|(%03)|(%2C)/g, function(matched){
      return mapObj[matched];
    });
    // console.log(str.split(' '));
    rearrange = str.split(' ');
    numMonth = month.indexOf(rearrange[3]);
    var newDate = [rearrange[6], numMonth, rearrange[4], rearrange[0]];
    var datetime = new Date(newDate[0], newDate[1], newDate[2], newDate[3]);
    return datetime;
  }



};

