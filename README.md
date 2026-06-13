# DeskGuard 🛡️
> Real-Time Smart Library Floor Plan Tracker — Maximizing study spaces, eliminating seat-ghosting.

DeskGuard is a lightweight, interactive dashboard application designed for university libraries and co-working spaces. It provides users with a live visual map of available study desks, actively tracks "Away" statuses to prevent unfair seat hoarding, and automatically frees up abandoned spaces via an intelligent countdown mechanism.

---

## 🚀 Live Link
View the working web application here: 
👉 **[INSERT YOUR VERCEL OR NETLIFY DEPLOYMENT LINK HERE]**

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
