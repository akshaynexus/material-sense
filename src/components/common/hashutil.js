const hashformat = (value, decimal, unit, fsymbol = true) => {
  if (decimal === 0) {
    return value + unit;
  } else {
    var si = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "k" },
      { value: 1e6, symbol: "M" },
      { value: 1e9, symbol: "G" },
      { value: 1e12, symbol: "T" },
      { value: 1e15, symbol: "P" },
      { value: 1e18, symbol: "E" },
      { value: 1e21, symbol: "Z" },
      { value: 1e24, symbol: "Y" },
    ];
    for (var i = si.length - 1; i > 0; i--) {
      if (value >= si[i].value) {
        break;
      }
    }
    return fsymbol
      ? (value / si[i].value)
        .toFixed(decimal)
        .replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") +
      " " +
      si[i].symbol +
      unit
      : (value / si[i].value)
        .toFixed(decimal)
        .replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1");
  }
};
export default hashformat;
