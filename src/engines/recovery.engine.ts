import { RecoveryReadiness } from '../domain/metrics.js';
import { FitnessFatigueForm } from '../domain/metrics.js';

export class RecoveryEngine {
  /**
   * Calculates overall readiness and recovery status based on Form (TSB) and HRV metrics
   */
  public static calculateReadiness(
    form: FitnessFatigueForm,
    hrvRmssd?: number,
    baselineHrv: number = 65,
    restingHr?: number,
    baselineRestingHr: number = 50
  ): RecoveryReadiness {
    let score = 75; // baseline

    // Form contribution (-25 to +25)
    if (form.tsb > 10) score += 15;
    else if (form.tsb < -20) score -= 25;
    else if (form.tsb < -10) score -= 10;

    // HRV contribution
    if (hrvRmssd) {
      const hrvRatio = hrvRmssd / baselineHrv;
      if (hrvRatio >= 1.1) score += 10;
      else if (hrvRatio < 0.85) score -= 15;
    }

    // Resting HR contribution
    if (restingHr) {
      const hrDiff = restingHr - baselineRestingHr;
      if (hrDiff >= 5) score -= 15;
      else if (hrDiff <= -2) score += 5;
    }

    // Clamp score 0 - 100
    score = Math.max(0, Math.min(100, Math.round(score)));

    let fatigueLevel: RecoveryReadiness['fatigueLevel'] = 'Moderate';
    let recommendation: RecoveryReadiness['recommendation'] = 'Moderate Session';
    let deloadRecommended = false;

    if (score >= 80) {
      fatigueLevel = 'Low';
      recommendation = 'Train Hard';
    } else if (score >= 60) {
      fatigueLevel = 'Moderate';
      recommendation = 'Moderate Session';
    } else if (score >= 40) {
      fatigueLevel = 'High';
      recommendation = 'Easy Active Recovery';
    } else {
      fatigueLevel = 'Severe';
      recommendation = 'Full Rest Day';
      deloadRecommended = true;
    }

    if (form.tsb < -25) {
      deloadRecommended = true;
    }

    return {
      readinessScore: score,
      hrvRmssd,
      restingHr,
      fatigueLevel,
      recommendation,
      deloadRecommended,
    };
  }
}
