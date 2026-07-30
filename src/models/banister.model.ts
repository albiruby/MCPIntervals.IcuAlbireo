import { PHYSIOLOGY_CONFIG } from '../config/physiology.config.js';
import { LiteratureRegistry, ScientificReference } from '../registry/literature.registry.js';
import { calculateEwma } from '../utils/math.js';

export interface BanisterModelResult {
  ctl: number; // Fitness (42d EWMA)
  atl: number; // Fatigue (7d EWMA)
  tsb: number; // Form (CTL - ATL)
  status: 'Fresh' | 'Optimal Training' | 'Neutral' | 'Fatigued' | 'High Risk';
  reference: ScientificReference;
}

export class BanisterModel {
  public static calculatePMC(dailyLoads: { date: string; load: number }[]): BanisterModelResult {
    const ref = LiteratureRegistry.getReference('banister_impulse')!;

    if (dailyLoads.length === 0) {
      return { ctl: 45, atl: 40, tsb: 5, status: 'Fresh', reference: ref };
    }

    const ctl = calculateEwma(dailyLoads, PHYSIOLOGY_CONFIG.ctlTimeConstantDays);
    const atl = calculateEwma(dailyLoads, PHYSIOLOGY_CONFIG.atlTimeConstantDays);
    const tsb = Math.round((ctl - atl) * 10) / 10;

    let status: BanisterModelResult['status'] = 'Optimal Training';
    if (tsb > 15) status = 'Fresh';
    else if (tsb >= -10) status = 'Optimal Training';
    else if (tsb >= -25) status = 'Fatigued';
    else status = 'High Risk';

    return { ctl, atl, tsb, status, reference: ref };
  }
}
