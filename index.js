function checkCashRegister(price, cash, cid) {
  // cid = Cash In Drawer
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

  // find and specify change, remove from cash register
  var change = []; // actual coins to be given to customer (in pennies)

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

  // Return result
  // if no match
  if (change.reduce((a, b) => a + b) !== constant) {
    return { status: "INSUFFICIENT_FUNDS", change: [] };
  }

  // if exact match
  if (cid.reduce((acc, el) => acc + el[1], 0) === 0) {
    return { status: "CLOSED", change: originalCid };
  }

  // if match can be made with some of cid
  var count = change.reduce((tally, coin) => {
    tally[coin] = (tally[coin] || 0) + coin;
    return tally;
  }, {});

  var countArray = [];
  for (let key in count) {
    countArray.push([coinNames[coinVals.indexOf(+key)], count[key] / 100]);
  }

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

console.log(
  checkCashRegister(19.5, 20, [
    ["PENNY", 0.01],
    ["NICKEL", 0],
    ["DIME", 0],
    ["QUARTER", 0],
    ["ONE", 1],
    ["FIVE", 0],
    ["TEN", 0],
    ["TWENTY", 0],
    ["ONE HUNDRED", 0],
  ])
); // insufficient funds

console.log(
  checkCashRegister(19.5, 20, [
    ["PENNY", 0.5],
    ["NICKEL", 0],
    ["DIME", 0],
    ["QUARTER", 0],
    ["ONE", 0],
    ["FIVE", 0],
    ["TEN", 0],
    ["TWENTY", 0],
    ["ONE HUNDRED", 0],
  ])
); // closed (exact change)
