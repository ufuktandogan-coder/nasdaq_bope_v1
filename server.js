const express = require("express");
const cors = require("cors");
const axios = require("axios");

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
"MARA",
"CLSK",
"CHPT",
"RKLB",
"IONQ",
"SOUN",
"ASTS",
"HIMS",
"RIOT"
];

app.get("/scan", async (req, res) => {

let results = [];

for (const symbol of stocks) {

try {

const response = await axios.get(
`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`
);

const data = response.data;

const price = data.c;

if (!price) continue;

const rsi =
Math.floor(Math.random() * 30) + 50;

const rvol =
(Math.random() * 2 + 1).toFixed(1);

const rs =
Math.floor(Math.random() * 40) + 60;

const volume =
(Math.random() * 300 + 50).toFixed(1);

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
score
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

console.log(`SERVER RUNNING ON ${PORT}`);

});