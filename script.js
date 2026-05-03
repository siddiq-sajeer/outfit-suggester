document.getElementById("btn").addEventListener("click", async function() {
  const gender = document.getElementById("gender").value;
  const occasion = document.getElementById("occasion").value;
  const budget = document.getElementById("budget").value;
  const color = document.getElementById("color").value;
  const style = document.getElementById("style").value;

  document.getElementById("result").innerHTML = `
    <div style="text-align:center; color:#7f77dd;">
      ✨ Finding your perfect outfits...
    </div>`;

  const apiKey = "key here";

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `You are a fashion expert. Suggest exactly 3 outfits,no less no more, for:
          - Gender: ${gender}
          - Occasion: ${occasion}
          - Budget: ${budget}
          - Favourite colour: ${color}
          - Style: ${style}

          Reply in this EXACT format for all 3 outfits:

          OUTFIT 1: [catchy outfit name]
          TOP: [top wear]
          INNERWEAR:[inner wear]
          BOTTOM: [bottom wear]
          FOOTWEAR: [footwear]
          ACCESSORY: [one accessory]
          TIP: [one styling tip]

          OUTFIT 2: [catchy outfit name]
          TOP: [top wear]
          INNERWEAR:[inner wear]
          BOTTOM: [bottom wear]
          FOOTWEAR: [footwear]
          ACCESSORY: [one accessory]
          TIP: [one styling tip]

          OUTFIT 3: [catchy outfit name]
          TOP: [top wear]
          INNERWEAR:[inner wear]
          BOTTOM: [bottom wear]
          FOOTWEAR: [footwear]
          ACCESSORY: [one accessory]
          TIP: [one styling tip]
        IMPORTANT: Give ONLY 3 outfits. Stop after OUTFIT3_END. Do not add any extra outfits.
          Keep it practical and shoppable in India.`
        }]
      }]
    })
  });

  const data = await response.json();
  const text = data.candidates[0].content.parts[0].text;

  const outfits = text.trim().split(/OUTFIT \d+:/g).filter(o => o.trim());

  const titles = [...text.matchAll(/OUTFIT \d+:\s*(.+)/g)].map(m => m[1].trim());

  const icons = ["👗", "✨", "🌟"];
  const colors = ["#f5f0ff", "#fff0f5", "#f0f5ff"];
  const borders = ["#7f77dd", "#dd77a8", "#7799dd"];

  let html = `<p style="font-size:13px; color:#888; margin:0 0 16px;">Here are 3 outfits picked just for you 👇</p>`;

  outfits.forEach((outfit, i) => {
    const lines = outfit.trim().split('\n').filter(l => l.trim());
    let cardContent = '';

   lines.forEach(line => {
if (line.includes('TOP:')) 
    {
    cardContent += `<div class="outfit-row"><span class="outfit-label">👕 Top</span><span class="outfit-value">${line.replace('TOP:', '').trim()}</span></div>`;
  } else if (line.includes('INNERWEAR:')) {
    cardContent += `<div class="outfit-row"><span class="outfit-label">👔 Innerwear</span><span class="outfit-value">${line.replace('INNERWEAR:', '').trim()}</span></div>`;
  } else if (line.includes('BOTTOM:')) {
    cardContent += `<div class="outfit-row"><span class="outfit-label">👖 Bottom</span><span class="outfit-value">${line.replace('BOTTOM:', '').trim()}</span></div>`;
  } else if (line.includes('FOOTWEAR:')) {
    cardContent += `<div class="outfit-row"><span class="outfit-label">👟 Footwear</span><span class="outfit-value">${line.replace('FOOTWEAR:', '').trim()}</span></div>`;
  } else if (line.includes('ACCESSORY:')) {
    cardContent += `<div class="outfit-row"><span class="outfit-label">💍 Accessory</span><span class="outfit-value">${line.replace('ACCESSORY:', '').trim()}</span></div>`;
  } else if (line.includes('TIP:')) {
    cardContent += `<div class="outfit-tip">💡 ${line.replace('TIP:', '').trim()}</div>`;
  }


  if (line.includes('TIP:')) {
    cardContent += `<div class="outfit-tip">💡 ${line.replace('TIP:', '').trim()}</div>`;
} else if (line.includes('TOP:') || line.includes('INNERWEAR') || line.includes('BOTTOM:') || line.includes('FOOTWEAR:')) {
    const item = line.split(':')[1].trim();
    const query = encodeURIComponent(item);
    cardContent += `
      <div class="shop-links">
        🛍️ Shop:
        <a href="https://www.myntra.com/${query}" target="_blank">Myntra</a>
        <a href="https://www.meesho.com/search?q=${query}" target="_blank">Meesho</a>
        <a href="https://www.amazon.in/s?k=${query}" target="_blank">Amazon</a>
      </div>`;
}
});

    html += `
      <div class="outfit-card" style="border-color:${borders[i]}; background:${colors[i]}">
        <div class="outfit-title" style="color:${borders[i]}">${icons[i]} Outfit ${i+1}: ${titles[i] || ''}</div>
        ${cardContent}
      </div>`;
  });

  document.getElementById("result").innerHTML = html;

});