'use strict';

//FIXME: dublicate code
function extractChortData(data) {
    return {
        items: extractItems().map(function (item) {
            return {name: item.split("/").pop()};
        }),
        matrix: createChortMatrix()
    };

    function extractItems() {
        var items = Object.keys(data);

        items.forEach(function (key) {
            data[key].forEach(function (value, index) {
                if (items.indexOf(value, index + 1) < 0) {
                    items.push(value);
                }
            });
        });
        return items;
        ;
    }

    function createChortMatrix() {
        var matrix = [], items = extractItems();

        items.forEach(function () {
            var d = [], i = 0;
            while (i < items.length) {
                d[i++] = 0;
            }
            matrix.push(d);
        });
        items.forEach(function (key, i) {
            if (data[key]) {
                data[key].forEach(function (value, j) {
                    if (items.indexOf(value, j + 1) < 0) {
                    } else {
                        matrix[i][items.indexOf(value)] = matrix[i][items.indexOf(value)] += 1;
                    }
                });
            }
        });
        return matrix;
    }
}

function filterByDependencies(actual, min) {
    console.log('enter', actual.items.length);
    var mapping = sumDependencies(actual.matrix);
    mapping
        .filter(function (m) {
            return m.sum <= min
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

describe('a service that provides file dependencies', function () {

    it('should create a dependency matrix', function (done) {
        var input = {
            "anything": ["something", "anyhow"],
            "something": ["anyhow", "incoming"],
            "anyhow": []
        };
        var expected = {
            "matrix": [[0, 1, 1, 0], [0, 0, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]]
        };

        JSON.stringify(extractChortData(input).matrix).should.equal(JSON.stringify(expected.matrix));
        done();
    })

    it('should identify sum of a row', function (done) {
        var input = {
            "anything": ["something", "anyhow"],
            "something": ["anyhow", "incoming"],
            "anyhow": [],
            "toBeRemoved": []
        };
        var expected = {
            "matrix": [[0, 1, 1, 0], [0, 0, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]]
        };

        var actual = filterByDependencies(extractChortData(input), 0);
        JSON.stringify(actual.matrix).should.equal(JSON.stringify(expected.matrix));
        actual.items.should.containDeep([{name: "anything"}, {name: "something"}, {name: "anyhow"}, {name: "incoming"}]);

        actual = filterByDependencies(extractChortData(input), 1);
        actual.items.should.containDeep([{name: "anything"}, {name: "something"}, {name: "anyhow"}]);

        actual = filterByDependencies(extractChortData(input), 100000);
        actual.items.should.be.empty();
        done();
    });


    it('should extract dependency item names (js files and libs)', function (done) {
        var input = {
            "anything": ["something", "anyhow"],
            "something": ["anyhow", "incoming"],
            "anyhow": []
        };
        var expected = {
            "items": [{name: 'anything'}, {name: 'something'}, {name: 'anyhow'}, {name: 'incoming'}]
        };

        JSON.stringify(extractChortData(input).items).should.equal(JSON.stringify(expected.items));
        done();
    });
})
;
