document.getElementById("btn").addEventListener("click", async function () {

  const language = document.getElementById("language").value;
  const gender = document.getElementById("gender").value;
  const occasion = document.getElementById("occasion").value;
  const color = document.getElementById("color").value;
  const style = document.getElementById("style").value;
  const budget = document.getElementById("budget").value;
  const photoFile = document.getElementById("photo").files[0];

  // Show results section with loading
  document.getElementById("results-section").style.display = "block";
  document.getElementById("result").innerHTML = `
    <div class="loading-state">
      <div class="loading-dots">
        <span></span><span></span><span></span>
      </div>
      <div class="loading-text">AI is curating your outfits...</div>
    </div>`;

  document.getElementById("results-section").scrollIntoView({ behavior: "smooth" });

  // Handle photo upload
  let photoBase64 = null;
  if (photoFile) {
    photoBase64 = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.readAsDataURL(photoFile);
    });
  }

  const apiKey = "key here";

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        parts: [
          ...(photoBase64 ? [{
            inline_data: { mime_type: photoFile.type, data: photoBase64 }
          }] : []),
          {
            text: `You are a fashion expert. ${photoBase64 ?
              'Look at this person in the photo and suggest outfits based on their appearance, skin tone and body type.' :
              'Suggest 3 outfits based on the preferences below.'}

            - Reply in this language: ${language}
            - Gender: ${gender}
            - Occasion: ${occasion}
            - Favourite colour: ${color}
            - Style: ${style}
            - Budget: ${budget}

            You MUST reply in this EXACT format:

            OUTFIT1_START
            NAME: [catchy outfit name]
            TOP: [top wear]
            BOTTOM: [bottom wear]
            FOOTWEAR: [footwear]
            ACCESSORY: [one accessory]
            TIP: [one styling tip]
            OUTFIT1_END

            OUTFIT2_START
            NAME: [catchy outfit name]
            TOP: [top wear]
            BOTTOM: [bottom wear]
            FOOTWEAR: [footwear]
            ACCESSORY: [one accessory]
            TIP: [one styling tip]
            OUTFIT2_END

            OUTFIT3_START
            NAME: [catchy outfit name]
            TOP: [top wear]
            BOTTOM: [bottom wear]
            FOOTWEAR: [footwear]
            ACCESSORY: [one accessory]
            TIP: [one styling tip]
            OUTFIT3_END

            IMPORTANT: Give ONLY 3 outfits. Keep it practical and shoppable in India.`
          }
        ]
      }]
    })
  });

  const data = await response.json();
  const text = data.candidates[0].content.parts[0].text;

  const icons = ["👔", "✨", "🌟"];
  const outfitBlocks = [
    text.match(/OUTFIT1_START([\s\S]*?)OUTFIT1_END/),
    text.match(/OUTFIT2_START([\s\S]*?)OUTFIT2_END/),
    text.match(/OUTFIT3_START([\s\S]*?)OUTFIT3_END/)
  ];

  let html = "";

  outfitBlocks.forEach((block, i) => {
    if (!block) return;
    const content = block[1].trim();
    const lines = content.split("\n").map(l => l.trim()).filter(l => l);

    let name = "", top = "", bottom = "", footwear = "", accessory = "", tip = "";

    lines.forEach(line => {
      if (line.startsWith("NAME:")) name = line.replace("NAME:", "").trim();
      else if (line.startsWith("TOP:")) top = line.replace("TOP:", "").trim();
      else if (line.startsWith("BOTTOM:")) bottom = line.replace("BOTTOM:", "").trim();
      else if (line.startsWith("FOOTWEAR:")) footwear = line.replace("FOOTWEAR:", "").trim();
      else if (line.startsWith("ACCESSORY:")) accessory = line.replace("ACCESSORY:", "").trim();
      else if (line.startsWith("TIP:")) tip = line.replace("TIP:", "").trim();
    });

    const topQuery = encodeURIComponent(top);
    const bottomQuery = encodeURIComponent(bottom);
    const footwearQuery = encodeURIComponent(footwear);

    html += `
      <div class="outfit-card">
        <div class="card-header">
          <div class="card-num">0${i + 1}</div>
          <div class="card-name">${name}</div>
          <div class="card-icon">${icons[i]}</div>
        </div>
        <div class="card-body">
          <div class="outfit-row">
            <span class="outfit-label">👕 Top</span>
            <span class="outfit-value">${top}</span>
          </div>
          <div class="outfit-row">
            <span class="outfit-label">👖 Bottom</span>
            <span class="outfit-value">${bottom}</span>
          </div>
          <div class="outfit-row">
            <span class="outfit-label">👟 Footwear</span>
            <span class="outfit-value">${footwear}</span>
          </div>
          <div class="outfit-row">
            <span class="outfit-label">💍 Accessory</span>
            <span class="outfit-value">${accessory}</span>
          </div>
        </div>
        ${tip ? `<div class="outfit-tip">💡 ${tip}</div>` : ""}
        <div class="shop-section">
          <span class="shop-label">Shop</span>
          <div class="shop-links">
            <a href="https://www.myntra.com/${topQuery}" target="_blank">Myntra</a>
            <a href="https://www.meesho.com/search?q=${topQuery}" target="_blank">Meesho</a>
            <a href="https://www.amazon.in/s?k=${topQuery}" target="_blank">Amazon</a>
          </div>
        </div>
        <div class="card-footer">
          <a class="share-btn" href="https://wa.me/?text=${encodeURIComponent(`Check out this outfit!\n\n${name}\n👕 ${top}\n👖 ${bottom}\n👟 ${footwear}\n💍 ${accessory}\n\n💡 ${tip}\n\nGenerated by DRIP AI`)}" target="_blank">
            📲 Share on WhatsApp
          </a>
        </div>
      </div>`;
  });

  document.getElementById("result").innerHTML = html;
});