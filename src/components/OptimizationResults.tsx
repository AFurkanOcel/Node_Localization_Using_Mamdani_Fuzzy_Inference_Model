import  { Check, Zap } from 'lucide-react';

export interface OptimizationResult {
  bestParameters: {
    rules: any[];
    settings: any;
  };
  performance: {
    mae: number;
    rmse: number;
    accuracy: number;
  };
}

interface OptimizationResultsProps {
  result: OptimizationResult | null;
  onApply: (parameters: OptimizationResult['bestParameters']) => void;
}

const OptimizationResults = ({ result, onApply }: OptimizationResultsProps) => {
  if (!result) return null;
  
  const { bestParameters, performance } = result;
  
  return (
    <div className="mt-4 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium text-green-800 flex items-center mb-4">
        <Zap size={24} className="mr-2 text-green-600" />
        Optimization Complete
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div className="bg-white p-4 rounded-md shadow-sm">
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <Check className="h-4 w-4 text-green-500 mr-1" />
            Best Parameters
          </h4>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
            <dt className="text-sm font-medium text-gray-500">Function Type</dt>
            <dd className="text-sm text-gray-900 capitalize">{bestParameters.settings.functionType}</dd>
            
            <dt className="text-sm font-medium text-gray-500">Set Count</dt>
            <dd className="text-sm text-gray-900">{bestParameters.settings.setCount}</dd>
            
            <dt className="text-sm font-medium text-gray-500">Rule Count</dt>
            <dd className="text-sm text-gray-900">{bestParameters.rules.length}</dd>
          </dl>
        </div>
        
        <div className="bg-white p-4 rounded-md shadow-sm">
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <Check className="h-4 w-4 text-green-500 mr-1" />
            Performance
          </h4>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
            <dt className="text-sm font-medium text-gray-500">MAE</dt>
            <dd className="text-sm font-semibold text-indigo-600">{performance.mae.toFixed(3)}</dd>
            
            <dt className="text-sm font-medium text-gray-500">RMSE</dt>
            <dd className="text-sm font-semibold text-indigo-600">{performance.rmse.toFixed(3)}</dd>
            
            <dt className="text-sm font-medium text-gray-500">Accuracy</dt>
            <dd className="text-sm font-semibold text-indigo-600">{performance.accuracy.toFixed(1)}%</dd>
          </dl>
        </div>
      </div>
      
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => onApply(bestParameters)}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <Check className="mr-2 h-5 w-5" />
          Apply These Parameters
        </button>
      </div>
    </div>
  );
};

export default OptimizationResults;
 