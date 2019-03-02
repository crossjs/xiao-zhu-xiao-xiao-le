var yyw;
(function (yyw) {
    function sliceString(value, size, asciiAsHalf) {
        if (size === void 0) { size = 6; }
        if (asciiAsHalf === void 0) { asciiAsHalf = true; }
        if (asciiAsHalf) {
            var chars_1 = [];
            var maxIndex = value.length;
            var n = size * 2;
            var i = 0;
            while (n > 0 && i <= maxIndex) {
                var char = value.charAt(i++);
                n--;
                if (char.charCodeAt(0) > 255) {
                    n--;
                }
                chars_1.push(char);
            }
            return chars_1.join("");
        }
        return value.substring(0, size);
    }
    yyw.sliceString = sliceString;
    function zeroPadding(str, size) {
        var padding = "0000000000";
        return "" + padding.slice(0, size - str.length) + str;
    }
    yyw.zeroPadding = zeroPadding;
})(yyw || (yyw = {}));
