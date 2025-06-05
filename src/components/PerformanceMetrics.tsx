import  { ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface PerformanceMetricsProps {
  metrics: {
    mae: number;
    rmse: number;
    accuracy: number;
  };
  previous?: {
    mae: number;
    rmse: number;
    accuracy: number;
  };
}

const PerformanceMetrics = ({ metrics, previous }: PerformanceMetricsProps) => {
  const getChangeIndicator = (current: number, previous: number | undefined, isPositiveGood: boolean) => {
    if (!previous) return null;
    
    const change = current - previous;
    const percentChange = Math.abs((change / previous) * 100);
    
    const isImproved = isPositiveGood ? change > 0 : change < 0;
    
    if (Math.abs(change) < 0.001) {
      return (
        <div className="flex items-center text-gray-500">
          <Minus className="h-4 w-4 mr-1" />
          <span>No change</span>
        </div>
      );
    }
    
    return (
      <div className={`flex items-center ${isImproved ? 'text-green-600' : 'text-red-600'}`}>
        {isImproved ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
        <span>{percentChange.toFixed(1)}%</span>
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h2>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-gradient-to-br from-red-50 to-white overflow-hidden shadow rounded-lg px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-md bg-red-100 text-red-600">
              <span className="text-lg font-semibold">MAE</span>
            </div>
            <div className="ml-4">
              <dt className="text-sm font-medium text-gray-500">
                Mean Absolute Error
              </dt>
              <dd className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">
                  {metrics.mae.toFixed(3)}
                </p>
                {previous && (
                  <div className="ml-2">
                    {getChangeIndicator(metrics.mae, previous.mae, false)}
                  </div>
                )}
              </dd>
            </div>
          </div>
          <div className="mt-3 text-sm">
            <p className="text-gray-500">Lower is better. Average error magnitude across all test cases.</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50 to-white overflow-hidden shadow rounded-lg px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-md bg-yellow-100 text-yellow-600">
              <span className="text-lg font-semibold">RMSE</span>
            </div>
            <div className="ml-4">
              <dt className="text-sm font-medium text-gray-500">
                Root Mean Square Error
              </dt>
              <dd className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">
                  {metrics.rmse.toFixed(3)}
                </p>
                {previous && (
                  <div className="ml-2">
                    {getChangeIndicator(metrics.rmse, previous.rmse, false)}
                  </div>
                )}
              </dd>
            </div>
          </div>
          <div className="mt-3 text-sm">
            <p className="text-gray-500">Lower is better. Penalizes larger errors more heavily.</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-white overflow-hidden shadow rounded-lg px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-md bg-green-100 text-green-600">
              <span className="text-lg font-semibold">ACC</span>
            </div>
            <div className="ml-4">
              <dt className="text-sm font-medium text-gray-500">
                Accuracy
              </dt>
              <dd className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">
                  {metrics.accuracy.toFixed(1)}%
                </p>
                {previous && (
                  <div className="ml-2">
                    {getChangeIndicator(metrics.accuracy, previous.accuracy, true)}
                  </div>
                )}
              </dd>
            </div>
          </div>
          <div className="mt-3 text-sm">
            <p className="text-gray-500">Higher is better. Percentage of predictions with error &lt; 0.3.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;
 