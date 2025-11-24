/**
 * src/utils/NEWS2Score.js
 *
 * Implements the National Early Warning Score 2 (NEWS2) logic used in NHS, UK.
 * This module contains the scoring rules and the core calculation function.
 *
 * @see https://www.rcplondon.ac.uk/projects/outputs/national-early-warning-score-news-2
 */

// NEWS2 SCORING MATRIX
// Defines the score (0, 1, 2, or 3) for each physiological parameter based on its value.
export const SCORING_MATRIX = {
    respiratoryRate: [
      { range: [0, 8], score: 3 },
      { range: [9, 11], score: 1 },
      { range: [12, 20], score: 0 },
      { range: [21, 24], score: 2 },
      { range: [25, Infinity], score: 3 },
    ],
    oxygenSaturation: [
      { range: [96, 100], score: 0, scale: 1 }, // Scale 1 (Target 92-96%)
      { range: [94, 95], score: 1, scale: 1 },
      { range: [92, 93], score: 2, scale: 1 },
      { range: [0, 91], score: 3, scale: 1 },
      
      { range: [94, 100], score: 0, scale: 2 }, // Scale 2 (Target 88-92%) - for COPD/Hypercapnia risk
      { range: [92, 93], score: 1, scale: 2 },
      { range: [90, 91], score: 2, scale: 2 },
      { range: [0, 89], score: 3, scale: 3 }, // Score 3 for < 90 on both scales
    ],
    systolicBP: [
      { range: [0, 90], score: 3 },
      { range: [91, 100], score: 2 },
      { range: [101, 110], score: 1 },
      { range: [111, 219], score: 0 },
      { range: [220, Infinity], score: 3 },
    ],
    pulseRate: [
      { range: [0, 40], score: 3 },
      { range: [41, 50], score: 1 },
      { range: [51, 90], score: 0 },
      { range: [91, 110], score: 1 },
      { range: [111, 130], score: 2 },
      { range: [131, Infinity], score: 3 },
    ],
    consciousness: [
      { value: 'alert', score: 0 },
      { value: 'confused', score: 3 }, // Corresponds to AVPU V, P, U
    ],
    temperature: [
      { range: [0, 35.0], score: 3 },
      { range: [35.1, 36.0], score: 1 },
      { range: [36.1, 38.0], score: 0 },
      { range: [38.1, 39.0], score: 1 },
      { range: [39.1, Infinity], score: 2 },
    ],
    // Air/Oxygen Parameter is handled separately (score of 2 if patient is on air and needs O2 or vice versa).
  };
  
  /**
   * Calculates the total NEWS2 score based on all seven parameters.
   * @param {object} vitals - The patient's current vital signs.
   * @param {number} vitals.respiratoryRate - Breaths per minute (e.g., 18).
   * @param {number} vitals.oxygenSaturation - Percentage (e.g., 95).
   * @param {number} vitals.systolicBP - Systolic blood pressure (e.g., 120).
   * @param {number} vitals.pulseRate - Heart rate (e.g., 75).
   * @param {number} vitals.temperature - Celsius (e.g., 37.0).
   * @param {string} vitals.consciousness - 'alert' or 'confused' (AVPU: Alert=0, V/P/U=3).
   * @param {number} vitals.oxygenScale - 1 (Standard) or 2 (High-risk e.g., COPD).
   * @param {boolean} vitals.onSupplementalOxygen - True if patient is receiving supplemental O2.
   * @returns {object} The total score and breakdown.
   */
  export const calculateNEWS2 = (vitals) => {
    let totalScore = 0;
    let scoreBreakdown = {};
    let maxScore = 0;
  
    // Function to find score for range-based parameters
    const getRangeScore = (parameter, value, scale = 1) => {
      const rules = SCORING_MATRIX[parameter];
      let score = 0;
      
      for (const rule of rules) {
        if (
          (rule.scale === undefined || rule.scale === scale) &&
          value >= rule.range[0] &&
          value <= rule.range[1]
        ) {
          score = rule.score;
          break;
        }
      }
      return score;
    };
  
    // 1. Respiratory Rate
    const rrScore = getRangeScore('respiratoryRate', vitals.respiratoryRate);
    totalScore += rrScore;
    scoreBreakdown.respiratoryRate = rrScore;
    maxScore = Math.max(maxScore, rrScore);
  
    // 2. Oxygen Saturation (Requires Scale 1 or 2)
    const o2Scale = vitals.oxygenScale || 1; // Default to Scale 1
    const o2Score = getRangeScore('oxygenSaturation', vitals.oxygenSaturation, o2Scale);
    totalScore += o2Score;
    scoreBreakdown.oxygenSaturation = o2Score;
    maxScore = Math.max(maxScore, o2Score);
  
    // 3. Systolic BP
    const bpScore = getRangeScore('systolicBP', vitals.systolicBP);
    totalScore += bpScore;
    scoreBreakdown.systolicBP = bpScore;
    maxScore = Math.max(maxScore, bpScore);
  
    // 4. Pulse Rate
    const pulseScore = getRangeScore('pulseRate', vitals.pulseRate);
    totalScore += pulseScore;
    scoreBreakdown.pulseRate = pulseScore;
    maxScore = Math.max(maxScore, pulseScore);
  
    // 5. Consciousness (AVPU)
    // 'alert' -> 0, anything else (Confused/V/P/U) -> 3
    const consciousScore = SCORING_MATRIX.consciousness.find(c => c.value === vitals.consciousness)?.score || 3;
    totalScore += consciousScore;
    scoreBreakdown.consciousness = consciousScore;
    maxScore = Math.max(maxScore, consciousScore);
    
    // 6. Temperature
    const tempScore = getRangeScore('temperature', vitals.temperature);
    totalScore += tempScore;
    scoreBreakdown.temperature = tempScore;
    maxScore = Math.max(maxScore, tempScore);
  
    // 7. Supplemental Oxygen (Score of 2 is added if patient is receiving O2)
    const oxygenSuppScore = vitals.onSupplementalOxygen ? 2 : 0;
    totalScore += oxygenSuppScore;
    scoreBreakdown.onSupplementalOxygen = oxygenSuppScore;
  
    // CLINICAL RISK AND RESPONSE
    let risk = 'Low'; // 0-4 (but not 3 in a single parameter)
    let response = 'Routine monitoring';
    
    if (totalScore >= 7) {
      risk = 'High';
      response = 'Emergency medical review';
    } else if (totalScore >= 5 || maxScore === 3) {
      risk = 'Medium';
      response = 'Urgent clinical review';
    } else if (totalScore >= 1) {
      risk = 'Low';
      response = 'Standard care, hourly monitoring';
    } else if (totalScore === 0) {
      risk = 'Low';
      response = 'Routine care, minimum 12-hour monitoring';
    }
  
    // Override: Any score of 3 in a single parameter makes the overall risk Medium.
    if (maxScore === 3) {
        risk = 'Medium';
        response = 'Urgent clinical review';
    }
    
    return {
      score: totalScore,
      breakdown: scoreBreakdown,
      riskLevel: risk,
      clinicalResponse: response,
    };
  };