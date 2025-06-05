import  React, { useState } from 'react';
import { ParameterDetails } from './MembershipFunctionSettings';
import { MembershipRange } from '../utils/fuzzyLogic';

interface MembershipRangeEditorProps {
  parameter: ParameterDetails;
  ranges: MembershipRange[];
  onRangesChange: (ranges: MembershipRange[]) => void;
  membershipType: 'triangle' | 'trapezoid' | 'gaussian' | 'sigmoid';
}

const MembershipRangeEditor = ({ 
  parameter, 
  ranges, 
  onRangesChange,
  membershipType
}: MembershipRangeEditorProps) => {
  const [editing, setEditing] = useState<string | null>(null);
  
  const handleRangeChange = (index: number, field: 'start' | 'peak' | 'end', value: number) => {
    const newRanges = [...ranges];
    
    // Update the range
    newRanges[index] = {
      ...newRanges[index],
      [field]: value
    };
    
    // Ensure ranges are consistent
    if (field === 'start' && index > 0) {
      // If changing start of a range, update the end of previous range
      newRanges[index - 1] = {
        ...newRanges[index - 1],
        end: value
      };
    } else if (field === 'end' && index < newRanges.length - 1) {
      // If changing end of a range, update the start of next range
      newRanges[index + 1] = {
        ...newRanges[index + 1],
        start: value
      };
    }
    
    // Ensure peak is between start and end
    if (newRanges[index].peak !== undefined) {
      newRanges[index].peak = Math.min(
        Math.max(newRanges[index].start, newRanges[index].peak!),
        newRanges[index].end
      );
    }
    
    onRangesChange(newRanges);
  };
  
  const renderRangeEditor = (range: MembershipRange, index: number) => {
    const isEditing = editing === range.name;
    const showPeak = membershipType === 'triangle' || membershipType === 'trapezoid';
    
    return (
      <div 
        key={range.name}
        className={`p-3 border rounded-md ${isEditing ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-gray-300'}`}
      >
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-medium">{range.name.replace(/_/g, ' ')}</div>
          <button
            type="button"
            onClick={() => setEditing(isEditing ? null : range.name)}
            className="text-xs text-indigo-600 hover:text-indigo-900"
          >
            {isEditing ? 'Done' : 'Edit'}
          </button>
        </div>
        
        {isEditing ? (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700">
                Start
              </label>
              <input
                type="number"
                min={parameter.min}
                max={range.end}
                step={parameter.step}
                value={range.start}
                onChange={(e) => handleRangeChange(index, 'start', parseFloat(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                disabled={index === 0} // First range always starts at min
              />
            </div>
            
            {showPeak && (
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Peak
                </label>
                <input
                  type="number"
                  min={range.start}
                  max={range.end}
                  step={parameter.step}
                  value={range.peak !== undefined ? range.peak : (range.start + range.end) / 2}
                  onChange={(e) => handleRangeChange(index, 'peak', parseFloat(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            )}
            
            <div>
              <label className="block text-xs font-medium text-gray-700">
                End
              </label>
              <input
                type="number"
                min={range.start}
                max={parameter.max}
                step={parameter.step}
                value={range.end}
                onChange={(e) => handleRangeChange(index, 'end', parseFloat(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                disabled={index === ranges.length - 1} // Last range always ends at max
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-500">Start:</span>{' '}
              <span className="font-medium">{range.start} {parameter.unit}</span>
            </div>
            {showPeak && range.peak !== undefined && (
              <div>
                <span className="text-gray-500">Peak:</span>{' '}
                <span className="font-medium">{range.peak} {parameter.unit}</span>
              </div>
            )}
            <div>
              <span className="text-gray-500">End:</span>{' '}
              <span className="font-medium">{range.end} {parameter.unit}</span>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {ranges.map((range, index) => renderRangeEditor(range, index))}
      </div>
    </div>
  );
};

export default MembershipRangeEditor;
 