import  React, { useState, useEffect } from 'react';
import FuzzyInferenceForm from './FuzzyInferenceForm';
import RuleActivation from './RuleActivation';
import PerformanceMetrics from './PerformanceMetrics';
import MembershipFunctionSettings from './MembershipFunctionSettings';
import OptimizationPanel from './OptimizationPanel';
import OptimizationResults from './OptimizationResults';
import ResultsTable from './ResultsTable';
import { testData } from '../data/testData';
import { fuzzyInference, evaluateModel, optimizeModel, Rule, MembershipSettings } from '../utils/fuzzyLogic';
import { generateDefaultRules, generateDefaultMembershipSettings } from '../utils/fuzzyDefaults';

const Dashboard = () => {
  const [membershipSettings, setMembershipSettings] = useState<MembershipSettings>(
    generateDefaultMembershipSettings()
  );
  
  const [rules, setRules] = useState<Rule[]>(generateDefaultRules());
  
  const [inferenceResult, setInferenceResult] = useState<any>(null);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  const [optimizationResult, setOptimizationResult] = useState<any>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [previousMetrics, setPreviousMetrics] = useState<any>(null);
  
  // Run initial evaluation
  useEffect(() => {
    handleEvaluate();
  }, []);
  
  const handleRunInference = (inputs: any) => {
    const result = fuzzyInference(inputs, rules, membershipSettings);
    setInferenceResult(result);
  };
  
  const handleEvaluate = () => {
    const result = evaluateModel(testData, rules, membershipSettings);
    
    // Store previous metrics for comparison
    if (evaluationResult) {
      setPreviousMetrics({
        mae: evaluationResult.mae,
        rmse: evaluationResult.rmse,
        accuracy: evaluationResult.accuracy
      });
    }
    
    setEvaluationResult(result);
  };
  
  const handleOptimize = (options: any) => {
    setIsOptimizing(true);
    
    // Use setTimeout to prevent UI freezing during optimization
    setTimeout(() => {
      try {
        const result = optimizeModel(testData, rules, membershipSettings, options);
        setOptimizationResult(result);
      } catch (error) {
        console.error('Optimization error:', error);
      } finally {
        setIsOptimizing(false);
      }
    }, 100);
  };
  
  const handleApplyOptimization = (bestParameters: any) => {
    setRules(bestParameters.rules);
    setMembershipSettings(bestParameters.settings);
    
    // Re-evaluate with new parameters
    setTimeout(() => {
      handleEvaluate();
    }, 100);
  };
  
  const handleSettingsChange = (newSettings: MembershipSettings) => {
    setMembershipSettings(newSettings);
  };
  
  const handleRulesChange = (newRules: Rule[]) => {
    setRules(newRules);
  };
  
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden mb-8 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1530916320741-07ac11b52a4d?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxmdXp6eSUyMGxvZ2ljJTIwbWVtYmVyc2hpcCUyMGZ1bmN0aW9ucyUyMHZpc3VhbGl6YXRpb24lMjBncmFwaHN8ZW58MHx8fHwxNzQ5MTQ1Nzg4fDA&ixlib=rb-4.1.0&fit=fillmax&h=400&w=600"
            alt="Fern representing fuzzy logic structures"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:py-16 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Fuzzy Logic Model Optimizer
          </h1>
          <p className="mt-6 max-w-lg mx-auto text-xl text-indigo-100 sm:max-w-3xl">
            Advanced optimization for fuzzy membership functions, rules and inference parameters
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <FuzzyInferenceForm onRun={handleRunInference} />
          
          {inferenceResult && (
            <div className="mt-6">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Inference Result</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Based on your input parameters</p>
                </div>
                <div className="border-t border-gray-200">
                  <div className="px-4 py-5 sm:p-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">ALE Value</dt>
                        <dd className="mt-1 text-2xl font-semibold text-gray-900">
                          {inferenceResult.result.toFixed(3)}
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Classification</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            inferenceResult.result < 0.3 ? 'bg-green-100 text-green-800' : 
                            inferenceResult.result < 0.6 ? 'bg-blue-100 text-blue-800' :
                            inferenceResult.result < 0.9 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {inferenceResult.result < 0.3 ? 'Excellent' : 
                             inferenceResult.result < 0.6 ? 'Good' :
                             inferenceResult.result < 0.9 ? 'Fair' : 'Poor'}
                          </span>
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
                
                <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900">Rule Activations</h4>
                  <div className="mt-2">
                    <RuleActivation rules={inferenceResult.activations.map((a: any) => ({
                      name: a.ruleName,
                      strength: a.strength,
                      output: a.output
                    }))} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="lg:col-span-2">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <MembershipFunctionSettings
                settings={membershipSettings}
                onChange={handleSettingsChange}
                onRulesChange={handleRulesChange}
                rules={rules}
                onEvaluate={handleEvaluate}
              />
            </div>
          </div>
          
          {evaluationResult && (
            <div className="mt-6">
              <PerformanceMetrics 
                metrics={{
                  mae: evaluationResult.mae,
                  rmse: evaluationResult.rmse,
                  accuracy: evaluationResult.accuracy
                }}
                previous={previousMetrics}
              />
            </div>
          )}
          
          <div className="mt-6">
            <OptimizationPanel onOptimize={handleOptimize} isOptimizing={isOptimizing} />
          </div>
          
          {optimizationResult && (
            <div className="mt-6">
              <OptimizationResults 
                result={optimizationResult} 
                onApply={handleApplyOptimization} 
              />
            </div>
          )}
        </div>
      </div>
      
      {evaluationResult && evaluationResult.results && (
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Test Results</h2>
          <ResultsTable results={evaluationResult.results.slice(0, 10)} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
 