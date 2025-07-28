import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiCheckCircle, 
  FiAlertCircle, 
  FiArrowUp, 
  FiAward,
  FiShield,
  FiTrendingUp,
  FiCreditCard,
  FiClock,
  FiUsers
} from 'react-icons/fi';
import TrustScore from './TrustScore';
import { useTrustScore } from '../hooks/useTrustScore';

const TrustScoreDashboard = ({ userData }) => {
  const { 
    score, 
    maxScore, 
    breakdown, 
    getScoreProgress, 
    getNextMilestone 
  } = useTrustScore(userData);

  const progress = getScoreProgress();
  const nextMilestone = getNextMilestone();
  const progressToNextMilestone = Math.round(((score / nextMilestone.target) * 100) || 0);

  const getScoreItem = (icon, title, points, maxPoints, completed = true) => ({
    icon,
    title,
    points: completed ? points : 0,
    maxPoints,
    completed,
    progress: completed ? Math.min(100, (points / maxPoints) * 100) : 0
  });

  const scoreItems = [
    getScoreItem(
      <FiAward className="text-blue-500" />,
      'Profile Completion',
      breakdown.profile || 0,
      300,
      breakdown.profile > 0
    ),
    getScoreItem(
      <FiShield className="text-purple-500" />,
      'Risk Assessment',
      breakdown.riskAssessment || 0,
      200,
      !!breakdown.riskAssessment
    ),
    getScoreItem(
      <FiCheckCircle className="text-green-500" />,
      'ID Verification',
      breakdown.verification || 0,
      200,
      !!breakdown.verification
    ),
    getScoreItem(
      <FiCreditCard className="text-yellow-500" />,
      'Bank Linked',
      breakdown.bankLinked || 0,
      150,
      !!breakdown.bankLinked
    ),
    getScoreItem(
      <FiTrendingUp className="text-indigo-500" />,
      'Investment Activity',
      breakdown.investmentActivity || 0,
      100,
      !!breakdown.investmentActivity
    ),
    getScoreItem(
      <FiClock className="text-pink-500" />,
      'Consistent Activity',
      breakdown.consistentActivity || 0,
      50,
      !!breakdown.consistentActivity
    )
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col items-center text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Trust Score</h2>
          <p className="text-gray-600 max-w-md">
            Your trust score helps us personalize your experience and unlock additional features.
          </p>
        </div>
        
        <TrustScore score={score} maxScore={maxScore} />
        
        <div className="mt-8">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Next Milestone: {nextMilestone.description}</span>
            <span>{progressToNextMilestone}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5">
            <motion.div 
              className="bg-blue-600 h-2.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressToNextMilestone}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Breakdown</h3>
        <div className="space-y-4">
          {scoreItems.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${item.completed ? 'bg-blue-50' : 'bg-gray-50'}`}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-500">
                      {item.completed ? 'Completed' : 'Incomplete'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{item.points}/{item.maxPoints}</p>
                  <p className="text-xs text-gray-500">
                    {Math.round((item.points / item.maxPoints) * 100)}%
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div 
                  className="h-1.5 rounded-full bg-blue-600"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <FiAlertCircle className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">How to improve your score</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>• Complete your profile information</p>
              <p>• Verify your identity</p>
              <p>• Link your bank account</p>
              <p>• Complete the risk assessment</p>
              <p>• Make your first investment</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustScoreDashboard;
