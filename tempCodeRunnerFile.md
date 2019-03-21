const typesMap = {
  "●": 1,
  "○": 2,
  "≡": 4,
  "×": 8,
};
const matrix = `
● ● ● ● ● ●
● × ● ● × ●
● ● ● ● ● ●
● ● ● ● ● ●
● × ● ● × ●
● ● ● ● ● ●
`
.replace(/^\s| +|\s$/g, "")
.split(/[\r\n]+/)
.map((line, row) => line.split("").map((v, col) => typesMap[v]))

console.log(matrix);