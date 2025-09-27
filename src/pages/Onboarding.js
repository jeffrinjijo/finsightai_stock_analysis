import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../context/AuthContext';
import TrustScoreDashboard from '../components/TrustScoreDashboard';


import { 
  FiUser, FiCamera, FiMail, FiTrendingUp, FiShield, FiTarget,
  FiDollarSign, FiBriefcase, FiCalendar, FiHome, FiGlobe, FiBarChart2, FiCheck,
  FiClock, FiPieChart, FiActivity, FiLayers, FiAward
} from "react-icons/fi";

// Risk Assessment Questions
const riskAssessmentQuestions = [
  {
    id: 1,
    question: "What is your investment experience?",
    options: [
      { text: "None - I'm new to investing", value: 1 },
      { text: "Some - I've made a few investments", value: 2 },
      { text: "Experienced - I invest regularly", value: 3 },
      { text: "Very experienced - I'm comfortable with complex investments", value: 4 }
    ]
  },
  {
    id: 2,
    question: "How would you react to a sudden 20% drop in your investment value?",
    options: [
      { text: "Sell all investments immediately", value: 1 },
      { text: "Sell some investments to reduce risk", value: 2 },
      { text: "Hold and wait for recovery", value: 3 },
      { text: "Buy more while prices are low", value: 4 }
    ]
  },
  {
    id: 3,
    question: "What is your investment time horizon?",
    options: [
      { text: "Less than 1 year", value: 1 },
      { text: "1-3 years", value: 2 },
      { text: "3-5 years", value: 3 },
      { text: "More than 5 years", value: 4 }
    ]
  },
  {
    id: 4,
    question: "What percentage of your income do you plan to invest?",
    options: [
      { text: "Less than 5%", value: 1 },
      { text: "5-10%", value: 2 },
      { text: "10-20%", value: 3 },
      { text: "More than 20%", value: 4 }
    ]
  },
  {
    id: 5,
    question: "How would you describe your investment knowledge?",
    options: [
      { text: "Limited - I'm just starting to learn", value: 1 },
      { text: "Basic - I understand the fundamentals", value: 2 },
      { text: "Good - I'm comfortable with most investment concepts", value: 3 },
      { text: "Advanced - I understand complex investment strategies", value: 4 }
    ]
  }
];

// User Categories based on risk assessment score (4-20)
const userCategories = [
  {
    level: "Conservative",
    scoreRange: [4, 8],
    description: "Prefers safety over high returns, comfortable with minimal risk",
    color: "bg-blue-100 text-blue-800",
    icon: <FiShield className="text-blue-500" />,
    allocation: {
      stocks: '20%',
      bonds: '50%',
      cash: '30%'
    }
  },
  {
    level: "Moderate",
    scoreRange: [9, 14],
    description: "Balanced approach with moderate risk tolerance",
    color: "bg-yellow-100 text-yellow-800",
    icon: <FiPieChart className="text-yellow-500" />,
    allocation: {
      stocks: '50%',
      bonds: '40%',
      cash: '10%'
    }
  },
  {
    level: "Aggressive",
    scoreRange: [15, 20],
    description: "Seeks high returns, comfortable with significant risk",
    color: "bg-green-100 text-green-800",
    icon: <FiTrendingUp className="text-green-500" />,
    allocation: {
      stocks: '80%',
      bonds: '15%',
      cash: '5%'
    }
  }
];

const goalsOptions = [
  { label: "Wealth Growth", icon: <FiTrendingUp className="mr-2" />, value: "wealth_growth" },
  { label: "Retirement", icon: <FiBriefcase className="mr-2" />, value: "retirement" },
  { label: "Education", icon: <FiCalendar className="mr-2" />, value: "education" },
  { label: "Home Purchase", icon: <FiHome className="mr-2" />, value: "home_purchase" },
  { label: "Travel", icon: <FiGlobe className="mr-2" />, value: "travel" },
  { label: "Emergency Fund", icon: <FiShield className="mr-2" />, value: "emergency_fund" },
  { label: "Passive Income", icon: <FiDollarSign className="mr-2" />, value: "passive_income" },
  { label: "Other", icon: <FiLayers className="mr-2" />, value: "other" }
];

const investmentHorizons = [
  { label: "Short-term (<1 year)", value: "short" },
  { label: "Medium-term (1-5 years)", value: "medium" },
  { label: "Long-term (5+ years)", value: "long" },
];

