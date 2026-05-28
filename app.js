// SKEUOFIT - Tactile Sound Synthesizer via Web Audio API
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playClickSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.05);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);

    const oscHigh = ctx.createOscillator();
    const gainHigh = ctx.createGain();
    oscHigh.type = 'sine';
    oscHigh.frequency.setValueAtTime(1200, now);
    oscHigh.frequency.exponentialRampToValueAtTime(800, now + 0.015);
    gainHigh.gain.setValueAtTime(0.15, now);
    gainHigh.gain.exponentialRampToValueAtTime(0.001, now + 0.015);
    oscHigh.connect(gainHigh);
    gainHigh.connect(ctx.destination);
    oscHigh.start(now);
    oscHigh.stop(now + 0.015);
  } catch (e) {
    console.warn("Audio blocked:", e);
  }
}

function playSplashSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(300, now);
    osc1.frequency.exponentialRampToValueAtTime(900, now + 0.15);
    gain1.gain.setValueAtTime(0.0, now);
    gain1.gain.linearRampToValueAtTime(0.2, now + 0.03);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.18);

    setTimeout(() => {
      const insideCtx = getAudioContext();
      const t = insideCtx.currentTime;
      const osc2 = insideCtx.createOscillator();
      const gain2 = insideCtx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(600, t);
      osc2.frequency.exponentialRampToValueAtTime(1600, t + 0.1);
      gain2.gain.setValueAtTime(0.0, t);
      gain2.gain.linearRampToValueAtTime(0.15, t + 0.02);
      gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      osc2.connect(gain2);
      gain2.connect(insideCtx.destination);
      osc2.start(t);
      osc2.stop(t + 0.12);
    }, 60);
  } catch (e) {
    console.warn("Audio blocked:", e);
  }
}

function playCameraSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const bufferSize = ctx.sampleRate * 0.12;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1000, now);
    filter.Q.setValueAtTime(2, now);
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.35, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.12);

    const oscMotor = ctx.createOscillator();
    const motorGain = ctx.createGain();
    oscMotor.type = 'sawtooth';
    oscMotor.frequency.setValueAtTime(80, now + 0.12);
    oscMotor.frequency.linearRampToValueAtTime(250, now + 0.3);
    oscMotor.frequency.linearRampToValueAtTime(200, now + 0.8);
    oscMotor.frequency.exponentialRampToValueAtTime(10, now + 1.2);
    const motorFilter = ctx.createBiquadFilter();
    motorFilter.type = 'lowpass';
    motorFilter.frequency.setValueAtTime(400, now);
    motorGain.gain.setValueAtTime(0.0, now);
    motorGain.gain.setValueAtTime(0.15, now + 0.12);
    motorGain.gain.linearRampToValueAtTime(0.12, now + 0.8);
    motorGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    oscMotor.connect(motorFilter);
    motorFilter.connect(motorGain);
    motorGain.connect(ctx.destination);
    oscMotor.start(now + 0.12);
    oscMotor.stop(now + 1.2);
  } catch (e) {
    console.warn("Audio blocked:", e);
  }
}

function playPrinterSound(durationSeconds = 1.5) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(90, now);
    const mod = ctx.createOscillator();
    const modGain = ctx.createGain();
    mod.frequency.setValueAtTime(18, now);
    modGain.gain.setValueAtTime(15, now);
    mod.connect(modGain);
    modGain.connect(osc.frequency);
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(250, now);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.setValueAtTime(0.05, now + durationSeconds - 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + durationSeconds);
    osc.connect(lp);
    lp.connect(gain);
    gain.connect(ctx.destination);
    mod.start(now);
    osc.start(now);
    mod.stop(now + durationSeconds);
    osc.stop(now + durationSeconds);

    setTimeout(() => {
      try {
        const tearCtx = getAudioContext();
        const t = tearCtx.currentTime;
        const bufferSize = tearCtx.sampleRate * 0.15;
        const buffer = tearCtx.createBuffer(1, bufferSize, tearCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const tearNoise = tearCtx.createBufferSource();
        tearNoise.buffer = buffer;
        const hp = tearCtx.createBiquadFilter();
        hp.type = 'highpass';
        hp.frequency.setValueAtTime(1500, t);
        const tearGain = tearCtx.createGain();
        tearGain.gain.setValueAtTime(0.2, t);
        tearGain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        tearNoise.connect(hp);
        hp.connect(tearGain);
        tearGain.connect(tearCtx.destination);
        tearNoise.start(t);
        tearNoise.stop(t + 0.15);
      } catch (e) {
        console.warn("Tear failed:", e);
      }
    }, durationSeconds * 1000);
  } catch (e) {
    console.warn("Audio blocked:", e);
  }
}

