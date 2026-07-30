import { IntervalsAthleteResponse, IntervalsActivityResponse, IntervalsStreamResponse } from './types.js';

export class IntervalsClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly athleteId: string;

  constructor(apiKey: string, athleteId: string = 'me', baseUrl: string = 'https://intervals.icu/api/v1') {
    this.apiKey = apiKey;
    this.athleteId = athleteId;
    this.baseUrl = baseUrl;
  }

  private get headers(): Record<string, string> {
    const authHeader = 'Basic ' + Buffer.from(`API_KEY:${this.apiKey}`).toString('base64');
    return {
      Authorization: authHeader,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
  }

  public async getAthlete(): Promise<IntervalsAthleteResponse> {
    if (!this.apiKey) {
      return this.getMockAthlete();
    }
    const response = await fetch(`${this.baseUrl}/athlete/${this.athleteId}`, {
      headers: this.headers,
    });
    if (!response.ok) {
      throw new Error(`Intervals API error: ${response.status} ${response.statusText}`);
    }
    return (await response.json()) as IntervalsAthleteResponse;
  }

  public async getActivities(oldestIso?: string, newestIso?: string): Promise<IntervalsActivityResponse[]> {
    if (!this.apiKey) {
      return this.getMockActivities();
    }
    let url = `${this.baseUrl}/athlete/${this.athleteId}/activities`;
    const params = new URLSearchParams();
    if (oldestIso) params.append('oldest', oldestIso);
    if (newestIso) params.append('newest', newestIso);
    if (params.toString()) url += `?${params.toString()}`;

    const response = await fetch(url, { headers: this.headers });
    if (!response.ok) {
      throw new Error(`Intervals API error fetching activities: ${response.status} ${response.statusText}`);
    }
    return (await response.json()) as IntervalsActivityResponse[];
  }

  public async getActivityById(id: string): Promise<IntervalsActivityResponse> {
    if (!this.apiKey) {
      const mockList = this.getMockActivities();
      return mockList.find((a) => a.id === id) || mockList[0];
    }
    const response = await fetch(`${this.baseUrl}/activity/${id}`, {
      headers: this.headers,
    });
    if (!response.ok) {
      throw new Error(`Intervals API error fetching activity ${id}: ${response.status} ${response.statusText}`);
    }
    return (await response.json()) as IntervalsActivityResponse;
  }

  public async getActivityStreams(id: string): Promise<IntervalsStreamResponse> {
    if (!this.apiKey) {
      return this.getMockStreams();
    }
    const response = await fetch(`${this.baseUrl}/activity/${id}/streams`, {
      headers: this.headers,
    });
    if (!response.ok) {
      throw new Error(`Intervals API error fetching activity streams ${id}: ${response.status} ${response.statusText}`);
    }
    return (await response.json()) as IntervalsStreamResponse;
  }

  /**
   * Fallback mock data when API_KEY is omitted for initial sandbox testing
   */
  private getMockAthlete(): IntervalsAthleteResponse {
    return {
      id: 'i12345',
      name: 'Runner Ultimate',
      weight: 68.5,
      icu_max_hr: 192,
      icu_resting_hr: 48,
      icu_lthr: 171,
      icu_threshold_pace: 3.85, // ~4:20 /km
      icu_ftp: 280,
      icu_vdot: 51.5,
      icu_hr_zones: [135, 152, 163, 171, 192],
    };
  }

  private getMockActivities(): IntervalsActivityResponse[] {
    const now = new Date();
    return [
      {
        id: 'act_101',
        name: 'Morning Threshold Cruise Intervals',
        type: 'Run',
        start_date_local: new Date(now.getTime() - 86400000 * 2).toISOString(),
        distance: 12500,
        moving_time: 3300,
        elapsed_time: 3420,
        average_speed: 3.78, // ~4:24 /km
        max_speed: 4.8,
        average_heartrate: 164,
        max_heartrate: 178,
        average_cadence: 176,
        total_elevation_gain: 45,
        icu_training_load: 78,
        decoupling: 2.1,
      },
      {
        id: 'act_102',
        name: 'Sunday Long Run',
        type: 'Run',
        start_date_local: new Date(now.getTime() - 86400000 * 5).toISOString(),
        distance: 22000,
        moving_time: 6600,
        elapsed_time: 6720,
        average_speed: 3.33, // ~5:00 /km
        max_speed: 4.1,
        average_heartrate: 148,
        max_heartrate: 161,
        average_cadence: 172,
        total_elevation_gain: 120,
        icu_training_load: 115,
        decoupling: 4.2,
      },
      {
        id: 'act_103',
        name: 'Easy Recovery Run',
        type: 'Run',
        start_date_local: new Date(now.getTime() - 86400000 * 7).toISOString(),
        distance: 8000,
        moving_time: 2640,
        elapsed_time: 2700,
        average_speed: 3.03, // ~5:30 /km
        max_speed: 3.5,
        average_heartrate: 136,
        max_heartrate: 144,
        average_cadence: 168,
        total_elevation_gain: 20,
        icu_training_load: 42,
        decoupling: 1.1,
      },
    ];
  }

  private getMockStreams(): IntervalsStreamResponse {
    const time = Array.from({ length: 60 }, (_, i) => i * 30);
    const hr = time.map((_, i) => 135 + Math.floor(i * 0.6));
    const speed = time.map(() => 3.5 + Math.random() * 0.2);
    return {
      time: { data: time },
      heartrate: { data: hr },
      velocity_smooth: { data: speed },
    };
  }
}
