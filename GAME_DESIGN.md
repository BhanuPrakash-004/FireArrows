# Game Design Document: Fire Arrows 🏹🔥

## 📖 Overview
**Fire Arrows** is a tense, real-time multiplayer survival game inspired by the "Alice in Borderland" (Season 3) flaming arrow trial. Players are spawned into an ancient Chinese courtyard. A random player is chosen to answer a question. Depending on their margin of error from the correct answer, a proportional number of deadly **Fire Arrows** will rain down from the sky. 

To survive, players must quickly navigate the 3D environment and find cover underneath roofs or solid structures before the arrows hit the ground.

---

## 🎮 Core Gameplay Loop
1. **The Question Phase**: A trivia or estimation question is presented to a randomly chosen player (e.g., "In what year was the Great Wall of China started?").
2. **The Answer Phase**: The chosen player inputs their answer.
3. **The Penalty Calculation**: The game calculates the margin of error between the player's answer and the actual answer.
   * *Formula*: `| Player Answer - Actual Answer | = Number of Arrows` (or a scaled version of this).
4. **The Rain of Fire**: The calculated number of fire arrows spawn high above the map and begin falling rapidly.
5. **The Scramble**: All players (including the one who answered) have a brief window to move their character using **WASD** controls to find shelter.
6. **Resolution**: Arrows strike the ground. Any player caught in the open space without overhead cover is eliminated.
7. **Next Round**: The cycle repeats with the surviving players until only one remains (or a set number of rounds is completed).

---

## ✨ Key Features
- **3D Environment**: Fully playable 3D world built with React Three Fiber, featuring an intricate `ancient_chinese_courtyard_park.glb` map.
- **Player Avatars**: Players control 3D models (currently `Running.glb`) with smooth WASD movement and camera following.
- **Real-Time Multiplayer**: Powered by Node.js and Socket.IO to ensure low-latency movement synchronization and unified game states (timers, questions, arrow events) across all connected clients.
- **Dynamic Physics & Collision**: 
  - Arrows spawn dynamically and fall with velocity.
  - A real-time **Raycasting System** constantly checks the space directly above the player. If the ray hits a roof/structure before the sky, the player is marked as `SAFE`. If it hits the sky, the player is in `DANGER`.
- **High-Stakes Trivia**: The difficulty of the physical survival aspect is directly tied to the intellectual accuracy of the players.

---

## 🛠️ Tech Stack Architecture
### Frontend (The Client)
* **Framework**: React + TypeScript (via Vite).
* **3D Engine**: Three.js + `@react-three/fiber` + `@react-three/drei`.
* **Styling**: Tailwind CSS (v4) for the UI overlay (timers, health bars, safe/danger indicators).
* **Networking**: `socket.io-client` for real-time WebSocket communication.

### Backend (The Server)
* **Runtime**: Node.js + Express.
* **Real-time Server**: Socket.IO for managing rooms, broadcasting player positions, managing the game loop timers, and validating answers.

---

## 🚀 Development Roadmap
- **Phase 1: Single Player MVP (Completed) ✅**
  - Set up 3D Canvas, load environment and player models.
  - Implement WASD movement.
  - Implement upward raycasting for Safe/Danger detection under roofs.
  - Implement basic repeating arrow rain mechanic.
- **Phase 2: Multiplayer Synchronization (Next)**
  - Broadcast player coordinates to the backend via Socket.IO.
  - Render multiple player models on the same map.
- **Phase 3: The Game Loop**
  - Implement the Question API and UI modal.
  - Calculate error margins and dynamically adjust the number/speed of arrows.
  - Implement health/elimination mechanics.
