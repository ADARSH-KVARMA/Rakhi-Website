# 🌸 Interactive Raksha Bandhan Gift Website for Sister 🌸

A beautiful, emotional, playful, and highly interactive gift website designed specifically for your sister. The experience is designed mobile-first, and is structured as a **personal digital memory book + mini game + surprise experience**.

---

## ✨ Features

- **6 Guided Scenes (Layers 0 to 5)**: Smooth transitions that unlock sequentially.
- **Playful Quiz (Layer 1)**: Fun questions with custom, cheeky responses.
- **Memory Lane Carousel (Layer 2)**: Responsive memories card carousel with a built-in fallback for missing images.
- **The ₹10,000 Cash Trick (Layer 3)**: A button that runs away from clicks/taps within its boundary box, with funny responses before unlocking a ₹0.00 win popup.
- **Heartfelt Typewriter Message (Layer 4)**: Cursive parchment note typing effect with skip-to-end tap detection.
- **Animated SVG Rakhi (Layer 5)**: Glowing, rotating, and pulsing SVG Rakhi.
- **Confetti & Particles**: Client-side canvas confetti triggers and soft floating ambient hearts/flowers background.
- **Background Music Support**: Top right audio toggle with safe fallback, handling autoplay permissions gracefully.
- **Secret Easter Egg**: Secret heart icon at the bottom. Tapping it 5 times triggers a surprise message.

---

## 🛠️ Project Structure

```text
raksha_bandhan/
│
├── app.py                   # Flask server backend
├── requirements.txt         # Package dependencies (Flask)
├── README.md                # This setup guide
│
├── templates/
│   └── index.html           # Main HTML structure with vector Rakhi and UI
│
└── static/
    ├── css/
    │   └── style.css        # Palette variables, layouts, and animations
    ├── js/
    │   └── script.js        # State, Canvas confetti, typewriter, and configuration
    ├── images/
    │   └── README.txt       # Instructions for memory photos
    └── music/
        └── README.txt       # Instructions for placing MP3 background audio
```

---

## 🚀 Installation & Running

### 1. Install Python
Ensure Python (version 3.8+) is installed on your system.

### 2. Install Dependencies
Open your command terminal in the project directory and run:
```bash
pip install -r requirements.txt
```

### 3. Run the Server
Launch the Flask development server:
```bash
python app.py
```

### 4. Open the Website
Open your browser and navigate to:
```text
http://127.0.0.1:5000
```
*Tip: In your browser (e.g. Chrome/Edge/Safari), press **F12** and select the **Mobile/Device Emulation** view (set to iPhone or Android portrait) to experience it as a mobile device.*

---

## 🎨 Personalization Guide

### 1. Change Sister's Name
Open [script.js](file:///c:/Users/Adrash%20Varma/Rakhi%20website/static/js/script.js) and edit the `sisterName` property at the top:
```javascript
const CONFIG = {
    sisterName: "YourSisterName", // <-- Edit name here
    ...
};
```

### 2. Customise Memories (Layer 2)
In [script.js](file:///c:/Users/Adrash%20Varma/Rakhi%20website/static/js/script.js), edit the items in the `memories` array.
*   **Where to put photos**: Save your photos inside the `static/images/` folder as `memory1.jpg`, `memory2.jpg`, etc.
*   *Note: If a photo is missing or named differently, the site renders a soft, styled card fallback instead of showing a broken image link.*
*   Add as many or as few memory objects as you want:
```javascript
memories: [
    {
        image: "/static/images/my_photo.jpg", // Photo path in static/images
        title: "Silly Moments",
        year: "2023",
        text: "Your descriptive memory paragraph..."
    },
    ...
]
```

### 3. Customise Heartfelt Messages (Layer 4)
Change paragraphs in the letter by modifying the array `finalMessage` in [script.js](file:///c:/Users/Adrash%20Varma/Rakhi%20website/static/js/script.js):
```javascript
finalMessage: [
    "First paragraph text...",
    "Second paragraph text...",
    ...
]
```

### 4. Background Music (MP3)
Place a background music file inside the `static/music/` directory.
Rename it to `background.mp3`.
*Note: If no audio file is provided, the website runs normally without audio or console errors.*

---

## 🌈 Visual Customization (Themes & Colors)

You can easily adjust the color theme by modifying the CSS variables at the top of [style.css](file:///c:/Users/Adrash%20Varma/Rakhi%20website/static/css/style.css):

*   **Background Gradients**: Modify `--bg-gradient` for a different backdrop.
*   **Pastel Accent Colors**: Update `--color-primary` (pink/red), `--color-secondary` (lavender/purple), and `--color-peach` (orange/peach) to change key theme highlights.
*   **Fonts**: The website loads Google Fonts `Quicksand` (soft-rounded headings/body) and `Caveat` (cursive quotes). Feel free to import other fonts inside the `<head>` of [index.html](file:///c:/Users/Adrash%20Varma/Rakhi%20website/templates/index.html).

---

## ☁️ Deployment

Once personalized, you can share the website using the following methods:

1.  **Local Network Sharing (Easiest for testing)**: Make sure your phone and laptop are on the same Wi-Fi. Run `python app.py`. Get your laptop's local IP address (e.g. `192.168.1.15`). Access it on your phone browser at `http://192.168.1.15:5000`.
2.  **Free Hosting Deployments**:
    *   **Vercel (Recommended)**: Connect your GitHub repository to Vercel. Vercel will automatically read the `vercel.json` file we created and build the Flask application using `@vercel/python`.
    *   **PythonAnywhere**: Ideal for hosting simple Flask backends. Upload your files, configure a free Web App, and run it.
    *   **Render / Railway**: Link your GitHub repository, specify the start command (`python app.py` or `gunicorn app:app`), and deploy.
3.  **Static Deploy (Alternative)**: If you don't need a Flask server, you can open `templates/index.html` directly, make relative path adjustments in asset links, and host it for free on **GitHub Pages**, **Vercel**, or **Netlify**!
