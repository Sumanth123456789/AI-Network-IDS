
import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  trend?: string;
  trendColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon, trend, trendColor }) => {
  return (
    <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl shadow-lg backdrop-blur-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">{label}</p>
          <h3 className="text-3xl font-bold mt-1 text-white">{value}</h3>
          {trend && (
            <p className={`text-xs mt-2 ${trendColor || 'text-slate-400'}`}>
              <i className={`fas fa-arrow-${trend.startsWith('+') ? 'up' : 'down'} mr-1`}></i>
              {trend} from last hour
            </p>
          )}
        </div>
        <div className="bg-slate-700/50 p-3 rounded-lg text-blue-400">
          <i className={`fas ${icon} text-xl`}></i>
        </div>
      </div>
    </div>
  );
};
