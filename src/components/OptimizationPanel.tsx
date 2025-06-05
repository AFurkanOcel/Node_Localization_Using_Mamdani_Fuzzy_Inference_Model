import  { useState } from 'react';
import { Settings, RefreshCw, Zap } from 'lucide-react';

interface OptimizationOptions {
  iterations: number;
  useParticleSwarm: boolean;
  optimizeRanges: boolean;
  optimizeRules: boolean;
}

interface OptimizationPanelProps {
  onOptimize: (options: OptimizationOptions) => void;
  isOptimizing: boolean;
}

const OptimizationPanel = ({ onOptimize, isOptimizing }: OptimizationPanelProps) => {
  const [options, setOptions] = useState<OptimizationOptions>({
    iterations: 100,
    useParticleSwarm: true,
    optimizeRanges: true,
    optimizeRules: false
  });
  
  const [expanded, setExpanded] = useState(false);
  
  const handleChange = (field: keyof OptimizationOptions, value: number | boolean) => {
    setOptions({
      ...options,
      [field]: value
    });
  };
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-5 sm:px-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium flex items-center">
              <Zap className="mr-2 h-5 w-5" />
              Model Optimization
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-indigo-100">
              Find optimal membership functions and rules
            </p>
          </div>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {expanded ? 'Hide Options' : 'Show Options'}
          </button>
        </div>
      </div>
      
      {expanded && (
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="iterations" className="block text-sm font-medium text-gray-700">
                Optimization Iterations
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="iterations"
                  id="iterations"
                  min={10}
                  max={1000}
                  value={options.iterations}
                  onChange={(e) => handleChange('iterations', parseInt(e.target.value))}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                More iterations = better results but slower
              </p>
            </div>

            <div className="sm:col-span-3">
              <fieldset>
                <legend className="text-sm font-medium text-gray-700">Optimization Method</legend>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center">
                    <input
                      id="method-pso"
                      name="optimization-method"
                      type="radio"
                      checked={options.useParticleSwarm}
                      onChange={() => handleChange('useParticleSwarm', true)}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                    />
                    <label htmlFor="method-pso" className="ml-3 block text-sm font-medium text-gray-700">
                      Particle Swarm Optimization (Recommended)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="method-grid"
                      name="optimization-method"
                      type="radio"
                      checked={!options.useParticleSwarm}
                      onChange={() => handleChange('useParticleSwarm', false)}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                    />
                    <label htmlFor="method-grid" className="ml-3 block text-sm font-medium text-gray-700">
                      Grid Search
                    </label>
                  </div>
                </div>
              </fieldset>
            </div>
            
            <div className="sm:col-span-6">
              <fieldset>
                <legend className="text-sm font-medium text-gray-700">What to Optimize</legend>
                <div className="mt-4 grid grid-cols-1 gap-y-4 sm:grid-cols-2">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="optimize-ranges"
                        name="optimize-ranges"
                        type="checkbox"
                        checked={options.optimizeRanges}
                        onChange={(e) => handleChange('optimizeRanges', e.target.checked)}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="optimize-ranges" className="font-medium text-gray-700">
                        Membership Function Ranges
                      </label>
                      <p className="text-gray-500">
                        Find optimal boundaries for each fuzzy set
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="optimize-rules"
                        name="optimize-rules"
                        type="checkbox"
                        checked={options.optimizeRules}
                        onChange={(e) => handleChange('optimizeRules', e.target.checked)}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="optimize-rules" className="font-medium text-gray-700">
                        Rule Weights
                      </label>
                      <p className="text-gray-500">
                        Adjust rule weights for better performance
                      </p>
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </div>
      )}
      
      <div className="px-4 py-4 bg-gray-50 text-right sm:px-6">
        <button
          onClick={() => onOptimize(options)}
          disabled={isOptimizing}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isOptimizing ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Optimizing...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Run Optimization
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default OptimizationPanel;
 