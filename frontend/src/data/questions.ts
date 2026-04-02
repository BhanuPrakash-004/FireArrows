import type { Question } from '../types/game'

export const questions: Question[] = [
  // ===== EASY: Math Questions =====
  { id: 1, question: "What is 25 + 37?", answer: 62 },
  { id: 2, question: "What is 100 - 46?", answer: 54 },
  { id: 3, question: "What is 12 × 8?", answer: 96 },
  { id: 4, question: "What is 144 ÷ 12?", answer: 12 },
  { id: 5, question: "What is 15 × 15?", answer: 225 },
  { id: 6, question: "What is 500 - 287?", answer: 213 },
  { id: 7, question: "What is 23 + 89?", answer: 112 },
  { id: 8, question: "What is 17 × 6?", answer: 102 },
  { id: 9, question: "What is 256 ÷ 16?", answer: 16 },
  { id: 10, question: "What is 99 + 99?", answer: 198 },
  { id: 11, question: "What is 1000 - 333?", answer: 667 },
  { id: 12, question: "What is 25 × 4?", answer: 100 },
  { id: 13, question: "What is 13 × 13?", answer: 169 },
  { id: 14, question: "What is 450 ÷ 9?", answer: 50 },
  { id: 15, question: "What is 78 + 156?", answer: 234 },

  // ===== MEDIUM: Science & Body =====
  { id: 16, question: "How many bones are in the adult human body?", answer: 206, hint: "More than 200" },
  { id: 17, question: "How many teeth does an adult human have?", answer: 32 },
  { id: 18, question: "How many chromosomes do humans have?", answer: 46 },
  { id: 19, question: "What is normal human body temperature in °F?", answer: 98, unit: "°F", hint: "Around 98-99" },
  { id: 20, question: "How many muscles are in the human body?", answer: 600, hint: "Around 600" },
  { id: 21, question: "How many liters of blood in an adult body?", answer: 5, unit: "liters" },
  { id: 22, question: "How many bones does a baby have at birth?", answer: 270, hint: "More than adults!" },
  { id: 23, question: "What is the speed of sound in m/s?", answer: 343, unit: "m/s" },
  { id: 24, question: "How many elements in the periodic table?", answer: 118 },
  { id: 25, question: "How many chambers does the human heart have?", answer: 4 },

  // ===== MEDIUM: Geography & Countries =====
  { id: 26, question: "How many countries are in the world?", answer: 195, hint: "Around 195" },
  { id: 27, question: "How many continents are there?", answer: 7 },
  { id: 28, question: "How many states in the USA?", answer: 50 },
  { id: 29, question: "How many states in India?", answer: 28 },
  { id: 30, question: "How many countries in Europe?", answer: 44 },
  { id: 31, question: "How many countries in Africa?", answer: 54 },
  { id: 32, question: "What year did India gain independence?", answer: 1947 },
  { id: 33, question: "How many time zones does Russia have?", answer: 11 },
  { id: 34, question: "Height of Mount Everest in meters?", answer: 8849, unit: "m" },
  { id: 35, question: "How many islands does Indonesia have?", answer: 17000, hint: "Around 17,000" },

  // ===== MEDIUM: Space & Earth =====
  { id: 36, question: "Radius of Earth in kilometers?", answer: 6371, unit: "km" },
  { id: 37, question: "How many planets in our solar system?", answer: 8 },
  { id: 38, question: "How many moons does Earth have?", answer: 1 },
  { id: 39, question: "How many moons does Mars have?", answer: 2 },
  { id: 40, question: "How many moons does Jupiter have?", answer: 95, hint: "Over 90!" },
  { id: 41, question: "Speed of light in km/s (thousands)?", answer: 300, unit: "thousand km/s" },
  { id: 42, question: "How many hours in a week?", answer: 168 },
  { id: 43, question: "How many days in a year?", answer: 365 },
  { id: 44, question: "Earth's age in billions of years?", answer: 4, unit: "billion years", hint: "Around 4-5" },
  { id: 45, question: "How many minutes in a day?", answer: 1440 },

  // ===== HARD: Space Distances =====
  { id: 46, question: "Distance from Earth to Moon in km?", answer: 384400, unit: "km", hint: "Around 384,000" },
  { id: 47, question: "Distance from Earth to Sun in million km?", answer: 150, unit: "million km" },
  { id: 48, question: "Diameter of the Sun in km?", answer: 1392000, unit: "km", hint: "Around 1.4 million" },
  { id: 49, question: "How many stars in the Milky Way (billions)?", answer: 200, unit: "billion", hint: "100-400 billion" },
  { id: 50, question: "Temperature of Sun's surface in °C?", answer: 5500, unit: "°C" },

  // ===== HARD: World Population & Stats =====
  { id: 51, question: "World population in billions (2024)?", answer: 8, unit: "billion" },
  { id: 52, question: "India's population in billions?", answer: 1, unit: "billion", hint: "Over 1.4" },
  { id: 53, question: "Population of USA in millions?", answer: 335, unit: "million" },
  { id: 54, question: "Population of China in billions?", answer: 1, unit: "billion", hint: "Around 1.4" },
  { id: 55, question: "How many languages spoken in the world?", answer: 7000, hint: "Around 7,000" },

  // ===== HARD: Social Media & Celebrities =====
  { id: 56, question: "Virat Kohli's Instagram followers (millions)?", answer: 270, unit: "million", hint: "250-280M" },
  { id: 57, question: "Cristiano Ronaldo's Instagram followers (millions)?", answer: 640, unit: "million" },
  { id: 58, question: "MrBeast YouTube subscribers (millions)?", answer: 340, unit: "million", hint: "Over 300M" },
  { id: 59, question: "T-Series YouTube subscribers (millions)?", answer: 270, unit: "million" },
  { id: 60, question: "PewDiePie YouTube subscribers (millions)?", answer: 111, unit: "million" },

  // ===== HARD: Wealth & Money =====
  { id: 61, question: "Elon Musk net worth in billion USD?", answer: 200, unit: "billion USD", hint: "150-250B" },
  { id: 62, question: "Jeff Bezos net worth in billion USD?", answer: 200, unit: "billion USD" },
  { id: 63, question: "Apple's market cap in trillion USD?", answer: 3, unit: "trillion USD" },
  { id: 64, question: "Bitcoin's all-time high in thousand USD?", answer: 73, unit: "thousand USD" },
  { id: 65, question: "India's GDP in trillion USD?", answer: 3, unit: "trillion USD" },

  // ===== HARD: Technology & Records =====
  { id: 66, question: "How many websites exist (billions)?", answer: 2, unit: "billion" },
  { id: 67, question: "Daily Google searches in billions?", answer: 8, unit: "billion" },
  { id: 68, question: "YouTube daily video views in billions?", answer: 5, unit: "billion" },
  { id: 69, question: "WhatsApp daily messages in billions?", answer: 100, unit: "billion" },
  { id: 70, question: "Netflix subscribers in millions?", answer: 260, unit: "million" },

  // ===== MEDIUM: Sports =====
  { id: 71, question: "Players on a football (soccer) team?", answer: 11 },
  { id: 72, question: "Players on a cricket team?", answer: 11 },
  { id: 73, question: "Players on a basketball team on court?", answer: 5 },
  { id: 74, question: "Overs in a T20 cricket match?", answer: 20 },
  { id: 75, question: "Length of Olympic swimming pool in meters?", answer: 50, unit: "m" },
  { id: 76, question: "Sachin Tendulkar's ODI centuries?", answer: 49 },
  { id: 77, question: "Virat Kohli's ODI centuries?", answer: 50 },
  { id: 78, question: "FIFA World Cups won by Brazil?", answer: 5 },
  { id: 79, question: "Runs in a cricket century?", answer: 100 },
  { id: 80, question: "Maximum break in snooker?", answer: 147 },

  // ===== EASY-MEDIUM: General Knowledge =====
  { id: 81, question: "Weeks in a year?", answer: 52 },
  { id: 82, question: "Letters in the English alphabet?", answer: 26 },
  { id: 83, question: "Degrees in a circle?", answer: 360 },
  { id: 84, question: "Degrees in a right angle?", answer: 90 },
  { id: 85, question: "Sides on a hexagon?", answer: 6 },
  { id: 86, question: "Sides on a pentagon?", answer: 5 },
  { id: 87, question: "Seconds in an hour?", answer: 3600 },
  { id: 88, question: "Seconds in a minute?", answer: 60 },
  { id: 89, question: "Days in February (non-leap year)?", answer: 28 },
  { id: 90, question: "Months with 31 days?", answer: 7 },

  // ===== HARD: Animals & Nature =====
  { id: 91, question: "Speed of cheetah in km/h?", answer: 120, unit: "km/h" },
  { id: 92, question: "Blue whale's heart weight in kg?", answer: 180, unit: "kg" },
  { id: 93, question: "Age of oldest tree in years?", answer: 5000, hint: "Around 5,000 years" },
  { id: 94, question: "Number of ant species?", answer: 12000, hint: "Over 12,000" },
  { id: 95, question: "Deepest ocean depth in meters?", answer: 11000, unit: "m", hint: "Mariana Trench ~11,000m" },

  // ===== MEDIUM: More Math =====
  { id: 96, question: "Square root of 144?", answer: 12 },
  { id: 97, question: "Square root of 625?", answer: 25 },
  { id: 98, question: "What is 2 to the power of 10?", answer: 1024 },
  { id: 99, question: "What is 3 to the power of 4?", answer: 81 },
  { id: 100, question: "What is 50% of 250?", answer: 125 },
]

// Get random question excluding recently used ones
export function getRandomQuestion(usedIds: number[]): Question {
  const available = questions.filter(q => !usedIds.includes(q.id))
  if (available.length === 0) {
    return questions[Math.floor(Math.random() * questions.length)]
  }
  return available[Math.floor(Math.random() * available.length)]
}

// Calculate arrow count based on error (1 arrow per 1 unit of error)
export function calculateArrowCount(playerAnswer: number, correctAnswer: number): number {
  const error = Math.abs(playerAnswer - correctAnswer)
  // Minimum 10 arrows, maximum 200 arrows
  return Math.min(200, Math.max(10, Math.round(error)))
}
