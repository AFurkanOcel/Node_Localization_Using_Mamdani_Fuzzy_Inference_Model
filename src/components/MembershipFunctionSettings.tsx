import  React, { useState } from 'react';
import { Plus, Trash, RefreshCw } from 'lucide-react';
import MembershipRangeEditor from './MembershipRangeEditor';
import MembershipFunctionChart from './MembershipFunctionChart';
import { MembershipSettings, Rule, MembershipRange } from '../utils/fuzzyLogic';
import { generateDefaultRules } from '../utils/fuzzyDefaults';

export interface ParameterDetails {
  id: string;
  name: string;
  min: number;
  max: number;
  step: number;
  unit: string;
}

export interface RangeDefinition {
  name: string;
  start: number;
  peak?: number;
  end: number;
}

interface MembershipFunctionSettingsProps {
  settings: MembershipSettings;
  onChange: (settings: MembershipSettings) => void;
  rules: Rule[];
  onRulesChange: (rules: Rule[]) => void;
  onEvaluate: () => void;
}

const parameterDetails: ParameterDetails[] = [
  { id: 'anchorRatio', name: 'Anchor Ratio', min: 0, max: 50, step: 1, unit: '%' },
  { id: 'transRange', name: 'Transmission Range', min: 0, max: 100, step: 1, unit: 'm' },
  { id: 'nodeDensity', name: 'Node Density', min: 0, max: 50, step: 1, unit: '/km²' },
  { id: 'iterations', name: 'Iterations', min: 0, max: 100, step: 1, unit: '' },
];

