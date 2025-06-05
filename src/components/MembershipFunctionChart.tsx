import  React from 'react';

export interface MembershipData {
  categories: string[];
  series: {
    name: string;
    data: number[];
  }[];
}

interface MembershipFunctionChartProps {
  title: string;
  data: MembershipData;
  xLabel?: string;
  yLabel?: string;
}

const MembershipFunctionChart: React.FC<MembershipFunctionChartProps> = ({ 
  title, 
  data, 
  xLabel = 'Value', 
  yLabel = 'Membership' 
}) => {
  // Get colors based on series name
  const getColor = (name: string) => {
    if (name.includes('extremely low') || name.includes('very low')) {
      return 'rgba(6, 182, 212, 0.7)'; // cyan
    }
    if (name.includes('low') || name.includes('short') || name.includes('sparse') || name.includes('few')) {
      return 'rgba(59, 130, 246, 0.7)'; // blue
    }
    if (name.includes('medium') || name.includes('moderate') || name.includes('some')) {
      return 'rgba(16, 185, 129, 0.7)'; // green
    }
    if (name.includes('high') || name.includes('long') || name.includes('dense') || name.includes('many')) {
      return 'rgba(245, 158, 11, 0.7)'; // amber
    }
    if (name.includes('very high') || name.includes('extremely high')) {
      return 'rgba(239, 68, 68, 0.7)'; // red
    }
    return 'rgba(156, 163, 175, 0.7)'; // gray
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      
      <div className="relative h-60">
        {/* X and Y axes */}
        <div className="absolute inset-0 border-l border-b border-gray-300">
          {/* Y axis labels */}
          <div className="absolute -left-6 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
            <span>1.0</span>
            <span>0.5</span>
            <span>0.0</span>
          </div>
          
          {/* X axis labels */}
          <div className="absolute bottom-0 left-0 w-full flex justify-between text-xs text-gray-500 px-2">
            {data.categories.map((cat, idx) => (
              <span key={idx} style={{ transform: 'translateX(-50%)' }}>{cat}</span>
            ))}
          </div>
          
          {/* Grid lines */}
          <div className="absolute inset-0">
            <div className="border-t border-gray-200 h-1/2"></div>
            <div className="border-t border-gray-100 h-1/4"></div>
            <div className="border-t border-gray-100 h-3/4"></div>
          </div>
        </div>
        
        {/* Series */}
        <div className="absolute inset-0 pt-4 pb-6 pl-2">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            {data.series.map((series, seriesIdx) => (
              <g key={seriesIdx}>
                {/* Area */}
                <path
                  d={`M0,100 ${series.data.map((y, i) => `L${(i / (series.data.length - 1)) * 100},${100 - y * 100}`).join(' ')} L100,100 Z`}
                  fill={getColor(series.name)}
                  opacity="0.4"
                />
                
                {/* Line */}
                <path
                  d={`M0,${100 - series.data[0] * 100} ${series.data.map((y, i) => `L${(i / (series.data.length - 1)) * 100},${100 - y * 100}`).join(' ')}`}
                  stroke={getColor(series.name)}
                  strokeWidth="2"
                  fill="none"
                />
                
                {/* Points */}
                {series.data.map((y, i) => (
                  <circle
                    key={i}
                    cx={`${(i / (series.data.length - 1)) * 100}`}
                    cy={`${100 - y * 100}`}
                    r="2"
                    fill={getColor(series.name)}
                  />
                ))}
              </g>
            ))}
          </svg>
        </div>
        
        {/* Legend */}
        <div className="absolute top-2 right-2 bg-white bg-opacity-80 p-2 rounded border border-gray-200">
          <div className="flex flex-col">
            {data.series.map((series, idx) => (
              <div key={idx} className="flex items-center text-xs">
                <div 
                  className="w-3 h-3 mr-1 rounded-sm" 
                  style={{ backgroundColor: getColor(series.name) }}
                ></div>
                <span>{series.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-2 text-xs text-gray-500 flex justify-between">
        <span>{xLabel}</span>
        <span>{yLabel}</span>
      </div>
    </div>
  );
};

export default MembershipFunctionChart;
 