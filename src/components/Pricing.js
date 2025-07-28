import React, { useEffect } from 'react';
import { FiCheck } from 'react-icons/fi';

// Debug function
const log = (message) => {
  console.log(`[Pricing] ${message}`);
};

const PricingCard = ({ title, price, period, features, popular = false, buttonText = 'Get Started' }) => (
  <div className={`relative flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-xl ${popular ? 'ring-2 ring-blue-500 transform scale-105' : ''}`}>
    {popular && (
      <div className="absolute top-0 right-0 -mt-3 -mr-3">
        <span className="px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-full">
          Most Popular
        </span>
      </div>
    )}
    
    <div className="flex-1">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
      <div className="mt-4 flex items-baseline">
        <span className="text-4xl font-extrabold text-gray-900 dark:text-white">${price}</span>
        <span className="ml-1 text-lg font-medium text-gray-500 dark:text-gray-400">/{period}</span>
      </div>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Perfect for {title.toLowerCase()} users</p>
      
      <ul className="mt-6 space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <FiCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="ml-3 text-gray-700 dark:text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
    
    <div className="mt-8">
      <button 
        className={`w-full px-6 py-3 text-base font-medium rounded-lg transition-colors duration-200 ${
          popular 
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700' 
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
        }`}
      >
        {buttonText}
      </button>
    </div>
  </div>
);

const Pricing = () => {
  useEffect(() => {
    log('Component mounted');
    return () => log('Component unmounted');
  }, []);
  
  log('Rendering Pricing component');
  const plans = [
    {
      title: 'Free',
      price: '0',
      period: 'forever',
      buttonText: 'Get Started',
      features: [
        'Real-time stock data',
        'Basic stock analytics',
        '3 stock portfolio tracking',
        'Community discussions',
        'Email support',
      ],
    },
    {
      title: 'Pro',
      price: '9.99',
      period: 'week',
      popular: true,
      buttonText: 'Start Free Trial',
      features: [
        'Everything in Free',
        'Unlimited portfolio tracking',
        'Advanced analytics & charts',
        'AI-powered insights',
        'Priority support',
        'Exclusive webinars',
      ],
    },
    {
      title: 'Enterprise',
      price: '49.99',
      period: 'month',
      buttonText: 'Contact Sales',
      features: [
        'Everything in Pro',
        'Custom analytics dashboard',
        'Dedicated account manager',
        'API access',
        'Team collaboration tools',
        'Custom integration support',
      ],
    },
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
            Choose the perfect plan for your investment journey
          </p>
        </div>

        <div className="mt-12 space-y-8 md:space-y-0 md:grid md:grid-cols-3 md:gap-8 lg:gap-12">
          {plans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </div>

        <div className="mt-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
          <div className="md:flex md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Need something custom?</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Contact our sales team to discuss a custom plan that fits your specific needs.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <button className="w-full md:w-auto px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
