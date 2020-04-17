function checkCashRegister(price, cash, cid) {
  var changeRequired = cash * 100 - price * 100; // decreases as coins are gathered
  const constant = changeRequired; // remains the same
  const originalCid = JSON.parse(JSON.stringify(cid)); // remains the same
  var coinVals = [1, 5, 10, 25, 100, 500, 1000, 2000, 10000]; // pennies
  var coinNames = [
    "PENNY",
    "NICKEL",
    "DIME",
    "QUARTER",
    "ONE",
    "FIVE",
    "TEN",
    "TWENTY",
    "ONE HUNDRED",
  ];
  let change = []; // actual coins to be given to customer (pennies)

  for (let i = coinVals.length - 1; i >= 0; i--) {
    while (
      changeRequired >= coinVals[i] &&
      cid[i][1] > 0 &&
      changeRequired > 0
    ) {
      change.push(coinVals[i]);
      cid[i][1] =
        Math.round((cid[i][1] - coinVals[i] / 100 + Number.EPSILON) * 100) /
        100;
      changeRequired -= coinVals[i];
    }
  }

  if (change.reduce((a, b) => a + b) !== constant) {
    return { status: "INSUFFICIENT_FUNDS", change: [] };
  }

  if (cid.reduce((acc, el) => acc + el[1], 0) === 0) {
    return { status: "CLOSED", change: originalCid };
  }

  // console.log(change);
  var count = change.reduce((tally, coin) => {
    var name = coinNames[coinVals.indexOf(coin)];
    // console.log(name);
    tally[coin] = (tally[coin] || 0) + coin;
    return tally;
  }, {});

  var countArray = [];

  for (let key in count) {
    countArray.push([coinNames[coinVals.indexOf(+key)], count[key] / 100]);
  }

  // console.log(countArray);
  countArray.sort((a, b) => b[1] - a[1]);
  return { status: "OPEN", change: countArray };
}

console.log(
  checkCashRegister(3.26, 100, [
    ["PENNY", 1.01],
    ["NICKEL", 2.05],
    ["DIME", 3.1],
    ["QUARTER", 4.25],
    ["ONE", 90],
    ["FIVE", 55],
    ["TEN", 20],
    ["TWENTY", 60],
    ["ONE HUNDRED", 100],
  ])
); // 96.74
