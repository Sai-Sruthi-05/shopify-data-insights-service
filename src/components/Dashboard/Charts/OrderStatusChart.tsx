import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useStore } from '../../../store/useStore';

ChartJS.register(ArcElement, Tooltip, Legend);

export const OrderStatusChart: React.FC = () => {
  const { analytics } = useStore();

  if (!analytics) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 animate-fade-in">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Order Status Distribution</h3>
          <p className="text-sm text-gray-500">Current status of all orders</p>
        </div>
        <div className="h-80 flex items-center justify-center">
          <p className="text-gray-500">Loading chart data...</p>
        </div>
      </div>
    );
  }

  const statusColors = {
    delivered: '#10b981',
    shipped: '#3b82f6',
    processing: '#f59e0b',
    pending: '#ef4444',
    cancelled: '#6b7280',
  };

  const data = {
    labels: analytics.orderStatusDistribution.map((item) => 
      item.status.charAt(0).toUpperCase() + item.status.slice(1)
    ),
    datasets: [
      {
        data: analytics.orderStatusDistribution.map((item) => item.count),
        backgroundColor: analytics.orderStatusDistribution.map((item) => 
          statusColors[item.status as keyof typeof statusColors]
        ),
        borderColor: '#ffffff',
        borderWidth: 2,
        hoverBorderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            size: 12,
          },
          color: '#374151',
        },
      },
      tooltip: {
        backgroundColor: '#1f2937',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context: any) {
            const percentage = analytics.orderStatusDistribution[context.dataIndex].percentage;
            return `${context.label}: ${context.parsed} orders (${percentage}%)`;
          }
        }
      },
    },
    cutout: '60%',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 animate-fade-in">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Order Status Distribution</h3>
        <p className="text-sm text-gray-500">Current status of all orders</p>
      </div>
      <div className="h-80">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};