export interface FitnessFatigueForm {
  ctl: number; // Chronic Training Load (Fitness - 42-day EWMA)
  atl: number; // Acute Training Load (Fatigue - 7-day EWMA)
  tsb: number; // Training Stress Balance (Form = CTL - ATL)
  status: 'Fresh' | 'Optimal Training' | 'Neutral' | 'Fatigued' | 'High Risk';
}

export interface ACWRResult {
  acuteLoad7d: number;
  chronicLoad28d: number;
  acwr: number;
  monotony: number;
  strain: number;
  riskLevel: 'Low Risk (<0.8 or 0.8-1.3)' | 'Moderate Risk (1.3-1.5)' | 'High Risk (>1.5)';
  recommendation: string;
}

export interface TIDDistribution {
  zone1TimeSec: number;
  zone2TimeSec: number;
  zone3TimeSec: number;
  zone1Percentage: number;
  zone2Percentage: number;
  zone3Percentage: number;
  classifiedModel: 'Polarized' | 'Pyramidal' | 'Threshold' | 'Unstructured';
  summary: string;
}

export interface RacePrediction {
  distanceName: string;
  distanceMeters: number;
  predictedTimeSeconds: number;
  formattedTime: string; // hh:mm:ss or mm:ss
  predictedPaceSecPerKm: number;
  formattedPace: string; // mm:ss /km
}

export interface RecoveryReadiness {
  readinessScore: number; // 0 - 100
  hrvRmssd?: number;
  restingHr?: number;
  sleepQualityScore?: number;
  fatigueLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
  recommendation: 'Train Hard' | 'Moderate Session' | 'Easy Active Recovery' | 'Full Rest Day';
  deloadRecommended: boolean;
}
