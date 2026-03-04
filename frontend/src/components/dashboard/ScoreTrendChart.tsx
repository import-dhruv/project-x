'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ScoreTrendChartProps {
  data: Array<{
    week: string;
    avg: number;
    deptAvg: number;
    atRisk: number;
  }>;
}

export default function ScoreTrendChart({ data }: ScoreTrendChartProps) {
  return (
    <div className="glass-card p-6 animate-fade-slide-up stagger-2">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
          📈 Score Trends
        </h3>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-xs rounded-lg bg-accent-blue/20 text-accent-blue border border-accent-blue/30 font-medium">
            Weekly
          </button>
          <button className="px-3 py-1.5 text-xs rounded-lg hover:bg-white/[0.04] text-text-muted transition-colors">
            Monthly
          </button>
          <button className="px-3 py-1.5 text-xs rounded-lg hover:bg-white/[0.04] text-text-muted transition-colors">
            Quarterly
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorDept" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="week" stroke="#94a3b8" fontSize={12} />
          <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
          <Tooltip
            contentStyle={{
              background: 'rgba(15, 22, 41, 0.95)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              backdropFilter: 'blur(12px)',
            }}
            labelStyle={{ color: '#f1f5f9', fontWeight: 600 }}
            itemStyle={{ color: '#94a3b8', fontSize: 12 }}
          />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
            formatter={(value) => <span style={{ color: '#94a3b8', fontSize: 12 }}>{value}</span>}
          />
          <Area
            type="monotone"
            dataKey="avg"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#colorAvg)"
            name="Company Avg"
            dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
          />
          <Area
            type="monotone"
            dataKey="deptAvg"
            stroke="#06b6d4"
            strokeWidth={2}
            fill="url(#colorDept)"
            name="Dept Avg"
            dot={{ r: 4, fill: '#06b6d4', strokeWidth: 2, stroke: '#fff' }}
          />
          <Area
            type="monotone"
            dataKey="atRisk"
            stroke="#ef4444"
            strokeWidth={2}
            strokeDasharray="5 5"
            fill="none"
            name="At Risk Count"
            dot={{ r: 4, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
