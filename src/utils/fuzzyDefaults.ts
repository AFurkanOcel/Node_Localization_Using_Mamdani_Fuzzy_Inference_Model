import  { MembershipSettings, Rule, MembershipRange } from './fuzzyLogic';
import { v4 as uuidv4 } from 'uuid';

// Generate default membership settings
export function generateDefaultMembershipSettings(): MembershipSettings {
  return {
    functionType: 'gaussian',
    setCount: 5,
    ranges: {
      anchorRatio: generateDefaultRanges('anchorRatio', 0, 50, 5),
      transRange: generateDefaultRanges('transRange', 0, 100, 5),
      nodeDensity: generateDefaultRanges('nodeDensity', 0, 50, 5),
      iterations: generateDefaultRanges('iterations', 0, 100, 5)
    }
  };
}

// Generate default ranges for a parameter
function generateDefaultRanges(
  paramId: string,
  min: number,
  max: number,
  count: number
): MembershipRange[] {
  const step = (max - min) / count;
  const ranges: MembershipRange[] = [];
  
  for (let i = 0; i < count; i++) {
    const start = min + step * i;
    const end = min + step * (i + 1);
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
    
    // Optimized ranges based on parameters
    let peak;
    if (paramId === 'anchorRatio') {
      if (name === 'very_low') peak = 5;
      else if (name === 'low') peak = 15;
      else if (name === 'medium') peak = 25;
      else if (name === 'high') peak = 35;
      else if (name === 'very_high') peak = 45;
    } 
    else if (paramId === 'transRange') {
      if (name === 'very_low') peak = 10;
      else if (name === 'low') peak = 30;
      else if (name === 'medium') peak = 50;
      else if (name === 'high') peak = 70;
      else if (name === 'very_high') peak = 90;
    }
    else if (paramId === 'nodeDensity') {
      if (name === 'very_low') peak = 5;
      else if (name === 'low') peak = 15;
      else if (name === 'medium') peak = 25;
      else if (name === 'high') peak = 35;
      else if (name === 'very_high') peak = 45;
    }
    else if (paramId === 'iterations') {
      if (name === 'very_low') peak = 10;
      else if (name === 'low') peak = 30;
      else if (name === 'medium') peak = 50;
      else if (name === 'high') peak = 70;
      else if (name === 'very_high') peak = 90;
    }
    
    ranges.push({
      name,
      start: i === 0 ? min : start,
      peak,
      end: i === count - 1 ? max : end
    });
  }
  
  return ranges;
}

