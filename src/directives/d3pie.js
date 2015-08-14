angular.module('de.devjs.angular.d3pie', [])
    .directive('d3pie', ['$timeout', '$http', '$compile', function ($timeout, $http, $compile) {
        return {
            restrict: 'E',
            scope: {
                data: '='
            },
            link: function (scope, element, attrs) {
                var width = attrs.width || 350,
                    height = attrs.height || 350,
                    radius = Math.min(width, height) / 2;

                var color = d3.scale.ordinal().range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

                var pie = d3.layout.pie()
                    .sort(null)
                    .value(function (d) {
                        return d.count;
                    });

                var svg = d3.select(element[0])
                    .append("svg")
                    .append("g")
                    .attr('class', 'outerGroup');

                scope.$watch('data', function () {
                    if (scope.data) {
                        populate(scope.data);
                    }
                });

                function populate(data) {
                    var parent = element.parent()[0];
                    width = parent.clientWidth - 20;
                    height = parent.clientHeight - 20;
                    radius = Math.min(width, height) / 3;

                    var d3Element = d3.select(element[0]);

                    d3Element
                        .select('svg')
                        .attr('width', width)
                        .attr('height', height)
                        .select('g.outerGroup')
                        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

                    var arc = d3.svg.arc()
                        .outerRadius(radius - 10)
                        .innerRadius(0);

                    var g = svg.selectAll(".arc");
                    g.remove();

                    g = svg.selectAll(".arc")
                        .data(pie(data))
                        .enter().append("g")
                        .attr("class", "arc");

                    g.append("path")
                        .attr("d", arc)
                        .style("fill", function (d) {
                            return color(d.data.name);
                        });

                    g.append("text")
                        .attr("transform", function (d) {
                            var c = arc.centroid(d),
                                x = c[0],
                                y = c[1],
                                h = Math.sqrt(x*x + y*y);
                            return "translate(" + (x/h * radius) +  ',' + (y/h * radius) +  ")";
                        })
                        .attr("text-anchor", function(d) {
                            // are we past the center?
                            return (d.endAngle + d.startAngle)/2 > Math.PI ?
                                "end" : "start";
                        })
                        .style("text-anchor", "middle")
                        .text(function (d) {
                            return d.data.name + ': ' + d.data.count + '%';
                        });
                }
            }
        }
    }
    ]);