const MembershipFunctionSettings = ({ 
  settings, 
  onChange, 
  rules, 
  onRulesChange, 
  onEvaluate 
}: MembershipFunctionSettingsProps) => {
  const [activeTab, setActiveTab] = useState<string>('anchorRatio');
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);

  const handleFunctionTypeChange = (type: 'triangle' | 'trapezoid' | 'gaussian' | 'sigmoid') => {
    onChange({
      ...settings,
      functionType: type
    });
  };

  const handleSetCountChange = (count: 3 | 5 | 7) => {
    // Generate new ranges based on count
    const newSettings = {
      ...settings,
      setCount: count
    };
    
    // For each parameter, create evenly distributed ranges
    for (const param of parameterDetails) {
      const { min, max } = param;
      const step = (max - min) / count;
      
      const ranges: MembershipRange[] = [];
      for (let i = 0; i < count; i++) {
        const start = min + step * i;
        const end = min + step * (i + 1);
        const peak = (start + end) / 2;
        
        let name = '';
        if (count === 3) {
          name = i === 0 ? 'low' : i === 1 ? 'medium' : 'high';
        } else if (count === 5) {
          name = i === 0 ? 'very_low' : 
                 i === 1 ? 'low' : 
                 i === 2 ? 'medium' : 
                 i === 3 ? 'high' : 'very_high';
        } else {
          name = i === 0 ? 'extremely_low' :
                 i === 1 ? 'very_low' :
                 i === 2 ? 'low' :
                 i === 3 ? 'medium' :
                 i === 4 ? 'high' :
                 i === 5 ? 'very_high' : 'extremely_high';
        }
        
        ranges.push({
          name,
          start: i === 0 ? min : start,
          peak,
          end: i === count - 1 ? max : end
        });
      }
      
      newSettings.ranges[param.id as keyof typeof newSettings.ranges] = ranges;
    }
    
    onChange(newSettings);
    
    // Also regenerate rules to match new set count
    onRulesChange(generateDefaultRules(count));
  };

  const handleRangesChange = (paramId: string, newRanges: RangeDefinition[]) => {
    onChange({
      ...settings,
      ranges: {
        ...settings.ranges,
        [paramId]: newRanges
      }
    });
  };

  const handleAddRule = () => {
    // Generate a unique ID for the new rule
    const newId = `rule_${Date.now()}`;
    
    // Create a default new rule
    const newRule: Rule = {
      id: newId,
      name: `Rule ${rules.length + 1}`,
      condition: {
        anchorRatio: settings.ranges.anchorRatio[0].name,
        transRange: settings.ranges.transRange[0].name,
        nodeDensity: settings.ranges.nodeDensity[0].name,
        iterations: settings.ranges.iterations[0].name
      },
      output: 'excellent',
      weight: 1.0
    };
    
    onRulesChange([...rules, newRule]);
    setEditingRuleId(newId);
  };

  const handleRemoveRule = (ruleId: string) => {
    onRulesChange(rules.filter(r => r.id !== ruleId));
    if (editingRuleId === ruleId) {
      setEditingRuleId(null);
    }
  };

  const handleRuleChange = (ruleId: string, field: string, value: any) => {
    const updatedRules = rules.map(rule => {
      if (rule.id === ruleId) {
        if (field.startsWith('condition.')) {
          const conditionField = field.split('.')[1];
          return {
            ...rule,
            condition: {
              ...rule.condition,
              [conditionField]: value
            }
          };
        } else {
          return {
            ...rule,
            [field]: value
          };
        }
      }
      return rule;
    });
    
    onRulesChange(updatedRules);
  };

  const handleRegenerateRules = () => {
    onRulesChange(generateDefaultRules(settings.setCount));
  };

  // Generate chart data for the current parameter
  const getChartData = (paramId: string) => {
    const param = parameterDetails.find(p => p.id === paramId)!;
    const ranges = settings.ranges[paramId as keyof typeof settings.ranges];
    
    // Generate x-axis categories (values)
    const categories = Array.from({ length: 11 }, (_, i) => 
      ((param.max - param.min) * (i / 10) + param.min).toString()
    );
    
    // Generate data series for each membership function
    const series = ranges.map(range => {
      const data = categories.map(cat => {
        const x = parseFloat(cat);
        
        // Calculate membership value based on function type
        let y = 0;
        
        if (settings.functionType === 'triangle') {
          if (x < range.start || x > range.end) {
            y = 0;
          } else if (range.peak !== undefined && x === range.peak) {
            y = 1;
          } else if (range.peak !== undefined && x < range.peak) {
            y = (x - range.start) / (range.peak - range.start);
          } else if (range.peak !== undefined) {
            y = (range.end - x) / (range.end - range.peak);
          } else {
            const peak = (range.start + range.end) / 2;
            if (x < peak) {
              y = (x - range.start) / (peak - range.start);
            } else {
              y = (range.end - x) / (range.end - peak);
            }
          }
        } else if (settings.functionType === 'trapezoid') {
          if (x < range.start || x > range.end) {
            y = 0;
          } else if (range.peak !== undefined) {
            const flatEnd = range.peak + (range.end - range.peak) / 2;
            if (x >= range.peak && x <= flatEnd) {
              y = 1;
            } else if (x < range.peak) {
              y = (x - range.start) / (range.peak - range.start);
            } else {
              y = (range.end - x) / (range.end - flatEnd);
            }
          } else {
            const firstThird = range.start + (range.end - range.start) / 3;
            const secondThird = range.end - (range.end - range.start) / 3;
            if (x >= firstThird && x <= secondThird) {
              y = 1;
            } else if (x < firstThird) {
              y = (x - range.start) / (firstThird - range.start);
            } else {
              y = (range.end - x) / (range.end - secondThird);
            }
          }
        } else if (settings.functionType === 'gaussian') {
          const peak = range.peak !== undefined ? range.peak : (range.start + range.end) / 2;
          const sigma = Math.max(peak - range.start, range.end - peak) / 3;
          y = Math.exp(-Math.pow(x - peak, 2) / (2 * Math.pow(sigma, 2)));
        } else if (settings.functionType === 'sigmoid') {
          const midpoint = (range.start + range.end) / 2;
          const scale = 10 / (range.end - range.start);
          y = 1 / (1 + Math.exp(-scale * (x - midpoint)));
        }
        
        return Math.max(0, Math.min(1, y)); // Clamp between 0 and 1
      });
      
      return {
        name: range.name.replace(/_/g, ' '),
        data
      };
    });
    
    return {
      categories,
      series
    };
  };

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Membership Function Settings</h2>
      
      <div className="bg-white shadow ring-1 ring-black ring-opacity-5 p-4 rounded-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Membership Function Type
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  settings.functionType === 'triangle'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => handleFunctionTypeChange('triangle')}
              >
                Triangle
              </button>
              <button
                type="button"
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  settings.functionType === 'trapezoid'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => handleFunctionTypeChange('trapezoid')}
              >
                Trapezoid
              </button>
              <button
                type="button"
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  settings.functionType === 'gaussian'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => handleFunctionTypeChange('gaussian')}
              >
                Gaussian
              </button>
              <button
                type="button"
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  settings.functionType === 'sigmoid'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => handleFunctionTypeChange('sigmoid')}
              >
                Sigmoid
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Fuzzy Sets
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  settings.setCount === 3
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => handleSetCountChange(3)}
              >
                3 Sets
              </button>
              <button
                type="button"
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  settings.setCount === 5
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => handleSetCountChange(5)}
              >
                5 Sets
              </button>
              <button
                type="button"
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  settings.setCount === 7
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => handleSetCountChange(7)}
              >
                7 Sets
              </button>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {parameterDetails.map((param) => (
                <button
                  key={param.id}
                  onClick={() => setActiveTab(param.id)}
                  className={`
                    whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm
                    ${activeTab === param.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                  `}
                >
                  {param.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
        
        {parameterDetails.map((param) => (
          <div key={param.id} className={activeTab === param.id ? '' : 'hidden'}>
            <MembershipRangeEditor
              parameter={param}
              ranges={settings.ranges[param.id as keyof typeof settings.ranges]}
              onRangesChange={(newRanges) => handleRangesChange(param.id, newRanges)}
              membershipType={settings.functionType}
            />
            
            <div className="mt-4">
              <MembershipFunctionChart
                title={`${param.name} Membership Functions`}
                data={getChartData(param.id)}
                xLabel={`${param.name} (${param.unit})`}
              />
            </div>
          </div>
        ))}
        
        <div className="mt-6 border-t border-gray-200 pt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Fuzzy Rules</h3>
          
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rule
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Anchor Ratio
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trans Range
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Node Density
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Iterations
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Output
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Weight
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {rules.map((rule) => (
                  <tr key={rule.id} className={editingRuleId === rule.id ? 'bg-blue-50' : ''}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                      {editingRuleId === rule.id ? (
                        <input
                          type="text"
                          value={rule.name}
                          onChange={(e) => handleRuleChange(rule.id, 'name', e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      ) : (
                        rule.name
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {editingRuleId === rule.id ? (
                        <select
                          value={rule.condition.anchorRatio}
                          onChange={(e) => handleRuleChange(rule.id, 'condition.anchorRatio', e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          {settings.ranges.anchorRatio.map((range) => (
                            <option key={range.name} value={range.name}>
                              {range.name.replace(/_/g, ' ')}
                            </option>
                          ))}
                        </select>
                      ) : (
                        rule.condition.anchorRatio.replace(/_/g, ' ')
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {editingRuleId === rule.id ? (
                        <select
                          value={rule.condition.transRange}
                          onChange={(e) => handleRuleChange(rule.id, 'condition.transRange', e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          {settings.ranges.transRange.map((range) => (
                            <option key={range.name} value={range.name}>
                              {range.name.replace(/_/g, ' ')}
                            </option>
                          ))}
                        </select>
                      ) : (
                        rule.condition.transRange.replace(/_/g, ' ')
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {editingRuleId === rule.id ? (
                        <select
                          value={rule.condition.nodeDensity}
                          onChange={(e) => handleRuleChange(rule.id, 'condition.nodeDensity', e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          {settings.ranges.nodeDensity.map((range) => (
                            <option key={range.name} value={range.name}>
                              {range.name.replace(/_/g, ' ')}
                            </option>
                          ))}
                        </select>
                      ) : (
                        rule.condition.nodeDensity.replace(/_/g, ' ')
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {editingRuleId === rule.id ? (
                        <select
                          value={rule.condition.iterations}
                          onChange={(e) => handleRuleChange(rule.id, 'condition.iterations', e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          {settings.ranges.iterations.map((range) => (
                            <option key={range.name} value={range.name}>
                              {range.name.replace(/_/g, ' ')}
                            </option>
                          ))}
                        </select>
                      ) : (
                        rule.condition.iterations.replace(/_/g, ' ')
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {editingRuleId === rule.id ? (
                        <select
                          value={rule.output}
                          onChange={(e) => handleRuleChange(rule.id, 'output', e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="excellent">Excellent</option>
                          <option value="very_good">Very Good</option>
                          <option value="good">Good</option>
                          <option value="fair">Fair</option>
                          <option value="poor">Poor</option>
                          <option value="very_poor">Very Poor</option>
                          <option value="extremely_poor">Extremely Poor</option>
                        </select>
                      ) : (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                          rule.output === 'excellent' ? 'bg-green-100 text-green-800' : 
                          rule.output === 'very_good' ? 'bg-green-100 text-green-800' :
                          rule.output === 'good' ? 'bg-blue-100 text-blue-800' :
                          rule.output === 'fair' ? 'bg-yellow-100 text-yellow-800' :
                          rule.output === 'poor' ? 'bg-red-100 text-red-800' :
                          rule.output === 'very_poor' ? 'bg-red-100 text-red-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {rule.output.replace(/_/g, ' ')}
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {editingRuleId === rule.id ? (
                        <input
                          type="number"
                          min="0"
                          max="1"
                          step="0.1"
                          value={rule.weight}
                          onChange={(e) => handleRuleChange(rule.id, 'weight', parseFloat(e.target.value))}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      ) : (
                        rule.weight.toFixed(1)
                      )}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      {editingRuleId === rule.id ? (
                        <button
                          onClick={() => setEditingRuleId(null)}
                          className="text-indigo-600 hover:text-indigo-900 mr-2"
                        >
                          Done
                        </button>
                      ) : (
                        <button
                          onClick={() => setEditingRuleId(rule.id)}
                          className="text-indigo-600 hover:text-indigo-900 mr-2"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => handleRemoveRule(rule.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 flex justify-between">
            <button
              type="button"
              onClick={handleAddRule}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Rule
            </button>
            
            <div>
              <button
                type="button"
                onClick={handleRegenerateRules}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-2"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Regenerate Rules
              </button>
              
              <button
                type="button"
                onClick={onEvaluate}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Apply & Evaluate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipFunctionSettings;
 