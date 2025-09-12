import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'orange' | 'purple';
}

const colorConfig = {
  blue: {
    bg: 'bg-primary-50',
    icon: 'text-primary-600',
    border: 'border-primary-200',
  },
  green: {
    bg: 'bg-secondary-50',
    icon: 'text-secondary-600',
    border: 'border-secondary-200',
  },
  orange: {
    bg: 'bg-accent-50',
    icon: 'text-accent-600',
    border: 'border-accent-200',
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'text-purple-600',
    border: 'border-purple-200',
  },
};

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  color = 'blue',
}) => {
  const colors = colorConfig[color];
  const isPositive = change !== undefined ? change > 0 : null;

  return (
    <div className={`bg-white rounded-xl border ${colors.border} p-6 hover:shadow-lg transition-all duration-200 animate-fade-in`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          
          {change !== undefined && (
            <div className="flex items-center space-x-1">
              {isPositive ? (
                <TrendingUp className="w-4 h-4 text-success-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-error-600" />
              )}
              <span
                className={`text-sm font-medium ${
                  isPositive ? 'text-success-600' : 'text-error-600'
                }`}
              >
                {Math.abs(change)}%
              </span>
              <span className="text-sm text-gray-500">
                {changeLabel || 'vs last month'}
              </span>
            </div>
          )}
        </div>
        
        <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${colors.icon}`} />
        </div>
      </div>
    </div>
  );
};