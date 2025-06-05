import  { useState, useEffect } from 'react';
import { Plus, Trash2, RefreshCw } from 'lucide-react';

export interface Rule {
  id: string;
  name: string;
  condition: {
    anchorRatio: string;
    transRange: string;
    nodeDensity: string;
    iterations: string;
  };
  output: string;
  weight: number;
}

interface RuleTemplates {
  [key: string]: Rule;
}

interface FuzzyModelEditorProps {
  setCount: 3 | 5 | 7;
  onRulesChange: (rules: Rule[]) => void;
  initialRules?: Rule[];
}

// Default labels for different set counts
const getDefaultLabels = (count: 3 | 5 | 7) => {
  if (count === 3) {
    return {
      anchorRatio: ['low', 'medium', 'high'],
      transRange: ['short', 'medium', 'long'],
      nodeDensity: ['sparse', 'moderate', 'dense'],
      iterations: ['few', 'some', 'many'],
      output: ['excellent', 'good', 'fair', 'poor']
    };
  } else if (count === 5) {
    return {
      anchorRatio: ['very_low', 'low', 'medium', 'high', 'very_high'],
      transRange: ['very_short', 'short', 'medium', 'long', 'very_long'],
      nodeDensity: ['very_sparse', 'sparse', 'moderate', 'dense', 'very_dense'],
      iterations: ['very_few', 'few', 'some', 'many', 'very_many'],
      output: ['excellent', 'good', 'fair', 'poor', 'very_poor']
    };
  } else {
    return {
      anchorRatio: ['extremely_low', 'very_low', 'low', 'medium', 'high', 'very_high', 'extremely_high'],
      transRange: ['extremely_short', 'very_short', 'short', 'medium', 'long', 'very_long', 'extremely_long'],
      nodeDensity: ['extremely_sparse', 'very_sparse', 'sparse', 'moderate', 'dense', 'very_dense', 'extremely_dense'],
      iterations: ['extremely_few', 'very_few', 'few', 'some', 'many', 'very_many', 'extremely_many'],
      output: ['excellent', 'very_good', 'good', 'fair', 'poor', 'very_poor', 'extremely_poor']
    };
  }
};

