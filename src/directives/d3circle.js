angular.module('de.devjs.angular.d3circle', [])
    .directive('d3circle', ['$timeout', '$http', '$compile', function ($timeout, $http, $compile) {
        return {
            restrict: 'E',
            scope: {
                data: '='
            },
            link: function (scope, element, attrs) {

                var diameter = attrs.diameter,
                    format = d3.format(",d");

                var pack = d3.layout.pack()
                    .size([diameter - 4, diameter - 4])
                    .value(function (d) {
                        return d.count;
                    });

                var svg = d3.select(element[0]).append("svg")
                    .attr("width", diameter)
                    .attr("height", diameter)
                    .append("g")
                    .attr("transform", "translate(2,2)");

                d3.select(self.frameElement).style("height", diameter + "px");

                scope.$watch('data', function () {
                    populate(scope.data);
                });

                function populate(root) {
                    var node = svg.datum(root).selectAll(".node")
                        .data(pack.nodes)
                        .enter().append("g")
                        .attr("class", function (d) {
                            return d.children ? "node" : "leaf node";
                        })
                        .attr("transform", function (d) {
                            return "translate(" + d.x + "," + d.y + ")";
                        });

                    node.append("title")
                        .text(function (d) {
                            return d.name + (d.children ? "" : ": " + format(d.count));
                        });
                    node.append("circle")
                        .attr("r", function (d) {
                            return d.r;
                        });
                    node.filter(function (d) {
                        return !d.children;
                    }).append("text")
                        .attr("dy", ".3em")
                        .style("text-anchor", "middle")
                        .text(function (d) {
                            return d.name.substring(0, d.r / 3);
                        });
                };
            }
        }
    }
    ]);
