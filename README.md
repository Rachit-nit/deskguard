# DeskGuard 🛡️
> Real-Time Smart Library Floor Plan Tracker — Maximizing study spaces, eliminating seat-ghosting.

DeskGuard is a lightweight, interactive dashboard application designed for university libraries and co-working spaces. It provides users with a live visual map of available study desks, actively tracks "Away" statuses to prevent unfair seat hoarding, and automatically frees up abandoned spaces via an intelligent countdown mechanism.

---

## 🚀 Live Link
View the working web application here: 
👉 **[https://astonishing-dragon-2ab67d.netlify.app/]**

---

## 🛠️ How to Run Locally

Since DeskGuard is built using native web technologies, it runs directly in any modern browser without needing complex build steps or dependencies.

### Step 1: Clone the Repository
```bash
git clone https://github.com/Rachit-nit/deskguard.git
cd deskguard
```

### Step 2: Launch the App
* **Method A (Easiest):** Double-click the `index.html` file in your project folder to open it instantly in your preferred web browser.
* **Method B (Recommended):** If you are using VS Code, right-click `index.html` and select **"Open with Live Server"** to view it on a local development server (typically at `http://127.0.0.1:5500`).

---

## ⚙️ Environment Variables

This project is built as a pure client-side static application using vanilla frontend languages. 

* **Required Variables:** `None`
* **Configuration:** No external `.env` file or API keys are required to run the current production-ready prototype. Mock data logic for desk timers and status swapping is handled natively inside the core JavaScript bundle.

---

## 💻 Tech Stack
* **Structure:** `HTML5` semantic layout for clear dashboard formatting.
* **Styling:** `CSS3` custom properties, flexbox/grid layouts, and a modern dark-mode aesthetic with interactive visual glowing anchors.
* **Logic:** Vanilla `JavaScript (ES6+)` for real-time DOM updates, interactive desk selection state-swapping, and mock interval timer tracking.

---

## 🌟 Key Features
* **Interactive Floor Plan:** Visual matrix layout showing individual desk conditions (`Free`, `Occupied`, `Away`).
* **Active Station Controller:** Dynamic sidebar module tracking custom metrics for the currently selected workspace (e.g., Workstation #103).
* **Smart "Step Away" Mechanics:** Visual countdown tracker safeguarding user spaces temporarily while showing an active counter to nearby searchers.
* **Auto-Freed Counter:** Keeps score of total spaces successfully reclaimed from ghost users during operational hours.
