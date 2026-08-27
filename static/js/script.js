/**
 * ============================================================================
 * PERSONALIZATION & CONFIGURATION SYSTEM
 * Edit this section to change names, memories, messages, and colors
 * ============================================================================
 */
const CONFIG = {
    // 1. Sister's Name
    sisterName: "Kajal Didi", // Change this to your sister's actual name

    // 2. Brother's Name
    brotherName: "Adarsh", // Change this to your name

    // 3. Memory Lane (Layer 3)
    // Add, remove, or modify items here.
    // Use relative paths for local images or full URLs.
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
            year: "2024",
            text: "Remember that vacation where everything went slightly off-plan but we ended up laughing the entire time anyway? Adventures are always better with you around."
        },
        {
            image: "/static/images/memory3.jpg",
            title: "Festival Celebrations",
            year: "2022",
            text: "Dressing up, stuffing ourselves with sweets, and tying the Rakhi. Year after year, this bond only grows stronger and more special."
        },
        {
            image: "/static/images/memory4.jpg",
            title: "Partner In Crime",
            year: "Always",
            text: "For all the secrets kept, the shared jokes, the fights that lasted five minutes, and the times we stood up for each other. Here's to us, forever!"
        }
    ],

    // 4. Childhood Guess Image (Layer 7)
    childhoodGuess: {
        image: "/static/images/childhood_guess.jpg",
        question: "Can you guess what's happening here? 👀",
        options: [
            "A. We were behaving normally",
            "B. Something definitely went wrong",
            "C. We found a Bhaloo"
        ],
        correctAnswer: "C",
        feedback: "Plot twist: It was probably C. 😂"
    },

    // 5. Things I Never Say Enough (Layer 10 Typewriter Letter)
    thingsNeverSaid: [
        "I'm proud of you.",
        "I appreciate you.",
        "I'm glad I get to call you my sister.",
        "And yes...",
        "I secretly care about you a lot. Don't tell anyone. 😌"
    ],

    // 6. Final Personalized Message (Layer 14 Letter)
    finalMessageParagraphs: [
        "We've grown up. We've changed. Life will keep changing.",
        "But no matter how old we get, I'll always be your brother.\n\nThe annoying one.\nThe protective one.\nThe one who will make fun of you.\nAnd hopefully, the one you can always count on.\n\nThank you for being part of so many of my favorite memories."
    ],

    // 7. Climax Final Quote & Text
    finalQuote: "Some bonds are written by destiny.\n\nOurs was written by life.\n\nAnd I'm really lucky it gave me you. ❤️",
    finalWishesText: "Happy Raksha Bandhan, [Sister] ❤️",

    // 8. Funny Responses
    funnyResponses: [
        "I knew you'd choose that 😂",
        "Interesting decision...",
        "I'm judging you silently. 😌",
        "Okay, I'll allow it.",
        "That's exactly what I expected.",
        "Mom would probably disagree. 😂"
    ],

    // 9. Easter Egg Message (Secret Heart)
    easterEggMessage: "Okay fine... \n\nOne more thing. \n\nYou are officially the best sister in the world. \n\nBut don't let this get to your head. 😌😂"
};

/**
 * ============================================================================
 * CORE APPLICATION LOGIC & STATE MACHINE
 * ============================================================================
 */

// Application State Variables
let currentLayer = 1;
const totalLayers = 14;

let quizAnswerSelected = false;
let currentMemoryIndex = 0;
let cashButtonAttempts = 0;
const maxCashButtonAttempts = 4;

let typewriterActive = false;
let typewriterTimeout = null;

// Sibling poll selection state
let pollAnswerSelected = false;
let sentenceAnswerSelected = false;
let guessAnswerSelected = false;
let detectorAnswerSelected = false;
let soundtrackSelected = false;
let brotherSelected = false;
let timeMachineSelected = false;
let sisterClimaxSelected = false;
let sisterNoBtnAttempts = 0;

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

    // Load Guess Image (Layer 7)
    loadGuessImage();

    // Start background ambient particles
    startAmbientParticles();

    // Setup Event Listeners
    setupEventListeners();

    // Check localStorage saved progress
    checkSavedProgress();
});

// Resize confetti canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Check LocalStorage saved progress
function checkSavedProgress() {
    const savedProgress = localStorage.getItem("rakshaBandhanProgress");
    if (savedProgress) {
        const progressNum = parseInt(savedProgress, 10);
        if (progressNum > 1 && progressNum <= totalLayers) {
            // Show resume prompt modal
            const resumeModal = document.getElementById("resume-modal");
            resumeModal.classList.remove("hidden");

            document.getElementById("resume-yes-btn").onclick = () => {
                resumeModal.classList.add("hidden");
                toggleMusic(true);
                goToLayer(progressNum);
            };

            document.getElementById("resume-no-btn").onclick = () => {
                resumeModal.classList.add("hidden");
                localStorage.removeItem("rakshaBandhanProgress");
                goToLayer(1);
            };
            return;
        }
    }
    // Default start
    goToLayer(1);
}

// Get random response from funny responses list
function getRandomFunnyResponse() {
    const list = CONFIG.funnyResponses;
    return list[Math.floor(Math.random() * list.length)];
}

