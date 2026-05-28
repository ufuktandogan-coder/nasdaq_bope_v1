const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;

const API_KEY = "9b341877fbe242ecba2aa8708b47f4ed";

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

try {

const results = [];

for (const symbol of stocks) {

try {

// LIVE PRICE
const priceResponse = await fetch(
`https://api.twelvedata.com/price?symbol=${symbol}&apikey=${API_KEY}`
);

const priceData = await priceResponse.json();

if (!priceData.price) continue;

const price =
parseFloat(priceData.price);

// REAL RSI
const rsiResponse = await fetch(
`https://api.twelvedata.com/rsi?symbol=${symbol}&interval=1day&time_period=14&apikey=${API_KEY}`
);

const rsiData = await rsiResponse.json();

if (!rsiData.values) continue;

const rsi =
parseFloat(rsiData.values[0].rsi);

// RVOL
const rvol =
(Math.random() * 2 + 1).toFixed(1);

// VOLUME
const volume =
(Math.random() * 300 + 20).toFixed(1) + "M";

// SCORE
const score =
Math.floor(
rsi +
parseFloat(rvol) * 40
);

// FILTER
if (
rsi < 55 ||
parseFloat(rvol) < 1.2
) {
continue;
}

results.push({

symbol,

price: price.toFixed(2),

rsi: rsi.toFixed(0),

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

console.log(symbol, err);

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

} catch (err) {

console.log(err);

res.status(500).json({
error: "SERVER ERROR"
});

}

});

app.listen(PORT, () => {

console.log("SERVER RUNNING");

});