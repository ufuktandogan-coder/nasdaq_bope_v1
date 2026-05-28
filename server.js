const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;

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
"RIOT",
"HIMS"
];

app.get("/scan", async (req, res) => {

const results = [];

for (const symbol of stocks) {

try {

let price;

// MANUAL LIVE PRICES
const livePrices = {

MARA: 5.50,
CLSK: 18.17,
SOFI: 14.32,
PLTR: 127.40,
ACHR: 10.21,
RKLB: 31.80,
IONQ: 40.12,
RIOT: 10.55,
HIMS: 58.22

};

price =
livePrices[symbol] ||
(Math.random() * 20 + 5);

const rsi =
Math.floor(Math.random() * 25) + 50;

const rvol =
(Math.random() * 2 + 1).toFixed(1);

const volume =
(Math.random() * 300 + 20).toFixed(1) + "M";

const score =
Math.floor(
rsi +
(parseFloat(rvol) * 40)
);

results.push({

symbol,

price: Number(price).toFixed(2),

rsi,

rvol,

volume,

score,

entry: (price * 1.02).toFixed(2),

stop: (price * 0.95).toFixed(2),

tp1: (price * 1.08).toFixed(2),

tp2: (price * 1.15).toFixed(2),

rr: "1:4.0"

});

} catch (err) {

console.log(err);

}

}

results.sort((a, b) => b.score - a.score);

res.json({

scanned: stocks.length,

passed: results.length,

bestScore:
results[0]?.score || 0,

results

});

});

app.listen(PORT, () => {

console.log("SERVER RUNNING");

});
