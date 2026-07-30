import { AthleteProfile } from '../domain/athlete.js';
import { Activity, ActivityStream } from '../domain/activity.js';

export interface ProviderCapabilities {
  supportsHeartRate: boolean;
  supportsPace: boolean;
  supportsPower: boolean;
  supportsCadence: boolean;
  supportsHrv: boolean;
  supportsSleep: boolean;
  supportsStreams: boolean;
}

export interface DateRangeQuery {
  oldestIso?: string;
  newestIso?: string;
  limit?: number;
}

export interface ProviderInterface {
  readonly providerName: string;
  readonly capabilities: ProviderCapabilities;

  supports(capability: keyof ProviderCapabilities): boolean;

  getAthleteProfile(): Promise<AthleteProfile>;
  getActivities(query?: DateRangeQuery): Promise<Activity[]>;
  getActivityById(activityId: string): Promise<Activity>;
  getActivityStream(activityId: string): Promise<ActivityStream>;
}
