(function () {
    angular.module('de.devjs.angular.d3pie.example', ['de.devjs.angular.d3pie', 'de.devjs.angular.d3circle',
        'de.devjs.angular.d3codeflower', 'de.devjs.angular.d3dependency'])
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

            // file names
            $scope.circleData = {
                "name": "frontend",
                "children": [
                    {
                        "name": "scripts",
                        "children": [
                            {
                                "name": "biggloud",
                                "children": [
                                    {
                                        "name": "model",
                                        "children": [
                                            {"name": "store.js", "count": 143},
                                            {"name": "flore.js", "count": 50},
                                            {"name": "util.js", "count": 455}
                                        ]
                                    },
                                    {
                                        "name": "view",
                                        "children": [
                                            {"name": "oans.js", "count": 143},
                                            {"name": "zwoa.js", "count": 50},
                                            {"name": "drie.js", "count": 455}
                                        ]
                                    }]
                            }
                        ]
                    }]
            };
            $scope.dependency = {
                items: [
                    {name: "London"},
                    {name: "Miami"},
                    {name: "Wuppertal"},
                    {name: "Bochum"}],
                matrix: [[1, 0, 0, 2], [0, 1, 2, 0], [0, 0, 1, 0], [2, 2, 0, 1]]
            };
        }]);
})();