// Rule templates for automatic rule generation
const getRuleTemplates = (count: 3 | 5 | 7): RuleTemplates => {
  const labels = getDefaultLabels(count);
  
  if (count === 3) {
    return {
      excellentRule: {
        id: '',
        name: 'Rule (Excellent)',
        condition: {
          anchorRatio: labels.anchorRatio[0], // low
          transRange: labels.transRange[0],   // short
          nodeDensity: labels.nodeDensity[0], // sparse
          iterations: labels.iterations[2]    // many
        },
        output: 'excellent',
        weight: 1.0
      },
      goodRule: {
        id: '',
        name: 'Rule (Good)',
        condition: {
          anchorRatio: labels.anchorRatio[0], // low
          transRange: labels.transRange[1],   // medium
          nodeDensity: labels.nodeDensity[1], // moderate
          iterations: labels.iterations[1]    // some
        },
        output: 'good',
        weight: 0.9
      },
      fairRule: {
        id: '',
        name: 'Rule (Fair)',
        condition: {
          anchorRatio: labels.anchorRatio[1], // medium
          transRange: labels.transRange[1],   // medium
          nodeDensity: labels.nodeDensity[1], // moderate
          iterations: labels.iterations[0]    // few
        },
        output: 'fair',
        weight: 0.8
      },
      poorRule: {
        id: '',
        name: 'Rule (Poor)',
        condition: {
          anchorRatio: labels.anchorRatio[2], // high
          transRange: labels.transRange[2],   // long
          nodeDensity: labels.nodeDensity[2], // dense
          iterations: labels.iterations[0]    // few
        },
        output: 'poor',
        weight: 0.9
      }
    };
  }
  
  // For 5 and 7 sets, we'll just use a subset of rules for simplicity
  // In a real application, you would want more comprehensive templates
  const templates: RuleTemplates = {};
  
  templates.excellentRule = {
    id: '',
    name: 'Rule (Excellent)',
    condition: {
      anchorRatio: labels.anchorRatio[0], // very_low/extremely_low
      transRange: labels.transRange[0],   // very_short/extremely_short
      nodeDensity: labels.nodeDensity[0], // very_sparse/extremely_sparse
      iterations: labels.iterations[count-1] // very_many/extremely_many
    },
    output: 'excellent',
    weight: 1.0
  };
  
  templates.veryGoodRule = {
    id: '',
    name: 'Rule (Very Good)',
    condition: {
      anchorRatio: labels.anchorRatio[1], // low/very_low
      transRange: labels.transRange[1],   // short/very_short
      nodeDensity: labels.nodeDensity[1], // sparse/very_sparse
      iterations: labels.iterations[count-2] // many/very_many
    },
    output: count >= 5 ? 'very_good' : 'good',
    weight: 0.95
  };
  
  templates.goodRule = {
    id: '',
    name: 'Rule (Good)',
    condition: {
      anchorRatio: labels.anchorRatio[1], // low/very_low
      transRange: labels.transRange[2],   // medium/short
      nodeDensity: labels.nodeDensity[1], // sparse/very_sparse
      iterations: labels.iterations[Math.floor(count/2)] // some
    },
    output: 'good',
    weight: 0.9
  };
  
  templates.fairRule = {
    id: '',
    name: 'Rule (Fair)',
    condition: {
      anchorRatio: labels.anchorRatio[Math.floor(count/2)], // medium
      transRange: labels.transRange[Math.floor(count/2)],   // medium
      nodeDensity: labels.nodeDensity[Math.floor(count/2)], // moderate
      iterations: labels.iterations[Math.floor(count/2)-1]  // few/some
    },
    output: 'fair',
    weight: 0.8
  };
  
  templates.poorRule = {
    id: '',
    name: 'Rule (Poor)',
    condition: {
      anchorRatio: labels.anchorRatio[count-2], // high/very_high
      transRange: labels.transRange[count-2],   // long/very_long
      nodeDensity: labels.nodeDensity[count-2], // dense/very_dense
      iterations: labels.iterations[1]          // few/very_few
    },
    output: 'poor',
    weight: 0.9
  };
  
  templates.veryPoorRule = {
    id: '',
    name: 'Rule (Very Poor)',
    condition: {
      anchorRatio: labels.anchorRatio[count-1], // very_high/extremely_high
      transRange: labels.transRange[count-1],   // very_long/extremely_long
      nodeDensity: labels.nodeDensity[count-1], // very_dense/extremely_dense
      iterations: labels.iterations[0]          // very_few/extremely_few
    },
    output: count >= 5 ? 'very_poor' : 'poor',
    weight: 0.85
  };
  
  return templates;
};

// Get initial rules based on set count
const getInitialRules = (count: 3 | 5 | 7): Rule[] => {
  const templates = getRuleTemplates(count);
  const rules: Rule[] = [];
  
  let ruleId = 1;
  
  // Add basic rules for all set counts
  const addRule = (template: Rule) => {
    rules.push({
      ...template,
      id: String(ruleId),
      name: `Rule ${ruleId}`
    });
    ruleId++;
  };
  
  addRule(templates.excellentRule);
  addRule(templates.goodRule);
  addRule(templates.fairRule);
  addRule(templates.poorRule);
  
  // Add more rules for higher set counts
  if (count >= 5) {
    addRule(templates.veryGoodRule);
    addRule(templates.veryPoorRule);
  }
  
  // For 7 sets, add even more complex rules
  if (count === 7) {
    const labels = getDefaultLabels(count);
    
    // Add a few more specialized rules
    addRule({
      id: '',
      name: '',
      condition: {
        anchorRatio: labels.anchorRatio[2], // low
        transRange: labels.transRange[3],   // medium
        nodeDensity: labels.nodeDensity[2], // sparse
        iterations: labels.iterations[4]    // many
      },
      output: 'good',
      weight: 0.88
    });
    
    addRule({
      id: '',
      name: '',
      condition: {
        anchorRatio: labels.anchorRatio[3], // medium
        transRange: labels.transRange[4],   // long
        nodeDensity: labels.nodeDensity[4], // dense
        iterations: labels.iterations[3]    // some
      },
      output: 'poor',
      weight: 0.82
    });
  }
  
  return rules;
};

