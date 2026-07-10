"use client";

import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useTranslation } from '../contexts/LanguageContext';

interface SugarCurveChartProps {
  currentGL: number;
  swapGL?: number; // Optional comparison if there is a swap
}

export default function SugarCurveChart({ currentGL, swapGL }: SugarCurveChartProps) {
  const { t } = useTranslation();
  
  const data = useMemo(() => {
    // Generate synthetic blood sugar curve based on Glycemic Load
    // Baseline is roughly 90 mg/dL
    const baseline = 90;
    
    // A simplified curve over 120 minutes
    return [
      { time: '0m', current: baseline, swap: baseline },
      { time: '30m', current: baseline + (currentGL * 0.8), swap: swapGL ? baseline + (swapGL * 0.8) : baseline },
      { time: '60m', current: baseline + (currentGL * 1.5), swap: swapGL ? baseline + (swapGL * 1.5) : baseline }, // Peak
      { time: '90m', current: baseline + (currentGL * 0.9), swap: swapGL ? baseline + (swapGL * 0.9) : baseline },
      { time: '120m', current: baseline + (currentGL * 0.2), swap: swapGL ? baseline + (swapGL * 0.2) : baseline },
    ];
  }, [currentGL, swapGL]);

  // Determine peak color
  const peak = 90 + (currentGL * 1.5);
  const peakColor = peak > 140 ? "#ef4444" : peak > 120 ? "#eab308" : "#10b981";

  return (
    <div className="w-full h-64 mt-4 bg-white/60 p-4 rounded-xl border border-gray-100 shadow-inner">
      <h4 className="text-sm font-semibold text-gray-700 mb-4 font-heading text-center">
        {t('chart.title')}
      </h4>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={peakColor} stopOpacity={0.4}/>
              <stop offset="95%" stopColor={peakColor} stopOpacity={0}/>
            </linearGradient>
            {swapGL && (
              <linearGradient id="colorSwap" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            )}
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} domain={['dataMin - 10', 'auto']} />
          <Tooltip 
            contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            labelStyle={{ fontWeight: 'bold', color: '#374151' }}
          />
          <ReferenceLine y={140} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'High Zone', fill: '#ef4444', fontSize: 10 }} />
          <ReferenceLine y={120} stroke="#10b981" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: t('chart.safeZone'), fill: '#10b981', fontSize: 10 }} />
          
          {swapGL && (
            <Area 
              type="monotone" 
              dataKey="swap" 
              name={t('chart.withSwap')}
              stroke="#10b981" 
              fillOpacity={1} 
              fill="url(#colorSwap)" 
              strokeWidth={2}
            />
          )}
          <Area 
            type="monotone" 
            dataKey="current" 
            name={t('chart.currentMeal')}
            stroke={peakColor} 
            fillOpacity={1} 
            fill="url(#colorCurrent)" 
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
