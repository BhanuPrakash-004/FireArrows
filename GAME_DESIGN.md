# Game Design Document: Fire Arrows 🏹🔥

## 📖 Overview
**Fire Arrows** is a tense, single-player survival game inspired by the "Alice in Borderland" flaming arrow trial. You're spawned into an ancient Chinese courtyard where you must answer trivia questions. Your accuracy determines how many deadly **Fire Arrows** rain down from the sky.

To survive, quickly navigate the 3D environment and find cover underneath roofs before the arrows hit!

---

## 🎮 Core Gameplay Loop
1. **Question Phase** (15s): A trivia question appears. Enter your best numerical answer.
2. **Scramble Phase** (5s): See how far off you were! Use this time to find cover - arrows are spawning.
3. **Arrow Rain** (6s): Arrows fall. Stay under cover (SAFE) or get hit and lose a life (DANGER).
4. **Next Round**: Survive and face a new question. Game ends when you lose all 3 lives.

**Arrow Count Formula**: The further from the correct answer, the more arrows fall (5-80 arrows based on % error).

---

## ✨ Key Features
- **3D Environment**: Ancient Chinese courtyard with roofs for shelter
- **Player Avatar**: Animated 3D character with smooth WASD movement
- **Dynamic Camera**: Mouse-controlled orbit camera with adjustable sensitivity
- **Safety Detection**: Real-time raycast checks if you're under cover
- **Trivia System**: 25 questions covering history, science, geography, and more
- **Health System**: 3 lives displayed as hearts
- **Score Tracking**: Points based on answer accuracy
- **Dynamic Atmosphere**: Sky darkens during arrow rain for tension

---

## 🛠️ Tech Stack
### Frontend (Single-Player)
* **Framework**: React + TypeScript (Vite)
* **3D Engine**: Three.js + @react-three/fiber + @react-three/drei
* **Physics**: @react-three/rapier
* **Styling**: Tailwind CSS v4

---

## 📁 Project Structure
```
frontend/src/
├── App.tsx                 # Main game component
├── main.tsx               # Entry point
├── index.css              # Global styles
├── types/
│   └── game.ts            # TypeScript interfaces
├── data/
│   └── questions.ts       # Trivia question bank
├── hooks/
│   └── useGameState.ts    # Game state management
└── components/
    ├── Player.tsx         # Player character + movement
    ├── FireArrows.tsx     # Arrow spawning + physics
    ├── EnvironmentMap.tsx # 3D environment
    └── ui/
        ├── StartScreen.tsx
        ├── GameOverScreen.tsx
        ├── QuestionModal.tsx
        └── GameHUD.tsx
```

---

## 🎯 Game Status: COMPLETE ✅
- ✅ 3D environment with physics
- ✅ Player movement (WASD) with animations
- ✅ Camera controls with sensitivity slider
- ✅ Upward raycasting for safe/danger detection
- ✅ Trivia question system with 25 questions
- ✅ Dynamic arrow count based on answer accuracy
- ✅ Health system (3 lives)
- ✅ Score tracking
- ✅ Start screen with instructions
- ✅ Game over screen with statistics
- ✅ Dynamic sky/lighting during arrow phases