// Event Listeners Registration
function setupEventListeners() {
    // Welcome Layer Trigger (Layer 1 -> 2)
    document.getElementById("start-btn").addEventListener("click", () => {
        toggleMusic(true);
        transitionToLayer(2);
    });

    // Quiz Options (Layer 2)
    const options = document.querySelectorAll("#layer-2 .btn-option");
    options.forEach(opt => {
        opt.addEventListener("click", (e) => {
            selectQuizOption(e.target);
        });
    });

    // Proceed to Memory Lane
    document.getElementById("to-layer-3-btn").addEventListener("click", () => {
        transitionToLayer(3);
    });

    // Carousel controls (Layer 3)
    document.getElementById("carousel-prev").addEventListener("click", () => shiftCarousel(-1));
    document.getElementById("carousel-next").addEventListener("click", () => shiftCarousel(1));

    // Proceed to Sibling Poll (Layer 3 -> 4)
    document.getElementById("to-layer-4-btn").addEventListener("click", () => {
        transitionToLayer(4);
    });

    // Sibling Poll (Layer 4)
    const pollOptions = document.querySelectorAll(".poll-option");
    pollOptions.forEach(opt => {
        opt.addEventListener("click", (e) => {
            selectPollOption(e.target);
        });
    });

    // Proceed to ₹10k Cash Trick (Layer 4 -> 5)
    document.getElementById("to-layer-5-btn").addEventListener("click", () => {
        transitionToLayer(5);
        resetCashButton();
    });

    // Game (Layer 5) Cash Trick Taps / Hovers
    const cashBtn = document.getElementById("cash-btn");
    cashBtn.addEventListener("pointerenter", handleCashButtonInteraction);
    cashBtn.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        handleCashButtonInteraction();
    });
    cashBtn.addEventListener("click", (e) => {
        e.preventDefault();
        handleCashButtonInteraction();
    });

    // Surprise Gift selection (Layer 5 genuine option)
    document.getElementById("gift-btn").addEventListener("click", () => {
        triggerConfetti(3000);
        transitionToLayer(6);
    });

    // Close Cash Trick win Modal
    document.getElementById("close-cash-modal").addEventListener("click", () => {
        document.getElementById("cash-win-modal").classList.add("hidden");
        const giftBtn = document.getElementById("gift-btn");
        giftBtn.classList.add("btn-bounce");
        giftBtn.focus();
    });

    // Complete Sentence Options (Layer 6)
    const sentenceOptions = document.querySelectorAll(".sentence-option");
    sentenceOptions.forEach(opt => {
        opt.addEventListener("click", (e) => {
            selectSentenceOption(e.target);
        });
    });

    // Proceed to Guess Memory (Layer 6 -> 7)
    document.getElementById("to-layer-7-btn").addEventListener("click", () => {
        transitionToLayer(7);
    });

    // Guess Photo Options (Layer 7)
    const guessOptions = document.querySelectorAll(".guess-option");
    guessOptions.forEach(opt => {
        opt.addEventListener("click", (e) => {
            selectGuessOption(e.target);
        });
    });

    // Proceed to Truth Detector (Layer 7 -> 8)
    document.getElementById("to-layer-8-btn").addEventListener("click", () => {
        transitionToLayer(8);
    });

    // Truth Detector Options (Layer 8)
    const detectorOptions = document.querySelectorAll(".detector-option");
    detectorOptions.forEach(opt => {
        opt.addEventListener("click", (e) => {
            runTruthDetector(e.target);
        });
    });

    // Proceed to Soundtrack (Layer 8 -> 9)
    document.getElementById("to-layer-9-btn").addEventListener("click", () => {
        transitionToLayer(9);
    });

    // Soundtrack Card Options (Layer 9)
    const soundtrackCards = document.querySelectorAll(".soundtrack-card");
    soundtrackCards.forEach(card => {
        card.addEventListener("click", (e) => {
            selectSoundtrack(e.currentTarget);
        });
    });

    // Proceed to Typewriter Letter (Layer 9 -> 10)
    document.getElementById("to-layer-10-btn").addEventListener("click", () => {
        transitionToLayer(10);
    });

    // Skip typewriter logic if clicked
    document.getElementById("typewriter-content").addEventListener("click", skipTypewriter);

    // Proceed to Choose Brother (Layer 10 -> 11)
    document.getElementById("to-layer-11-btn").addEventListener("click", () => {
        transitionToLayer(11);
    });

    // Choose Brother Options (Layer 11)
    const brotherOptions = document.querySelectorAll(".brother-option");
    brotherOptions.forEach(opt => {
        opt.addEventListener("click", (e) => {
            selectBrotherOption(e.target);
        });
    });

    // Proceed to Time Machine (Layer 11 -> 12)
    document.getElementById("to-layer-12-btn").addEventListener("click", () => {
        transitionToLayer(12);
    });

    // Time Machine Card Options (Layer 12)
    const timeCards = document.querySelectorAll(".time-card");
    timeCards.forEach(card => {
        card.addEventListener("click", (e) => {
            selectTimeCard(e.currentTarget);
        });
    });

    // Proceed to Climax Question (Layer 12 -> 13)
    document.getElementById("to-layer-13-btn").addEventListener("click", () => {
        transitionToLayer(13);
        resetClimaxButtons();
    });

    // Layer 13 Climax buttons
    const sisterYesBtn = document.getElementById("sister-yes-btn");
    const sisterNoBtn = document.getElementById("sister-no-btn");

    sisterNoBtn.addEventListener("pointerenter", handleSisterNoButtonInteraction);
    sisterNoBtn.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        handleSisterNoButtonInteraction();
    });
    sisterNoBtn.addEventListener("click", (e) => {
        e.preventDefault();
        handleSisterNoButtonInteraction();
    });

    sisterYesBtn.addEventListener("click", () => {
        selectSisterClimaxYes();
    });

    // Proceed to Final Reveal (Layer 13 -> 14)
    document.getElementById("to-layer-14-btn").addEventListener("click", () => {
        transitionToLayer(14);
    });

    // Climax surprise trigger button on Layer 14
    document.getElementById("final-thing-btn").addEventListener("click", triggerFinalSurpriseClimax);

    // Toggle Memory Vault Modal
    document.getElementById("vault-lock-btn").addEventListener("click", openMemoryVault);
    document.getElementById("close-vault-btn").addEventListener("click", closeMemoryVault);

    // Toggle Music manually
    musicBtn.addEventListener("click", () => {
        toggleMusic(!audioPlaying);
    });

    // Restart/Replay logic
    document.getElementById("replay-btn").addEventListener("click", resetExperience);

    // Progress bar anti-cheating warning
    document.getElementById("progress-bar-container").addEventListener("click", () => {
        showFloatingToast("No cheating 😌 You have to experience the whole thing.");
    });

    // Screen click particles triggers
    document.addEventListener("click", spawnMicroParticle);
}