// Generate default rules
export function generateDefaultRules(setCount: 3 | 5 | 7 = 5): Rule[] {
  // Base rules that work well for the model
  if (setCount === 3) {
    return [
      createRule('Rule 1', 'low', 'low', 'low', 'high', 'excellent'),
      createRule('Rule 2', 'low', 'low', 'medium', 'medium', 'very_good'),
      createRule('Rule 3', 'low', 'medium', 'low', 'high', 'very_good'),
      createRule('Rule 4', 'medium', 'low', 'low', 'high', 'good'),
      createRule('Rule 5', 'medium', 'medium', 'medium', 'medium', 'fair'),
      createRule('Rule 6', 'high', 'medium', 'medium', 'medium', 'poor'),
      createRule('Rule 7', 'high', 'high', 'high', 'low', 'very_poor'),
      createRule('Rule 8', 'medium', 'high', 'high', 'low', 'poor'),
      createRule('Rule 9', 'low', 'high', 'high', 'medium', 'fair'),
      createRule('Rule 10', 'high', 'high', 'low', 'low', 'poor')
    ];
  } else if (setCount === 5) {
    return [
      createRule('Rule 1', 'very_low', 'very_low', 'very_low', 'very_high', 'excellent'),
      createRule('Rule 2', 'very_low', 'low', 'very_low', 'high', 'excellent'),
      createRule('Rule 3', 'low', 'very_low', 'very_low', 'high', 'excellent'),
      createRule('Rule 4', 'low', 'low', 'low', 'high', 'very_good'),
      createRule('Rule 5', 'very_low', 'medium', 'low', 'medium', 'very_good'),
      createRule('Rule 6', 'low', 'medium', 'medium', 'medium', 'good'),
      createRule('Rule 7', 'medium', 'medium', 'medium', 'medium', 'good'),
      createRule('Rule 8', 'medium', 'high', 'medium', 'low', 'fair'),
      createRule('Rule 9', 'high', 'medium', 'high', 'low', 'poor'),
      createRule('Rule 10', 'high', 'high', 'high', 'very_low', 'very_poor'),
      createRule('Rule 11', 'very_high', 'high', 'high', 'very_low', 'very_poor'),
      createRule('Rule 12', 'very_high', 'very_high', 'very_high', 'very_low', 'extremely_poor'),
      createRule('Rule 13', 'low', 'low', 'high', 'medium', 'fair'),
      createRule('Rule 14', 'very_low', 'high', 'very_high', 'low', 'poor'),
      createRule('Rule 15', 'very_high', 'very_low', 'medium', 'medium', 'fair'),
      createRule('Rule 16', 'medium', 'very_low', 'very_high', 'high', 'fair'),
      createRule('Rule 17', 'very_low', 'very_high', 'very_low', 'very_high', 'good'),
      createRule('Rule 18', 'high', 'high', 'low', 'medium', 'fair'),
      createRule('Rule 19', 'very_high', 'medium', 'very_low', 'low', 'poor'),
      createRule('Rule 20', 'low', 'very_high', 'medium', 'very_low', 'poor')
    ];
  } else {
    return [
      createRule('Rule 1', 'extremely_low', 'extremely_low', 'extremely_low', 'extremely_high', 'excellent'),
      createRule('Rule 2', 'very_low', 'very_low', 'very_low', 'very_high', 'excellent'),
      createRule('Rule 3', 'low', 'very_low', 'very_low', 'high', 'very_good'),
      createRule('Rule 4', 'very_low', 'low', 'very_low', 'high', 'very_good'),
      createRule('Rule 5', 'low', 'low', 'low', 'high', 'good'),
      createRule('Rule 6', 'medium', 'low', 'low', 'medium', 'good'),
      createRule('Rule 7', 'medium', 'medium', 'medium', 'medium', 'fair'),
      createRule('Rule 8', 'high', 'medium', 'medium', 'low', 'fair'),
      createRule('Rule 9', 'high', 'high', 'high', 'low', 'poor'),
      createRule('Rule 10', 'very_high', 'high', 'high', 'very_low', 'very_poor'),
      createRule('Rule 11', 'extremely_high', 'very_high', 'very_high', 'extremely_low', 'extremely_poor'),
      createRule('Rule 12', 'extremely_low', 'extremely_high', 'extremely_low', 'medium', 'fair'),
      createRule('Rule 13', 'extremely_high', 'extremely_low', 'extremely_high', 'low', 'poor'),
      createRule('Rule 14', 'very_low', 'extremely_high', 'medium', 'very_low', 'poor'),
      createRule('Rule 15', 'low', 'high', 'very_high', 'extremely_low', 'very_poor'),
      createRule('Rule 16', 'extremely_low', 'medium', 'extremely_high', 'medium', 'fair'),
      createRule('Rule 17', 'medium', 'extremely_low', 'high', 'extremely_high', 'fair'),
      createRule('Rule 18', 'high', 'very_low', 'extremely_high', 'high', 'poor'),
      createRule('Rule 19', 'very_high', 'low', 'high', 'very_low', 'very_poor'),
      createRule('Rule 20', 'extremely_high', 'medium', 'low', 'extremely_low', 'extremely_poor'),
      createRule('Rule 21', 'very_low', 'very_high', 'extremely_low', 'extremely_high', 'good'),
      createRule('Rule 22', 'low', 'extremely_high', 'very_low', 'high', 'good'),
      createRule('Rule 23', 'medium', 'very_high', 'low', 'medium', 'fair'),
      createRule('Rule 24', 'high', 'extremely_high', 'medium', 'low', 'poor'),
      createRule('Rule 25', 'very_high', 'high', 'extremely_high', 'very_low', 'very_poor')
    ];
  }
}

// Helper to create a rule with the given parameters
function createRule(
  name: string,
  anchorRatio: string,
  transRange: string,
  nodeDensity: string,
  iterations: string,
  output: string,
  weight: number = 1.0
): Rule {
  return {
    id: uuidv4().slice(0, 8),
    name,
    condition: {
      anchorRatio,
      transRange,
      nodeDensity,
      iterations
    },
    output,
    weight
  };
}
 