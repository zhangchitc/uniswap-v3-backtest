// get results for last 25 days
import uniswapStrategyBacktest from './index.mjs';
const backtestResults = await uniswapStrategyBacktest(
    "0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640", 1000, 2120.09, 2662.99, {days: 25, period: "daily"});
console.log(backtestResults);