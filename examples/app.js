(function () {
    angular.module('de.devjs.angular.pie.example', ['de.devjs.angular.pie'])
        .controller('appController', ['$scope', '$interval', function ($scope, $interval) {
            $scope.pieData = [{
                name: 'j.sprenger',
                count: 56
            }, {
                name: 'stephan.koeninger',
                count: 1000
            },
                {
                    name: 'end.gegner',
                    count: 1000
                }];

            $interval(function () {
                $scope.pieData = angular.copy($scope.pieData);
                $scope.pieData[0].count = Math.random() * 128;
                $scope.pieData[1].count = Math.random() * 55;
                $scope.pieData[2].count = Math.random() * 255;
            }, 1000);
        }])
})();
