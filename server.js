const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;

const API_KEY = "d8b0oi9r01qk20sp60j0d";

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

// LIVE PRICE
const quoteRes = await fetch(
`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`
);

const quote = await quoteRes.json();

const price = quote.c;

if (!price || price <= 0) continue;

// FAKE RSI FOR NOW
const rsi = Math.floor(Math.random() * 25) + 50;

// RELATIVE VOLUME
const rvol = (Math.random() * 2 + 1).toFixed(1);

// SCORE
const score =
Math.floor(rsi) +
Math.floor(parseFloat(rvol) * 40);

// VOLUME
const volume =
(Math.random() * 300 + 20).toFixed(1) + "M";

results.push({
symbol,
price: price.toFixed(2),
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
}

results.sort((a, b) => b.score - a.score);

res.json({
scanned: stocks.length,
passed: results.length,
bestScore: results[0]?.score || 0,
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