import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const colorMap = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  purple: 'bg-purple-100 text-purple-600',
  red: 'bg-red-100 text-red-600',
  amber: 'bg-amber-100 text-amber-600',
  emerald: 'bg-emerald-100 text-emerald-600',
  orange: 'bg-orange-100 text-orange-600',
  indigo: 'bg-indigo-100 text-indigo-600',
  cyan: 'bg-cyan-100 text-cyan-600',
  teal: 'bg-teal-100 text-teal-600',
};

export default function KPICard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  suffix,
  prefix,
  color = 'blue',
}) {
  const iconColors = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {prefix && <span className="text-2xl">{prefix}</span>}
            {value}
            {suffix && (
              <span className="text-lg font-medium text-gray-500 ml-1">
                {suffix}
              </span>
            )}
          </p>
          {trend !== undefined && trend !== null && (
            <div className="mt-2 flex items-center text-sm">
              {trendUp ? (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={trendUp ? 'text-green-600' : 'text-red-600'}>
                {trendUp ? '+' : '-'}
                {Math.abs(trend)}%
              </span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg ${iconColors}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
}
