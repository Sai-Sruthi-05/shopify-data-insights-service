import React from 'react';
import { TrendingUp, TrendingDown, Package } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const TopProducts: React.FC = () => {
  const { analytics } = useStore();

  if (!analytics) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Top Performing Products</h3>
            <p className="text-sm text-gray-500">Based on revenue and growth</p>
          </div>
          <Package className="w-6 h-6 text-gray-400" />
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">Loading product data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Top Performing Products</h3>
          <p className="text-sm text-gray-500">Based on revenue and growth</p>
        </div>
        <Package className="w-6 h-6 text-gray-400" />
      </div>

      <div className="space-y-4">
        {analytics.productPerformance.map((product, index) => (
          <div key={product.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-medium">
                {index + 1}
              </div>
              <div>
                <p className="font-medium text-gray-900">{product.name}</p>
                <p className="text-sm text-gray-500">
                  {product.units} units sold • ${product.revenue.toLocaleString()} revenue
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {product.growth > 0 ? (
                <TrendingUp className="w-4 h-4 text-success-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-error-600" />
              )}
              <span className={`text-sm font-medium ${
                product.growth > 0 ? 'text-success-600' : 'text-error-600'
              }`}>
                {Math.abs(product.growth).toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};