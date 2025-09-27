import React from 'react';
import { ResponsiveContainer, Treemap, Tooltip } from 'recharts';

const MarketHeatmap = ({ data }) => {
  // This is a simplified example - in a real app, you'd fetch real market data
  const sampleData = [
    { name: 'Technology', size: 35, fill: '#4F46E5' },
    { name: 'Healthcare', size: 25, fill: '#10B981' },
    { name: 'Finance', size: 20, fill: '#F59E0B' },
    { name: 'Consumer', size: 15, fill: '#EF4444' },
    { name: 'Energy', size: 10, fill: '#8B5CF6' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 h-80">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Market Heatmap</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={sampleData}
            dataKey="size"
            aspectRatio={4/3}
            stroke="#fff"
            fill="#8884d8"
          >
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-2 border border-gray-200 rounded shadow">
                      <p className="font-medium">{payload[0].payload.name}</p>
                      <p>{payload[0].value}% of market</p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </Treemap>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MarketHeatmap;
