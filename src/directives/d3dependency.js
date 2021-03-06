angular.module('de.devjs.angular.d3dependency', [])
    .directive('d3dependency', [function () {
        return {
            restrict: 'E',
            scope: {
                data: '='
            },
            templateUrl: '/src/views/dependency.html',
            link: function (scope, element, attrs) {

                scope.update = function () {
                    populate(filterByDependencies(scope.data));
                }

                //slider should filter and repopulate
                scope.$watch('data', function () {
                    if (scope.data) {
                        populate(filterByDependencies(scope.data));
                    }
                });

                function filterByDependencies(data) {
                    var actual = angular.copy(data);
                    var mapping = sumDependencies(actual.matrix);
                    mapping
                        .filter(function (m) {
                            return m.sum <= actual.min
                        })
                        .map(function (m) {
                            return m.index;
                        })
                        .reverse()
                        .forEach(function (m) {
                            actual.matrix.forEach(function (item) {
                                item.splice(m, 1)
                            });
                            actual.matrix.splice(m, 1);
                            actual.items.splice(m, 1);
                        });
                    return actual;


                    function sumDependencies(matrix) {
                        var result = [];
                        matrix.forEach(function (row, i) {
                            var sumX = row.reduce(function (a, b) {
                                return a + b;
                            });

                            var sumY = matrix.reduce(function (a, b) {
                                return a + b[i];
                            }, 0);

                            result.push({index: i, sum: sumX + sumY});
                        });

                        return result;
                    }
                }

                function populate(data) {
                    var width, height,
                        parent = element.parent()[0],
                        items = data.items,
                        matrix = data.matrix;

                    if(data.items.length <= 0){
                        return;
                    }

                    if (!attrs.diameter) {
                        width = parent.clientWidth - 20;
                        height = parent.clientHeight - 20;
                    } else {
                        width = attrs.diameter;
                        height = attrs.diameter;
                    }

                    var outerRadius = Math.min(width, height) / 2 - 10,
                        innerRadius = outerRadius - 24;

                    d3.select(element[0]).selectAll('svg').remove();

                    var arc = d3.svg.arc()
                        .innerRadius(innerRadius)
                        .outerRadius(outerRadius);

                    var layout = d3.layout.chord()
                        .padding(.04)
                        .sortSubgroups(d3.descending)
                        .sortChords(d3.ascending);

                    var path = d3.svg.chord()
                        .radius(innerRadius);

                    var svg = d3.select(element[0])
                        .append("svg")
                        .on("click", deselect)
                        .attr("width", width)
                        .attr("height", height)
                        .append("g")
                        .attr("id", "circle")
                        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

                    svg.append("circle")
                        .attr("r", outerRadius);

                    // Compute the chord layout.
                    layout.matrix(matrix);

                    // Add a group per neighborhood.
                    var group = svg.selectAll(".group")
                        .data(layout.groups)
                        .enter().append("g")
                        .attr("class", "group")
                        .on("mouseover", mouseover);

                    // Add a mouseover title.
                    group.append("title").text(function (d, i) {
                        return items[i].name + " --> " + (d.value);
                    });

                    // Add the group arc.
                    var groupPath = group.append("path")
                        .attr("id", function (d, i) {
                            return "group" + i;
                        })
                        .attr("d", arc);

                    // Add a text label.
                    var groupText = group.append("text")
                        .attr("x", 6)
                        .attr("dy", 15);

                    groupText.append("textPath")
                        .attr("xlink:href", function (d, i) {
                            return "#group" + i;
                        })
                        .text(function (d, i) {
                            return items[i].name;
                        });

                    // Remove the labels that don't fit. :(
                    groupText.filter(function (d, i) {
                        return groupPath[0][i].getTotalLength() / 2 - 16 < this.getComputedTextLength();
                    }).remove();

                    // Add the chords.
                    var chord = svg.selectAll(".chord")
                        .data(layout.chords)
                        .enter().append("path")
                        .attr("d", path)
                        .attr("class", function (d) {
                            if (d.source !== d.target
                                && d.source.value > 0 && d.target.value > 0)
                                return " cycle";
                            else return " chord";
                        });

                    // Add an elaborate mouseover title for each chord.
                    chord.append("title").text(function (d) {
                        var label = items[d.source.index].name
                            + " --> " + items[d.target.index].name
                            + "(" + d.source.value + ")";

                        if (d.source !== d.target
                            && d.source.value > 0 && d.target.value > 0) {
                            label += "\n"
                                + items[d.target.index].name
                                + " --> " + items[d.source.index].name
                                + "(" + d.target.value + ")";
                        }
                        return label;
                    });


                    function deselect(d, i) {
                        chord.classed("fade", function (p) {
                            return false;
                        });
                    }

                    function mouseover(d, i) {
                        chord.classed("fade", function (p) {
                            return p.source.index != i
                                && p.target.index != i;
                        });
                    }
                }
            }
        }
    }
    ]);

