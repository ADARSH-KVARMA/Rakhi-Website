/**
 * ============================================================================
 * PERSONALIZATION & CONFIGURATION SYSTEM
 * Edit this section to change names, memories, messages, and colors
 * ============================================================================
 */
const CONFIG = {
    // 1. Sister's Name
    sisterName: "Rakhi", // Change this to your sister's actual name

    // 2. Memory Lane (Layer 2)
    // Add, remove, or modify items here.
    // Use relative paths for local images or full URLs.
    // If files are missing, a beautiful fallback container will be rendered automatically.
    memories: [
        {
            image: "/static/images/memory1.jpg",
            title: "The Good Old Days",
            year: "Childhood",
            text: "No matter how much we argued over TV remotes, sharing toys, or who got the bigger slice of cake, looking back, those little moments are some of my absolute favorites."
        },
        {
            image: "/static/images/memory2.jpg",
            title: "Our Family Adventures",
            year: "2018",
            text: "Remember that vacation where everything went slightly off-plan but we ended up laughing the entire time anyway? Adventures are always better with you around."
        },
        {
            image: "/static/images/memory3.jpg",
            title: "Festival Celebrations",
            year: "2021",
            text: "Dressing up, stuffing ourselves with sweets, and tying the Rakhi. Year after year, this bond only grows stronger and more special."
        },
        {
            image: "/static/images/memory4.jpg",
            title: "Partner In Crime",
            year: "Always",
            text: "For all the secrets kept, the shared jokes, the fights that lasted five minutes, and the times we stood up for each other. Here's to us, forever!"
        }
    ],

    // 3. Heartfelt Message (Layer 4)
    // Each string in this array will be displayed as a paragraph in the letter.
    finalMessage: [
        "Growing up with you has given me more memories than I can count.",
        "We've laughed till our stomachs hurt, fought over the silliest things, annoyed each other to no end, and supported each other when it mattered most.",
        "Somewhere between all those daily arguments and late-night talks, you became one of the most important people in my life.",
        "I may not say it every day, because that would be 'un-brotherly'...",
        "but I'm incredibly lucky to have you as my sister. Thank you for being you. ❤️"
    ],

    // 4. Easter Egg Message (Secret Heart)
    easterEggMessage: "Okay fine... \n\nOne more thing. \n\nYou are officially the best sister in the world. \n\nBut don't let this get to your head. 😌😂"
};

/**
 * ============================================================================
 * CORE APPLICATION LOGIC & STATE MACHINE
 * Do not modify this logic unless you want to change website behavior
 * ============================================================================
 */

// Application State Variables
let currentLayer = 0;
let quizAnswerSelected = false;
let currentMemoryIndex = 0;
let cashButtonAttempts = 0;
const maxCashButtonAttempts = 3;
let typewriterActive = false;
let typewriterTimeout = null;
let easterEggCount = 0;

// Audio State
let audioPlaying = false;
const bgMusic = document.getElementById("bg-music");
const musicBtn = document.getElementById("music-btn");

// Confetti Setup
const canvas = document.getElementById("confetti-canvas");
const ctx = canvas.getContext("2d");
let confettiParticles = [];
let confettiAnimationId = null;

// Initialize on load
document.addEventListener("DOMContentLoaded", () => {
    // Render sister name in final layout
    const nameSpan = document.getElementById("final-sister-name");
    if (nameSpan) nameSpan.textContent = CONFIG.sisterName + " ❤️";

    // Set initial size of confetti canvas
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Load Memories into Carousel
    loadMemories();

    // Start background ambient particles
    startAmbientParticles();

    // Setup Event Listeners
    setupEventListeners();
});

