import { AthleteProfile } from '../domain/athlete.js';
import { DanielsModel } from '../models/daniels.model.js';
import { NorwegianModel } from '../models/norwegian.model.js';
import { CasadoModel } from '../models/casado.model.js';
import { SeilerModel } from '../models/seiler.model.js';
import { CriticalSpeedModel } from '../models/critical_speed.model.js';
import { ValidationLayer, ScientificConfidenceDTO } from '../utils/validation.js';

export interface MultiModelThresholdAnalysis {
  athleteName: string;
  lt1HrBpm: number;
  lt2HrBpm: number;
  ltPaceFormatted: string;
  danielsModel: ReturnType<typeof DanielsModel.calculatePacesFromVDOT>;
  norwegianModel: ReturnType<typeof NorwegianModel.calculateDoubleThresholdTargets>;
  casadoModel: ReturnType<typeof CasadoModel.calculateProgression>;
  seilerBoundaries: ReturnType<typeof SeilerModel.calculate3ZoneBoundaries>;
  confidence: ScientificConfidenceDTO;
}

export class ThresholdEngine {
  public static analyzeThreshold(profile: AthleteProfile): MultiModelThresholdAnalysis {
    const lthr = profile.lthr;
    const ltPaceSecKm = profile.ltPaceSecPerKm;
    const maxHr = profile.maxHeartRate;

    const seilerBoundaries = SeilerModel.calculate3ZoneBoundaries(lthr, maxHr);
    const danielsPaces = DanielsModel.calculatePacesFromVDOT(profile.vdot, ltPaceSecKm);
    const norwegianTargets = NorwegianModel.calculateDoubleThresholdTargets(lthr, ltPaceSecKm);
    const casadoProgression = CasadoModel.calculateProgression(ltPaceSecKm);

    const confidence = ValidationLayer.buildConfidenceScore(
      15,
      true,
      !!profile.criticalPowerWatts,
      0.9,
      [
        'LT1 estimated from Seiler 3-Zone model (~83% LTHR).',
        'LT2 matched to athlete LTHR.',
        'Norwegian targets sub-LT2 lactate (2.5-3.5 mmol/L).',
      ]
    );

    return {
      athleteName: profile.name,
      lt1HrBpm: seilerBoundaries.z1MaxHr,
      lt2HrBpm: lthr,
      ltPaceFormatted: danielsPaces.thresholdPaceSecKm ? `${Math.floor(ltPaceSecKm / 60)}:${Math.round(ltPaceSecKm % 60).toString().padStart(2, '0')} /km` : '-:--',
      danielsModel: danielsPaces,
      norwegianModel: norwegianTargets,
      casadoModel: casadoProgression,
      seilerBoundaries,
      confidence,
    };
  }
}
