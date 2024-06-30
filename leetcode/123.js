function maxProfit(prices) {
  let minPrice = prices[0]
  let profit = 0;
  for (let i = 1; i < prices.length; i++) {
    console.log(prices[i]);
    if (minPrice > prices[i]) {
      minPrice = prices[i]
    } else {
      if (prices[i] - minPrice > profit) {
        profit = prices[i] - minPrice
      }
    }
  }

  return profit

}

console.log('result = ', maxProfit([7, 1, 5, 3, 6, 4]));
