import { useState, useEffect, useRef, useCallback } from 'react';
import { FiSend, FiX, FiMessageSquare, FiTrendingUp, FiLoader } from 'react-icons/fi';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Sample stock data with yesterday's and previous day's prices
  const trendingStocks = [
    { 
      symbol: 'TSLA', 
      name: 'Tesla', 
      currentPrice: 275.45,
      yesterdayPrice: 260.35,
      previousDayPrice: 245.80,
      volume: '25.4M',
      get change() {
        return ((this.yesterdayPrice - this.previousDayPrice) / this.previousDayPrice * 100).toFixed(2);
      }
    },
    { 
      symbol: 'NVDA', 
      name: 'NVIDIA', 
      currentPrice: 452.75,
      yesterdayPrice: 435.20,
      previousDayPrice: 402.10,
      volume: '45.1M',
      get change() {
        return ((this.yesterdayPrice - this.previousDayPrice) / this.previousDayPrice * 100).toFixed(2);
      }
    },
    { 
      symbol: 'META', 
      name: 'Meta', 
      currentPrice: 312.90,
      yesterdayPrice: 299.50,
      previousDayPrice: 287.30,
      volume: '32.7M',
      get change() {
        return ((this.yesterdayPrice - this.previousDayPrice) / this.previousDayPrice * 100).toFixed(2);
      }
    },
  ];

  // Initial bot message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = {
        id: 1,
        text: "Hi there! I'm your AI investment assistant. I can help you with investment advice, stock analysis, and market insights. How can I assist you today?",
        sender: 'bot',
        timestamp: new Date().toISOString(),
        type: 'text',
        buttons: ['Show me top movers', 'Investment advice', 'Market trends']
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  // Send message to AI
  const sendToAI = useCallback(async (messageText) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          context: messages
            .filter(msg => msg.sender === 'user' || msg.sender === 'bot')
            .map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.text
            }))
            .slice(-5) // Send last 5 messages for context
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }
      
      const data = await response.json();
      
      return data.response;
    } catch (error) {
      console.error('Error calling AI:', error);
      return "I'm sorry, I encountered an error processing your request. Please try again later.";
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (text) => {
    if (!text.trim() || isLoading) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date().toISOString(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Check if this is a button click that matches a specific command
    if (text === 'Show me top movers') {
      // Use the existing stock display logic
      setTimeout(() => generateBotResponse(text), 300);
      return;
    }

    // For other messages, use AI
    try {
      const aiResponse = await sendToAI(text);
      
      const botMessage = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: 'bot',
        timestamp: new Date().toISOString(),
        type: 'text'
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm having trouble connecting to the AI service. Please try again later.",
        sender: 'bot',
        timestamp: new Date().toISOString(),
        type: 'error'
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  // Calculate potential profit for a given investment amount
  const calculatePotentialProfit = (stock, amount) => {
    const investment = parseFloat(amount) || 0;
    if (investment <= 0) return 0;
    
    const shares = investment / stock.yesterdayPrice;
    const currentValue = shares * stock.currentPrice;
    return (currentValue - investment).toFixed(2);
  };

  const generateBotResponse = (userInput) => {
    userInput = userInput.toLowerCase();
    let botResponse;

    // Keep the stock display functionality for the 'top movers' button
    if (userInput.includes('show me top movers')) {
      // Show yesterday's top movers
      botResponse = {
        id: messages.length + 2,
        text: "Here are yesterday's top performing stocks. These stocks showed significant movement and could present good opportunities. Tap on any stock to see how much you could have made with a hypothetical investment.",
        sender: 'bot',
        timestamp: new Date().toISOString(),
        type: 'stocks',
        stocks: [...trendingStocks].sort((a, b) => b.change - a.change).slice(0, 3)
      };
    } else if (userInput.includes('invest') || userInput.includes('buy') || userInput.includes('stock') || userInput.match(/\$\d+/)) {
      // Check if user mentioned an investment amount like $1000
      const amountMatch = userInput.match(/\$?(\d+(\.\d{1,2})?)/);
      const investmentAmount = amountMatch ? parseFloat(amountMatch[1]) : 1000; // Default to $1000 if no amount specified
      
      // Find the stock mentioned in the message, or pick a random one
      let stock = trendingStocks.find(s => 
        userInput.toLowerCase().includes(s.symbol.toLowerCase()) || 
        userInput.toLowerCase().includes(s.name.toLowerCase())
      ) || trendingStocks[Math.floor(Math.random() * trendingStocks.length)];
      
      const potentialProfit = calculatePotentialProfit(stock, investmentAmount);
      const profitPercent = ((potentialProfit / investmentAmount) * 100).toFixed(2);
      
      // Format the investment amount as currency
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      });
      
      botResponse = {
        id: messages.length + 2,
        text: `💡 Investment Insight for ${stock.name} (${stock.symbol}):\n\n` +
              `• Yesterday's Price: $${stock.yesterdayPrice.toFixed(2)}\n` +
              `• Previous Close: $${stock.previousDayPrice.toFixed(2)}\n` +
              `• Price Change: ${stock.change}%\n\n` +
              `If you had invested ${formatter.format(investmentAmount)} yesterday, you could have made:\n` +
              `💰 Potential Profit: $${Math.abs(potentialProfit)} (${profitPercent}%)`,
        sender: 'bot',
        timestamp: new Date().toISOString(),
        type: 'text',
        buttons: [
          `What about $${(investmentAmount * 2).toLocaleString()}?`,
          'Show me other stocks',
          'How can I start investing?'
        ]
      };
    } else if (userInput.includes('help') || userInput.includes('hi') || userInput.includes('hello')) {
      // Help response
      botResponse = {
        id: messages.length + 2,
        text: "I can help you with: \n• Finding trending stocks\n• Investment suggestions\n• Market insights\n• Portfolio advice\n\nWhat would you like to know?",
        sender: 'bot',
        timestamp: new Date().toISOString(),
        type: 'text'
      };
    } else {
      // Default response
      botResponse = {
        id: messages.length + 2,
        text: "I'm here to help you make informed investment decisions. You can ask me about trending stocks, investment opportunities, or market insights. What would you like to know?",
        sender: 'bot',
        timestamp: new Date().toISOString(),
        type: 'text'
      };
    }

    setMessages(prev => [...prev, botResponse]);
  };

  const handleButtonClick = (buttonText) => {
    handleSendMessage(buttonText);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Format message time
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Format stock change with color and arrow
  const formatChange = (change) => {
    const isPositive = parseFloat(change) >= 0;
    return (
      <span className={`font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? '↑' : '↓'} {Math.abs(parseFloat(change)).toFixed(2)}%
      </span>
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-80 h-[500px] bg-white rounded-t-xl shadow-xl flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-xl flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-2">
                <FiTrendingUp className="text-white" />
              </div>
              <h3 className="font-semibold">Investment Assistant</h3>
            </div>
            <button 
              onClick={toggleChat}
              className="p-1 hover:bg-white/20 rounded-full"
              aria-label="Close chat"
            >
              <FiX className="text-white" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 mt-20">
                <FiMessageSquare className="mx-auto h-10 w-10 mb-2" />
                <p>How can I help with your investments today?</p>
              </div>
            ) : (
              messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender === 'user' 
                        ? 'bg-blue-600 text-white rounded-br-none' 
                        : 'bg-white shadow-md rounded-bl-none'
                    }`}
                  >
                    {message.type === 'stocks' ? (
                      <div>
                        <p className="mb-2">{message.text}</p>
                        <div className="space-y-2">
                          {message.stocks.map((stock, index) => (
                            <div 
                              key={index} 
                              className="p-2 border rounded-lg hover:bg-gray-50 cursor-pointer"
                              onClick={() => handleSendMessage(`Tell me more about ${stock.symbol}`)}
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-semibold">{stock.symbol}</p>
                                  <p className="text-xs text-gray-500">{stock.name}</p>
                                  <p className="text-xs mt-1">
                                    <span className="text-gray-500">Yesterday: </span>
                                    ${stock.yesterdayPrice.toFixed(2)}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold">{formatChange(stock.change)}</p>
                                  <p className="text-xs text-gray-500">
                                    {stock.volume} vol
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="whitespace-pre-line">{message.text}</p>
                    )}
                    <p className="text-xs opacity-70 mt-1 text-right">
                      {formatTime(message.timestamp)}
                    </p>
                    {message.buttons && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {message.buttons.map((button, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleButtonClick(button)}
                            className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded"
                          >
                            {button}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200 bg-white">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(input);
              }}
              className="flex"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(input)}
                placeholder="Ask about investments..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                disabled={isLoading}
              />
              <button
                onClick={() => handleSendMessage(input)}
                disabled={isLoading}
                className={`px-4 rounded-r-lg flex items-center justify-center ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {isLoading ? (
                  <FiLoader className="animate-spin" />
                ) : (
                  <FiSend />
                )}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <button
          onClick={toggleChat}
          className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center"
          aria-label="Open chat"
        >
          <FiMessageSquare size={24} />
        </button>
      )}
    </div>
  );
};

export default Chatbot;