// Resize confetti canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Event Listeners Registration
function setupEventListeners() {
    // Welcome Layer Trigger
    document.getElementById("start-btn").addEventListener("click", () => {
        // Play music (first user gesture)
        toggleMusic(true);
        // Go to Layer 1
        transitionToLayer(1);
        // Highlight first step in progress
        document.getElementById("progress-bar-container").classList.remove("hidden");
    });

    // Quiz Options (Layer 1)
    const options = document.querySelectorAll(".btn-option");
    options.forEach(opt => {
        opt.addEventListener("click", (e) => {
            selectQuizOption(e.target);
        });
    });

    // Proceed to Memory Lane
    document.getElementById("to-layer-2-btn").addEventListener("click", () => {
        transitionToLayer(2);
    });

    // Carousel controls
    document.getElementById("carousel-prev").addEventListener("click", () => shiftCarousel(-1));
    document.getElementById("carousel-next").addEventListener("click", () => shiftCarousel(1));

    // Proceed to Layer 3 (Game)
    document.getElementById("to-layer-3-btn").addEventListener("click", () => {
        transitionToLayer(3);
        resetCashButton();
    });

    // Game (Layer 3) Cash Trick Taps / Hovers
    const cashBtn = document.getElementById("cash-btn");
    
    // Support hover (desktop) & touch/pointer (mobile)
    cashBtn.addEventListener("pointerenter", handleCashButtonInteraction);
    cashBtn.addEventListener("pointerdown", (e) => {
        e.preventDefault(); // Prevent double trigger
        handleCashButtonInteraction();
    });
    cashBtn.addEventListener("click", (e) => {
        if (cashButtonAttempts < maxCashButtonAttempts) {
            e.preventDefault();
            handleCashButtonInteraction();
        } else {
            // Trigger winning modal
            showCashWinModal();
        }
    });

    // Surprise Gift selection (Genuine option)
    document.getElementById("gift-btn").addEventListener("click", () => {
        triggerConfetti(4000);
        transitionToLayer(4);
        startTypewriterMessage();
    });

    // Close Cash Trick win Modal
    document.getElementById("close-cash-modal").addEventListener("click", () => {
        document.getElementById("cash-win-modal").classList.add("hidden");
        // Highlight the Gift Button
        const giftBtn = document.getElementById("gift-btn");
        giftBtn.classList.add("btn-bounce");
        giftBtn.focus();
    });

    // Skip typewriter logic if clicked
    document.getElementById("typewriter-content").addEventListener("click", skipTypewriter);

    // Proceed to Layer 5
    document.getElementById("to-layer-5-btn").addEventListener("click", () => {
        transitionToLayer(5);
        triggerConfetti(5000);
    });

    // Restart/Replay logic
    document.getElementById("replay-btn").addEventListener("click", resetExperience);

    // Secret Easter Egg
    document.getElementById("easter-egg-btn").addEventListener("click", handleEasterEgg);

    // Toggle Music manually
    musicBtn.addEventListener("click", () => {
        toggleMusic(!audioPlaying);
    });
}

/**
 * ============================================================================
 * STATE LAYER TRANSITIONS
 * ============================================================================
 */
function transitionToLayer(targetLayer) {
    const currentLayerEl = document.getElementById(`layer-${currentLayer}`);
    const nextLayerEl = document.getElementById(`layer-${targetLayer}`);
    
    if (!nextLayerEl) return;

    // Fade out current layer
    if (currentLayerEl) {
        currentLayerEl.classList.remove("active");
        setTimeout(() => {
            currentLayerEl.style.display = "none";
            
            // Setup next layer
            nextLayerEl.style.display = "flex";
            // For browsers to register display flex and animate properly
            void nextLayerEl.offsetWidth;
            nextLayerEl.classList.add("active");
            
            currentLayer = targetLayer;
            updateProgressTracker(targetLayer);
        }, 500); // Wait for transition out
    } else {
        nextLayerEl.style.display = "flex";
        nextLayerEl.classList.add("active");
        currentLayer = targetLayer;
        updateProgressTracker(targetLayer);
    }
}

// Update the top floral progress step tracker
function updateProgressTracker(layerIndex) {
    const dots = document.querySelectorAll(".step-dot");
    dots.forEach((dot, index) => {
        const stepNum = index + 1;
        if (stepNum < layerIndex) {
            dot.classList.add("completed");
            dot.classList.remove("active");
            dot.innerHTML = "❤️"; // Heart icon for finished scenes
        } else if (stepNum === layerIndex) {
            dot.classList.add("active");
            dot.classList.remove("completed");
            dot.innerHTML = "🌸"; // Active flower marker
        } else {
            dot.classList.remove("active", "completed");
            dot.innerHTML = "🌸";
        }
    });
}

