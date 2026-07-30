import { Activity, ActivityStream, DecouplingResult } from '../domain/activity.js';
import { mean } from '../utils/math.js';

export class ActivityEngine {
  /**
   * Calculates cardiac/aerobic decoupling (% drift between HR and Pace/Power)
   */
  public static calculateDecoupling(stream: ActivityStream): DecouplingResult {
    const hr = stream.heartRateBpm;
    const speed = stream.speedMps;

    if (!hr || !speed || hr.length < 10 || speed.length < 10) {
      return {
        firstHalfPaceSecKm: 0,
        firstHalfAvgHr: 0,
        firstHalfEfficiencyRatio: 0,
        secondHalfPaceSecKm: 0,
        secondHalfAvgHr: 0,
        secondHalfEfficiencyRatio: 0,
        decouplingPercentage: 0,
        assessment: 'Minimal Drift (<3.5%)',
      };
    }

    const midIndex = Math.floor(hr.length / 2);

    const firstHalfHr = mean(hr.slice(0, midIndex));
    const firstHalfSpeed = mean(speed.slice(0, midIndex));
    const firstHalfEff = firstHalfSpeed / (firstHalfHr || 1);

    const secondHalfHr = mean(hr.slice(midIndex));
    const secondHalfSpeed = mean(speed.slice(midIndex));
    const secondHalfEff = secondHalfSpeed / (secondHalfHr || 1);

    const decoupling = ((firstHalfEff - secondHalfEff) / firstHalfEff) * 100;
    const decouplingRounded = Math.round(decoupling * 10) / 10;

    let assessment: DecouplingResult['assessment'] = 'Minimal Drift (<3.5%)';
    if (decouplingRounded > 5.0) {
      assessment = 'Significant Aerobic Drift (>5.0%)';
    } else if (decouplingRounded >= 3.5) {
      assessment = 'Moderate Drift (3.5-5.0%)';
    }

    return {
      firstHalfPaceSecKm: 1000 / (firstHalfSpeed || 1),
      firstHalfAvgHr: Math.round(firstHalfHr),
      firstHalfEfficiencyRatio: Math.round(firstHalfEff * 10000) / 10000,
      secondHalfPaceSecKm: 1000 / (secondHalfSpeed || 1),
      secondHalfAvgHr: Math.round(secondHalfHr),
      secondHalfEfficiencyRatio: Math.round(secondHalfEff * 10000) / 10000,
      decouplingPercentage: decouplingRounded,
      assessment,
    };
  }

  /**
   * Filters and analyzes long runs (> 16km or > 90 mins)
   */
  public static isLongRun(activity: Activity): boolean {
    return activity.distanceMeters >= 16000 || activity.movingTimeSeconds >= 5400;
  }
}
