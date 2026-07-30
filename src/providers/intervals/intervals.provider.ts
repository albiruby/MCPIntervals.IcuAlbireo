import { ProviderInterface, DateRangeQuery, ProviderCapabilities } from '../base.provider.js';
import { AthleteProfile } from '../../domain/athlete.js';
import { Activity, ActivityStream } from '../../domain/activity.js';
import { IntervalsClient } from './intervals.client.js';
import { IntervalsMapper } from './intervals.mapper.js';

export class IntervalsProvider implements ProviderInterface {
  public readonly providerName = 'Intervals.icu';
  public readonly capabilities: ProviderCapabilities = {
    supportsHeartRate: true,
    supportsPace: true,
    supportsPower: true,
    supportsCadence: true,
    supportsHrv: false,
    supportsSleep: false,
    supportsStreams: true,
  };

  private readonly client: IntervalsClient;

  constructor(apiKey: string, athleteId: string = 'me', baseUrl?: string) {
    this.client = new IntervalsClient(apiKey, athleteId, baseUrl);
  }

  public supports(capability: keyof ProviderCapabilities): boolean {
    return !!this.capabilities[capability];
  }

  public async getAthleteProfile(): Promise<AthleteProfile> {
    const raw = await this.client.getAthlete();
    return IntervalsMapper.mapAthlete(raw);
  }

  public async getActivities(query?: DateRangeQuery): Promise<Activity[]> {
    const rawList = await this.client.getActivities(query?.oldestIso, query?.newestIso);
    let mapped = rawList.map((r) => IntervalsMapper.mapActivity(r));
    if (query?.limit && query.limit > 0) {
      mapped = mapped.slice(0, query.limit);
    }
    return mapped;
  }

  public async getActivityById(activityId: string): Promise<Activity> {
    const raw = await this.client.getActivityById(activityId);
    return IntervalsMapper.mapActivity(raw);
  }

  public async getActivityStream(activityId: string): Promise<ActivityStream> {
    const raw = await this.client.getActivityStreams(activityId);
    return IntervalsMapper.mapStream(raw);
  }
}
