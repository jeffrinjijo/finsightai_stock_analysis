import { useState, useEffect } from 'react';

const MAX_SCORE = 1000;
const SCORE_WEIGHTS = {
  PROFILE_COMPLETION: 300,   // Email, name, profile picture
  RISK_ASSESSMENT: 200,      // Completed risk assessment
  ID_VERIFICATION: 200,      // ID verification
  BANK_LINKED: 150,          // Bank account linked
  INVESTMENT_ACTIVITY: 100,  // First investment made
  CONSISTENT_ACTIVITY: 50,   // Regular logins/activity
  REFERRALS: 100,            // Referred other users
};

export const useTrustScore = (userData) => {
  const [score, setScore] = useState(0);
  const [breakdown, setBreakdown] = useState({});

  useEffect(() => {
    if (!userData) return;

    let calculatedScore = 0;
    const calculatedBreakdown = {};

    // Profile completion
    const profileCompletion = calculateProfileCompletion(userData);
    calculatedScore += profileCompletion;
    calculatedBreakdown.profile = profileCompletion;

    // Risk assessment
    if (userData.riskAssessmentCompleted) {
      calculatedScore += SCORE_WEIGHTS.RISK_ASSESSMENT;
      calculatedBreakdown.riskAssessment = SCORE_WEIGHTS.RISK_ASSESSMENT;
    }

    // Verification status
    if (userData.isVerified) {
      calculatedScore += SCORE_WEIGHTS.ID_VERIFICATION;
      calculatedBreakdown.verification = SCORE_WEIGHTS.ID_VERIFICATION;
    }

    // Bank linking
    if (userData.bankLinked) {
      calculatedScore += SCORE_WEIGHTS.BANK_LINKED;
      calculatedBreakdown.bankLinked = SCORE_WEIGHTS.BANK_LINKED;
    }

    // Investment activity
    if (userData.investmentActivity) {
      calculatedScore += SCORE_WEIGHTS.INVESTMENT_ACTIVITY;
      calculatedBreakdown.investmentActivity = SCORE_WEIGHTS.INVESTMENT_ACTIVITY;
    }

    // Consistent activity (simplified)
    if (userData.lastActiveDays && userData.lastActiveDays < 7) {
      calculatedScore += SCORE_WEIGHTS.CONSISTENT_ACTIVITY;
      calculatedBreakdown.consistentActivity = SCORE_WEIGHTS.CONSISTENT_ACTIVITY;
    }

    // Referrals
    if (userData.referralCount > 0) {
      const referralPoints = Math.min(
        userData.referralCount * 10, 
        SCORE_WEIGHTS.REFERRALS
      );
      calculatedScore += referralPoints;
      calculatedBreakdown.referrals = referralPoints;
    }

    setScore(Math.min(calculatedScore, MAX_SCORE));
    setBreakdown(calculatedBreakdown);
  }, [userData]);

  const calculateProfileCompletion = (userData) => {
    let completion = 0;
    if (userData.email) completion += 100;
    if (userData.name) completion += 100;
    if (userData.avatar) completion += 100;
    return completion;
  };

  const getScoreProgress = () => (score / MAX_SCORE) * 100;
  const getNextMilestone = () => {
    if (score < 300) return { target: 300, description: 'Complete your profile' };
    if (score < 500) return { target: 500, description: 'Complete risk assessment' };
    if (score < 700) return { target: 700, description: 'Verify your identity' };
    if (score < 850) return { target: 850, description: 'Link your bank account' };
    return { target: MAX_SCORE, description: 'You\'ve reached the maximum trust score!' };
  };

  return {
    score,
    maxScore: MAX_SCORE,
    breakdown,
    getScoreProgress,
    getNextMilestone,
  };
};

export default useTrustScore;
