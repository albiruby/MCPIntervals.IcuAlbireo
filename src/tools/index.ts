import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { ProviderInterface } from '../providers/base.provider.js';
import { AthleteEngine } from '../engines/athlete.engine.js';
import { ActivityEngine } from '../engines/activity.engine.js';
import { WorkoutEngine } from '../engines/workout.engine.js';
import { ThresholdEngine } from '../engines/threshold.engine.js';
import { TIDEngine } from '../engines/tid.engine.js';
import { PerformanceEngine } from '../engines/performance.engine.js';
import { PredictionEngine } from '../engines/prediction.engine.js';
import { RecoveryEngine } from '../engines/recovery.engine.js';
import { InjuryRiskEngine } from '../engines/injury_risk.engine.js';
import { WorkoutBuilderEngine } from '../engines/workout_builder.engine.js';
import { NutritionEngine } from '../engines/nutrition.engine.js';
import { RacePlannerEngine } from '../engines/race_planner.engine.js';
import { ReportEngine } from '../engines/report.engine.js';
import { LiteratureRegistry } from '../registry/literature.registry.js';
import { TTLCache } from '../cache/cache.manager.js';
import { formatPace, formatDuration } from '../utils/formatters.js';

export function registerAllTools(server: Server, provider: ProviderInterface) {
  // 1. List Tools Handler
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        // Provider Health & Observability Tools
        {
          name: 'provider_status',
          description: 'Checks active endurance provider name, capabilities (HR, Power, Streams, HRV, Sleep), and health status.',
          inputSchema: { type: 'object', properties: {} },
        },
        {
          name: 'provider_ping',
          description: 'Pings provider API endpoint and reports response latency.',
          inputSchema: { type: 'object', properties: {} },
        },
        {
          name: 'get_literature_references',
          description: 'Lists all scientific paper & textbook references (Daniels, Seiler, Norwegian Method, Casado, Riegel, Banister, ACWR) registered in TrackLab.',
          inputSchema: { type: 'object', properties: {} },
        },

        // Profile & Athlete Tools
        {
          name: 'get_athlete_profile',
          description: 'Fetches athlete profile, LTHR, LT Pace, VDOT, and body metrics.',
          inputSchema: { type: 'object', properties: {} },
        },
        {
          name: 'get_hr_zones',
          description: 'Calculates athlete 5-zone HR breakdown based on LTHR & Max HR.',
          inputSchema: { type: 'object', properties: {} },
        },
        {
          name: 'get_pace_zones',
          description: 'Calculates athlete pace zones (Z1 Easy to Z5 Repetition).',
          inputSchema: { type: 'object', properties: {} },
        },

        // Activity & Drift Tools
        {
          name: 'get_latest_activity',
          description: 'Fetches the most recent workout session and summary.',
          inputSchema: { type: 'object', properties: {} },
        },
        {
          name: 'list_recent_activities',
          description: 'Lists recent activities with pace, HR, distance, and training load.',
          inputSchema: {
            type: 'object',
            properties: {
              limit: { type: 'number', description: 'Number of activities to fetch (default: 10)' },
            },
          },
        },
        {
          name: 'analyze_activity_drift',
          description: 'Analyzes cardiac decoupling (% aerobic drift) for a specific activity stream.',
          inputSchema: {
            type: 'object',
            properties: {
              activityId: { type: 'string', description: 'Activity ID' },
            },
            required: ['activityId'],
          },
        },

        // Threshold & Literature Models
        {
          name: 'analyze_threshold',
          description: 'Executes multi-literature threshold analysis (Daniels, Norwegian Double Threshold, Casado, Seiler 3-Zone) with confidence scoring.',
          inputSchema: { type: 'object', properties: {} },
        },

        // TID Tools
        {
          name: 'calculate_tid',
          description: 'Calculates 3-zone Training Intensity Distribution (Polarized 80/20 vs Pyramidal vs Threshold).',
          inputSchema: {
            type: 'object',
            properties: {
              days: { type: 'number', description: 'Lookback window in days (default: 14)' },
            },
          },
        },

        // Performance & PMC
        {
          name: 'get_fitness_fatigue_form',
          description: 'Calculates Banister EWMA PMC (CTL Fitness, ATL Fatigue, TSB Form).',
          inputSchema: { type: 'object', properties: {} },
        },
        {
          name: 'calculate_vdot',
          description: 'Calculates Jack Daniels VDOT rating from a race performance.',
          inputSchema: {
            type: 'object',
            properties: {
              distanceMeters: { type: 'number', description: 'Race distance in meters' },
              timeSeconds: { type: 'number', description: 'Finish time in seconds' },
            },
            required: ['distanceMeters', 'timeSeconds'],
          },
        },

        // Parameterized Race Predictor
        {
          name: 'predict_race',
          description: 'Predicts race finish time using Riegel & Daniels models with validity checking.',
          inputSchema: {
            type: 'object',
            properties: {
              knownDistanceMeters: { type: 'number', description: 'Sample race distance in meters (e.g. 5000)' },
              knownTimeSeconds: { type: 'number', description: 'Sample finish time in seconds (e.g. 1200)' },
              targetDistanceMeters: { type: 'number', description: 'Target race distance in meters (e.g. 42195)' },
            },
            required: ['knownDistanceMeters', 'knownTimeSeconds', 'targetDistanceMeters'],
          },
        },

        // Recovery & Injury Risk
        {
          name: 'get_training_readiness',
          description: 'Calculates 0-100 Training Readiness score and workout recommendation.',
          inputSchema: { type: 'object', properties: {} },
        },
        {
          name: 'calculate_acwr',
          description: 'Calculates Acute:Chronic Workload Ratio (7d vs 28d EWMA), Monotony, and Strain.',
          inputSchema: { type: 'object', properties: {} },
        },

        // Parameterized Workout Builder
        {
          name: 'build_workout',
          description: 'Generates structured step workout (Threshold Cruise Intervals or VO2max Intervals).',
          inputSchema: {
            type: 'object',
            properties: {
              type: { type: 'string', enum: ['Threshold', 'VO2max'], description: 'Workout type' },
              repetitions: { type: 'number', description: 'Number of reps (default: 5)' },
            },
            required: ['type'],
          },
        },

        // Nutrition & Race Planner
        {
          name: 'calculate_race_nutrition',
          description: 'Calculates Carb Loading (g/kg), fluid (mL/hr), sodium, and gel schedule.',
          inputSchema: {
            type: 'object',
            properties: {
              targetRaceHours: { type: 'number', description: 'Target race duration in hours' },
            },
            required: ['targetRaceHours'],
          },
        },
        {
          name: 'generate_race_plan',
          description: 'Generates negative split kilometer pacing chart and fuel strategy.',
          inputSchema: {
            type: 'object',
            properties: {
              distanceKm: { type: 'number', description: 'Race distance in KM' },
              targetTimeSeconds: { type: 'number', description: 'Goal finish time in seconds' },
            },
            required: ['distanceKm', 'targetTimeSeconds'],
          },
        },

        // Exporters & Dashboards
        {
          name: 'export_weekly_report',
          description: 'Exports weekly performance & PMC summary report in GitHub Markdown.',
          inputSchema: { type: 'object', properties: {} },
        },
        {
          name: 'training_dashboard',
          description: 'Unified Status Dashboard summarizing PMC, TID, ACWR, Readiness, and Provider Status.',
          inputSchema: { type: 'object', properties: {} },
        },
      ],
    };
  });

  // 2. Call Tool Handler
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      // In-Memory Cache for Athlete Profile
      let profile = TTLCache.get<any>('athlete_profile');
      if (!profile) {
        profile = await provider.getAthleteProfile();
        TTLCache.set('athlete_profile', profile, 60);
      }

      switch (name) {
        case 'provider_status':
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    provider: provider.providerName,
                    capabilities: provider.capabilities,
                    cacheStatus: 'Active (60s TTL)',
                  },
                  null,
                  2
                ),
              },
            ],
          };

        case 'provider_ping': {
          const start = Date.now();
          await provider.getAthleteProfile();
          const latencyMs = Date.now() - start;
          return { content: [{ type: 'text', text: `Provider Ping (${provider.providerName}): **${latencyMs} ms** [Healthy]` }] };
        }

        case 'get_literature_references': {
          const refs = LiteratureRegistry.getAllReferences();
          return { content: [{ type: 'text', text: JSON.stringify(refs, null, 2) }] };
        }

        case 'get_athlete_profile':
          return { content: [{ type: 'text', text: JSON.stringify(profile, null, 2) }] };

        case 'get_hr_zones':
          return { content: [{ type: 'text', text: JSON.stringify(profile.hrZones, null, 2) }] };

        case 'get_pace_zones':
          return { content: [{ type: 'text', text: JSON.stringify(profile.paceZones, null, 2) }] };

        case 'get_latest_activity': {
          const activities = await provider.getActivities({ limit: 1 });
          return { content: [{ type: 'text', text: JSON.stringify(activities[0], null, 2) }] };
        }

        case 'list_recent_activities': {
          const limit = Number(args?.limit || 10);
          const activities = await provider.getActivities({ limit });
          return { content: [{ type: 'text', text: JSON.stringify(activities, null, 2) }] };
        }

        case 'analyze_activity_drift': {
          const activityId = String(args?.activityId || 'act_101');
          const stream = await provider.getActivityStream(activityId);
          const result = ActivityEngine.calculateDecoupling(stream);
          return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }

        case 'analyze_threshold': {
          const result = ThresholdEngine.analyzeThreshold(profile);
          return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }

        case 'calculate_tid': {
          const days = Number(args?.days || 14);
          const activities = await provider.getActivities({ limit: days });
          const result = TIDEngine.calculateTID(activities, profile);
          return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }

        case 'get_fitness_fatigue_form': {
          const activities = await provider.getActivities({ limit: 30 });
          const pmc = PerformanceEngine.calculatePMC(activities);
          return { content: [{ type: 'text', text: JSON.stringify(pmc, null, 2) }] };
        }

        case 'calculate_vdot': {
          const dist = Number(args?.distanceMeters || 5000);
          const time = Number(args?.timeSeconds || 1200);
          const vdot = PerformanceEngine.calculateVDOTFromRace(dist, time);
          return { content: [{ type: 'text', text: `Daniels VDOT rating for ${(dist / 1000).toFixed(1)}km in ${formatDuration(time)}: **${vdot}**` }] };
        }

        case 'predict_race': {
          const sampleDist = Number(args?.knownDistanceMeters || 5000);
          const sampleTime = Number(args?.knownTimeSeconds || 1200);
          const targetDist = Number(args?.targetDistanceMeters || 42195);
          const prediction = PredictionEngine.predictRace(sampleDist, sampleTime, targetDist);
          return { content: [{ type: 'text', text: JSON.stringify(prediction, null, 2) }] };
        }

        case 'get_training_readiness': {
          const activities = await provider.getActivities({ limit: 30 });
          const pmc = PerformanceEngine.calculatePMC(activities);
          const readiness = RecoveryEngine.calculateReadiness(pmc, 68, 65, profile.restingHeartRate, 48);
          return { content: [{ type: 'text', text: JSON.stringify(readiness, null, 2) }] };
        }

        case 'calculate_acwr': {
          const activities = await provider.getActivities({ limit: 30 });
          const acwr = InjuryRiskEngine.calculateACWR(activities);
          return { content: [{ type: 'text', text: JSON.stringify(acwr, null, 2) }] };
        }

        case 'build_workout': {
          const type = String(args?.type || 'Threshold');
          const reps = Number(args?.repetitions || 5);
          const workout = type === 'VO2max' ? WorkoutBuilderEngine.buildVo2MaxWorkout(profile, reps) : WorkoutBuilderEngine.buildThresholdWorkout(profile, reps);
          return { content: [{ type: 'text', text: JSON.stringify(workout, null, 2) }] };
        }

        case 'calculate_race_nutrition': {
          const hours = Number(args?.targetRaceHours || 3.5);
          const nutrition = NutritionEngine.calculateRaceNutrition(profile, hours);
          return { content: [{ type: 'text', text: JSON.stringify(nutrition, null, 2) }] };
        }

        case 'generate_race_plan': {
          const distKm = Number(args?.distanceKm || 42.195);
          const timeSec = Number(args?.targetTimeSeconds || 12600);
          const plan = RacePlannerEngine.generateRacePlan(profile, distKm, timeSec);
          return { content: [{ type: 'text', text: JSON.stringify(plan, null, 2) }] };
        }

        case 'export_weekly_report': {
          const activities = await provider.getActivities({ limit: 14 });
          const pmc = PerformanceEngine.calculatePMC(activities);
          const tid = TIDEngine.calculateTID(activities, profile);
          const acwrRes = InjuryRiskEngine.calculateACWR(activities);
          const markdown = ReportEngine.generateWeeklyMarkdownReport(profile, activities, pmc, tid.modelResult as any, acwrRes.acwrModel);
          return { content: [{ type: 'text', text: markdown }] };
        }

        case 'training_dashboard': {
          const activities = await provider.getActivities({ limit: 30 });
          const pmc = PerformanceEngine.calculatePMC(activities);
          const tid = TIDEngine.calculateTID(activities, profile);
          const acwrRes = InjuryRiskEngine.calculateACWR(activities);
          const readiness = RecoveryEngine.calculateReadiness(pmc);

          const dashboard = {
            provider: { name: provider.providerName, capabilities: provider.capabilities },
            athlete: { name: profile.name, vdot: profile.vdot, lthr: profile.lthr, ltPace: formatPace(profile.ltPaceSecPerKm) },
            pmc,
            tid: { model: tid.modelResult.classifiedModel, summary: tid.modelResult.summaryText },
            injuryRisk: { acwr: acwrRes.acwrModel.acwr, riskLevel: acwrRes.acwrModel.riskLevel },
            readiness: { score: readiness.readinessScore, recommendation: readiness.recommendation },
          };
          return { content: [{ type: 'text', text: JSON.stringify(dashboard, null, 2) }] };
        }

        default:
          throw new Error(`Tool not found: ${name}`);
      }
    } catch (err: any) {
      return {
        isError: true,
        content: [{ type: 'text', text: `TrackLab Engine Error: ${err?.message || String(err)}` }],
      };
    }
  });
}
