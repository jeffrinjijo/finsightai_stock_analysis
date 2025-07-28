import React from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiShield, FiTrendingUp } from 'react-icons/fi';

const TrustScore = ({ score = 0, maxScore = 1000 }) => {
  const percentage = Math.min(100, Math.max(0, (score / maxScore) * 100));
  const getTrustLevel = () => {
    if (score >= 800) return { label: 'Excellent', color: 'text-green-500' };
    if (score >= 600) return { label: 'Good', color: 'text-blue-500' };
    if (score >= 400) return { label: 'Fair', color: 'text-yellow-500' };
    return { label: 'Needs Work', color: 'text-red-500' };
  };

  const trustLevel = getTrustLevel();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Your Trust Score</h3>
        <div className={`text-sm font-medium ${trustLevel.color} flex items-center`}>
          <FiShield className="mr-1" />
          {trustLevel.label}
        </div>
      </div>
      
      <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden mb-4">
        <motion.div
          className={`h-full ${trustLevel.color.replace('text', 'bg').replace('-500', '-100')} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
          {score} / {maxScore}
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-3 bg-blue-50 rounded-lg">
          <FiAward className="mx-auto mb-1 text-blue-500" />
          <div className="text-xs text-gray-600">Profile</div>
          <div className="font-semibold text-blue-600">
            {Math.min(300, score)}/300
          </div>
        </div>
        <div className="p-3 bg-purple-50 rounded-lg">
          <FiShield className="mx-auto mb-1 text-purple-500" />
          <div className="text-xs text-gray-600">Verification</div>
          <div className="font-semibold text-purple-600">
            {Math.min(400, Math.max(0, score - 300))}/400
          </div>
        </div>
        <div className="p-3 bg-green-50 rounded-lg">
          <FiTrendingUp className="mx-auto mb-1 text-green-500" />
          <div className="text-xs text-gray-600">Activity</div>
          <div className="font-semibold text-green-600">
            {Math.min(300, Math.max(0, score - 700))}/300
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustScore;
