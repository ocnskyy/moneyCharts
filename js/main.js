angular.module('myApp',['ui.bootstrap', 'ui.bootstrap.datetimepicker', 'chart.js'])
.factory('myService', function($http, $filter, $q) {
  var getArray = function(first, last) {
    var promises = [];

    var tmp = _.clone(first);
    tmp.setDate(tmp.getDate() - 1);

    while (tmp < last) {
      tmp.setDate(tmp.getDate() + 1);
      var str = "http://kursach.sappz/zapros.php?date=" + $filter('date')(tmp, 'dd.MM.yyyy');
      promises.push($http.get(str));
    }

    return $q.all(promises).then(function (responce) {
      var arr = [];
      responce.forEach(function (item) {
        arr.push(item.data);
      });
      return arr;
    });
  };

  return {
    getArray: getArray
  };
})
.controller('MyController', function($scope, myService){
  $scope.minDate = new Date('2009/01/01');
  $scope.maxDate = new Date('2015/06/10');

  $scope.save = true;

  $scope.final = {
    name: 'usd'
  };

  $scope.series = ['Sale', 'Purchase'];
  $scope.colours = [
  {
    'fillColor': 'rgba(0, 0, 255, 0.1)',
    'strokeColor': '#7400D9',
    'pointColor': '#7400D9'
    // 'highlightFill': 'rgba(47, 132, 71, 0.8)'
    // 'highlightStroke': 'rgba(47, 132, 71, 0.8)'
  },
  {
    'fillColor': 'rgba(0, 0, 255, 0.1)',
    'strokeColor': '#0085F7',
    'pointColor': '#0085F7'
  }
  ];

  $scope.getInfo = function() {

    if ($scope.save == true) {
      $scope.take = $scope.data.data1;
    }

    $scope.save = false;
    
    $scope.dates = [];

    $scope.currencies = {};

    myService.getArray($scope.data.date1, $scope.data.date2).then(function (res) {
      for (i in res) {
       $scope.dates.push(res[i].date);

       for (j in res[i].exchangeRate) {
        var key = res[i].exchangeRate[j].currency.toLowerCase();
        if ( _.isEmpty($scope.currencies[key])) {
          $scope.currencies[key] =  [[],[]];
        }
        $scope.currencies[key][0].push(res[i].exchangeRate[j].saleRate || res[i].exchangeRate[j].saleRateNB);
        $scope.currencies[key][1].push(res[i].exchangeRate[j].purchaseRate || res[i].exchangeRate[j].purchaseRateNB);
        }   //for j
      }   //for i

    });//конец функции сервиса

  } //конец функции контроллера
}); //конец контроллера