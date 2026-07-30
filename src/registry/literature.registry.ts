export interface ScientificReference {
  id: string;
  title: string;
  authors: string[];
  publication: string;
  year: number;
  isbnOrDoi?: string;
  coreConcept: string;
  assumptions: string[];
  validityDomain: string;
}

export class LiteratureRegistry {
  private static readonly REFERENCES: Record<string, ScientificReference> = {
    daniels_vdot: {
      id: 'daniels_vdot',
      title: "Daniels' Running Formula (4th Edition)",
      authors: ['Jack Daniels, PhD'],
      publication: 'Human Kinetics',
      year: 2021,
      isbnOrDoi: 'ISBN: 9781492578413',
      coreConcept: 'VDOT pseudo-VO2max rating derived from running velocity and oxygen consumption equations.',
      assumptions: [
        'Assumes flat, non-technical terrain under temperate environmental conditions.',
        'Reflects running economy and aerobic capacity combined.',
      ],
      validityDomain: 'Events from 1500m to Marathon.',
    },
    seiler_tid: {
      id: 'seiler_tid',
      title: 'What is Best Practice for Training Intensity Distribution in Endurance Athletes?',
      authors: ['Stephen Seiler, PhD'],
      publication: 'International Journal of Sports Physiology and Performance',
      year: 2010,
      isbnOrDoi: 'DOI: 10.1123/ijspp.5.3.276',
      coreConcept: '3-Zone intensity distribution framework demarcated by Aerobic (LT1) and Anaerobic (LT2) thresholds.',
      assumptions: [
        'Zone 1: Below LT1 (Low Intensity / Aerobic Base)',
        'Zone 2: Between LT1 & LT2 (Threshold / Tempo)',
        'Zone 3: Above LT2 (High Intensity / VO2max)',
      ],
      validityDomain: 'Endurance disciplines (Running, Cycling, Rowing, XC Skiing).',
    },
    norwegian_method: {
      id: 'norwegian_method',
      title: 'The Norwegian Model of Double Threshold Training',
      authors: ['Bakken, M.', 'Ingebrigtsen Training Methodology Analysis'],
      publication: 'Sports Medicine Review & Practical Methodology',
      year: 2022,
      isbnOrDoi: 'Practitioner Literature / Case Studies',
      coreConcept: 'Sub-LT2 threshold accumulation via double threshold days with strict blood lactate control (2.5-3.5 mmol/L).',
      assumptions: [
        'Controlled HR below LTHR prevents excessive muscular breakdown.',
        'High weekly volume spent in sub-threshold state maximizes mitochondrial biogenesis.',
      ],
      validityDomain: 'Middle-distance to Marathon runners.',
    },
    casado_model: {
      id: 'casado_model',
      title: 'Training Periodization in Elite Middle- and Long-Distance Runners',
      authors: ['Arturo Casado', 'Leif Inge Tjelta'],
      publication: 'Sports Medicine',
      year: 2019,
      isbnOrDoi: 'DOI: 10.1007/s40279-019-01105-0',
      coreConcept: 'High-volume threshold progression transitioning from general aerobic volume to specific race-pace tempo.',
      assumptions: ['Prioritizes extensive threshold interval volume prior to race-specific sharpening.'],
      validityDomain: 'Elite and competitive endurance athletes.',
    },
    critical_speed: {
      id: 'critical_speed',
      title: 'The Critical Power Concept: Historical Background, Mathematical Basis, and Physiological Implications',
      authors: ['David C. Poole', 'Andrew M. Jones'],
      publication: 'Sports Medicine',
      year: 2016,
      isbnOrDoi: 'DOI: 10.1007/s40279-016-0561-x',
      coreConcept: 'Mathematical asymptote of speed/power (CS/CP) separating sustainable fatigue-state from unsustainable finite anaerobic work capacity (D\').',
      assumptions: [
        'Work above CS depletes D\' at a rate proportional to intensity.',
        'CS represents upper limit of heavy intensity domain.',
      ],
      validityDomain: 'Events from 2 mins to ~60 mins.',
    },
    riegel_model: {
      id: 'riegel_model',
      title: 'Athletic Records by Age',
      authors: ['Peter S. Riegel'],
      publication: 'American Scientist',
      year: 1981,
      isbnOrDoi: 'JSTOR: 27850550',
      coreConcept: 'Exponential fatigue equation T2 = T1 * (D2 / D1)^1.06 for predicting race times across distances.',
      assumptions: [
        'Assumes appropriate endurance training for target distance.',
        'Fatigue exponent 1.06 calibrated for trained endurance runners.',
      ],
      validityDomain: 'Races between 3.5 minutes and 24 hours.',
    },
    banister_impulse: {
      id: 'banister_impulse',
      title: 'Modeling Elite Athletic Performance',
      authors: ['Eric W. Banister'],
      publication: 'Physiological Testing of the Elite Athlete',
      year: 1991,
      isbnOrDoi: 'ISBN: 9780873223270',
      coreConcept: 'Impulse-response model tracking Fitness (CTL: 42-day EWMA) and Fatigue (ATL: 7-day EWMA) to derive Performance (TSB = CTL - ATL).',
      assumptions: ['Fitness decays slowly; fatigue decays rapidly.'],
      validityDomain: 'Training Load / PMC monitoring.',
    },
    acwr_model: {
      id: 'acwr_model',
      title: 'The Acute:Chronic Workload Ratio in Endurance Sports',
      authors: ['Tim Gabbett'],
      publication: 'British Journal of Sports Medicine',
      year: 2016,
      isbnOrDoi: 'DOI: 10.1136/bjsports-2015-095788',
      coreConcept: 'EWMA ratio of 7-day Acute Load to 28-day Chronic Load for injury risk monitoring.',
      assumptions: [
        'Sweet-spot ratio: 0.8 - 1.3.',
        'Spike ratio > 1.5 indicates high injury risk.',
        'ACWR is a guideline tool, not an absolute deterministic predictor.',
      ],
      validityDomain: 'Athletic injury prevention and load management.',
    },
  };

  public static getReference(id: string): ScientificReference | undefined {
    return this.REFERENCES[id];
  }

  public static getAllReferences(): ScientificReference[] {
    return Object.values(this.REFERENCES);
  }
}
