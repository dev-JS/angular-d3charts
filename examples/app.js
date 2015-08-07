(function () {
    angular.module('de.devjs.angular.d3pie.example', ['de.devjs.angular.d3pie', 'de.devjs.angular.d3circle'])
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

            $scope.circleData = [
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
                $scope.circleData = angular.copy($scope.circleData);
                // just test data, do not mind those magic numbers!
                $scope.circleData.map(function (i) {
                    return i.count = Math.floor(Math.random() * (1000 - 1)) + 1;
                });
            }, 1000);

        }]);
})();
