(function () {
    angular.module('de.devjs.angular.pie.example', ['de.devjs.angular.pie'])
        .controller('appController', ['$scope', '$interval', function ($scope, $interval) {
            $scope.pieData = [
                {
                    name: 'j.sprenger',
                    count: 56
                }, {
                    name: 'some1',
                    count: 10
                }, {
                    name: 'stekoe',
                    count: 1000
                }, {
                    name: 'end.gegner',
                    count: 1000
                }];

            $interval(function () {
                $scope.pieData = angular.copy($scope.pieData);
                // just test data, do not mind those magic numbers!
                $scope.pieData.map(function (i) {
                    return i.count = Math.floor(Math.random() * (1000 - 1)) + 1;
                });
            }, 1000);
        }])
})();
