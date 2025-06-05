import  React from 'react';

export interface Rule {
  name: string;
  strength: number;
  output: string;
}

interface RuleActivationProps {
  rules: Rule[];
}

const RuleActivation: React.FC<RuleActivationProps> = ({ rules }) => {
  const getOutputClass = (output: string) => {
    return output === 'excellent' || output === 'very_good' ? 'bg-green-100 text-green-800' :
           output === 'good' ? 'bg-blue-100 text-blue-800' :
           output === 'fair' ? 'bg-yellow-100 text-yellow-800' :
           'bg-red-100 text-red-800';
  };
  
  const formatOutput = (output: string) => {
    return output.replace(/_/g, ' ');
  };
  
  return (
    <div className="space-y-2">
      {rules.length === 0 ? (
        <p className="text-sm text-gray-500 italic">No rules activated</p>
      ) : (
        rules
          .sort((a, b) => b.strength - a.strength)
          .map((rule, index) => (
            <div 
              key={index} 
              className={`px-3 py-2 rounded-md ${rule.strength > 0 ? 'bg-gray-50' : 'bg-gray-50 opacity-50'}`}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900 truncate" title={rule.name}>
                  {rule.name}
                </span>
                <span 
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getOutputClass(rule.output)}`}
                >
                  {formatOutput(rule.output)}
                </span>
              </div>
              <div className="mt-1">
                <div className="relative pt-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block text-indigo-600">
                        Activation Strength
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-indigo-600">
                        {rule.strength.toFixed(3)}
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-gray-200 mt-1">
                    <div 
                      style={{ width: `${rule.strength * 100}%` }} 
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))
      )}
    </div>
  );
};

export default RuleActivation;
 