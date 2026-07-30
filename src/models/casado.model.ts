import { LiteratureRegistry, ScientificReference } from '../registry/literature.registry.js';
import { formatPace } from '../utils/formatters.js';

export interface CasadoModelResult {
  extensiveThresholdPaceFormatted: string;
  intensiveThresholdPaceFormatted: string;
  recommendation: string;
  reference: ScientificReference;
}

export class CasadoModel {
  public static calculateProgression(ltPaceSecKm: number): CasadoModelResult {
    const ref = LiteratureRegistry.getReference('casado_model')!;
    const extensivePace = Math.round(ltPaceSecKm * 1.05); // Sub-LT2
    const intensivePace = Math.round(ltPaceSecKm * 0.98); // Supra-LT2

    return {
      extensiveThresholdPaceFormatted: formatPace(extensivePace),
      intensiveThresholdPaceFormatted: formatPace(intensivePace),
      recommendation: `Casado progression model: Build extensive threshold volume @ ${formatPace(extensivePace)} in early base phase before progressing to intensive threshold @ ${formatPace(intensivePace)}.`,
      reference: ref,
    };
  }
}
