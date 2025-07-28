import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function Goals() {
  const [goal, setGoal] = useState("Laptop");
  const [targetAmount, setTargetAmount] = useState(60000);
  const [months, setMonths] = useState(12);
  const [risk, setRisk] = useState("Low");
  const [monthlyInvestment, setMonthlyInvestment] = useState(null);
  const [expectedReturnRate, setExpectedReturnRate] = useState(0);
  const [goalHistory, setGoalHistory] = useState([]);

  useEffect(() => {
    const savedGoals = JSON.parse(localStorage.getItem("finsightGoalHistory")) || [];
    setGoalHistory(savedGoals);
  }, []);

  const calculateInvestment = () => {
    let rate;
    switch (risk) {
      case "Low":
        rate = 0.07;
        break;
      case "Moderate":
        rate = 0.12;
        break;
      case "High":
        rate = 0.18;
        break;
      default:
        rate = 0.1;
    }

    setExpectedReturnRate(rate * 100);
    const r = rate / 12;
    const n = months;
    const sipFactor = (((1 + r) ** n - 1) / r) * (1 + r);
    const requiredMonthly = targetAmount / sipFactor;

    setMonthlyInvestment(Math.ceil(requiredMonthly));
  };

  const handleSaveGoal = () => {
    if (!goal || targetAmount <= 0 || months <= 0 || !monthlyInvestment) {
      alert("Please complete all fields before saving.");
      return;
    }

    const newGoal = {
      goal,
      targetAmount,
      months,
      risk,
      monthlyInvestment,
      date: new Date().toLocaleDateString(),
      status: "In Progress",
    };

    const updatedHistory = [newGoal, ...goalHistory];
    localStorage.setItem("finsightGoalHistory", JSON.stringify(updatedHistory));
    setGoalHistory(updatedHistory);
  };

  const deleteGoal = (index) => {
    const updated = [...goalHistory];
    updated.splice(index, 1);
    localStorage.setItem("finsightGoalHistory", JSON.stringify(updated));
    setGoalHistory(updated);
  };

  const markAsAchieved = (index) => {
    const updated = [...goalHistory];
    updated[index].status = "Achieved";
    localStorage.setItem("finsightGoalHistory", JSON.stringify(updated));
    setGoalHistory(updated);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-3xl font-bold mb-4 text-center text-blue-800">🎯 Goal-Based Investing</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold">Select Goal:</label>
            <select
              className="w-full p-2 border rounded mt-1"
              value={goal}
              onChange={(e) => {
                const selected = e.target.value;
                setGoal(selected);
                if (selected === "Laptop") setTargetAmount(60000);
                else if (selected === "Europe Trip") setTargetAmount(150000);
                else if (selected === "House") setTargetAmount(500000);
                else setTargetAmount(0);
                setMonthlyInvestment(null);
              }}
            >
              <option value="Laptop">Buy a Laptop (₹60,000)</option>
              <option value="Europe Trip">Europe Trip (₹1,50,000)</option>
              <option value="House">Down Payment for House (₹5,00,000)</option>
              <option value="Custom">Custom Goal</option>
            </select>

            {goal === "Custom" && (
              <input
                type="number"
                className="w-full p-2 mt-3 border rounded"
                placeholder="Enter custom target amount (₹)"
                value={targetAmount}
                onChange={(e) => setTargetAmount(Number(e.target.value))}
              />
            )}

            <label className="block mt-4 font-semibold">Timeframe (in months)</label>
            <input
              type="number"
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />

            <label className="block mt-4 font-semibold">Risk Appetite</label>
            <select
              className="w-full p-2 border rounded"
              value={risk}
              onChange={(e) => setRisk(e.target.value)}
            >
              <option value="Low">Low (7%)</option>
              <option value="Moderate">Moderate (12%)</option>
              <option value="High">High (18%)</option>
            </select>

            <div className="flex gap-2 mt-4">
              <button
                onClick={calculateInvestment}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Simulate
              </button>
              <button
                onClick={handleSaveGoal}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Save Goal
              </button>
            </div>

            {monthlyInvestment !== null && (
              <div className="mt-6 text-center bg-blue-50 p-4 rounded">
                <p className="text-gray-800 text-lg">💰 Monthly Investment:</p>
                <p className="text-3xl font-bold text-green-600">₹{monthlyInvestment}</p>
                <p className="text-sm text-gray-600">
                  For {months} months at {expectedReturnRate}% annual return
                </p>
              </div>
            )}
          </div>

          {/* Graph */}
          {goalHistory.length >= 2 && (
            <div className="p-2">
              <h3 className="text-lg font-semibold mb-2">📈 Goal Progress</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart
                  data={goalHistory
                    .slice()
                    .reverse()
                    .map((g, index) => ({
                      name: g.goal ? (g.goal.length > 10 ? g.goal.slice(0, 10) + "..." : g.goal) : "Unnamed",
                      value: g.monthlyInvestment,
                    }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* History */}
        {goalHistory.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4 text-gray-800">🕓 Goal History</h3>
            <ul className="space-y-3 max-h-64 overflow-y-auto">
              {goalHistory.map((g, index) => (
                <li key={index} className="bg-gray-100 rounded p-4 shadow flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{g.goal}</p>
                    <p className="text-sm text-gray-600">
                      ₹{g.targetAmount} • {g.months} mo • {g.risk} Risk • ₹{g.monthlyInvestment}/mo
                    </p>
                    <p className={`text-xs mt-1 ${g.status === "Achieved" ? "text-green-600" : "text-orange-500"}`}>
                      Status: {g.status}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {g.status === "In Progress" && (
                      <button
                        onClick={() => markAsAchieved(index)}
                        className="text-xs bg-green-500 text-white px-2 py-1 rounded"
                      >
                        Mark Achieved
                      </button>
                    )}
                    <button
                      onClick={() => deleteGoal(index)}
                      className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Goals;
