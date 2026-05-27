function addResultCard(ticker, price, rsi){

const container =
document.getElementById("results");

const card =
document.createElement("div");

card.style.background = "#1a1f2e";
card.style.border = "1px solid #333";
card.style.padding = "14px";
card.style.marginTop = "10px";
card.style.borderRadius = "10px";

card.innerHTML = `
<h3>${ticker}</h3>
<div>Price: $${price.toFixed(2)}</div>
<div>RSI: ${rsi.toFixed(1)}</div>
`;

container.appendChild(card);

}
