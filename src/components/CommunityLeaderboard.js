import React from "react";
import { motion } from "framer-motion";
import { FiAward, FiArrowUpRight } from "react-icons/fi";

const LeaderboardItem = ({ rank, name, gain, avatar, isCurrentUser = false, delay = 0 }) => {
  const rankColors = {
    1: "from-yellow-400 to-yellow-500",
    2: "from-gray-300 to-gray-400",
    3: "from-amber-600 to-amber-700"
  };

  const rankIcons = {
    1: "🥇",
    2: "🥈", 
    3: "🥉"
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: delay * 0.1 }}
      className={`flex items-center justify-between p-4 rounded-xl ${
        isCurrentUser ? "bg-indigo-50 border border-indigo-100" : "bg-white"
      }`}
    >
      <div className="flex items-center space-x-4">
        <div className="relative">
          {rank <= 3 ? (
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {rankIcons[rank]}
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-sm font-medium">
              {rank}
            </div>
          )}
          
          {isCurrentUser && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border-2 border-white"></div>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
            {avatar}
          </div>
          <div>
            <p className={`font-medium ${isCurrentUser ? "text-indigo-700" : "text-gray-900"}`}>
              {isCurrentUser ? "You" : name}
            </p>
            <p className="text-xs text-gray-500">Weekly gain</p>
          </div>
        </div>
      </div>
      
      <div className={`flex items-center ${gain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        <span className="font-semibold">{gain >= 0 ? '+' : ''}{gain}%</span>
        {gain >= 0 ? (
          <FiArrowUpRight className="ml-1" />
        ) : (
          <FiArrowUpRight className="ml-1 transform rotate-90" />
        )}
      </div>
    </motion.div>
  );
};

export default function CommunityLeaderboard() {
  const leaderboardData = [
    { id: 1, name: "Alex Johnson", gain: 12.5, avatar: "AJ" },
    { id: 2, name: "Sarah Miller", gain: 9.8, avatar: "SM" },
    { id: 3, name: "James Wilson", gain: 8.3, avatar: "JW" },
    { id: 4, name: "Emma Davis", gain: 7.6, avatar: "ED" },
    { id: 5, name: "You", gain: 5.2, avatar: "ME", isCurrentUser: true },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 w-full"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Community Leaderboard</h3>
        <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center">
          View all <FiArrowUpRight className="ml-1" />
        </button>
      </div>
      
      <div className="space-y-3">
        {leaderboardData.map((user, index) => (
          <LeaderboardItem
            key={user.id}
            rank={index + 1}
            name={user.name}
            gain={user.gain}
            avatar={user.avatar}
            isCurrentUser={user.isCurrentUser}
            delay={index}
          />
        ))}
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Your rank</p>
            <p className="font-medium">#5</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Gain this week</p>
            <p className="font-medium text-green-600">+5.2%</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
