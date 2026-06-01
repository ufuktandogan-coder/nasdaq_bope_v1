const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;

const API_KEY = "9b341877fbe242ecba2aa8708b47f4ed";

const stocks = require("./universe");


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

// REAL VOLUME

const volumeResponse = await fetch(
`https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&outputsize=5&apikey=${API_KEY}`
);

const volumeData = await volumeResponse.json();

if (!volumeData.values) continue;

const todayVolume = parseInt(volumeData.values[0].volume);

const avgVolume =
volumeData.values
.slice(1, 5)
.reduce((sum, day) => sum + parseInt(day.volume), 0) / 4;

const rvol = (todayVolume / avgVolume).toFixed(2);
const rvol = (todayvolume / avgVolume).toFixed(2);
console.log (
    symbol,
    "RS :", rsi,
    "TODAY:" , todayVolume,
    "AVG:", avgVolume,
    "RVOL:", rvol 

) ;

const volume =
(todayVolume / 1000000).toFixed(1) + "M";


// SCORE
const score =
Math.floor(
rsi +
parseFloat(rvol) * 40
);

// FILTER
if (
rsi < 40 ||
parseFloat(rvol) < 0.5
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