// Reset entire state back to welcome screen
function resetExperience() {
    currentLayer = 0;
    quizAnswerSelected = false;
    currentMemoryIndex = 0;
    cashButtonAttempts = 0;
    typewriterActive = false;
    clearTimeout(typewriterTimeout);

    // Reset Quiz UI
    const options = document.querySelectorAll(".btn-option");
    options.forEach(opt => opt.classList.remove("selected"));
    document.getElementById("quiz-feedback").classList.add("hidden");
    document.getElementById("quiz-next-container").classList.add("hidden");

    // Reset carousel
    shiftCarousel(0);

    // Reset letter
    document.getElementById("typewriter-content").innerHTML = "";
    document.getElementById("letter-next-container").classList.add("hidden");

    // Hide progress bar on welcome
    document.getElementById("progress-bar-container").classList.add("hidden");

    // Hide any modals
    document.getElementById("cash-win-modal").classList.add("hidden");

    // Loop through layers and hide them
    for (let i = 1; i <= 5; i++) {
        const layer = document.getElementById(`layer-${i}`);
        layer.classList.remove("active");
        layer.style.display = "none";
    }

    // Set Layer 0 as active
    const layer0 = document.getElementById("layer-0");
    layer0.style.display = "flex";
    layer0.classList.add("active");
}

/**
 * ============================================================================
 * MUSIC PLAYER MANAGEMENT
 * Handles play, pause, audio visualizer styling, and missing files
 * ============================================================================
 */
function toggleMusic(play) {
    if (play) {
        bgMusic.play()
            .then(() => {
                audioPlaying = true;
                musicBtn.classList.add("playing");
            })
            .catch((err) => {
                console.log("Audio autoplay blocked or file missing: ", err);
                audioPlaying = false;
                musicBtn.classList.remove("playing");
            });
    } else {
        bgMusic.pause();
        audioPlaying = false;
        musicBtn.classList.remove("playing");
    }
}

/**
 * ============================================================================
 * LAYER 1: QUIZ GAME LOGIC
 * ============================================================================
 */
function selectQuizOption(selectedButton) {
    if (quizAnswerSelected) return; // Allow selecting once to emphasize feedback

    const selectedOption = selectedButton.getAttribute("data-option");
    
    // Select styling
    const options = document.querySelectorAll(".btn-option");
    options.forEach(opt => opt.classList.remove("selected"));
    selectedButton.classList.add("selected");

    // Playful answers dictionary
    let feedback = "";
    switch(selectedOption) {
        case "A":
            feedback = "Hmm... confident. Let's see about that 👀";
            break;
        case "B":
            feedback = "Unfortunately for you, that's correct 😂";
            break;
        case "C":
            feedback = "Fair enough. I understand. 😅";
            break;
        case "D":
            feedback = "ERROR 404: Sister pretending not to know brother. 🤖";
            break;
    }

    // Display feedback message
    const feedbackBox = document.getElementById("quiz-feedback");
    const feedbackText = document.getElementById("feedback-text");
    feedbackText.textContent = feedback;
    feedbackBox.classList.remove("hidden");

    // Reveal next button after choice
    const nextContainer = document.getElementById("quiz-next-container");
    nextContainer.classList.remove("hidden");
}

/**
 * ============================================================================
 * LAYER 2: CAROUSEL COMPONENT
 * ============================================================================
 */
function loadMemories() {
    const container = document.getElementById("carousel-inner");
    container.innerHTML = "";

    CONFIG.memories.forEach((mem, index) => {
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("memory-card");

        // Fallback onerror hook to graceful render beautiful fallback card if image path fails
        cardDiv.innerHTML = `
            <div class="memory-image-container">
                <img src="${mem.image}" alt="${mem.title}" class="memory-image" onerror="handleMemoryImageError(this, '${mem.title}')">
            </div>
            <div class="memory-meta">
                <span class="memory-year">📍 ${mem.year}</span>
                <span class="memory-num">Memory #${String(index + 1).padStart(2, '0')}</span>
            </div>
            <h3 class="memory-card-title">${mem.title}</h3>
            <p class="memory-card-text">${mem.text}</p>
        `;
        container.appendChild(cardDiv);
    });

    updateCarouselIndicator();
}

// Graceful missing memory photo fallback
window.handleMemoryImageError = function(imgElement, title) {
    const container = imgElement.parentElement;
    if (container) {
        container.innerHTML = `
            <div class="memory-fallback-card">
                <div class="fallback-icon">❤️</div>
                <div class="fallback-label">${title}</div>
            </div>
        `;
    }
};

function shiftCarousel(direction) {
    const totalMemories = CONFIG.memories.length;
    currentMemoryIndex += direction;

    if (currentMemoryIndex < 0) {
        currentMemoryIndex = totalMemories - 1;
    } else if (currentMemoryIndex >= totalMemories) {
        currentMemoryIndex = 0;
    }

    const container = document.getElementById("carousel-inner");
    container.style.transform = `translateX(-${currentMemoryIndex * 100}%)`;
    
    updateCarouselIndicator();
}

