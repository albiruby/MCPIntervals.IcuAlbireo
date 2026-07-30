export interface IntervalsAthleteResponse {
  id: string;
  name: string;
  weight?: number;
  icu_max_hr?: number;
  icu_resting_hr?: number;
  icu_lthr?: number;
  icu_threshold_pace?: number; // m/s
  icu_ftp?: number;
  icu_vdot?: number;
  icu_hr_zones?: number[];
  icu_pace_zones?: number[];
  icu_power_zones?: number[];
}

export interface IntervalsActivityResponse {
  id: string;
  external_id?: string;
  name: string;
  type: string;
  start_date_local: string;
  distance: number; // meters
  moving_time: number; // seconds
  elapsed_time: number; // seconds
  average_speed: number; // m/s
  max_speed: number; // m/s
  average_heartrate?: number;
  max_heartrate?: number;
  average_watts?: number;
  max_watts?: number;
  average_cadence?: number;
  total_elevation_gain?: number;
  icu_training_load?: number;
  decoupling?: number;
  icu_laps?: Array<{
    index: number;
    name?: string;
    distance: number;
    moving_time: number;
    elapsed_time: number;
    average_speed: number;
    average_heartrate?: number;
    max_heartrate?: number;
    average_watts?: number;
    average_cadence?: number;
    total_elevation_gain?: number;
  }>;
}

export interface IntervalsStreamResponse {
  time?: { data: number[] };
  distance?: { data: number[] };
  heartrate?: { data: number[] };
  velocity_smooth?: { data: number[] };
  watts?: { data: number[] };
  cadence?: { data: number[] };
  altitude?: { data: number[] };
}