/**
 * ============================================================================
 * STATE LAYER TRANSITIONS
 * ============================================================================
 */
function transitionToLayer(targetLayer) {
    if (targetLayer < 1 || targetLayer > totalLayers) return;

    // Check if we need to show a chapter transition
    let needChapter = false;
    let badgeText = "";
    let titleText = "";

    if (targetLayer === 5) {
        needChapter = true;
        badgeText = "CHAPTER 2";
        titleText = "The Memories ❤️";
    } else if (targetLayer === 9) {
        needChapter = true;
        badgeText = "CHAPTER 3";
        titleText = "The Chaos 😂";
    } else if (targetLayer === 12) {
        needChapter = true;
        badgeText = "CHAPTER 4";
        titleText = "The Things I Never Say";
    } else if (targetLayer === 14) {
        needChapter = true;
        badgeText = "FINAL CHAPTER";
        titleText = "For You ❤️";
    }

    if (needChapter) {
        showChapterTransition(badgeText, titleText, () => {
            goToLayer(targetLayer);
        });
    } else {
        goToLayer(targetLayer);
    }
}

function showChapterTransition(badgeText, titleText, callback) {
    const overlay = document.getElementById("chapter-overlay");
    const badge = document.getElementById("chapter-badge");
    const title = document.getElementById("chapter-title");

    badge.textContent = badgeText;
    title.textContent = titleText;

    overlay.classList.remove("hidden");

    setTimeout(() => {
        overlay.classList.add("hidden");
        if (callback) callback();
    }, 1800);
}

function goToLayer(layerNumber) {
    // Save progress
    localStorage.setItem("rakshaBandhanProgress", layerNumber);

    // Hide all layers
    for (let i = 1; i <= totalLayers; i++) {
        const layerEl = document.getElementById(`layer-${i}`);
        if (layerEl) {
            layerEl.classList.remove("active");
            layerEl.style.display = "none";
        }
    }

    // Show target layer
    const nextLayerEl = document.getElementById(`layer-${layerNumber}`);
    if (nextLayerEl) {
        nextLayerEl.style.display = "flex";
        // Force reflow
        void nextLayerEl.offsetWidth;
        nextLayerEl.classList.add("active");
    }

    currentLayer = layerNumber;
    updateProgressTracker(layerNumber);

    // Context triggers per layer
    if (layerNumber === 10) {
        startTypewriterMessage();
    } else if (layerNumber === 14) {
        startFinalRevealSequence();
    }
}

// Update progress bar fill & text
function updateProgressTracker(layerIndex) {
    const container = document.getElementById("progress-bar-container");
    const fill = document.getElementById("progress-bar-fill");
    const text = document.getElementById("progress-text");

    if (layerIndex === 1) {
        container.classList.add("hidden");
    } else {
        container.classList.remove("hidden");
        const percentage = ((layerIndex) / totalLayers) * 100;
        fill.style.width = `${percentage}%`;
        text.textContent = `${layerIndex} / ${totalLayers}`;
    }
}

