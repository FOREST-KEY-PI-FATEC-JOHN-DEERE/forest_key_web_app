import { NextResponse } from 'next/server';
import {
  getRenewalCompliance,
  getExpiredUsers,
  getAverageNextRenewal,
  getNextDue,
  getTop5UserRisk,
  getPasswordStrengthMetric,
} from '@/services/dashboard.service';

export async function GET() {
  try {
    const [compliance, expired, averageNext, nextDue, top5, passwordStrength] = await Promise.all([
      getRenewalCompliance(),
      getExpiredUsers(),
      getAverageNextRenewal(),
      getNextDue(),
      getTop5UserRisk(),
      getPasswordStrengthMetric(),
    ]);

    return NextResponse.json({
      success: true,
      data: { compliance, expired, averageNext, nextDue, top5, passwordStrength },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
