import { FiArrowUpRight, FiArrowDownLeft } from 'react-icons/fi';

function StatCard({ icon, title, value, change, isPositive = true }) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0 rounded-md bg-blue-50 p-3 text-blue-500">
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {value}
                </div>
                {change && (
                  <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                    isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {isPositive ? (
                      <FiArrowUpRight className="self-center flex-shrink-0 h-5 w-5 text-green-500" />
                    ) : (
                      <FiArrowDownLeft className="self-center flex-shrink-0 h-5 w-5 text-red-500" />
                    )}
                    <span className="sr-only">
                      {isPositive ? 'Increased by' : 'Decreased by'}
                    </span>
                    {change}
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatCard;
