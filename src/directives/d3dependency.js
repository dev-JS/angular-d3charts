angular.module('de.devjs.angular.d3dependency', [])
    .directive('d3dependency', [function () {
        return {
            restrict: 'E',
            scope: {
                data: '='
            },
            link: function (scope, element, attrs) {

                scope.$watch('data', function () {
                    if (scope.data) {
                        populate(scope.data.items, scope.data.matrix);
                    }
                });

                function populate(items, matrix) {
                    var width, height,
                        parent = element.parent()[0];
                    if (!attrs.diameter) {
                        width = parent.clientWidth - 20;
                        height = parent.clientHeight - 20;
                    } else {
                        width = attrs.diameter;
                        height = attrs.diameter;
                    }

                    var outerRadius = Math.min(width, height) / 2 - 10,
                        innerRadius = outerRadius - 24;

                    var formatPercent = d3.format(".1%");

                    var arc = d3.svg.arc()
                        .innerRadius(innerRadius)
                        .outerRadius(outerRadius);

                    var layout = d3.layout.chord()
                        .padding(.04)
                        .sortSubgroups(d3.descending)
                        .sortChords(d3.ascending);

                    var path = d3.svg.chord()
                        .radius(innerRadius);

                    var svg = d3.select(element[0]).append("svg")
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
                        return items[i].name + ": " + formatPercent(d.value) + " of origins";
                    });

                    // Add the group arc.
                    var groupPath = group.append("path")
                        .attr("id", function (d, i) {
                            return "group" + i;
                        })
                        .attr("d", arc)
                        .style("fill", function (d, i) {
                            return items[i].color;
                        });

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
                    })
                        .remove();

                    // Add the chords.
                    var chord = svg.selectAll(".chord")
                        .data(layout.chords)
                        .enter().append("path")
                        .attr("class", "chord")
                        .style("fill", function (d) {
                            return items[d.source.index].color;
                        })
                        .attr("d", path);

                    // Add an elaborate mouseover title for each chord.
                    chord.append("title").text(function (d) {
                        return items[d.source.index].name
                            + " ? " + items[d.target.index].name
                            + ": " + formatPercent(d.source.value)
                            + "\n" + items[d.target.index].name
                            + " ? " + items[d.source.index].name
                            + ": " + formatPercent(d.target.value);
                    });

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

