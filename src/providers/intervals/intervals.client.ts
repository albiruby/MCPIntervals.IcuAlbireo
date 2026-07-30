import { IntervalsAthleteResponse, IntervalsActivityResponse, IntervalsStreamResponse } from './types.js';

export class IntervalsClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly athleteId: string;

  constructor(apiKey: string, athleteId: string, baseUrl: string = 'https://intervals.icu/api/v1') {
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
    const response = await fetch(`${this.baseUrl}/athlete/${this.athleteId}`, {
      headers: this.headers,
    });
    if (!response.ok) {
      throw new Error(`Intervals API error: ${response.status} ${response.statusText}`);
    }
    return (await response.json()) as IntervalsAthleteResponse;
  }

  public async getActivities(oldestIso?: string, newestIso?: string): Promise<IntervalsActivityResponse[]> {
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
    const response = await fetch(`${this.baseUrl}/activity/${id}`, {
      headers: this.headers,
    });
    if (!response.ok) {
      throw new Error(`Intervals API error fetching activity ${id}: ${response.status} ${response.statusText}`);
    }
    return (await response.json()) as IntervalsActivityResponse;
  }

  public async getActivityStreams(id: string): Promise<IntervalsStreamResponse> {
    const response = await fetch(`${this.baseUrl}/activity/${id}/streams`, {
      headers: this.headers,
    });
    if (!response.ok) {
      throw new Error(`Intervals API error fetching activity streams ${id}: ${response.status} ${response.statusText}`);
    }
    return (await response.json()) as IntervalsStreamResponse;
  }
}
