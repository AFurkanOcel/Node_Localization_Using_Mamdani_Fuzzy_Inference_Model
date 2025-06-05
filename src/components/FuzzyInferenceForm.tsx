import  React, { useState } from 'react';
import { Play } from 'lucide-react';

interface FuzzyInferenceFormProps {
  onRun: (values: any) => void;
}

const FuzzyInferenceForm: React.FC<FuzzyInferenceFormProps> = ({ onRun }) => {
  const [values, setValues] = useState({
    anchorRatio: 20,
    transRange: 40,
    nodeDensity: 15,
    iterations: 60
  });
  
  const handleChange = (field: string, value: number) => {
    setValues({
      ...values,
      [field]: value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRun(values);
  };
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Fuzzy Inference</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Enter parameters to run the fuzzy model</p>
      </div>
      
      <div className="border-t border-gray-200">
        <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="anchorRatio" className="block text-sm font-medium text-gray-700">
                Anchor Ratio: {values.anchorRatio}%
              </label>
              <div className="mt-1 flex items-center">
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  id="anchorRatio"
                  value={values.anchorRatio}
                  onChange={e => handleChange('anchorRatio', parseInt(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div className="mt-1 flex justify-between text-xs text-gray-500">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
              </div>
            </div>
            
            <div>
              <label htmlFor="transRange" className="block text-sm font-medium text-gray-700">
                Transmission Range: {values.transRange}m
              </label>
              <div className="mt-1 flex items-center">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  id="transRange"
                  value={values.transRange}
                  onChange={e => handleChange('transRange', parseInt(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div className="mt-1 flex justify-between text-xs text-gray-500">
                <span>0m</span>
                <span>50m</span>
                <span>100m</span>
              </div>
            </div>
            
            <div>
              <label htmlFor="nodeDensity" className="block text-sm font-medium text-gray-700">
                Node Density: {values.nodeDensity}/km²
              </label>
              <div className="mt-1 flex items-center">
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  id="nodeDensity"
                  value={values.nodeDensity}
                  onChange={e => handleChange('nodeDensity', parseInt(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div className="mt-1 flex justify-between text-xs text-gray-500">
                <span>0/km²</span>
                <span>25/km²</span>
                <span>50/km²</span>
              </div>
            </div>
            
            <div>
              <label htmlFor="iterations" className="block text-sm font-medium text-gray-700">
                Iterations: {values.iterations}
              </label>
              <div className="mt-1 flex items-center">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  id="iterations"
                  value={values.iterations}
                  onChange={e => handleChange('iterations', parseInt(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div className="mt-1 flex justify-between text-xs text-gray-500">
                <span>0</span>
                <span>50</span>
                <span>100</span>
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Play className="h-4 w-4 mr-2" />
                Run Inference
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FuzzyInferenceForm;
 