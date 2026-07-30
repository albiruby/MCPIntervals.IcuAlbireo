/**
 * Centralized Physiological Parameters & Literature Constants
 * Prevents magic numbers in physiological engines and scientific models.
 */

export const PHYSIOLOGY_CONFIG = {
  // Threshold & Heart Rate Zones
  lthrRatioMaxHr: 0.88, // Standard LTHR as % of Max HR
  lt1RatioLthr: 0.83, // Aerobic Threshold (LT1) as % of LTHR (Seiler 3-zone lower boundary)
  lt2RatioLthr: 1.0, // Anaerobic Threshold (LT2) equal to LTHR

  // Training Intensity Distribution (TID) Boundaries (Seiler Model)
  seilerZone1MaxRatioLthr: 0.83, // Z1 < LT1
  seilerZone2MaxRatioLthr: 1.0, // Z2 LT1 - LT2
  // Z3 > LT2

  // Daniels VDOT Oxygen Cost Equations Constants (Daniels 4th Ed)
  danielsPercentMaxCoeff1: 0.8,
  danielsPercentMaxCoeff2: 0.1894393,
  danielsPercentMaxCoeff3: -0.012778,
  danielsPercentMaxCoeff4: 0.2989558,
  danielsPercentMaxCoeff5: -0.1932605,
  danielsVo2Coeff1: -4.6,
  danielsVo2Coeff2: 0.182258,
  danielsVo2Coeff3: 0.000104,

  // Banister EWMA Impulse Response Model Time Constants (Days)
  ctlTimeConstantDays: 42, // Fitness (Chronic Training Load)
  atlTimeConstantDays: 7, // Fatigue (Acute Training Load)

  // Riegel Exponential Race Prediction
  riegelExponent: 1.06,

  // ACWR (Acute:Chronic Workload Ratio) Risk Thresholds
  acwrSweetSpotMin: 0.8,
  acwrSweetSpotMax: 1.3,
  acwrHighRiskThreshold: 1.5,

  // Validation Limits
  minValidRaceDistanceMeters: 400,
  maxPredictionRatioLimit: 15, // Ratio between target distance and sample distance (e.g. 400m to 42K is 105x > 15x limit)
};
