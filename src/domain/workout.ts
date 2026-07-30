export type StepType = 'Warmup' | 'Active' | 'Rest' | 'Cooldown' | 'Recovery';

export interface WorkoutStep {
  type: StepType;
  durationSeconds?: number;
  distanceMeters?: number;
  targetPaceSecPerKm?: { min: number; max: number };
  targetHrBpm?: { min: number; max: number };
  targetPowerWatts?: { min: number; max: number };
  description: string;
}

export interface RepetitionBlock {
  repeatCount: number;
  steps: WorkoutStep[];
  description: string;
}

export interface StructuredWorkout {
  title: string;
  category: 'Easy' | 'Recovery' | 'Long Run' | 'Threshold' | 'Cruise Interval' | 'VO2max' | 'Repetition' | 'Race Pace';
  description: string;
  totalDistanceMeters?: number;
  estimatedDurationSeconds: number;
  warmup: WorkoutStep;
  mainSet: (WorkoutStep | RepetitionBlock)[];
  cooldown: WorkoutStep;
  textInstructions: string;
}