const FuzzyModelEditor = ({ setCount, onRulesChange, initialRules }: FuzzyModelEditorProps) => {
  const [rules, setRules] = useState<Rule[]>(initialRules || getInitialRules(setCount));
  const [isAddingRule, setIsAddingRule] = useState(false);
  const [isGeneratingRules, setIsGeneratingRules] = useState(false);
  const [addRuleCount, setAddRuleCount] = useState(3);
  
  const labels = getDefaultLabels(setCount);
  
  const [newRule, setNewRule] = useState<Rule>({
    id: '',
    name: '',
    condition: {
      anchorRatio: labels.anchorRatio[0],
      transRange: labels.transRange[0],
      nodeDensity: labels.nodeDensity[0],
      iterations: labels.iterations[0]
    },
    output: 'excellent',
    weight: 1.0
  });
  
  // Update rules when set count changes
  useEffect(() => {
    if (!initialRules) {
      setRules(getInitialRules(setCount));
    }
  }, [setCount, initialRules]);

  // Propagate rules changes to parent
  useEffect(() => {
    onRulesChange(rules);
  }, [rules, onRulesChange]);
  
  const handleAddRule = () => {
    const ruleWithId = {
      ...newRule,
      id: String(Date.now()),
      name: `Rule ${rules.length + 1}`
    };
    
    setRules([...rules, ruleWithId]);
    setNewRule({
      id: '',
      name: '',
      condition: {
        anchorRatio: labels.anchorRatio[0],
        transRange: labels.transRange[0],
        nodeDensity: labels.nodeDensity[0],
        iterations: labels.iterations[0]
      },
      output: 'excellent',
      weight: 1.0
    });
    setIsAddingRule(false);
  };
  
  const handleRemoveRule = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id));
  };
  
  const handleConditionChange = (field: keyof Rule['condition'], value: string) => {
    setNewRule({
      ...newRule,
      condition: {
        ...newRule.condition,
        [field]: value
      }
    });
  };
  
  const generateRules = () => {
    setIsGeneratingRules(true);
    
    setTimeout(() => {
      const templates = getRuleTemplates(setCount);
      const newRules = [...rules];
      const existingRulesCount = rules.length;
      
      // Get all template combinations
      const parameters = ['anchorRatio', 'transRange', 'nodeDensity', 'iterations'];
      
      // Generate combinations based on requested count
      for (let i = 0; i < addRuleCount; i++) {
        // Create a random rule by combining random values for each parameter
        const condition: any = {};
        
        parameters.forEach(param => {
          const options = labels[param as keyof typeof labels];
          const randomIndex = Math.floor(Math.random() * options.length);
          condition[param] = options[randomIndex];
        });
        
        // Determine output based on a weighted heuristic
        // This is a simplified logic - in a real system you'd want something more sophisticated
        let outputValue = '';
        
        // Low anchor ratio and high iterations tend to give better results
        const anchorRatioIndex = labels.anchorRatio.indexOf(condition.anchorRatio);
        const iterationsIndex = labels.iterations.indexOf(condition.iterations);
        
        const anchorRatioNormalized = 1 - (anchorRatioIndex / (labels.anchorRatio.length - 1));
        const iterationsNormalized = iterationsIndex / (labels.iterations.length - 1);
        
        const score = (anchorRatioNormalized * 0.4) + (iterationsNormalized * 0.6);
        
        if (score > 0.8) {
          outputValue = 'excellent';
        } else if (score > 0.6) {
          outputValue = 'good';
        } else if (score > 0.4) {
          outputValue = 'fair';
        } else {
          outputValue = 'poor';
        }
        
        // Add the rule
        newRules.push({
          id: String(Date.now() + i),
          name: `Rule ${existingRulesCount + i + 1}`,
          condition: condition,
          output: outputValue,
          weight: 0.7 + (Math.random() * 0.3) // Random weight between 0.7 and 1.0
        });
      }
      
      setRules(newRules);
      setIsGeneratingRules(false);
    }, 500); // Simulate processing time
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Fuzzy Rules</h2>
        <div className="flex space-x-2">
          <div className="flex items-center">
            <select
              className="block w-20 mr-2 text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={addRuleCount}
              onChange={(e) => setAddRuleCount(parseInt(e.target.value))}
            >
              <option value="3">3</option>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
            <button
              onClick={generateRules}
              disabled={isGeneratingRules}
              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {isGeneratingRules ? (
                <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-1" />
              )}
              Generate Rules
            </button>
          </div>
          <button
            onClick={() => setIsAddingRule(!isAddingRule)}
            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Rule
          </button>
        </div>
      </div>
      
      {isAddingRule && (
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
          <h3 className="text-sm font-medium text-gray-700 mb-3">New Rule</h3>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                If Anchor Ratio is
              </label>
              <select
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={newRule.condition.anchorRatio}
                onChange={(e) => handleConditionChange('anchorRatio', e.target.value)}
              >
                {labels.anchorRatio.map((label) => (
                  <option key={label} value={label}>
                    {label.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                and Trans Range is
              </label>
              <select
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={newRule.condition.transRange}
                onChange={(e) => handleConditionChange('transRange', e.target.value)}
              >
                {labels.transRange.map((label) => (
                  <option key={label} value={label}>
                    {label.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                and Node Density is
              </label>
              <select
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={newRule.condition.nodeDensity}
                onChange={(e) => handleConditionChange('nodeDensity', e.target.value)}
              >
                {labels.nodeDensity.map((label) => (
                  <option key={label} value={label}>
                    {label.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                and Iterations is
              </label>
              <select
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={newRule.condition.iterations}
                onChange={(e) => handleConditionChange('iterations', e.target.value)}
              >
                {labels.iterations.map((label) => (
                  <option key={label} value={label}>
                    {label.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Then Output is
              </label>
              <select
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={newRule.output}
                onChange={(e) => setNewRule({...newRule, output: e.target.value})}
              >
                {labels.output.map((label) => (
                  <option key={label} value={label}>
                    {label.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Rule Weight
              </label>
              <input 
                type="number" 
                step="0.1"
                min="0"
                max="1"
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={newRule.weight}
                onChange={(e) => setNewRule({...newRule, weight: parseFloat(e.target.value)})}
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              className="mr-3 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => setIsAddingRule(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={handleAddRule}
            >
              Add Rule
            </button>
          </div>
        </div>
      )}
      
      <div className="bg-white overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rule
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Condition
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Output
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Weight
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {rules.map((rule) => (
                <tr key={rule.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                    {rule.name}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    <span className="whitespace-normal">
                      <span className="font-medium">If</span> Anchor Ratio is{' '}
                      <span className="text-indigo-600">{rule.condition.anchorRatio.replace(/_/g, ' ')}</span>{' '}
                      <span className="font-medium">and</span> Trans Range is{' '}
                      <span className="text-indigo-600">{rule.condition.transRange.replace(/_/g, ' ')}</span>{' '}
                      <span className="font-medium">and</span> Node Density is{' '}
                      <span className="text-indigo-600">{rule.condition.nodeDensity.replace(/_/g, ' ')}</span>{' '}
                      <span className="font-medium">and</span> Iterations is{' '}
                      <span className="text-indigo-600">{rule.condition.iterations.replace(/_/g, ' ')}</span>
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize 
                      ${rule.output === 'excellent' ? 'bg-green-100 text-green-800' : 
                        rule.output === 'good' || rule.output === 'very_good' ? 'bg-blue-100 text-blue-800' :
                        rule.output === 'fair' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'}`}
                    >
                      {rule.output.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {rule.weight.toFixed(2)}
                  </td>
                  <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                    <button
                      onClick={() => handleRemoveRule(rule.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6">
          <div className="text-sm text-gray-500">
            Total Rules: <span className="font-medium text-gray-900">{rules.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FuzzyModelEditor;
 