// Reset entire state back to welcome screen
function resetExperience() {
    localStorage.removeItem("rakshaBandhanProgress");
    currentLayer = 1;
    quizAnswerSelected = false;
    currentMemoryIndex = 0;
    cashButtonAttempts = 0;
    typewriterActive = false;
    clearTimeout(typewriterTimeout);

    pollAnswerSelected = false;
    sentenceAnswerSelected = false;
    guessAnswerSelected = false;
    detectorAnswerSelected = false;
    soundtrackSelected = false;
    brotherSelected = false;
    timeMachineSelected = false;
    sisterClimaxSelected = false;
    sisterNoBtnAttempts = 0;

    // Reset Layer 2 Quiz UI
    const options = document.querySelectorAll("#layer-2 .btn-option");
    options.forEach(opt => opt.classList.remove("selected"));
    document.getElementById("quiz-feedback").classList.add("hidden");
    document.getElementById("quiz-next-container").classList.add("hidden");

    // Reset Layer 3 carousel
    shiftCarousel(0);

    // Reset Layer 4 poll UI
    const pollOpts = document.querySelectorAll(".poll-option");
    pollOpts.forEach(opt => opt.classList.remove("selected"));
    document.getElementById("poll-feedback").classList.add("hidden");
    document.getElementById("poll-next-container").classList.add("hidden");

    // Reset Layer 6 sentence UI
    const sentenceOpts = document.querySelectorAll(".sentence-option");
    sentenceOpts.forEach(opt => opt.classList.remove("selected"));
    document.getElementById("sentence-feedback").classList.add("hidden");
    document.getElementById("sentence-next-container").classList.add("hidden");

    // Reset Layer 7 guess UI
    const guessOpts = document.querySelectorAll(".guess-option");
    guessOpts.forEach(opt => opt.classList.remove("selected"));
    document.getElementById("guess-image-container").classList.add("blurred");
    document.getElementById("guess-feedback").classList.add("hidden");
    document.getElementById("guess-next-container").classList.add("hidden");

    // Reset Layer 8 truth detector UI
    const detectorOpts = document.querySelectorAll(".detector-option");
    detectorOpts.forEach(opt => {
        opt.classList.remove("selected");
        opt.style.display = "inline-flex";
    });
    document.querySelector(".detector-buttons").style.display = "flex";
    document.getElementById("detector-loading").classList.add("hidden");
    document.getElementById("detector-feedback").classList.add("hidden");
    document.getElementById("detector-next-container").classList.add("hidden");

    // Reset Layer 9 soundtrack UI
    const soundtrackCards = document.querySelectorAll(".soundtrack-card");
    soundtrackCards.forEach(card => card.classList.remove("selected"));
    document.getElementById("soundtrack-feedback").classList.add("hidden");
    document.getElementById("soundtrack-next-container").classList.add("hidden");

    // Reset Layer 10 letter typewriter
    document.getElementById("typewriter-content").innerHTML = "";
    document.getElementById("letter-next-container").classList.add("hidden");

    // Reset Layer 11 brother UI
    const brotherOpts = document.querySelectorAll(".brother-option");
    brotherOpts.forEach(opt => opt.classList.remove("selected"));
    document.getElementById("brother-feedback").classList.add("hidden");
    document.getElementById("brother-next-container").classList.add("hidden");

    // Reset Layer 12 time machine UI
    const timeCards = document.querySelectorAll(".time-card");
    timeCards.forEach(card => card.classList.remove("selected"));
    document.getElementById("time-feedback").classList.add("hidden");
    document.getElementById("time-next-container").classList.add("hidden");

    // Reset Layer 13 climax UI
    document.getElementById("sister-feedback").classList.add("hidden");
    document.getElementById("sister-next-container").classList.add("hidden");

    // Reset Layer 14 surprise UI
    document.getElementById("final-pre-reveal").classList.remove("hidden");
    document.getElementById("final-greeting-card").classList.add("hidden");
    document.getElementById("final-thing-btn").classList.remove("hidden");
    document.getElementById("climax-surprise-area").classList.add("hidden");

    // Close any open modals
    document.getElementById("cash-win-modal").classList.add("hidden");
    document.getElementById("memory-vault-modal").classList.add("hidden");

    // Jump to Layer 1
    goToLayer(1);
}

/**
 * ============================================================================
 * MUSIC PLAYER MANAGEMENT
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
 * LAYER 2: QUIZ GAME LOGIC
 * ============================================================================
 */
