import { ProviderInterface } from './base.provider.js';
import { IntervalsProvider } from './intervals/intervals.provider.js';
import { Config } from '../config.js';

export class ProviderFactory {
  public static createProvider(config: Config): ProviderInterface {
    // Currently defaults to IntervalsProvider (supports future garmin, strava, coros, etc.)
    return new IntervalsProvider(
      config.intervals.apiKey,
      config.intervals.athleteId,
      config.intervals.baseUrl
    );
  }
}