// --- CONFIGURATION & STATE ---
const CALORIE_GOAL = 2000;
const WATER_GOAL = 3000;

// Food details database for presets and AI simulation
const FOOD_DATABASE = {
  pizza: {
    name: "Pepperoni Pizza (1 Slice)",
    calories: 290,
    protein: "12g",
    carbs: "32g",
    fat: "12g",
    rating: "MODERATE",
    color: "#ff8c00",
    image: "./assets/pizza.png"
  },
  salad: {
    name: "Garden Avocado Salad",
    calories: 320,
    protein: "8g",
    carbs: "15g",
    fat: "26g",
    rating: "EXCELLENT",
    color: "#2ecc71",
    image: "./assets/salad.png"
  },
  burger: {
    name: "Double Cheeseburger & Fries",
    calories: 890,
    protein: "42g",
    carbs: "84g",
    fat: "44g",
    rating: "POOR",
    color: "#e74c3c",
    image: "./assets/burger.png"
  },
  toast: {
    name: "Avocado Toast w/ Egg",
    calories: 380,
    protein: "14g",
    carbs: "30g",
    fat: "22g",
    rating: "EXCELLENT",
    color: "#2ecc71",
    image: "./assets/toast.png"
  },
  sushi: {
    name: "Salmon Sushi Roll (8pc)",
    calories: 410,
    protein: "20g",
    carbs: "54g",
    fat: "8g",
    rating: "GOOD",
    color: "#2ecc71",
    image: "./assets/sushi.png"
  }
};

let state = {
  currentDate: getTodayString(),
  calories: 0,
  water: 0,
  foodEntries: [],
  history: [] // Last 7 days logs
};

// Currently selected/uploaded scan candidate
let activeScanData = null;

// --- DOM ELEMENTS ---
const calDisplay = document.getElementById('cal-display');
const waterDisplay = document.getElementById('water-display');
const journalEntries = document.getElementById('journal-entries');
const emptyJournalMsg = document.getElementById('empty-journal-msg');
const notebookDate = document.getElementById('notebook-date');
const calorieResetBtn = document.getElementById('calorie-reset-btn');

// Polaroid camera
const polaroidFrame = document.getElementById('polaroid-frame');
const photoPlaceholder = document.getElementById('photo-placeholder');
const photoPreview = document.getElementById('photo-preview');
const polaroidCaption = document.getElementById('polaroid-caption-text');
const foodPresets = document.getElementById('food-presets');
const imageUpload = document.getElementById('image-upload');
const scanBtn = document.getElementById('scan-btn');
const scanLaser = document.getElementById('scan-laser');

// Receipts
const thermalReceipt = document.getElementById('thermal-receipt');
const receiptDate = document.getElementById('receipt-date');
const receiptFoodName = document.getElementById('receipt-food-name');
const receiptCalories = document.getElementById('receipt-calories');
const receiptProtein = document.getElementById('receipt-protein');
const receiptCarbs = document.getElementById('receipt-carbs');
const receiptFat = document.getElementById('receipt-fat');
const receiptHealthRating = document.getElementById('receipt-health-rating');
const receiptLogBtn = document.getElementById('receipt-log-btn');

// Water Tracker
const waterCanvas = document.getElementById('water-canvas');
const waterResetBtn = document.getElementById('water-reset-btn');
const gaugeHand = document.getElementById('gauge-hand');