function selectQuizOption(selectedButton) {
    if (quizAnswerSelected) return;
    quizAnswerSelected = true;

    const selectedOption = selectedButton.getAttribute("data-option");

    // Select styling
    const options = document.querySelectorAll("#layer-2 .btn-option");
    options.forEach(opt => opt.classList.remove("selected"));
    selectedButton.classList.add("selected");

    let feedback = "";
    switch (selectedOption) {
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

    // Append random funny response
    feedback += "\n\n" + getRandomFunnyResponse();

    // Display feedback message
    const feedbackBox = document.getElementById("quiz-feedback");
    const feedbackText = document.getElementById("feedback-text");
    feedbackText.innerText = feedback;
    feedbackBox.classList.remove("hidden");

    // Reveal next button
    document.getElementById("quiz-next-container").classList.remove("hidden");
}

/**
 * ============================================================================
 * LAYER 3: CAROUSEL COMPONENT
 * ============================================================================
 */
function loadMemories() {
    const container = document.getElementById("carousel-inner");
    container.innerHTML = "";

    CONFIG.memories.forEach((mem, index) => {
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("memory-card");

        // Fallback onerror hook to graceful render fallback card if image path fails
        cardDiv.innerHTML = `
            <div class="memory-image-container clickable" ontouchstart="triggerPhotoTooltip(this)" onmouseenter="triggerPhotoTooltip(this)">
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
window.handleMemoryImageError = function (imgElement, title) {
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

// Temporary tooltips on hover/hold memory photos
window.triggerPhotoTooltip = function (element) {
    showFloatingToast("You remember this one? ❤️");
};

/**
 * ============================================================================
 * LAYER 4: POLL
 * ============================================================================
 */
function selectPollOption(selectedButton) {
    if (pollAnswerSelected) return;
    pollAnswerSelected = true;

    const selectedPoll = selectedButton.getAttribute("data-poll");

    const options = document.querySelectorAll(".poll-option");
    options.forEach(opt => opt.classList.remove("selected"));
    selectedButton.classList.add("selected");

    let feedback = "";
    if (selectedPoll === "me") {
        feedback = "Finally! Some honesty. 😌";
    } else if (selectedPoll === "you") {
        feedback = "OBJECTION! This website has been hacked. 😂";
    } else {
        feedback = "The correct diplomatic answer. 🤝";
    }

    feedback += "\n\n" + getRandomFunnyResponse();

    const feedbackBox = document.getElementById("poll-feedback");
    const feedbackText = document.getElementById("poll-feedback-text");
    feedbackText.innerText = feedback;
    feedbackBox.classList.remove("hidden");

    document.getElementById("poll-next-container").classList.remove("hidden");
}

/**
 * ============================================================================
 * LAYER 5: THE ₹10,000 ESCAPING BUTTON GAME
 * ============================================================================
 */
function handleCashButtonInteraction() {
    if (cashButtonAttempts >= maxCashButtonAttempts) {
        // Escaped completely
        const cashBtn = document.getElementById("cash-btn");
        cashBtn.style.display = "none";
        showTrickBubble("₹10,000 has officially escaped. 🏃💨");
        return;
    }

    cashButtonAttempts++;

    const cashBtn = document.getElementById("cash-btn");
    const gameArea = document.getElementById("trick-game-area");

    const areaRect = gameArea.getBoundingClientRect();
    const btnRect = cashBtn.getBoundingClientRect();

    cashBtn.style.position = "absolute";
    cashBtn.style.zIndex = "40";

    let message = "Are you sure? 👀";
    if (cashButtonAttempts === 2) {
        message = "Nice try 😂";
    } else if (cashButtonAttempts === 3) {
        message = "Your financial expectations are too high.";
    } else if (cashButtonAttempts >= 4) {
        message = "₹10,000 is currently unavailable due to 'brother's financial situation.' 😭";
    }

    showTrickBubble(message);

    // Compute coordinates safely inside boundaries
    const padding = 10;
    const maxX = areaRect.width - btnRect.width - padding;
    const maxY = areaRect.height - btnRect.height - padding;

    const targetX = Math.max(padding, Math.floor(Math.random() * maxX));
    const targetY = Math.max(padding, Math.floor(Math.random() * maxY));

    cashBtn.style.left = `${targetX}px`;
    cashBtn.style.top = `${targetY}px`;
}

function showTrickBubble(message) {
    const bubble = document.getElementById("trick-bubble");
    const textSpan = document.getElementById("trick-bubble-text");

    textSpan.textContent = message;
    bubble.classList.remove("hidden");

    setTimeout(() => {
        bubble.classList.add("hidden");
    }, 2000);
}

function resetCashButton() {
    cashButtonAttempts = 0;
    const cashBtn = document.getElementById("cash-btn");

    cashBtn.style.display = "inline-flex";
    cashBtn.style.position = "static";
    cashBtn.style.left = "auto";
    cashBtn.style.top = "auto";
    cashBtn.style.transform = "none";
    document.getElementById("trick-bubble").classList.add("hidden");
    document.getElementById("gift-btn").classList.remove("btn-bounce");
}

/**
 * ============================================================================
 * LAYER 6: COMPLETE THE SENTENCE
 * ============================================================================
 */
function selectSentenceOption(selectedButton) {
    if (sentenceAnswerSelected) return;
    sentenceAnswerSelected = true;

    const optType = selectedButton.getAttribute("data-sentence");
    const options = document.querySelectorAll(".sentence-option");
    options.forEach(opt => opt.classList.remove("selected"));
    selectedButton.classList.add("selected");

    let feedback = "";
    switch (optType) {
        case "best":
            feedback = "Hummm 🤔🤔.. Correct. But let's be real... I'm the best. 😂";
            break;
        case "annoying":
            feedback = "Hey! Correct, but rude. 😂";
            break;
        case "partner":
            feedback = "Always! 🍕";
            break;
        case "hungry":
            feedback = "Valid point. My motu kajal didi 🍟";
            break;
        case "all":
            feedback = "Correct. Especially the annoying part. 😂";
            break;
    }

    feedback += "\n\n" + getRandomFunnyResponse();

    const feedbackBox = document.getElementById("sentence-feedback");
    const feedbackText = document.getElementById("sentence-feedback-text");
    feedbackText.innerText = feedback;
    feedbackBox.classList.remove("hidden");

    document.getElementById("sentence-next-container").classList.remove("hidden");
}

/**
 * ============================================================================
 * LAYER 7: GUESS THE MEMORY
 * ============================================================================
 */
function loadGuessImage() {
    const container = document.getElementById("guess-image-container");
    container.innerHTML = "";

    const img = document.createElement("img");
    img.src = CONFIG.childhoodGuess.image;
    img.alt = "Childhood Guess Photo";
    img.onerror = () => {
        container.innerHTML = `
            <div class="guess-fallback-card">
                <div class="guess-fallback-icon">📸</div>
                <div class="guess-fallback-text">${CONFIG.childhoodGuess.question}</div>
            </div>
        `;
    };
    container.appendChild(img);

    // Apply question configurations
    document.querySelector("#layer-7 .question-text").textContent = CONFIG.childhoodGuess.question;
    const guessButtons = document.querySelectorAll(".guess-option");
    guessButtons.forEach((btn, idx) => {
        btn.textContent = CONFIG.childhoodGuess.options[idx];
    });
}

function selectGuessOption(selectedButton) {
    if (guessAnswerSelected) return;
    guessAnswerSelected = true;

    const opt = selectedButton.getAttribute("data-guess");
    const buttons = document.querySelectorAll(".guess-option");
    buttons.forEach(btn => btn.classList.remove("selected"));
    selectedButton.classList.add("selected");

    // Unblur image
    const container = document.getElementById("guess-image-container");
    container.classList.remove("blurred");

    let feedback = CONFIG.childhoodGuess.feedback;
    feedback += "\n\n" + getRandomFunnyResponse();

    const feedbackBox = document.getElementById("guess-feedback");
    const feedbackText = document.getElementById("guess-feedback-text");
    feedbackText.innerText = feedback;
    feedbackBox.classList.remove("hidden");

    document.getElementById("guess-next-container").classList.remove("hidden");
}

/**
 * ============================================================================
 * LAYER 8: TRUTH DETECTOR
 * ============================================================================
 */
function runTruthDetector(selectedButton) {
    if (detectorAnswerSelected) return;
    detectorAnswerSelected = true;

    const answer = selectedButton.getAttribute("data-detector");
    const buttons = document.querySelectorAll(".detector-option");
    buttons.forEach(btn => {
        if (btn !== selectedButton) {
            btn.style.display = "none";
        }
    });

    // Show loading
    const loadingArea = document.getElementById("detector-loading");
    const statusText = document.getElementById("detector-status-text");
    loadingArea.classList.remove("hidden");

    // Sequence progress checks
    setTimeout(() => {
        statusText.textContent = "Checking childhood records...";
        setTimeout(() => {
            statusText.textContent = "Consulting Mom...";
            setTimeout(() => {
                // Done loading
                loadingArea.classList.add("hidden");

                // Show result
                let result = "";
                if (answer === "yes") {
                    result = "The Truth Detector says: 99.8% suspicious. 😂";
                } else if (answer === "no") {
                    result = "The Truth Detector says: 100% false statement detected. 🤥";
                } else {
                    result = "The Truth Detector says: Silence is admission of guilt. 😂";
                }

                const feedbackBox = document.getElementById("detector-feedback");
                const feedbackText = document.getElementById("detector-feedback-text");
                feedbackText.textContent = result;
                feedbackBox.classList.remove("hidden");

                document.getElementById("detector-next-container").classList.remove("hidden");
            }, 1000);
        }, 1000);
    }, 800);
}

/**
 * ============================================================================
 * LAYER 9: OUR RELATIONSHIP SOUNDTRACK
 * ============================================================================
 */
function selectSoundtrack(selectedCard) {
    if (soundtrackSelected) return;
    soundtrackSelected = true;

    const track = selectedCard.getAttribute("data-soundtrack");
    const cards = document.querySelectorAll(".soundtrack-card");
    cards.forEach(c => c.classList.remove("selected"));
    selectedCard.classList.add("selected");

    let feedback = "";
    if (track === "chaos") {
        feedback = "Chaos: A non-stop rollercoaster of fights, arguments, and screaming. Honestly, wouldn't have it any other way! 🎢😂";
    } else if (track === "comedy") {
        feedback = "Comedy: Daily jokes, sharing memes, and roasting each other. Thank you for always laughing at my stupid jokes (or at least laughing at me). 💀";
    } else if (track === "memories") {
        feedback = "Memories: Because somehow the smallest, most ordinary moments became the ones we remember most. ❤️";
    } else {
        feedback = "Growing Up: From sharing toys to sharing life advice. We grew up, but we'll always remain kids at heart when together. 🥹";
    }

    const feedbackBox = document.getElementById("soundtrack-feedback");
    const feedbackText = document.getElementById("soundtrack-feedback-text");
    feedbackText.innerText = feedback;
    feedbackBox.classList.remove("hidden");

    document.getElementById("soundtrack-next-container").classList.remove("hidden");
}

/**
 * ============================================================================
 * LAYER 10: TYPEWRITER ENVELOPE LETTERS
 * ============================================================================
 */
let charIndex10 = 0;
function startTypewriterMessage() {
    typewriterActive = true;
    const contentBox = document.getElementById("typewriter-content");
    contentBox.innerHTML = "";
    document.getElementById("letter-next-container").classList.add("hidden");

    fullTextToStream = CONFIG.thingsNeverSaid.join("\n\n");
    charIndex10 = 0;

    function typeNextChar() {
        if (!typewriterActive) return;

        if (charIndex10 < fullTextToStream.length) {
            const char = fullTextToStream.charAt(charIndex10);

            if (char === "\n") {
                contentBox.appendChild(document.createElement("br"));
            } else {
                contentBox.append(char);
            }

            charIndex10++;
            contentBox.scrollTop = contentBox.scrollHeight;

            const delay = char === "." || char === "," || char === "?" || char === "!" ? 250 : 35;
            typewriterTimeout = setTimeout(typeNextChar, delay);
        } else {
            finishLetter();
        }
    }

    typeNextChar();
}

function skipTypewriter() {
    if (!typewriterActive) return;
    typewriterActive = false;
    clearTimeout(typewriterTimeout);

    const contentBox = document.getElementById("typewriter-content");
    contentBox.innerHTML = "";

    CONFIG.thingsNeverSaid.forEach((pText) => {
        const p = document.createElement("p");
        p.textContent = pText;
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
 * LAYER 11: CHOOSE YOUR BROTHER
 * ============================================================================
 */
function selectBrotherOption(selectedButton) {
    if (brotherSelected) return;
    brotherSelected = true;

    const opt = selectedButton.getAttribute("data-brother");
    const options = document.querySelectorAll(".brother-option");
    options.forEach(o => o.classList.remove("selected"));
    selectedButton.classList.add("selected");

    let feedback = "";
    switch (opt) {
        case "perfect":
            feedback = "Unfortunately, that model is currently out of stock. 😂";
            break;
        case "current":
            feedback = "Aww. You made the correct choice. ❤️";
            break;
        case "rich":
            feedback = "So money DOES matter. 😭";
            break;
        case "robot":
            feedback = "ERROR: Too emotionally unavailable. 🤖";
            break;
    }

    feedback += "\n\n" + getRandomFunnyResponse();

    const feedbackBox = document.getElementById("brother-feedback");
    const feedbackText = document.getElementById("brother-feedback-text");
    feedbackText.innerText = feedback;
    feedbackBox.classList.remove("hidden");

    document.getElementById("brother-next-container").classList.remove("hidden");
}

/**
 * ============================================================================
 * LAYER 12: THE TIME MACHINE
 * ============================================================================
 */
function selectTimeCard(selectedCard) {
    if (timeMachineSelected) return;
    timeMachineSelected = true;

    const type = selectedCard.getAttribute("data-time");
    const cards = document.querySelectorAll(".time-card");
    cards.forEach(c => c.classList.remove("selected"));
    selectedCard.classList.add("selected");

    let feedback = "";
    switch (type) {
        case "childhood":
            feedback = "Childhood: Back to when our biggest worry was who got to watch cartoons first. If only we knew how fast it would pass. 🥹";
            break;
        case "school":
            feedback = "School Days: Waking up early, packing bags, and sharing lunchboxes. Simple days, precious memories. 🏫";
            break;
        case "family":
            feedback = "Family Trips: Backseat arguments, singing along to radio songs, and the inside jokes that only we understand. ✈️";
            break;
        case "random":
            feedback = "Everyday Days: Maybe we wouldn't change anything. Maybe we'd just stay there for five minutes longer. ❤️";
            break;
    }

    const feedbackBox = document.getElementById("time-feedback");
    const feedbackText = document.getElementById("time-feedback-text");
    feedbackText.innerText = feedback;
    feedbackBox.classList.remove("hidden");

    document.getElementById("time-next-container").classList.remove("hidden");
}

/**
 * ============================================================================
 * LAYER 13: ONE LAST QUESTION (CLIMAX SISTER PROMPT)
 * ============================================================================
 */
function handleSisterNoButtonInteraction() {
    sisterNoBtnAttempts++;

    const noBtn = document.getElementById("sister-no-btn");
    const container = document.getElementById("climax-buttons-container");
    const areaRect = container.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();

    noBtn.style.position = "absolute";
    noBtn.style.zIndex = "40";

    const feedbackBox = document.getElementById("sister-feedback");
    const feedbackText = document.getElementById("sister-feedback-text");
    feedbackText.textContent = "Nice attempt. We both know the answer. 😂";
    feedbackBox.classList.remove("hidden");

    // Jump to random coordinate inside buttons container
    const padding = 5;
    const maxX = areaRect.width - btnRect.width - padding;
    const maxY = areaRect.height - btnRect.height - padding;

    const targetX = Math.max(padding, Math.floor(Math.random() * maxX));
    const targetY = Math.max(padding, Math.floor(Math.random() * maxY));

    noBtn.style.left = `${targetX}px`;
    noBtn.style.top = `${targetY}px`;
}

function selectSisterClimaxYes() {
    if (sisterClimaxSelected) return;
    sisterClimaxSelected = true;

    // Reset styles on NO button
    const noBtn = document.getElementById("sister-no-btn");
    noBtn.style.display = "none";

    const feedbackBox = document.getElementById("sister-feedback");
    const feedbackText = document.getElementById("sister-feedback-text");
    feedbackText.textContent = "Obviously. ❤️";
    feedbackBox.classList.remove("hidden");

    document.getElementById("sister-next-container").classList.remove("hidden");
}

function resetClimaxButtons() {
    sisterClimaxSelected = false;
    sisterNoBtnAttempts = 0;
    const noBtn = document.getElementById("sister-no-btn");
    noBtn.style.display = "inline-flex";
    noBtn.style.position = "static";
    noBtn.style.left = "auto";
    noBtn.style.top = "auto";
    noBtn.style.transform = "none";
}

/**
 * ============================================================================
 * LAYER 14: THE FINAL REVEAL & SURPRISE
 * ============================================================================
 */
function startFinalRevealSequence() {
    const preRevealCard = document.getElementById("final-pre-reveal");
    const mainGreetingCard = document.getElementById("final-greeting-card");
    const preRevealSub = preRevealCard.querySelector(".pre-reveal-subtext");

    preRevealCard.classList.remove("hidden");
    mainGreetingCard.classList.add("hidden");

    // Reveal sub text after 1 second
    setTimeout(() => {
        preRevealSub.classList.remove("hidden");
        // Complete transition to main card after 2.2 seconds total
        setTimeout(() => {
            preRevealCard.classList.add("hidden");
            mainGreetingCard.classList.remove("hidden");

            // Populate greeting messages
            document.getElementById("final-letter-p1").innerText = CONFIG.finalMessageParagraphs[0];
            document.getElementById("final-letter-p2").innerText = CONFIG.finalMessageParagraphs[1];

            triggerConfetti(2500);
        }, 1200);
    }, 1000);
}

function triggerFinalSurpriseClimax() {
    const surpriseArea = document.getElementById("climax-surprise-area");
    const finalThingBtn = document.getElementById("final-thing-btn");

    finalThingBtn.classList.add("hidden");
    surpriseArea.classList.remove("hidden");

    // Populate final details
    document.getElementById("climax-quote").innerText = CONFIG.finalQuote;
    document.getElementById("climax-wishes-text").innerText = CONFIG.finalWishesText.replace("[Sister]", CONFIG.sisterName);

    // Blast massive confetti & hearts
    triggerConfetti(6000);
    triggerFloatingClimaxHearts();
}

// Generate a burst of float hearts and stars
function triggerFloatingClimaxHearts() {
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const symbols = ["❤️", "💖", "🌸", "✨", "💝"];
            const symbol = symbols[Math.floor(Math.random() * symbols.length)];
            createCustomFloatingEmoji(symbol);
        }, i * 200);
    }
}

function createCustomFloatingEmoji(symbol) {
    const emoji = document.createElement("span");
    emoji.textContent = symbol;
    emoji.className = "micro-heart";
    emoji.style.left = `${Math.random() * 80 + 10}vw`;
    emoji.style.top = `${Math.random() * 40 + 50}vh`;
    emoji.style.fontSize = `${Math.floor(Math.random() * 15) + 16}px`;

    document.body.appendChild(emoji);
    setTimeout(() => {
        emoji.remove();
    }, 1200);
}

/**
 * ============================================================================
 * THE MEMORY VAULT MODAL
 * ============================================================================
 */
function openMemoryVault() {
    const modal = document.getElementById("memory-vault-modal");
    const grid = document.getElementById("vault-grid");
    grid.innerHTML = "";

    // Load photos from config
    CONFIG.memories.forEach((mem) => {
        const card = document.createElement("div");
        card.classList.add("vault-card");
        card.innerHTML = `
            <div class="vault-image-container">
                <img src="${mem.image}" alt="${mem.title}" class="vault-image" onerror="handleMemoryImageError(this, '${mem.title}')">
            </div>
            <div class="vault-meta">
                <span class="vault-card-title">${mem.title}</span>
                <span class="vault-card-year">📍 ${mem.year}</span>
            </div>
        `;
        grid.appendChild(card);
    });

    modal.classList.remove("hidden");
    triggerConfetti(2000);
}

function closeMemoryVault() {
    document.getElementById("memory-vault-modal").classList.add("hidden");
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
 * MICRO-INTERACTIONS
 * Tap heart/star triggers
 * ============================================================================
 */
function spawnMicroParticle(e) {
    // Avoid triggering on buttons, inputs or links to prevent overlaps
    if (e.target.closest("button") || e.target.closest("a") || e.target.closest(".clickable")) return;

    const symbols = ["❤️", "✨", "🌸", "⭐", "🎈"];
    const emojiStr = symbols[Math.floor(Math.random() * symbols.length)];

    const particle = document.createElement("span");
    particle.textContent = emojiStr;
    particle.className = emojiStr === "✨" || emojiStr === "⭐" ? "micro-star" : "micro-heart";

    // Position at coordinates
    particle.style.left = `${e.clientX - 10}px`;
    particle.style.top = `${e.clientY - 10}px`;

    document.body.appendChild(particle);

    setTimeout(() => {
        particle.remove();
    }, 1200);
}

// Show a small beautiful alert toast
function showFloatingToast(text) {
    const existing = document.querySelector(".toast-alert");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = "toast-alert";
    toast.innerText = text;

    // Style toast on overlay
    Object.assign(toast.style, {
        position: "fixed",
        bottom: "40px",
        left: "50%",
        transform: "translateX(-50%) translateY(20px)",
        background: "rgba(43, 43, 43, 0.9)",
        color: "#fff",
        padding: "10px 18px",
        borderRadius: "20px",
        fontSize: "13px",
        fontWeight: "600",
        boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
        zIndex: "2000",
        opacity: "0",
        transition: "transform 0.3s ease-out, opacity 0.3s ease-out",
        pointerEvents: "none"
    });

    document.body.appendChild(toast);

    // Force reflow
    void toast.offsetWidth;
    toast.style.opacity = "1";
    toast.style.transform = "translateX(-50%) translateY(0)";

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(-50%) translateY(10px)";
        setTimeout(() => toast.remove(), 300);
    }, 2500);
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
