const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.static(__dirname));

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

const data = await response.json();

const price = data.c;

if (!price) continue;

if (price < 1 || price > 50) continue;

const rsi = Math.floor(Math.random() * 40) + 40;
const rvol = (Math.random() * 2 + 0.5).toFixed(1);
const rs = Math.floor(Math.random() * 60);
const volume = (Math.random() * 300 + 10).toFixed(1);

const score =
rsi +
(parseFloat(rvol) * 25) +
rs;

results.push({
symbol,
price: price.toFixed(2),
rsi,
rvol,
volume,
rs,
score: Math.floor(score)
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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

console.log("SERVER RUNNING");

});