// Weekly Report Printer
const weeklyReportTrigger = document.getElementById('weekly-report-trigger');
const weeklyTicketTape = document.getElementById('weekly-ticket-tape');
const ticketGenerationTime = document.getElementById('ticket-generation-time');
const calWeeklyChart = document.getElementById('cal-weekly-chart');
const waterWeeklyChart = document.getElementById('water-weekly-chart');
const weeklyStamp = document.getElementById('weekly-stamp');

// --- WATER CANVAS ANIMATOR ---
const canvasCtx = waterCanvas.getContext('2d');
let waveOffset = 0;
let currentWaterRenderLevel = 0; // Animates smoothly to the target level
let bubbles = [];

// Initialize Canvas dimensions
function resizeCanvas() {
  const rect = waterCanvas.getBoundingClientRect();
  waterCanvas.width = rect.width;
  waterCanvas.height = rect.height;
}

// Wave Physics Loop
function animateWater() {
  if (!waterCanvas) return;
  const width = waterCanvas.width;
  const height = waterCanvas.height;

  canvasCtx.clearRect(0, 0, width, height);

  // Target level calculation (from bottom)
  const targetLevel = (state.water / WATER_GOAL) * (height - 60); // Max fill leaves 60px padding at top
  // Smooth springy easing
  currentWaterRenderLevel += (targetLevel - currentWaterRenderLevel) * 0.08;

  const waterY = height - currentWaterRenderLevel;

  if (currentWaterRenderLevel > 2) {
    // Gradient fill for water body
    const gradient = canvasCtx.createLinearGradient(0, waterY, 0, height);
    gradient.addColorStop(0, 'rgba(41, 128, 185, 0.85)'); // Cyanish blue
    gradient.addColorStop(0.6, 'rgba(52, 152, 219, 0.9)');
    gradient.addColorStop(1, 'rgba(41, 128, 185, 0.95)');

    // Render Back Wave
    canvasCtx.fillStyle = 'rgba(41, 128, 185, 0.4)';
    canvasCtx.beginPath();
    canvasCtx.moveTo(0, waterY);
    for (let x = 0; x <= width; x++) {
      const waveY = Math.sin(x * 0.05 + waveOffset * 0.8) * 4;
      canvasCtx.lineTo(x, waterY + waveY - 2);
    }
    canvasCtx.lineTo(width, height);
    canvasCtx.lineTo(0, height);
    canvasCtx.fill();

    // Render Front Wave
    canvasCtx.fillStyle = gradient;
    canvasCtx.beginPath();
    canvasCtx.moveTo(0, waterY);
    for (let x = 0; x <= width; x++) {
      const waveY = Math.sin(x * 0.04 - waveOffset) * 6;
      canvasCtx.lineTo(x, waterY + waveY);
    }
    canvasCtx.lineTo(width, height);
    canvasCtx.lineTo(0, height);
    canvasCtx.fill();

    // Spawn bubbles randomly based on height
    if (Math.random() < 0.06 && bubbles.length < 25) {
      bubbles.push({
        x: Math.random() * (width - 10) + 5,
        y: height - 10,
        radius: Math.random() * 2 + 1,
        speed: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.3
      });
    }

    // Draw and update bubbles
    bubbles.forEach((bubble, index) => {
      canvasCtx.beginPath();
      canvasCtx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
      canvasCtx.fillStyle = `rgba(255, 255, 255, ${bubble.opacity})`;
      canvasCtx.fill();

      // Move bubble up
      bubble.y -= bubble.speed;
      // Slight horizontal wobble
      bubble.x += Math.sin(bubble.y * 0.05) * 0.3;

      // Kill bubbles that reach the surface or fade out
      if (bubble.y < waterY) {
        bubbles.splice(index, 1);
      }
    });
  }

  // Wave speed
  waveOffset += 0.08;
  requestAnimationFrame(animateWater);
}

// --- HELPER FUNCTIONS ---

function getTodayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatDateDisplay(dateStr) {
  const d = new Date(dateStr);
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return d.toLocaleDateString('en-US', options);
}

