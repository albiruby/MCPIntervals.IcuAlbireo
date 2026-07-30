export interface HeartRateZones {
  z1: { min: number; max: number; name: string };
  z2: { min: number; max: number; name: string };
  z3: { min: number; max: number; name: string };
  z4: { min: number; max: number; name: string };
  z5: { min: number; max: number; name: string };
}

export interface PaceZones {
  z1: { minPaceSec: number; maxPaceSec: number; name: string }; // Easy/Recovery
  z2: { minPaceSec: number; maxPaceSec: number; name: string }; // Aerobic/Marathon
  z3: { minPaceSec: number; maxPaceSec: number; name: string }; // Tempo/Threshold
  z4: { minPaceSec: number; maxPaceSec: number; name: string }; // Interval/VO2max
  z5: { minPaceSec: number; maxPaceSec: number; name: string }; // Repetition/Sprint
}

export interface PowerZones {
  z1: { minWatts: number; maxWatts: number; name: string };
  z2: { minWatts: number; maxWatts: number; name: string };
  z3: { minWatts: number; maxWatts: number; name: string };
  z4: { minWatts: number; maxWatts: number; name: string };
  z5: { minWatts: number; maxWatts: number; name: string };
}

export interface AthleteProfile {
  id: string;
  name: string;
  weightKg: number;
  maxHeartRate: number;
  restingHeartRate: number;
  lthr: number; // Lactate Threshold Heart Rate
  ltPaceSecPerKm: number; // Lactate Threshold Pace (seconds/km)
  ltPowerWatts?: number; // Lactate Threshold Power
  criticalSpeedMps: number; // Critical Speed (meters per second)
  criticalPowerWatts?: number; // Critical Power
  vdot: number;
  hrZones: HeartRateZones;
  paceZones: PaceZones;
  powerZones?: PowerZones;
}
