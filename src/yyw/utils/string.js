var yyw;
(function (yyw) {
    function sliceString(value, size = 6, asciiAsHalf = true) {
        if (asciiAsHalf) {
            const chars = [];
            const maxIndex = value.length;
            let n = size * 2;
            let i = 0;
            while (n > 0 && i <= maxIndex) {
                const char = value.charAt(i++);
                n--;
                if (char.charCodeAt(0) > 255) {
                    n--;
                }
                chars.push(char);
            }
            return chars.join("");
        }
        return value.substring(0, size);
    }
    yyw.sliceString = sliceString;
    function zeroPadding(str, size) {
        const padding = "0000000000";
        return `${padding.slice(0, size - str.length)}${str}`;
    }
    yyw.zeroPadding = zeroPadding;
})(yyw || (yyw = {}));