function updateCarouselIndicator() {
    const totalMemories = CONFIG.memories.length;
    document.getElementById("carousel-indicator").textContent = `${currentMemoryIndex + 1} / ${totalMemories}`;
}

/**
 * ============================================================================
 * LAYER 3: THE ₹10,000 ESCAPING BUTTON GAME
 * ============================================================================
 */
function handleCashButtonInteraction() {
    if (cashButtonAttempts >= maxCashButtonAttempts) return;

    cashButtonAttempts++;

    const cashBtn = document.getElementById("cash-btn");
    const gameArea = document.getElementById("trick-game-area");
    
    // Bounds of parent container
    const areaRect = gameArea.getBoundingClientRect();
    const btnRect = cashBtn.getBoundingClientRect();

    // Ensure button is positioned absolute inside its relative container
    cashBtn.style.position = "absolute";
    cashBtn.style.zIndex = "40";

    // Set bubble tooltip messages
    let message = "Are you sure? 👀";
    if (cashButtonAttempts === 2) {
        message = "Nice try 😂";
    } else if (cashButtonAttempts >= 3) {
        message = "₹10,000 has left the chat. 🏃💨";
    }

    showTrickBubble(message);

    // Compute random coordinate offset within parent gameArea box boundaries
    const padding = 15;
    const maxX = areaRect.width - btnRect.width - padding;
    const maxY = areaRect.height - btnRect.height - padding;

    // Pick random target X & Y within constraints
    const targetX = Math.max(padding, Math.floor(Math.random() * maxX));
    const targetY = Math.max(padding, Math.floor(Math.random() * maxY));

    // Apply translations
    cashBtn.style.left = `${targetX}px`;
    cashBtn.style.top = `${targetY}px`;
}

function showTrickBubble(message) {
    const bubble = document.getElementById("trick-bubble");
    const textSpan = document.getElementById("trick-bubble-text");
    
    textSpan.textContent = message;
    bubble.classList.remove("hidden");

    // Hide tooltip bubble after 2 seconds
    setTimeout(() => {
        bubble.classList.add("hidden");
    }, 2000);
}

function resetCashButton() {
    cashButtonAttempts = 0;
    const cashBtn = document.getElementById("cash-btn");
    
    // Reset properties to default flow
    cashBtn.style.position = "static";
    cashBtn.style.left = "auto";
    cashBtn.style.top = "auto";
    cashBtn.style.transform = "none";
    document.getElementById("trick-bubble").classList.add("hidden");
    
    // Remove pulse bounce from surprise gift if re-entered
    document.getElementById("gift-btn").classList.remove("btn-bounce");
}

function showCashWinModal() {
    document.getElementById("cash-win-modal").classList.remove("hidden");
}

/**
 * ============================================================================
 * LAYER 4: ENVELOPE TYPEWRITER LETTERS
 * ============================================================================
 */
let fullTextToStream = "";
function startTypewriterMessage() {
    typewriterActive = true;
    const contentBox = document.getElementById("typewriter-content");
    contentBox.innerHTML = "";
    document.getElementById("letter-next-container").classList.add("hidden");

    // Concatenate full letter messages with linebreaks
    fullTextToStream = CONFIG.finalMessage.join("\n\n");

    let charIndex = 0;
    
    function typeNextChar() {
        if (!typewriterActive) return;

        if (charIndex < fullTextToStream.length) {
            const char = fullTextToStream.charAt(charIndex);
            
            // Safe character injection
            if (char === "\n") {
                contentBox.appendChild(document.createElement("br"));
            } else {
                contentBox.append(char);
            }
            
            charIndex++;
            // Scroll to keep content visible if overflow on small mobile heights
            contentBox.scrollTop = contentBox.scrollHeight;

            // Speed customization: slightly faster for letters to prevent boredom
            const delay = char === "." || char === "," || char === "?" || char === "!" ? 280 : 35;
            typewriterTimeout = setTimeout(typeNextChar, delay);
        } else {
            finishLetter();
        }
    }

    typeNextChar();
}

function skipTypewriter() {
    if (!typewriterActive) return;
    
    // Clear dynamic loops
    typewriterActive = false;
    clearTimeout(typewriterTimeout);

    // Set full HTML content instantly
    const contentBox = document.getElementById("typewriter-content");
    contentBox.innerHTML = "";
    
    CONFIG.finalMessage.forEach((paragraph, idx) => {
        const p = document.createElement("p");
        p.textContent = paragraph;
        p.style.marginBottom = "12px";
        contentBox.appendChild(p);
    });

    finishLetter();
}