// Seed historical data if local storage is blank
function seedMockHistory() {
  const history = [];
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const d = new Date();
  
  // Seed past 7 days (not including today)
  for (let i = 7; i > 0; i--) {
    const prevDate = new Date();
    prevDate.setDate(d.getDate() - i);
    const dateStr = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}-${String(prevDate.getDate()).padStart(2, '0')}`;
    
    // Create realistic food entries
    const logs = [
      { name: "Avocado Toast", calories: 380 },
      { name: "Chicken Salad", calories: 420 },
      { name: "Banana", calories: 105 },
      { name: "Dinner Salmon", calories: 650 }
    ];

    const randomFactor = (Math.random() - 0.5) * 400; // variance
    const calories = Math.round(1850 + randomFactor);
    const water = Math.round(2800 + (Math.random() - 0.5) * 800);

    history.push({
      date: dateStr,
      dayName: prevDate.toLocaleDateString('en-US', { weekday: 'short' }),
      calories: calories,
      water: Math.max(1000, water),
      foodEntries: logs
    });
  }
  return history;
}

// --- CORE UTILITY ACTIONS ---

function loadState() {
  const localData = localStorage.getItem('skeuofit_state');
  if (localData) {
    state = JSON.parse(localData);
    // Check if the loaded state is for today, if not, save today's base
    const today = getTodayString();
    if (state.currentDate !== today) {
      // Archive current state into history
      const existingHistoryIndex = state.history.findIndex(h => h.date === state.currentDate);
      const dayData = {
        date: state.currentDate,
        dayName: new Date(state.currentDate).toLocaleDateString('en-US', { weekday: 'short' }),
        calories: state.calories,
        water: state.water,
        foodEntries: state.foodEntries
      };
      
      if (existingHistoryIndex >= 0) {
        state.history[existingHistoryIndex] = dayData;
      } else {
        state.history.push(dayData);
      }
      
      // Limit history to last 14 entries to avoid bloat
      if (state.history.length > 14) {
        state.history.shift();
      }

      // Reset for new day
      state.currentDate = today;
      state.calories = 0;
      state.water = 0;
      state.foodEntries = [];
    }
  } else {
    // Generate fresh state with pre-populated dummy history
    state.currentDate = getTodayString();
    state.calories = 0;
    state.water = 0;
    state.foodEntries = [];
    state.history = seedMockHistory();
  }
  saveState();
}

function saveState() {
  localStorage.setItem('skeuofit_state', JSON.stringify(state));
  updateUI();
}

function updateUI() {
  // 1. Nixie Displays
  calDisplay.textContent = `${String(state.calories).padStart(4, '0')} / ${CALORIE_GOAL} kcal`;
  waterDisplay.textContent = `${String(state.water).padStart(4, '0')} / ${WATER_GOAL} ml`;
  
  // 2. Notebook date
  notebookDate.textContent = formatDateDisplay(state.currentDate);
  
  // 3. Notebook Journal Items
  journalEntries.innerHTML = '';
  if (state.foodEntries.length === 0) {
    journalEntries.appendChild(emptyJournalMsg);
    emptyJournalMsg.classList.remove('hidden');
  } else {
    emptyJournalMsg.classList.add('hidden');
    state.foodEntries.forEach((entry, idx) => {
      const item = document.createElement('div');
      item.className = 'journal-item';
      item.innerHTML = `
        <span>- ${entry.name}</span>
        <div>
          <span class="kcal">${entry.calories} kcal</span>
          <span class="delete-scribble" data-index="${idx}">&times; Scribble Out</span>
        </div>
      `;
      journalEntries.appendChild(item);
    });
  }

  // 4. Water Dial Indicator
  const waterPercent = Math.min(100, (state.water / WATER_GOAL) * 100);
  // Calculate rotation (ticks display 0% to 100% which maps to -120deg to 120deg)
  const deg = -120 + (waterPercent / 100) * 240;
  gaugeHand.style.transform = `translateX(-50%) rotate(${deg}deg)`;
}

// Add Food Entry
function logFood(name, calories, protein = "-", carbs = "-", fat = "-") {
  state.foodEntries.push({
    id: Date.now(),
    name: name,
    calories: calories,
    protein: protein,
    carbs: carbs,
    fat: fat,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });
  state.calories += calories;
  saveState();
}

// Delete food item
function removeFood(index) {
  playClickSound();
  const deleted = state.foodEntries.splice(index, 1)[0];
  state.calories = Math.max(0, state.calories - deleted.calories);
  saveState();
}

// Add Water
function addWater(amount) {
  playSplashSound();
  state.water = Math.min(6000, state.water + amount);
  saveState();
}

// Reset Water
function resetWater() {
  playClickSound();
  state.water = 0;
  saveState();
}

// Reset Calories
function resetCalories() {
  playClickSound();
  state.calories = 0;
  state.foodEntries = [];
  saveState();
}

// --- EVENT HANDLERS & BINDINGS ---

// Set up UI Event listeners
function setupListeners() {
  // Manual Calorie entry quick buttons
  document.querySelectorAll('.calorie-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      playClickSound();
      const kcal = parseInt(e.target.dataset.kcal);
      logFood("Quick Manual Entry", kcal);
    });
  });

  calorieResetBtn.addEventListener('click', resetCalories);

  // Journal scribble out (event delegation)
  journalEntries.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-scribble')) {
      const idx = parseInt(e.target.dataset.index);
      removeFood(idx);
    }
  });

  // Water buttons
  document.querySelectorAll('.water-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Handle targeting nested span element if clicked
      const btnEl = e.target.closest('.water-btn');
      const ml = parseInt(btnEl.dataset.ml);
      addWater(ml);
    });
  });

  waterResetBtn.addEventListener('click', resetWater);

  // --- POLAROID PRESET SELECT & FILE UPLOAD ---
  foodPresets.addEventListener('change', (e) => {
    playClickSound();
    const presetId = e.target.value;
    if (FOOD_DATABASE[presetId]) {
      const food = FOOD_DATABASE[presetId];
      // Display photo
      photoPlaceholder.classList.add('hidden');
      photoPreview.src = food.image;
      photoPreview.classList.remove('hidden');
      polaroidCaption.textContent = food.name;
      
      // Update scan tracking data
      activeScanData = {
        name: food.name,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat,
        rating: food.rating
      };

      // Enable scan button
      scanBtn.disabled = false;
      
      // Hide receipt if open from previous scan
      thermalReceipt.classList.remove('printed');
      setTimeout(() => thermalReceipt.classList.add('hidden'), 500);
    }
  });

  // Custom photo upload handler
  imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      playClickSound();
      const reader = new FileReader();
      reader.onload = (event) => {
        photoPlaceholder.classList.add('hidden');
        photoPreview.src = event.target.result;
        photoPreview.classList.remove('hidden');
        
        // Generate mock AI name based on filename
        let guessName = "Custom Eaten Food";
        let guessKcal = 350;
        let p = "12g", c = "35g", f = "16g";
        let rating = "GOOD";

        const lowerName = file.name.toLowerCase();
        if (lowerName.includes('banana') || lowerName.includes('fruit')) {
          guessName = "Fresh Banana / Fruit";
          guessKcal = 105;
          p = "1g"; c = "27g"; f = "0g";
          rating = "EXCELLENT";
        } else if (lowerName.includes('egg') || lowerName.includes('breakfast')) {
          guessName = "Fried Eggs & Toast";
          guessKcal = 290;
          p = "16g"; c = "18g"; f = "15g";
          rating = "GOOD";
        } else if (lowerName.includes('pizza') || lowerName.includes('slice')) {
          guessName = "Hot Pepperoni Pizza";
          guessKcal = 290;
          p = "12g"; c = "32g"; f = "12g";
          rating = "MODERATE";
        } else if (lowerName.includes('salad') || lowerName.includes('healthy')) {
          guessName = "Garden Green Salad";
          guessKcal = 180;
          p = "4g"; c = "12g"; f = "10g";
          rating = "EXCELLENT";
        } else if (lowerName.includes('burger') || lowerName.includes('meat') || lowerName.includes('fries')) {
          guessName = "Beef Hamburger";
          guessKcal = 540;
          p = "28g"; c = "40g"; f = "29g";
          rating = "POOR";
        } else {
          // Semi-randomize details for fun customized tracking
          guessKcal = Math.round(200 + Math.random() * 400);
          p = `${Math.round(guessKcal * 0.03)}g`;
          c = `${Math.round(guessKcal * 0.08)}g`;
          f = `${Math.round(guessKcal * 0.04)}g`;
        }

        polaroidCaption.textContent = "Photo Loaded...";
        
        activeScanData = {
          name: guessName,
          calories: guessKcal,
          protein: p,
          carbs: c,
          fat: f,
          rating: rating
        };

        // Enable scan
        scanBtn.disabled = false;
        
        // Reset receipt
        thermalReceipt.classList.remove('printed');
        setTimeout(() => thermalReceipt.classList.add('hidden'), 500);
      };
      reader.readAsDataURL(file);
    }
  });

  // Camera scan button
  scanBtn.addEventListener('click', () => {
    if (!activeScanData) return;
    
    // Disable scanner interactions during whir scan
    scanBtn.disabled = true;
    foodPresets.disabled = true;
    
    playCameraSound();
    
    // Visual scan laser lines
    scanLaser.classList.remove('hidden');
    polaroidCaption.textContent = "AI Scanning...";
    polaroidFrame.style.animation = "vibrate 0.1s linear infinite";

    // Wait 2.2 seconds (matching sound and sweeping line visual)
    setTimeout(() => {
      // Stop scanner animation
      scanLaser.classList.add('hidden');
      polaroidFrame.style.animation = "none";
      polaroidCaption.textContent = activeScanData.name;
      
      // Print Thermal Receipt
      printThermalReceipt();
      
      // Enable selectors
      foodPresets.disabled = false;
    }, 2200);
  });

  // Log from Receipt
  receiptLogBtn.addEventListener('click', () => {
    if (!activeScanData) return;
    
    playClickSound();
    logFood(
      activeScanData.name,
      activeScanData.calories,
      activeScanData.protein,
      activeScanData.carbs,
      activeScanData.fat
    );
    
    // Visual success transition on receipt
    receiptLogBtn.textContent = "ADDED TO JOURNAL!";
    receiptLogBtn.style.backgroundColor = "#7f8c8d";
    receiptLogBtn.disabled = true;
    
    setTimeout(() => {
      // Hide receipt
      thermalReceipt.classList.remove('printed');
      setTimeout(() => {
        thermalReceipt.classList.add('hidden');
        // Reset Polaroid frame state
        photoPreview.classList.add('hidden');
        photoPlaceholder.classList.remove('hidden');
        polaroidCaption.textContent = "No food scanned...";
        foodPresets.value = "";
        activeScanData = null;
        
        // Reset receipt log button UI
        receiptLogBtn.textContent = "LOG TO JOURNAL";
        receiptLogBtn.style.backgroundColor = "#27ae60";
        receiptLogBtn.disabled = false;
      }, 800);
    }, 1000);
  });

  // --- WEEKLY SUMMARY ACTION ---
  weeklyReportTrigger.addEventListener('click', () => {
    playPrinterSound(2.0);
    
    // If ticket is already open, close it first
    if (weeklyTicketTape.classList.contains('printed')) {
      weeklyTicketTape.classList.remove('printed');
      return;
    }

    // Populate Report Details
    const now = new Date();
    ticketGenerationTime.textContent = now.toLocaleString();
    
    // Create ASCII charts
    calWeeklyChart.innerHTML = '';
    waterWeeklyChart.innerHTML = '';

    // Render Calorie summary (Past 7 days)
    let totalTargetCalMetCount = 0;
    state.history.forEach(day => {
      const calPercent = Math.min(100, (day.calories / CALORIE_GOAL) * 100);
      const isMet = day.calories >= 1600 && day.calories <= 2400; // healthy range
      if (isMet) totalTargetCalMetCount++;

      const chartRow = document.createElement('div');
      chartRow.className = 'chart-row';
      chartRow.innerHTML = `
        <span class="chart-day">${day.dayName}</span>
        <div class="chart-bar-container">
          <div class="chart-bar-fill ${isMet ? 'target-met' : 'target-missed'}" style="width: ${calPercent}%"></div>
        </div>
        <span class="chart-val">${day.calories}</span>
      `;
      calWeeklyChart.appendChild(chartRow);
    });

    // Render Water summary
    let totalTargetWaterMetCount = 0;
    state.history.forEach(day => {
      const waterPercent = Math.min(100, (day.water / WATER_GOAL) * 100);
      const isMet = day.water >= WATER_GOAL;
      if (isMet) totalTargetWaterMetCount++;

      const chartRow = document.createElement('div');
      chartRow.className = 'chart-row';
      chartRow.innerHTML = `
        <span class="chart-day">${day.dayName}</span>
        <div class="chart-bar-container">
          <div class="chart-bar-fill ${isMet ? 'target-met' : 'target-missed'}" style="width: ${waterPercent}%"></div>
        </div>
        <span class="chart-val">${day.water} ml</span>
      `;
      waterWeeklyChart.appendChild(chartRow);
    });

    // Determine weekly stamp rating
    const successRatio = (totalTargetCalMetCount + totalTargetWaterMetCount) / 14;
    weeklyStamp.className = "audit-stamp";
    if (successRatio > 0.8) {
      weeklyStamp.classList.add('stamp-passed');
      weeklyStamp.textContent = "SUPER FIT WEEK";
    } else if (successRatio > 0.5) {
      weeklyStamp.classList.add('stamp-passed');
      weeklyStamp.textContent = "GOALS MET";
    } else {
      weeklyStamp.classList.add('stamp-pending');
      weeklyStamp.textContent = "KEEP TRYING";
    }

    // Slide open the printer receipt
    weeklyTicketTape.classList.add('printed');
  });
}

// Render the printed recipe drawer
function printThermalReceipt() {
  if (!activeScanData) return;
  
  playPrinterSound(1.5);
  
  // Fill details
  const d = new Date();
  receiptDate.textContent = `DATE: ${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
  receiptFoodName.textContent = activeScanData.name;
  receiptCalories.textContent = `${activeScanData.calories} kcal`;
  receiptProtein.textContent = activeScanData.protein;
  receiptCarbs.textContent = activeScanData.carbs;
  receiptFat.textContent = activeScanData.fat;
  
  receiptHealthRating.textContent = activeScanData.rating;
  receiptHealthRating.className = 'health-badge';
  if (activeScanData.rating === 'EXCELLENT') {
    receiptHealthRating.style.backgroundColor = '#27ae60';
  } else if (activeScanData.rating === 'GOOD') {
    receiptHealthRating.style.backgroundColor = '#2ecc71';
  } else if (activeScanData.rating === 'MODERATE') {
    receiptHealthRating.style.backgroundColor = '#f39c12';
  } else {
    receiptHealthRating.style.backgroundColor = '#e74c3c';
  }

  // Slide thermal receipt out
  thermalReceipt.classList.remove('hidden');
  // Trigger transition flow after display block
  setTimeout(() => {
    thermalReceipt.classList.add('printed');
  }, 50);
}

// Add vibrate keyframe animations on the fly
const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes vibrate {
  0% { transform: rotate(-1.5deg) translate(0, 0); }
  20% { transform: rotate(-1.5deg) translate(-2px, 1px); }
  40% { transform: rotate(-1.5deg) translate(1px, -2px); }
  60% { transform: rotate(-1.5deg) translate(-1px, 2px); }
  80% { transform: rotate(-1.5deg) translate(2px, -1px); }
  100% { transform: rotate(-1.5deg) translate(0, 0); }
}
`;
document.head.appendChild(styleSheet);

// --- INITIALIZE SYSTEM ---
window.addEventListener('DOMContentLoaded', () => {
  loadState();
  setupListeners();
  
  // Set up liquid canvas
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  animateWater();
});
