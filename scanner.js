async function scanMarket() {

const resultsDiv = document.getElementById("results");

resultsDiv.innerHTML = "<h2>SCANNING...</h2>";

try {

response = await fetch("/scan");

const data = await response.json();

document.getElementById("scanned").innerText = data.scanned || 0;
document.getElementById("passed").innerText = data.passed || 0;
document.getElementById("watchlist").innerText = 0;
document.getElementById("bestScore").innerText = data.bestScore || 0;

resultsDiv.innerHTML = "";

if (!data.results || data.results.length === 0) {

resultsDiv.innerHTML = "<h2>NO RESULTS</h2>";

return;
}

data.results.forEach(stock => {

let breakoutLabel = "NORMAL";
let breakoutColor = "#64748b";

if (stock.score >= 150) {

breakoutLabel = "BREAKOUT";
breakoutColor = "#ff3131";

} else if (stock.score >= 120) {

breakoutLabel = "MOMENTUM";
breakoutColor = "#39ff14";
}

// TRADE PLAN

const entry = (stock.price * 1.02).toFixed(2);

const stop = (stock.price * 0.95).toFixed(2);

const risk = entry - stop;

const tp1 = (Number(entry) + (risk * 2)).toFixed(2);

const tp2 = (Number(entry) + (risk * 4)).toFixed(2);

const rr = ((tp2 - entry) / risk).toFixed(1);

const card = document.createElement("div");

card.className = "card";

card.innerHTML = `

<div style="
background:${breakoutColor};
color:black;
text-align:center;
padding:6px;
border-radius:8px;
font-weight:bold;
margin-bottom:14px;
">
${breakoutLabel}
</div>

<h2>${stock.symbol}</h2>

<p>Price: $${stock.price}</p>

<p>RSI: ${stock.rsi}</p>

<p>RVOL: ${stock.rvol}</p>

<p>Volume: ${stock.volume}M</p>

<p>RS: ${stock.rs}</p>

<p>Score: ${stock.score}</p>

<hr style="
border:0;
border-top:1px solid #334155;
margin:14px 0;
">

<p style="color:#39ff14">
ENTRY: $${entry}
</p>

<p style="color:#ff4d4d">
STOP: $${stop}
</p>

<p style="color:#00e5ff">
TP1: $${tp1}
</p>

<p style="color:#ffd700">
TP2: $${tp2}
</p>

<p>
RR: 1:${rr}
</p>

<button class="chart-btn"
onclick="window.open(
'https://www.tradingview.com/chart/?symbol=NASDAQ:${stock.symbol}',
'_blank'
)">
CHART
</button>

<button class="watch-btn">
WATCHLIST
</button>

`;

resultsDiv.appendChild(card);

});

} catch (err) {

console.log(err);

resultsDiv.innerHTML = "<h2>SERVER ERROR</h2>";
}
}