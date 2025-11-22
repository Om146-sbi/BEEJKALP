document.addEventListener("DOMContentLoaded", () => {
  // Navigation buttons
  const navButtons = document.querySelectorAll("nav .nav-btn");
  const sections = document.querySelectorAll(".section");

  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      navButtons.forEach(b => b.classList.remove("active"));
      sections.forEach(s => s.classList.remove("active"));
      btn.classList.add("active");
      const target = document.getElementById(btn.dataset.target);
      if (target) {
        target.classList.add("active");
        target.focus();
      }
    });
  });

  // Chatbot multilingual
  const chatMessages = document.getElementById("chat-messages");
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");
  const voiceBtn = document.getElementById("voice-btn");
  const languageSelect = document.getElementById("language-select");

  function addMessage(text, isUser = false, isTyping = false) {
    const p = document.createElement("p");
    p.classList.add("chat-message");
    p.classList.add(isUser ? "user" : "ai");
    if (isTyping) {
      p.classList.add("typing-indicator");
      p.textContent = text; // "AI is typing..."
    } else {
      p.textContent = text;
    }
    chatMessages.appendChild(p);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return p; // Return the element for potential removal
  }

  const responses = {
    en: {
      greeting: "Hello! How can I assist you today?",
      crop: "Based on your soil, weather, and season, maize, wheat, and rice are good choices.",
      weather: "Today is sunny with 28°C temperature and mild wind in [LOCATION].",
      market: "Current market rates: Wheat ₹2000/quintal, Rice ₹1800/quintal, Maize ₹1500/quintal.",
      disease: "Upload a leaf image in the Disease Detection section for diagnosis.",
      fertilizer: "For [CROP] in [SOIL] soil at [STAGE] stage, a balanced NPK (10-26-26) fertilizer is recommended.",
      thankyou: "You're welcome! Feel free to ask if you have more questions.",
      fallback: "I can help with crops, weather, market updates, diseases, or fertilizer advice. Please ask a specific question!"
    },
    hi: {
      greeting: "नमस्ते! मैं आज आपकी कैसे सहायता कर सकता हूँ?",
      crop: "आपकी मिट्टी, मौसम और मौसम के अनुसार, मक्का, गेहूं और धान अच्छी फसलें हैं।",
      weather: "आज का मौसम [LOCATION] में धूप वाला है, तापमान 28°C और हल्की हवा है।",
      market: "मौजूदा बाजार मूल्य: गेहूं ₹2000/क्विंटल, चावल ₹1800/क्विंटल, मक्का ₹1500/क्विंटल।",
      disease: "निदान के लिए कृपया रोग पहचान अनुभाग में पत्ती की छवि अपलोड करें।",
      fertilizer: "[SOIL] मिट्टी में [STAGE] अवस्था में [CROP] के लिए, संतुलित एनपीके (10-26-26) उर्वरक की सिफारिश की जाती है।",
      thankyou: "आपका स्वागत है! यदि आपके कोई और प्रश्न हैं तो बेझिझक पूछें।",
      fallback: "मैं फसलों, मौसम, बाजार अपडेट, रोगों या उर्वरक सलाह में मदद कर सकता हूँ। कृपया एक विशिष्ट प्रश्न पूछें!"
    },
    ml: {
      greeting: "നമസ്കാരം! ഇന്ന് ഞാൻ നിങ്ങളെ എങ്ങനെ സഹായിക്കും?",
      crop: "നിങ്ങളുടെ നിലം, കാലാവസ്ഥ, സീസൺ അനുസരിച്ച് ഗോൾ, ഗോതമ്പ്, അരി നല്ല ഫസലുകളാണ്.",
      weather: "[LOCATION] ൽ ഇന്ന് സൂര്യപ്രകാശം ചെറുതും, താപനില 28°C, മിതവായു ഓറും.",
      market: "ഇപ്പോൾ മാർക്കറ്റ് വിലകൾ: ഗോതമ്പ് ₹2000/ക്വിന്റൽ, അരി ₹1800/ക്വിന്റൽ, മക്കൾ ₹1500/ക്വിന്റൽ.",
      disease: "രോഗം കണ്ടെത്തുന്നതിന് ദയവായി രോഗം തിരിച്ചറിയൽ വിഭാഗത്തിൽ ഇലയുടെ ചിത്രം അപ്‌ലോഡ് ചെയ്യുക.",
      fertilizer: "[SOIL] മണ്ണിൽ [STAGE] ഘട്ടത്തിൽ [CROP] ന്, സന്തുലിതമായ NPK (10-26-26) വളം ശുപാർശ ചെയ്യുന്നു.",
      thankyou: "സ്വാഗതം! നിങ്ങൾക്ക് കൂടുതൽ ചോദ്യങ്ങളുണ്ടെങ്കിൽ ചോദിക്കാൻ മടിക്കരുത്.",
      fallback: "ഞാൻ ഫസലുകൾ, കാലാവസ്ഥ, വിപണി അപ്‌ഡേറ്റുകൾ, രോഗങ്ങൾ, അല്ലെങ്കിൽ വളം ഉപദേശം എന്നിവയിൽ സഹായിക്കും. ദയവായി ഒരു പ്രത്യേക ചോദ്യം ചോദിക്കുക!"
    }
  };

  function getAIResponse(input, lang) {
    const text = input.toLowerCase();
    const r = responses[lang] || responses.en;

    if (text.includes("hello") || text.includes("hi") || text.includes("नमस्ते") || text.includes("നമസ്കാരം")) {
      return r.greeting;
    }
    if (text.includes("thank you") || text.includes("thanks") || text.includes("धन्यवाद") || text.includes("നന്ദി")) {
      return r.thankyou;
    }
    if (text.includes("crop") || text.includes("फसल") || text.includes("കർഷണം") || text.includes("മഴ")) {
      return r.crop;
    } 
    if (text.includes("weather") || text.includes("मौसम") || text.includes("കാലാവസ്ഥ")) {
      return r.weather.replace("[LOCATION]", "your area"); // Placeholder for dynamic location
    } 
    if (text.includes("market") || text.includes("बाजार") || text.includes("വിപണി")) {
      return r.market;
    } 
    if (text.includes("disease") || text.includes("रोग") || text.includes("രോഗം")) {
      return r.disease;
    }
    if (text.includes("fertilizer") || text.includes("उर्वरक") || text.includes("വളം")) {
      return r.fertilizer.replace("[CROP]", "your crop").replace("[SOIL]", "your soil").replace("[STAGE]", "current");
    }
    return r.fallback;
  }

  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const userInput = chatInput.value.trim();
    if (!userInput) return;
    const lang = languageSelect.value;
    addMessage(userInput, true);
    chatInput.value = "";

    const typingIndicator = addMessage(lang === 'en' ? "AI is typing..." : lang === 'hi' ? "एआई टाइप कर रहा है..." : "എഐ ടൈപ്പ് ചെയ്യുന്നു...", false, true);

    setTimeout(() => {
      chatMessages.removeChild(typingIndicator); // Remove typing indicator
      const response = getAIResponse(userInput, lang);
      addMessage(response);
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(response);
        utterance.lang = (lang === 'en') ? 'en-US' : (lang === 'hi') ? 'hi-IN' : (lang === 'ml') ? 'ml-IN' : 'en-US';
        window.speechSynthesis.speak(utterance);
      }
    }, 1500); // Increased delay for typing indicator
  });

  voiceBtn.addEventListener("click", () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input not supported in your browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    const lang = languageSelect.value;

    recognition.lang = (lang === 'en') ? 'en-US' : (lang === 'hi') ? 'hi-IN' : (lang === 'ml') ? 'ml-IN' : 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = event => {
      const transcript = event.results[0][0].transcript;
      addMessage(transcript, true);
      const typingIndicator = addMessage(lang === 'en' ? "AI is typing..." : lang === 'hi' ? "एआई टाइप कर रहा है..." : "എഐ ടൈപ്പ് ചെയ്യുന്നു...", false, true);

      setTimeout(() => {
        chatMessages.removeChild(typingIndicator);
        const response = getAIResponse(transcript, lang);
        addMessage(response);
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(response);
          utterance.lang = recognition.lang;
          window.speechSynthesis.speak(utterance);
        }
      }, 1500);
    };

    recognition.onerror = (event) => {
      alert("Voice recognition error: " + event.error);
    };
  });

  // Crop advisory
  const cropForm = document.getElementById("crop-form");
  const cropResult = document.getElementById("crop-result");

  cropForm.addEventListener("submit", e => {
    e.preventDefault();
    const soil = document.getElementById("soil-type").value;
    const weather = document.getElementById("weather").value;
    const season = document.getElementById("season").value;

    if (!soil || !weather || !season) {
      cropResult.style.color = "red";
      cropResult.textContent = "Please select soil type, weather condition, and season.";
      return;
    }

    let recommendation = "";
    let yieldPotential = "Moderate yield potential.";
    let waterRequirement = "Moderate water requirement.";

    if (soil === "clay") {
      if (season === "kharif") {
        recommendation = "Rice and Jute are highly recommended for clay soil during Kharif season.";
        yieldPotential = "High yield potential with proper water management.";
        waterRequirement = "High water requirement.";
      } else if (season === "rabi") {
        recommendation = "Wheat and Mustard can be grown in clay soil during Rabi season.";
        yieldPotential = "Good yield potential.";
        waterRequirement = "Moderate to high water requirement.";
      } else { // Zaid or general
        recommendation = "Pulses (e.g., Gram) and some vegetables can be suitable for clay soil.";
      }
    } else if (soil === "sandy") {
      if (season === "kharif") {
        recommendation = "Millet, Groundnut, and Maize are good for sandy soil in Kharif.";
        yieldPotential = "Moderate yield potential, susceptible to drought.";
        waterRequirement = "Low to moderate water requirement, frequent irrigation needed.";
      } else if (season === "rabi") {
        recommendation = "Barley and some oilseeds (e.g., Castor) can be grown in sandy soil during Rabi.";
        yieldPotential = "Fair yield potential.";
        waterRequirement = "Low to moderate water requirement.";
      } else { // Zaid or general
        recommendation = "Watermelon and cucumber are suitable for sandy soil.";
      }
    } else if (soil === "loamy") {
      recommendation = "Loamy soil is versatile. Wheat, Maize, Sugarcane, and most vegetables thrive here in any season.";
      yieldPotential = "Excellent yield potential due to balanced properties.";
      waterRequirement = "Moderate water requirement, good drainage.";
    } else if (soil === "peaty") {
      recommendation = "Peaty soil supports Ryegrass, Orchard grass, and root vegetables like carrots and potatoes.";
      yieldPotential = "Good yield potential for specific crops.";
      waterRequirement = "High water retention, but can be acidic.";
    } else if (soil === "silty") {
      recommendation = "Silty soil is suitable for Rice, Wheat, and many vegetables, especially during Kharif and Rabi.";
      yieldPotential = "Very good yield potential.";
      waterRequirement = "Moderate to high water requirement, good moisture retention.";
    } else {
      recommendation = "Please choose valid soil, weather, and season conditions.";
    }

    cropResult.style.color = "#276633";
    cropResult.innerHTML = `${recommendation}<br/><strong>Yield Potential:</strong> ${yieldPotential}<br/><strong>Water Requirement:</strong> ${waterRequirement}`;
  });

  // Fertilizer advisory (New Section)
  const fertilizerForm = document.getElementById("fertilizer-form");
  const fertilizerResult = document.getElementById("fertilizer-result");

  fertilizerForm.addEventListener("submit", e => {
    e.preventDefault();
    const soilType = document.getElementById("fert-soil-type").value;
    const cropType = document.getElementById("fert-crop-type").value.toLowerCase();
    const cropStage = document.getElementById("fert-stage").value;

    if (!soilType || !cropType || !cropStage) {
      fertilizerResult.style.color = "red";
      fertilizerResult.textContent = "Please select soil type, enter crop type, and select growth stage.";
      return;
    }

    let recommendation = "";
    let timing = "";
    let micronutrients = "Consider a general micronutrient mix if deficiencies are suspected.";

    // General NPK ratios (N-P-K)
    const npk_planting = "10-26-26 (DAP/SSP based)";
    const npk_vegetative = "20-20-0 (Urea/Ammonium Sulfate based)";
    const npk_flowering = "0-0-50 (SOP based) or 13-0-45 (Potassium Nitrate)";
    const npk_fruiting = "19-19-19 or 13-0-45 (Potassium Nitrate)";

    if (soilType === "clay") {
      if (cropType.includes("rice") || cropType.includes("paddy")) {
        recommendation = `For Rice in Clay soil: At ${cropStage} stage, use `;
        if (cropStage === "planting") { recommendation += `DAP (${npk_planting}) for root development.`; timing = "Basal application."; }
        else if (cropStage === "vegetative") { recommendation += `Urea (${npk_vegetative}) in split doses for leaf growth.`; timing = "20-30 days after planting."; }
        else if (cropStage === "flowering") { recommendation += `Potassium (MOP/SOP) for grain filling.`; timing = "Panicle initiation stage."; }
        else if (cropStage === "fruiting") { recommendation += `Potassium (MOP/SOP) for grain quality.`; timing = "Grain filling stage."; }
      } else if (cropType.includes("wheat")) {
        recommendation = `For Wheat in Clay soil: At ${cropStage} stage, use `;
        if (cropStage === "planting") { recommendation += `NPK 12-32-16 or similar.`; timing = "Basal application."; }
        else if (cropStage === "vegetative") { recommendation += `Urea (${npk_vegetative}) as top dressing.`; timing = "20-25 days after sowing."; }
        else if (cropStage === "flowering") { recommendation += `Potassium Nitrate (${npk_flowering}) for grain development.`; timing = "Booting to flowering stage."; }
        else if (cropStage === "fruiting") { recommendation += `Potassium (SOP) for grain weight.`; timing = "Milk to dough stage."; }
      } else {
        recommendation = `For ${cropType} in Clay soil at ${cropStage} stage: A balanced NPK fertilizer (e.g., ${npk_fruiting}) is generally good.`;
        timing = "Consult specific crop guide for precise timing.";
      }
    } else if (soilType === "sandy") {
      recommendation = `For ${cropType} in Sandy soil at ${cropStage} stage: Requires more frequent, smaller doses due to leaching. Use `;
      if (cropStage === "planting") { recommendation += `NPK ${npk_planting}.`; timing = "Basal, incorporate well."; }
      else if (cropStage === "vegetative") { recommendation += `Urea (${npk_vegetative}) in 2-3 splits.`; timing = "Every 15-20 days."; }
      else if (cropStage === "flowering") { recommendation += `Potassium Nitrate (${npk_flowering}) or foliar spray.`; timing = "Start of flowering."; }
      else if (cropStage === "fruiting") { recommendation += `NPK ${npk_fruiting} or Potassium (SOP).`; timing = "During fruit/grain development."; }
      micronutrients += " Sandy soils often benefit from Zinc and Boron supplements.";
    } else if (soilType === "loamy") {
      recommendation = `For ${cropType} in Loamy soil at ${cropStage} stage: Loamy soil is fertile. Use `;
      if (cropStage === "planting") { recommendation += `NPK ${npk_planting}.`; timing = "Basal application."; }
      else if (cropStage === "vegetative") { recommendation += `Urea (${npk_vegetative}) as top dressing.`; timing = "20-30 days after planting."; }
      else if (cropStage === "flowering") { recommendation += `NPK ${npk_flowering} or a balanced foliar spray.`; timing = "Flowering initiation."; }
      else if (cropStage === "fruiting") { recommendation += `NPK ${npk_fruiting}.`; timing = "During fruit/grain development."; }
    } else if (soilType === "peaty") {
      recommendation = `For ${cropType} in Peaty soil at ${cropStage} stage: Peaty soils are rich in organic matter but may lack Potassium and micronutrients. Supplement with `;
      if (cropStage === "planting") { recommendation += `NPK ${npk_planting} and lime if acidic.`; timing = "Basal application."; }
      else if (cropStage === "vegetative") { recommendation += `Potassium (SOP) and Nitrogen if needed.`; timing = "Monitor plant growth."; }
      else { recommendation += `Potassium and micronutrients.`; timing = "As per crop needs."; }
      micronutrients += " Manganese and Copper can be important.";
    } else if (soilType === "silty") {
      recommendation = `For ${cropType} in Silty soil at ${cropStage} stage: Similar to loamy, a balanced NPK is usually effective. Use `;
      if (cropStage === "planting") { recommendation += `NPK ${npk_planting}.`; timing = "Basal application."; }
      else if (cropStage === "vegetative") { recommendation += `Urea (${npk_vegetative}) as top dressing.`; timing = "20-30 days after planting."; }
      else if (cropStage === "flowering") { recommendation += `NPK ${npk_flowering}.`; timing = "Flowering initiation."; }
      else if (cropStage === "fruiting") { recommendation += `NPK ${npk_fruiting}.`; timing = "During fruit/grain development."; }
    } else {
      recommendation = "Could not provide specific fertilizer recommendation. Please check inputs.";
      timing = "N/A";
      micronutrients = "N/A";
    }

    fertilizerResult.style.color = "#276633";
    fertilizerResult.innerHTML = `${recommendation}<br/><strong>Timing:</strong> ${timing}<br/><strong>Micronutrients:</strong> ${micronutrients}`;
  });


  // Disease detection (mock)
  const detectBtn = document.getElementById("detect-btn");
  const imageUpload = document.getElementById("image-upload");
  const diseaseLoading = document.getElementById("disease-loading");
  const diseaseResult = document.getElementById("disease-result");

  const mockDiseaseResponses = [
    { name: "Leaf Blight", severity: "Moderate", treatment: "Apply fungicides (e.g., Mancozeb) and maintain good irrigation. Ensure proper spacing.", prevention: "Use resistant varieties, rotate crops." },
    { name: "Rust Disease", severity: "High", treatment: "Use rust-specific fungicides (e.g., Propiconazole) and ensure proper air circulation. Remove infected plant parts.", prevention: "Plant resistant varieties, avoid overhead irrigation." },
    { name: "Powdery Mildew", severity: "Low", treatment: "Apply sulfur-based fungicides or neem oil. Improve plant spacing and air circulation.", prevention: "Ensure good air flow, plant in sunny areas." },
    { name: "Bacterial Spot", severity: "Moderate", treatment: "Remove infected leaves, use copper-based sprays, and practice crop rotation. Avoid working in wet conditions.", prevention: "Use certified disease-free seeds, sanitize tools." },
    { name: "Healthy Leaf", severity: "None", treatment: "No significant disease detected. Keep up the good work!", prevention: "Continue good agricultural practices." }
  ];

  detectBtn.addEventListener("click", () => {
    if(imageUpload.files.length === 0) {
      diseaseResult.style.color = "red";
      diseaseResult.textContent = "Please upload an image first!";
      return;
    }
    
    diseaseResult.textContent = ""; // Clear previous result
    diseaseLoading.style.display = "block"; // Show spinner

    setTimeout(() => {
      diseaseLoading.style.display = "none"; // Hide spinner
      const randomResponse = mockDiseaseResponses[Math.floor(Math.random() * mockDiseaseResponses.length)];
      
      diseaseResult.style.color = "#276633";
      diseaseResult.innerHTML = `<strong>Disease Detected:</strong> ${randomResponse.name}<br/>` + 
        `<strong>Severity:</strong> ${randomResponse.severity}<br/>` +
        `<strong>Recommended Treatment:</strong> ${randomResponse.treatment}<br/>` +
        `<strong>Prevention Tips:</strong> ${randomResponse.prevention}`;
    }, 3000); // Increased delay for more realistic "processing"
  });

  // Populate market data list and add search
  const marketDataList = document.getElementById("market-data");
  const marketSearchInput = document.getElementById("market-search");
  const allMarketData = [ // Stored in a variable to allow filtering
    { crop: "Wheat", price: "₹2000 / quintal", trend: "up" },
    { crop: "Rice", price: "₹1800 / quintal", trend: "stable" },
    { crop: "Maize", price: "₹1500 / quintal", trend: "down" },
    { crop: "Cotton", price: "₹5000 / quintal", trend: "up" },
    { crop: "Sugarcane", price: "₹310 / quintal", trend: "stable" },
    { crop: "Potato", price: "₹1500 / quintal", trend: "down" },
    { crop: "Onion", price: "₹1200 / quintal", trend: "up" },
    { crop: "Tomato", price: "₹800 / quintal", trend: "stable" },
    { crop: "Chilli", price: "₹2500 / quintal", trend: "up" },
  ];

  function renderMarketData(data) {
    marketDataList.innerHTML = ""; // Clear existing list
    if (data.length === 0) {
      const li = document.createElement("li");
      li.textContent = "No market data found for your search.";
      marketDataList.appendChild(li);
      return;
    }
    data.forEach(({crop, price, trend}) => {
      const li = document.createElement("li");
      li.classList.add("market-item");
      let trendIcon = '';
      let trendClass = 'trend-stable';
      if (trend === 'up') { trendIcon = '⬆️'; trendClass = 'trend-up'; }
      else if (trend === 'down') { trendIcon = '⬇️'; trendClass = 'trend-down'; }
      else { trendIcon = '➡️'; }

      li.innerHTML = `<span>${crop}: ${price}</span> <span class="market-trend ${trendClass}">${trendIcon} ${trend}</span>`;
      marketDataList.appendChild(li);
    });
  }

  renderMarketData(allMarketData); // Initial render

  marketSearchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredData = allMarketData.filter(item => 
      item.crop.toLowerCase().includes(searchTerm)
    );
    renderMarketData(filteredData);
  });


  // Weather Forecast (mock with location input and 5-day forecast)
  const weatherLocationInput = document.getElementById("weather-location");
  const getWeatherBtn = document.getElementById("get-weather-btn");
  const weatherDataDisplay = document.getElementById("weather-data");

  const mockWeatherData = {
    "delhi": { 
      current: { temp: "32°C", condition: "Sunny", humidity: "55%", wind: "8 km/h NW" },
      forecast: [
        { day: "Tomorrow", temp: "33°C", condition: "Sunny", icon: "☀️" },
        { day: "Day 3", temp: "30°C", condition: "Partly Cloudy", icon: "⛅" },
        { day: "Day 4", temp: "28°C", condition: "Light Rain", icon: "🌧️" },
        { day: "Day 5", temp: "29°C", condition: "Cloudy", icon: "☁️" }
      ]
    },
    "mumbai": { 
      current: { temp: "29°C", condition: "Partly Cloudy", humidity: "75%", wind: "12 km/h SW" },
      forecast: [
        { day: "Tomorrow", temp: "28°C", condition: "Cloudy", icon: "☁️" },
        { day: "Day 3", temp: "27°C", condition: "Heavy Rain", icon: "⛈️" },
        { day: "Day 4", temp: "29°C", condition: "Partly Cloudy", icon: "⛅" },
        { day: "Day 5", temp: "30°C", condition: "Sunny", icon: "☀️" }
      ]
    },
    "bengaluru": { 
      current: { temp: "25°C", condition: "Light Rain", humidity: "80%", wind: "10 km/h W" },
      forecast: [
        { day: "Tomorrow", temp: "24°C", condition: "Rainy", icon: "☔" },
        { day: "Day 3", temp: "26°C", condition: "Partly Cloudy", icon: "⛅" },
        { day: "Day 4", temp: "25°C", condition: "Light Rain", icon: "🌧️" },
        { day: "Day 5", temp: "27°C", condition: "Sunny", icon: "☀️" }
      ]
    },
    // Add more locations as needed
  };

  getWeatherBtn.addEventListener("click", () => {
    const location = weatherLocationInput.value.toLowerCase().trim();
    if (!location) {
      weatherDataDisplay.innerHTML = "<p style='color:red;'>Please enter a location.</p>";
      return;
    }

    const data = mockWeatherData[location];
    if (data) {
      let html = `<h3>Current Weather in ${location.charAt(0).toUpperCase() + location.slice(1)}:</h3>
        <p>🌡️ Temperature: ${data.current.temp}</p>
        <p>☀️ Condition: ${data.current.condition}</p>
        <p>💧 Humidity: ${data.current.humidity}</p>
        <p>🌬️ Wind: ${data.current.wind}</p>
        <h3>5-Day Forecast:</h3>`;
      
      data.forecast.forEach(day => {
        html += `<div class="weather-day">
          <p><strong>${day.day}:</strong> ${day.icon} ${day.condition}, ${day.temp}</p>
        </div>`;
      });
      weatherDataDisplay.innerHTML = html;
    } else {
      weatherDataDisplay.innerHTML = `<p style='color:orange;'>Weather data not available for "${location}". Showing general forecast:</p>
        <p>🌡️ Temperature: 28°C</p>
        <p>☀️ Condition: Sunny</p>
        <p>💧 Humidity: 60%</p>
        <p>🌬️ Wind: 5 km/h NE</p>
      `;
    }
  });
});
