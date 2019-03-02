var yyw;
(function (yyw) {
    function matrixEach(matrix, handler) {
        var rows = matrix.length;
        for (var row = 0; row < rows; row++) {
            var r = matrix[row];
            var cols = r.length;
            for (var col = 0; col < cols; col++) {
                handler(r[col], col, row);
            }
        }
    }
    yyw.matrixEach = matrixEach;
})(yyw || (yyw = {}));
