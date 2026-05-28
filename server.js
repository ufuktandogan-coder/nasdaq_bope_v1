const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

const API_KEY = "d8b0oi9r01qk20sp60j0d8b0oi9r01qk20sp60jg";

const stocks = [
"SOFI",
"PLTR",
"QS",
"ACHR",
"JOBY",
"SERV",
"BTDR",
"SMR",
"MARA",
"CLSK",
"CHPT",
"ENVX",
"ARQQ",
"RKLB",
"IONQ",
"SOUN",
"OPEN",
"ASTS",
"HIMS",
"RIOT"
];

app.get("/scan", async (req, res) => {

let results = [];

for (const symbol of stocks) {

try {

const response = await fetch(
`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`
);

const quote = await response.json();

const price = quote.c;
const previousClose = quote.pc;

if (!price || !previousClose) {
continue;
}

const changePercent =
((price - previousClose) / previousClose) * 100;

const rsi =
Math.max(
45,
Math.floor(50 + (changePercent * 5))
);

const rvol =
(1 + Math.random() * 2).toFixed(1);

const rs =
Math.max(
40,
Math.floor(50 + (changePercent * 10))
);

const volume =
(50 + Math.random() * 250).toFixed(1);

const score =
Math.floor(
rsi +
(parseFloat(rvol) * 25) +
rs
);

results.push({

symbol,

price: price.toFixed(2),

rsi,

rvol,

volume,

rs,

score,

entry: (price * 1.02).toFixed(2),

stop: (price * 0.95).toFixed(2),

tp1: (price * 1.10).toFixed(2),

tp2: (price * 1.20).toFixed(2),

rr: "1:4.0"

});

} catch (err) {

console.log("ERROR:", symbol);

}

}

results.sort((a, b) => b.score - a.score);

res.json({

scanned: stocks.length,

passed: results.length,

bestScore:
results.length > 0
? results[0].score
: 0,

results

});

});

app.use(express.static(__dirname));

app.listen(3000, () => {

console.log("SERVER RUNNING ON 3000");

});
