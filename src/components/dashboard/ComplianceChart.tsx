"use client"

import React, { useEffect, useState } from 'react';
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
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/dashboard/monthly${source === 'history' ? '?source=history' : ''}`);
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
        label: isHistory ? 'Eventos' : 'Conformidade (%)',
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

  if (loading) return <div className="h-64 flex items-center justify-center text-sm text-gray-500">Carregando gráfico...</div>;
  if (error) return <div className="h-64 flex items-center justify-center text-sm text-red-500">{error}</div>;

  return (
    <div className="h-64">
      <Line data={chartData} options={options} />
    </div>
  );
}
