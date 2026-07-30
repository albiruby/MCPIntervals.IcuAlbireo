import { AthleteProfile } from '../domain/athlete.js';
import { Activity } from '../domain/activity.js';
import { FitnessFatigueForm, TIDDistribution, ACWRResult } from '../domain/metrics.js';
import { formatPace } from '../utils/formatters.js';

export class ReportEngine {
  /**
   * Generates a comprehensive Weekly Summary Report in GitHub Markdown format
   */
  public static generateWeeklyMarkdownReport(
    profile: AthleteProfile,
    activities: Activity[],
    fff: FitnessFatigueForm,
    tid: TIDDistribution,
    acwr: ACWRResult
  ): string {
    const totalDistKm = (activities.reduce((acc, a) => acc + a.distanceMeters, 0) / 1000).toFixed(1);
    const totalTimeHours = (activities.reduce((acc, a) => acc + a.movingTimeSeconds, 0) / 3600).toFixed(1);
    const totalLoad = activities.reduce((acc, a) => acc + (a.trainingLoad || 0), 0);

    return `
# 🏃 TrackLab Weekly Performance & Fitness Report

## 👤 Athlete Overview
- **Athlete**: ${profile.name}
- **VDOT**: ${profile.vdot} | **LTHR**: ${profile.lthr} bpm | **LT Pace**: ${formatPace(profile.ltPaceSecPerKm)}

---

## 📊 Weekly Summary Metrics
| Metric | Value |
| :--- | :--- |
| **Total Distance** | **${totalDistKm} km** |
| **Total Moving Time** | **${totalTimeHours} hours** |
| **Total Training Load** | **${totalLoad} TSS** |
| **Activities Count** | **${activities.length} sessions** |

---

## 📉 Fitness, Fatigue & Form (PMC)
- **CTL (Fitness)**: ${fff.ctl}
- **ATL (Fatigue)**: ${fff.atl}
- **TSB (Form)**: **${fff.tsb}** (${fff.status})

---

## 🎯 Training Intensity Distribution (TID)
- **Classification**: **${tid.classifiedModel} Model**
- **Zone 1 (Low)**: ${tid.zone1Percentage}%
- **Zone 2 (Threshold)**: ${tid.zone2Percentage}%
- **Zone 3 (High)**: ${tid.zone3Percentage}%
*${tid.summary}*

---

## 🛡️ Injury Risk & Workload (ACWR)
- **ACWR Ratio**: **${acwr.acwr}** (${acwr.riskLevel})
- **Monotony**: ${acwr.monotony} | **Strain**: ${acwr.strain}
- **Recommendation**: ${acwr.recommendation}

---

## 🗓️ Sessions Log
${activities
  .map(
    (a) =>
      `- **${a.startDateLocal.split('T')[0]}**: [${a.name}](${(a.distanceMeters / 1000).toFixed(1)} km @ ${formatPace(a.averagePaceSecPerKm)}, HR: ${a.averageHeartRate || '-'} bpm, Load: ${a.trainingLoad || 0})`
  )
  .join('\n')}

---
*Generated automatically by TrackLab MCP Ultimate Edition Engine.*
`.trim();
  }
}
