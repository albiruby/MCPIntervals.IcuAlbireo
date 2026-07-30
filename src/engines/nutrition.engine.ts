import { AthleteProfile } from '../domain/athlete.js';

export interface NutritionPlan {
  carbLoadingDailyGrams: number;
  carbLoadingStrategyText: string;
  raceHourlyCarbsGrams: number;
  raceHourlyFluidMl: number;
  raceHourlySodiumMg: number;
  preRaceMealText: string;
  intraRaceFuelingSchedule: string;
}

export class NutritionEngine {
  /**
   * Generates endurance fueling and carb loading plan based on body weight & race duration
   */
  public static calculateRaceNutrition(profile: AthleteProfile, targetRaceHours: number): NutritionPlan {
    const weight = profile.weightKg || 68;

    // Carb loading (8-10g per kg body weight 36-48h before marathon/HM)
    const carbLoadingGrams = Math.round(weight * 9);

    // Hourly fuel guidelines
    let hourlyCarbs = 60; // 60g/hr standard
    if (targetRaceHours >= 3) hourlyCarbs = 75; // 75-90g/hr for long marathons

    const hourlyFluidMl = Math.round(weight * 8); // ~500-700 mL/hr depending on weather
    const hourlySodiumMg = 500; // 500-700 mg/hr

    return {
      carbLoadingDailyGrams: carbLoadingGrams,
      carbLoadingStrategyText: `Consume ${carbLoadingGrams}g carbs/day for 48 hours prior to race (high-GI rice, pasta, bagels, fruit juice, low fiber).`,
      raceHourlyCarbsGrams: hourlyCarbs,
      raceHourlyFluidMl: hourlyFluidMl,
      raceHourlySodiumMg: hourlySodiumMg,
      preRaceMealText: `100-120g easy-to-digest carbs 3 hours before start (white bread w/ jam, oatmeal, banana, electrolyte drink).`,
      intraRaceFuelingSchedule: `Take 1 energy gel (25-30g carbs) every 25-30 minutes with 150-200ml water starting at Min 25. Total target: ${hourlyCarbs}g carbs/hr.`,
    };
  }
}
