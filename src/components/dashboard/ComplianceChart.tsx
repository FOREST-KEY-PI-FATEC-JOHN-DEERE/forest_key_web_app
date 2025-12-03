"use client"

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type DataPoint = { month: string; percent?: number; events?: number };

export default function ComplianceChart({ source = 'compliance' }: { source?: 'compliance' | 'history' }) {
  const { t } = useTranslation();
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const stored = localStorage.getItem('user');
        let res;
        if (stored) {
          try {
            const authUser = JSON.parse(stored);
            const userId = authUser?.id;
            let fullName: string | null = null;
            try {
              const { data: profile } = await fetch('/api/users').then(r => r.json()).then(j => ({ data: j.data?.find((p: any) => p.id_user === userId) }));
              if (profile) fullName = [profile.first_name, profile.last_name].filter(Boolean).join(' ').trim();
            } catch {}

            res = await fetch(`/api/dashboard/monthly${source === 'history' ? '?source=history' : ''}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId, userFullName: fullName }),
            });
          } catch {
            res = await fetch(`/api/dashboard/monthly${source === 'history' ? '?source=history' : ''}`);
          }
        } else {
          res = await fetch(`/api/dashboard/monthly${source === 'history' ? '?source=history' : ''}`);
        }

        const json = await res.json();
        if (!mounted) return;
        if (json?.success) setData(json.data || []);
        else setError(json?.error || 'Failed to load monthly data');
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message || String(e));
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false };
  }, []);

  const labels = data.map(d => d.month);
  const isHistory = source === 'history';
  const chartData = {
    labels,
    datasets: [
      {
        label: isHistory ? (t('events') || 'Events') : (t('compliance_percent') || 'Compliance (%)'),
        data: data.map(d => (isHistory ? d.events ?? 0 : d.percent ?? 0)),
        fill: !isHistory,
        backgroundColor: isHistory ? 'rgba(16,185,129,0.12)' : 'rgba(59,130,246,0.12)',
        borderColor: isHistory ? 'rgba(16,185,129,0.9)' : 'rgba(59,130,246,0.9)',
        tension: 0.25,
        pointRadius: 4,
      },
    ],
  };

  const options: any = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: isHistory ? { beginAtZero: true } : { beginAtZero: true, max: 100 },
    },
  };

  if (loading) return <div className="h-64 flex items-center justify-center text-sm text-gray-500">{t('loading_chart') || 'Loading chart...'}</div>;
  if (error) return <div className="h-64 flex items-center justify-center text-sm text-red-500">{error}</div>;

  return (
    <div className="h-64">
      <Line data={chartData} options={options} />
    </div>
  );
}