function finishLetter() {
    typewriterActive = false;
    document.getElementById("letter-next-container").classList.remove("hidden");
}

/**
 * ============================================================================
 * EASTER EGG MANAGER
 * ============================================================================
 */
function handleEasterEgg() {
    easterEggCount++;
    
    // Small micro-jump on egg button
    const eggBtn = document.getElementById("easter-egg-btn");
    eggBtn.style.transform = `scale(${1 + easterEggCount * 0.15})`;

    if (easterEggCount >= 5) {
        // Trigger surprise
        triggerConfetti(5000);
        
        // Show sweet custom popup message
        alert(CONFIG.easterEggMessage);
        
        // Reset counter
        easterEggCount = 0;
        eggBtn.style.transform = "scale(1)";
    }
}

/**
 * ============================================================================
 * AMBIENT BACKGROUND PARTICLES
 * Generates floating hearts, stars, and flowers
 * ============================================================================
 */
function startAmbientParticles() {
    const container = document.getElementById("particle-container");
    const symbols = ["❤️", "🌸", "✨", "🌟", "🌸"];

    function spawnParticle() {
        if (document.hidden) return; // Pause on tab switch for performance

        // Don't spawn if reduced motion is preferred
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const particle = document.createElement("span");
        particle.classList.add("ambient-particle");
        
        // Configure random coordinates & styles
        particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        particle.style.left = `${Math.random() * 100}vw`;
        
        const size = Math.floor(Math.random() * 15) + 12; // 12px to 27px
        particle.style.fontSize = `${size}px`;

        const duration = Math.floor(Math.random() * 6) + 6; // 6s to 12s
        particle.style.animationDuration = `${duration}s`;

        container.appendChild(particle);

        // Remove element from DOM after animation completes
        setTimeout(() => {
            particle.remove();
        }, duration * 1000);
    }

    // Spawn particle every 1.5 seconds
    setInterval(spawnParticle, 1500);
}

/**
 * ============================================================================
 * LIGHTWEIGHT CANVASES CONFETTI ENGINE
 * Pure client-side confetti particles script with gravity physics
 * ============================================================================
 */
function triggerConfetti(durationMs) {
    // Reset active particles
    confettiParticles = [];
    if (confettiAnimationId) cancelAnimationFrame(confettiAnimationId);

    const colors = ["#ff6b6b", "#e64980", "#fa5252", "#cc5de8", "#748ffc", "#4dabf7", "#fab005", "#fd7e14"];
    const shapes = ["circle", "rect"];

    // Spawn function
    function addParticles() {
        for (let i = 0; i < 6; i++) {
            confettiParticles.push({
                x: Math.random() * canvas.width,
                y: -20,
                r: Math.floor(Math.random() * 8) + 4, // size radius
                color: colors[Math.floor(Math.random() * colors.length)],
                shape: shapes[Math.floor(Math.random() * shapes.length)],
                vx: (Math.random() * 4) - 2, // horizontal speed
                vy: Math.random() * 3 + 4,   // falling speed
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() * 4) - 2
            });
        }
    }

    let isSpawning = true;
    const interval = setInterval(() => {
        if (isSpawning) addParticles();
    }, 80);

    // Stop spawning particles after duration
    setTimeout(() => {
        isSpawning = false;
        clearInterval(interval);
    }, durationMs);

    // Canvas render frame loops
    function updateConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < confettiParticles.length; i++) {
            const p = confettiParticles[i];

            // Update position & speed
            p.y += p.vy;
            p.x += p.vx;
            p.rotation += p.rotationSpeed;

            // Render shape
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = p.color;

            if (p.shape === "circle") {
                ctx.beginPath();
                ctx.arc(0, 0, p.r, 0, 2 * Math.PI);
                ctx.fill();
            } else {
                ctx.fillRect(-p.r, -p.r, p.r * 2, p.r * 1.5);
            }
            ctx.restore();

            // Recycle offscreen particles
            if (p.y > canvas.height) {
                confettiParticles.splice(i, 1);
                i--;
            }
        }

        // Loop if there are still active particles on canvas
        if (isSpawning || confettiParticles.length > 0) {
            confettiAnimationId = requestAnimationFrame(updateConfetti);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    updateConfetti();
}