function Onboarding() {
  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    avatar: null,
    riskAssessmentCompleted: false,
    isVerified: false,
    bankLinked: false,
    investmentActivity: false,
    lastActiveDays: 0,
    referralCount: 0
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const { currentUser, completeOnboarding } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Form data state
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    experience: '',
    riskProfile: '',
    investmentGoals: [],
    investmentHorizon: '',
    riskAssessment: {},
    riskScore: 0,
    userCategory: null,
    termsAccepted: false
  });

  // Load user profile on mount
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        name: currentUser.name || prev.name,
        email: currentUser.email || prev.email
      }));
    }
  }, [currentUser]);

  const fileInputRef = useRef(null);
  
  // Calculate risk score and user category
  useEffect(() => {
    if (Object.keys(answers).length === riskAssessmentQuestions.length) {
      const score = Object.values(answers).reduce((sum, value) => sum + value, 0);
      const category = userCategories.find(
        cat => score >= cat.scoreRange[0] && score <= cat.scoreRange[1]
      ) || userCategories[1]; // Default to moderate
      
      setFormData(prev => ({
        ...prev,
        riskScore: score,
        userCategory: category,
        riskProfile: category.level,
        riskAssessment: answers
      }));
    }
  }, [answers]);
  
  // Handlers
  const handleAnswer = (questionId, value) => {
    const newAnswers = {
      ...answers,
      [questionId]: value
    };
    
    setAnswers(newAnswers);
    
    // Move to next question or finish assessment
    if (currentQuestion < riskAssessmentQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setCurrentStep(3); // Move to results step
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    setFormData(prev => {
      // Special handling for checkboxes (investment goals)
      if (type === 'checkbox') {
        const currentGoals = Array.isArray(prev.investmentGoals) ? [...prev.investmentGoals] : [];
        const updatedGoals = checked
          ? [...currentGoals, value]
          : currentGoals.filter(goal => goal !== value);
          
        return {
          ...prev,
          investmentGoals: updatedGoals
        };
      }
      
      // For file inputs
      if (type === 'file') {
        const file = files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreviewUrl(reader.result);
          };
          reader.readAsDataURL(file);
          return {
            ...prev,
            [name]: file
          };
        }
      }
      
      // For all other input types
      return {
        ...prev,
        [name]: value
      };
    });
    
    // Clear any errors for this field when it changes
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const triggerFileSelect = () => fileInputRef.current?.click();
  
  const startRiskAssessment = () => {
    setCurrentStep(2);
    setCurrentQuestion(0);
    setAnswers(formData.riskAssessment || {});
  };
  
  // Initialize form data from user data
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        name: currentUser.name || "",
        email: currentUser.email || "",
      }));
    }
  }, [currentUser]);
  
  const [errors, setErrors] = useState({});

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    const dataToSave = {
      name: formData.name,
      email: formData.email,
      experience: formData.experience,
      investmentHorizon: formData.investmentHorizon,
      goals: formData.investmentGoals,
      risk: formData.riskProfile,
      riskAssessment: formData.riskAssessment,
      riskScore: formData.riskScore,
      userCategory: formData.userCategory
    };
    localStorage.setItem("onboardingFormData", JSON.stringify(dataToSave));
  }, [formData]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFormData(prev => ({
          ...prev,
          avatar: ev.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGoalToggle = (goal) => {
    setFormData(prev => {
      const currentGoals = Array.isArray(prev.investmentGoals) ? [...prev.investmentGoals] : [];
      const newGoals = currentGoals.includes(goal)
        ? currentGoals.filter(g => g !== goal)
        : [...currentGoals, goal];

      // Clear investmentGoals error if any goals are selected
      if (newGoals.length > 0 && errors.investmentGoals) {
        setErrors(prev => ({
          ...prev,
          investmentGoals: null
        }));
      }

      return {
        ...prev,
        investmentGoals: newGoals
      };
    });
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
      if (!formData.experience) newErrors.experience = 'Please select your experience level';
    }
    
    if (step === 2) {
      if (!formData.risk) newErrors.risk = 'Please select your risk tolerance';
      if (!formData.investmentHorizon) newErrors.investmentHorizon = 'Please select your investment horizon';
      if (!formData.annualIncome) newErrors.annualIncome = 'Please enter your annual income';
      if (!formData.investmentAmount) newErrors.investmentAmount = 'Please enter your initial investment amount';
      
      // Additional validation for numbers
      if (formData.annualIncome && isNaN(Number(formData.annualIncome))) {
        newErrors.annualIncome = 'Please enter a valid number';
      }
      if (formData.investmentAmount && isNaN(Number(formData.investmentAmount))) {
        newErrors.investmentAmount = 'Please enter a valid number';
      }
    }
    
    if (step === 3) {
      if (!formData.investmentGoals || formData.investmentGoals.length === 0) newErrors.investmentGoals = 'Please select at least one goal';
      if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    // Validate current step before proceeding
    if (!validateStep(currentStep)) {
      toast.error('Please complete all required fields');
      return;
    }

    if (currentStep === 2) {
      // If in risk assessment and there are more questions
      if (currentQuestion < riskAssessmentQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      
      // If all questions are answered, calculate risk profile
      const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);
      const riskLevel = calculateRiskLevel(totalScore);
      setFormData(prev => ({
        ...prev,
        risk: riskLevel,
        riskAssessmentCompleted: true
      }));
    }
    
    // Move to next step if not the last step
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isStepValid = (step) => {
    if (step === 1) {
      return formData.name?.trim() && formData.email && formData.experience;
    }
    if (step === 2) {
      return Object.keys(answers).length === riskAssessmentQuestions.length;
    }
    return true;
  };

  const calculateRiskLevel = (score) => {
    // Calculate risk level based on total score
    // Max score is 4 points per question * number of questions
    const maxScore = riskAssessmentQuestions.length * 4;
    const percentage = (score / maxScore) * 100;
    
    if (percentage < 30) return 'conservative';
    if (percentage < 70) return 'moderate';
    return 'aggressive';
  };

  const prevStep = () => {
    if (currentStep === 2 && currentQuestion > 0) {
      // If in risk assessment and not on first question, go to previous question
      setCurrentQuestion(prev => prev - 1);
    } else if (currentStep > 1) {
      // Otherwise go to previous step
      setCurrentStep(prev => prev - 1);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (currentStep < 3) {  // Changed from 5 to 3 since we have 3 steps
      setCurrentStep(currentStep + 1);
      return;
    }
    
    // Handle final submission
    setIsSubmitting(true);
    
    try {
      // Complete onboarding
      const success = await completeOnboarding({
        ...formData,
        onboarded: true,
        onboardedAt: new Date().toISOString()
      });
      
      if (success) {
        // Redirect to home page after successful onboarding
        const redirectTo = location.state?.from?.pathname || '/';
        navigate(redirectTo, { replace: true });
      } else {
        throw new Error('Failed to complete onboarding');
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
      // Show error message to user
      setError('Failed to complete onboarding. Please try again.');
      toast.error('Failed to complete onboarding. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderProfileStep();
      case 2:
        return renderRiskAssessment();
      case 3:
      default:
        return null;
    }
  };

  // Render profile step
  const renderProfileStep = () => (
    <div className="bg-white p-8 rounded-lg shadow-md w-full justify-center items-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Complete Your Profile
      </h2>
      
      <div className="space-y-6">
        {/* Profile Picture Upload */}
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {previewUrl ? (
                <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <FiUser className="w-10 h-10 text-gray-400" />
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-1.5 hover:bg-blue-700 transition-colors"
            >
              <FiCamera className="w-4 h-4" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleInputChange}
              className="hidden"
              accept="image/*"
            />
          </div>
          <div>
            <h3 className="text-lg font-medium">Profile Photo</h3>
            <p className="text-sm text-gray-500">Click to upload a photo (max 2MB)</p>
          </div>
        </div>

        {/* Profile Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={!!currentUser?.email} // Disable if logged in with email
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
              Investment Experience <span className="text-red-500">*</span>
            </label>
            <select
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select your experience level</option>
              <option value="beginner">Beginner (0-2 years)</option>
              <option value="intermediate">Intermediate (2-5 years)</option>
              <option value="advanced">Advanced (5+ years)</option>
              <option value="expert">Expert</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  // Render risk assessment step
  const renderRiskAssessment = () => {
    const currentQ = riskAssessmentQuestions[currentQuestion];
    
    return (
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Risk Assessment</h2>
          <p className="text-gray-600">
            Question {currentQuestion + 1} of {riskAssessmentQuestions.length}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${((currentQuestion + 1) / riskAssessmentQuestions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">{currentQ.question}</h3>
          
          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleAnswer(currentQ.id, option.value)}
                className={`w-full text-left p-4 rounded-lg border ${
                  answers[currentQ.id] === option.value 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300'
                } transition-colors`}
              >
                <div className="flex items-center">
                  <div className="flex items-center h-5">
                    <div className={`h-4 w-4 rounded-full border-2 ${
                      answers[currentQ.id] === option.value 
                        ? 'border-blue-600 bg-blue-600' 
                        : 'border-gray-300'
                    } flex items-center justify-center`}>
                      {answers[currentQ.id] === option.value && (
                        <div className="h-2 w-2 rounded-full bg-white"></div>
                      )}
                    </div>
                  </div>
                  <span className="ml-3 text-gray-700">{option.text}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Update user data when form data changes
  useEffect(() => {
    setUserData(prev => ({
      ...prev,
      name: formData.name,
      email: formData.email,
      avatar: formData.avatar,
      riskAssessmentCompleted: currentStep >= 2,
      lastActiveDays: 0 // Update this based on actual user activity
    }));
  }, [formData, currentStep]);

  // Render results step
  const renderResults = () => {
    const { userCategory } = formData;
    
    // Default allocation if not provided
    const defaultAllocation = [
      { asset: 'Stocks', percentage: 60 },
      { asset: 'Bonds', percentage: 30 },
      { asset: 'Cash', percentage: 10 }
    ];
    
    // Get allocation from userCategory or use default
    const allocation = userCategory?.allocation || defaultAllocation;
    
    return (
      <div className="space-y-8">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Investor Profile</h2>
            <p className="text-gray-600">
              Based on your answers, we've determined your investment style is:
            </p>
          </div>

          <div className={`${userCategory?.color || 'bg-blue-100'} p-6 rounded-lg mb-8`}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="p-3 rounded-full bg-white bg-opacity-25">
                  {userCategory?.icon || <FiTrendingUp className="w-6 h-6 text-blue-500" />}
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-bold">{userCategory?.level || 'Moderate'} Investor</h3>
                <p className="mt-1">{userCategory?.description || 'Balanced approach with moderate risk tolerance'}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Your Investment Strategy</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Recommended Asset Allocation</h4>
                <div className="space-y-2">
                  {Array.isArray(allocation)
                    ? allocation.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{item.asset}</span>
                          <span className="text-sm font-medium">{item.percentage}%</span>
                        </div>
                      ))
                    : Object.entries(allocation).map(([asset, percentage], index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{asset.charAt(0).toUpperCase() + asset.slice(1)}</span>
                          <span className="text-sm font-medium">{percentage}</span>
                        </div>
                      ))
                  }
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Risk Level</h4>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${userCategory?.color?.replace('bg-', 'bg-') || 'bg-blue-500'}`}
                    style={{ width: `${(userCategory?.riskLevel || 5) * 10}%` }}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  {userCategory?.riskDescription || 'Moderate risk with balanced returns'}
                </p>
              </div>
            </div>
            <div className="mt-8">
              <h4 className="font-medium text-gray-900 mb-4">Next Steps</h4>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center">
                      <FiCheck className="h-3 w-3 text-blue-600" />
                    </div>
                  </div>
                  <p className="ml-3 text-sm text-gray-600">
                    Review your recommended portfolio allocation
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center">
                      <FiCheck className="h-3 w-3 text-blue-600" />
                    </div>
                  </div>
                  <p className="ml-3 text-sm text-gray-600">
                    Complete your account setup to start investing
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center">
                      <FiCheck className="h-3 w-3 text-blue-600" />
                    </div>
                  </div>
                  <p className="ml-3 text-sm text-gray-600">
                    Set up automatic deposits to grow your portfolio
                  </p>
                </div>
              </div>
            </div>
          </div>
          <TrustScoreDashboard userData={userData} />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-white px-4 py-12">
      <div className="w-full max-w-4xl">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-md mx-auto">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                    currentStep >= step ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  {step}
                </div>
                <span className="text-sm mt-2 text-gray-600">
                  {step === 1 ? 'Profile' : step === 2 ? 'Risk Assessment' : 'Complete'}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 h-1.5 bg-gray-200 rounded-full max-w-md mx-auto">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
            />
          </div>
        </div>
        
        <form id="onboarding-form" onSubmit={handleSubmit} className="w-full">
          <div className="flex flex-col items-center gap-2 mb-6">
            <h1 className="text-2xl font-bold text-gray-800 text-center">
              {currentStep === 1 ? 'Welcome to Finsight AI!' : 
               currentStep === 2 ? 'Investment Preferences' : 'Almost There!'}
            </h1>
            <p className="text-gray-500 text-sm text-center max-w-md">
              {currentStep === 1 ? 'Tell us about yourself to get started with personalized investment insights' : 
               currentStep === 2 ? 'Help us understand your investment style and preferences' : 
               'Set your financial goals to help us create a customized plan for you'}
            </p>
          </div>
          
          {renderStep()}
          
          <div className="flex justify-between mt-8 max-w-md mx-auto">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Previous
              </button>
            )}
            <div className="ml-auto">
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!isStepValid(currentStep)}
                >
                  {currentStep === 2 ? 'See Results' : 'Next'}
                </button>
              ) : (
                <button
                  type="submit"
                  form="onboarding-form"
                  className="px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Complete Profile'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Onboarding;
