export  interface MembershipFunction {
  type: 'triangle' | 'trapezoid' | 'gaussian' | 'sigmoid';
  parameters: number[];
}

export interface MembershipRange {
  name: string;
  start: number;
  peak?: number;
  end: number;
}

export interface FuzzyVariable {
  name: string;
  ranges: MembershipRange[];
}

export interface CustomRanges {
  [key: string]: MembershipRange[];
}

export interface MembershipSettings {
  functionType: 'triangle' | 'trapezoid' | 'gaussian' | 'sigmoid';
  setCount: 3 | 5 | 7;
  ranges: {
    anchorRatio: MembershipRange[];
    transRange: MembershipRange[];
    nodeDensity: MembershipRange[];
    iterations: MembershipRange[];
  };
}

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

// Calculate membership value based on function type and parameters
function calculateMembership(
  x: number, 
  type: 'triangle' | 'trapezoid' | 'gaussian' | 'sigmoid',
  range: MembershipRange
): number {
  const { start, end, peak } = range;
  
  // Handle out of range values
  if (x < start || x > end) return 0;
  
  switch (type) {
    case 'triangle':
      if (peak === undefined) {
        const calculatedPeak = (start + end) / 2;
        if (x === calculatedPeak) return 1;
        if (x < calculatedPeak) return (x - start) / (calculatedPeak - start);
        return (end - x) / (end - calculatedPeak);
      } else {
        if (x === peak) return 1;
        if (x < peak) return (x - start) / (peak - start);
        return (end - x) / (end - peak);
      }
      
    case 'trapezoid':
      // For trapezoid, we'll treat peak as the start of flat top
      // and calculate end of flat top
      if (peak === undefined) {
        const firstThird = start + (end - start) / 3;
        const secondThird = end - (end - start) / 3;
        
        if (x >= firstThird && x <= secondThird) return 1;
        if (x < firstThird) return (x - start) / (firstThird - start);
        return (end - x) / (end - secondThird);
      } else {
        const flatEnd = peak + (end - peak) / 2;
        
        if (x >= peak && x <= flatEnd) return 1;
        if (x < peak) return (x - start) / (peak - start);
        return (end - x) / (end - flatEnd);
      }
      
    case 'gaussian':
      if (peak === undefined) {
        const calculatedPeak = (start + end) / 2;
        const sigma = (end - start) / 6; // 3 sigma in each direction
        return Math.exp(-Math.pow(x - calculatedPeak, 2) / (2 * Math.pow(sigma, 2)));
      } else {
        const sigma = Math.max(peak - start, end - peak) / 3;
        return Math.exp(-Math.pow(x - peak, 2) / (2 * Math.pow(sigma, 2)));
      }
      
    case 'sigmoid':
      const midpoint = (start + end) / 2;
      const scale = 10 / (end - start); // Controls steepness
      return 1 / (1 + Math.exp(-scale * (x - midpoint)));
      
    default:
      return 0;
  }
}

// Fuzzify a crisp input value
export function fuzzify(
  value: number,
  ranges: MembershipRange[],
  functionType: 'triangle' | 'trapezoid' | 'gaussian' | 'sigmoid'
): Record<string, number> {
  const result: Record<string, number> = {};
  
  for (const range of ranges) {
    result[range.name] = calculateMembership(value, functionType, range);
  }
  
  return result;
}

// Apply a fuzzy rule and get activation strength
export function applyRule(
  rule: Rule,
  fuzzifiedInputs: {
    anchorRatio: Record<string, number>;
    transRange: Record<string, number>;
    nodeDensity: Record<string, number>;
    iterations: Record<string, number>;
  }
): { output: string; strength: number } {
  // Get membership values for each input
  const anchorRatioValue = fuzzifiedInputs.anchorRatio[rule.condition.anchorRatio] || 0;
  const transRangeValue = fuzzifiedInputs.transRange[rule.condition.transRange] || 0;
  const nodeDensityValue = fuzzifiedInputs.nodeDensity[rule.condition.nodeDensity] || 0;
  const iterationsValue = fuzzifiedInputs.iterations[rule.condition.iterations] || 0;
  
  // Calculate strength using min operator (AND logic)
  const strength = Math.min(
    anchorRatioValue,
    transRangeValue,
    nodeDensityValue,
    iterationsValue
  ) * rule.weight;
  
  return {
    output: rule.output,
    strength
  };
}

// Aggregate rule outputs for defuzzification
export function aggregateOutputs(
  ruleActivations: { output: string; strength: number }[]
): Record<string, number> {
  const aggregated: Record<string, number> = {};
  
  for (const activation of ruleActivations) {
    const { output, strength } = activation;
    
    // Use max operator for aggregation
    if (!aggregated[output] || strength > aggregated[output]) {
      aggregated[output] = strength;
    }
  }
  
  return aggregated;
}

// Defuzzify using centroid method
export function defuzzify(
  aggregatedOutputs: Record<string, number>,
  outputRanges: { [key: string]: number }
): number {
  let numerator = 0;
  let denominator = 0;
  
  for (const [output, strength] of Object.entries(aggregatedOutputs)) {
    const value = outputRanges[output] || 0;
    numerator += value * strength;
    denominator += strength;
  }
  
  if (denominator === 0) {
    // Fallback to linear method or default value
    return 0.8;
  }
  
  return numerator / denominator;
}

// Full fuzzy inference
export function fuzzyInference(
  inputs: {
    anchorRatio: number;
    transRange: number;
    nodeDensity: number;
    iterations: number;
  },
  rules: Rule[],
  settings: MembershipSettings
): {
  result: number;
  activations: { ruleName: string; strength: number; output: string }[];
  membershipValues: { anchorRatio: Record<string, number>; transRange: Record<string, number>; nodeDensity: Record<string, number>; iterations: Record<string, number> };
} {
  // Step 1: Fuzzify inputs
  const fuzzifiedInputs = {
    anchorRatio: fuzzify(inputs.anchorRatio, settings.ranges.anchorRatio, settings.functionType),
    transRange: fuzzify(inputs.transRange, settings.ranges.transRange, settings.functionType),
    nodeDensity: fuzzify(inputs.nodeDensity, settings.ranges.nodeDensity, settings.functionType),
    iterations: fuzzify(inputs.iterations, settings.ranges.iterations, settings.functionType)
  };
  
  // Step 2: Apply rules
  const activations = rules.map(rule => {
    const activation = applyRule(rule, fuzzifiedInputs);
    return {
      ruleName: rule.name,
      strength: activation.strength,
      output: activation.output
    };
  });
  
  // Step 3: Aggregate outputs
  const aggregatedOutputs = aggregateOutputs(
    activations.map(a => ({ output: a.output, strength: a.strength }))
  );
  
  // Step 4: Defuzzify
  // Map output linguistic values to numeric values (optimized based on requirements)
  const outputValues: { [key: string]: number } = {
    excellent: 0.2,
    very_good: 0.4,
    good: 0.6,
    fair: 0.9,
    poor: 1.2,
    very_poor: 1.5,
    extremely_poor: 1.8
  };
  
  const result = defuzzify(aggregatedOutputs, outputValues);
  
  return {
    result,
    activations,
    membershipValues: fuzzifiedInputs
  };
}

// Evaluate model against a dataset
export function evaluateModel(
  data: any[], 
  rules: Rule[],
  settings: MembershipSettings
): {
  results: { actual: number; predicted: number; error: number }[];
  mae: number;
  rmse: number;
  accuracy: number;
} {
  const results = data.map(item => {
    const prediction = fuzzyInference(
      {
        anchorRatio: item.anchor_ratio,
        transRange: item.trans_range,
        nodeDensity: item.node_density,
        iterations: item.iterations
      },
      rules,
      settings
    );
    
    return {
      actual: item.ale,
      predicted: prediction.result,
      error: Math.abs(item.ale - prediction.result)
    };
  });
  
  const mae = results.reduce((sum, r) => sum + r.error, 0) / results.length;
  const rmse = Math.sqrt(results.reduce((sum, r) => sum + Math.pow(r.error, 2), 0) / results.length);
  const accuracy = (results.filter(r => r.error < 0.3).length / results.length) * 100;
  
  return {
    results,
    mae,
    rmse,
    accuracy
  };
}

// Optimize model parameters using advanced techniques
export function optimizeModel(
  data: any[],
  rules: Rule[],
  settings: MembershipSettings,
  options: {
    iterations: number;
    useParticleSwarm: boolean;
    optimizeRanges: boolean;
    optimizeRules: boolean;
  }
): {
  bestParameters: {
    rules: Rule[];
    settings: MembershipSettings;
  };
  performance: {
    mae: number;
    rmse: number;
    accuracy: number;
  };
} {
  // Initial evaluation
  let bestRules = JSON.parse(JSON.stringify(rules));
  let bestSettings = JSON.parse(JSON.stringify(settings));
  let bestPerformance = evaluateModel(data, rules, settings);
  
  if (options.useParticleSwarm) {
    // Particle Swarm Optimization (simplified version)
    const numParticles = Math.min(20, options.iterations / 5);
    const maxVelocity = 0.2;
    
    // Create initial particles
    const particles = Array.from({ length: numParticles }, () => ({
      position: {
        rules: JSON.parse(JSON.stringify(rules)),
        settings: JSON.parse(JSON.stringify(settings))
      },
      velocity: {
        ranges: Array.from({ length: 4 }, () => 
          Array.from({ length: settings.ranges.anchorRatio.length }, () => 
            ({ start: Math.random() * maxVelocity - maxVelocity/2, peak: Math.random() * maxVelocity - maxVelocity/2, end: Math.random() * maxVelocity - maxVelocity/2 })
          )
        ),
        weights: Array.from({ length: rules.length }, () => Math.random() * maxVelocity - maxVelocity/2)
      },
      bestPosition: {
        rules: JSON.parse(JSON.stringify(rules)),
        settings: JSON.parse(JSON.stringify(settings))
      },
      bestScore: bestPerformance.mae
    }));
    
    // PSO constants
    const w = 0.7;  // Inertia
    const c1 = 1.5; // Cognitive coefficient
    const c2 = 1.5; // Social coefficient
    
    // Run PSO iterations
    for (let i = 0; i < options.iterations; i++) {
      // Update each particle
      particles.forEach(particle => {
        // Update position based on velocity
        if (options.optimizeRanges) {
          // Update range boundaries
          ['anchorRatio', 'transRange', 'nodeDensity', 'iterations'].forEach((param, paramIdx) => {
            particle.position.settings.ranges[param].forEach((range, rangeIdx) => {
              // Only adjust start/end within limits to maintain valid ranges
              if (rangeIdx > 0) { // Not the first range
                range.start += particle.velocity.ranges[paramIdx][rangeIdx].start;
                range.start = Math.max(0, range.start);
              }
              
              if (rangeIdx < particle.position.settings.ranges[param].length - 1) { // Not the last range
                range.end += particle.velocity.ranges[paramIdx][rangeIdx].end;
                range.end = Math.max(range.start + 1, range.end);
              }
              
              if (range.peak !== undefined) {
                range.peak += particle.velocity.ranges[paramIdx][rangeIdx].peak;
                range.peak = Math.min(Math.max(range.start, range.peak), range.end);
              }
              
              // Ensure adjacent ranges connect properly
              if (rangeIdx > 0) {
                const prevRange = particle.position.settings.ranges[param][rangeIdx - 1];
                prevRange.end = range.start;
              }
            });
          });
        }
        
        if (options.optimizeRules) {
          // Update rule weights
          particle.position.rules.forEach((rule, ruleIdx) => {
            rule.weight += particle.velocity.weights[ruleIdx];
            rule.weight = Math.min(Math.max(0.1, rule.weight), 1.0);
          });
        }
        
        // Evaluate new position
        const performance = evaluateModel(data, particle.position.rules, particle.position.settings);
        
        // Update personal best
        if (performance.mae < particle.bestScore) {
          particle.bestPosition = JSON.parse(JSON.stringify(particle.position));
          particle.bestScore = performance.mae;
          
          // Update global best
          if (performance.mae < bestPerformance.mae) {
            bestRules = JSON.parse(JSON.stringify(particle.position.rules));
            bestSettings = JSON.parse(JSON.stringify(particle.position.settings));
            bestPerformance = performance;
          }
        }
        
        // Update velocity
        if (options.optimizeRanges) {
          ['anchorRatio', 'transRange', 'nodeDensity', 'iterations'].forEach((param, paramIdx) => {
            particle.position.settings.ranges[param].forEach((range, rangeIdx) => {
              const r1 = Math.random();
              const r2 = Math.random();
              
              // Start velocity
              if (rangeIdx > 0) {
                particle.velocity.ranges[paramIdx][rangeIdx].start = 
                  w * particle.velocity.ranges[paramIdx][rangeIdx].start +
                  c1 * r1 * (particle.bestPosition.settings.ranges[param][rangeIdx].start - range.start) +
                  c2 * r2 * (bestSettings.ranges[param][rangeIdx].start - range.start);
              }
              
              // End velocity
              if (rangeIdx < particle.position.settings.ranges[param].length - 1) {
                particle.velocity.ranges[paramIdx][rangeIdx].end = 
                  w * particle.velocity.ranges[paramIdx][rangeIdx].end +
                  c1 * r1 * (particle.bestPosition.settings.ranges[param][rangeIdx].end - range.end) +
                  c2 * r2 * (bestSettings.ranges[param][rangeIdx].end - range.end);
              }
              
              // Peak velocity
              if (range.peak !== undefined) {
                particle.velocity.ranges[paramIdx][rangeIdx].peak = 
                  w * particle.velocity.ranges[paramIdx][rangeIdx].peak +
                  c1 * r1 * (particle.bestPosition.settings.ranges[param][rangeIdx].peak! - range.peak) +
                  c2 * r2 * (bestSettings.ranges[param][rangeIdx].peak! - range.peak);
              }
              
              // Limit velocity
              particle.velocity.ranges[paramIdx][rangeIdx].start = Math.max(-maxVelocity, Math.min(maxVelocity, particle.velocity.ranges[paramIdx][rangeIdx].start));
              particle.velocity.ranges[paramIdx][rangeIdx].end = Math.max(-maxVelocity, Math.min(maxVelocity, particle.velocity.ranges[paramIdx][rangeIdx].end));
              if (range.peak !== undefined) {
                particle.velocity.ranges[paramIdx][rangeIdx].peak = Math.max(-maxVelocity, Math.min(maxVelocity, particle.velocity.ranges[paramIdx][rangeIdx].peak!));
              }
            });
          });
        }
        
        if (options.optimizeRules) {
          particle.position.rules.forEach((rule, ruleIdx) => {
            const r1 = Math.random();
            const r2 = Math.random();
            
            particle.velocity.weights[ruleIdx] = 
              w * particle.velocity.weights[ruleIdx] +
              c1 * r1 * (particle.bestPosition.rules[ruleIdx].weight - rule.weight) +
              c2 * r2 * (bestRules[ruleIdx].weight - rule.weight);
            
            // Limit velocity
            particle.velocity.weights[ruleIdx] = Math.max(-maxVelocity, Math.min(maxVelocity, particle.velocity.weights[ruleIdx]));
          });
        }
      });
    }
  } else {
    // Grid Search (simplified)
    for (let i = 0; i < options.iterations; i++) {
      const newSettings = JSON.parse(JSON.stringify(settings));
      const newRules = JSON.parse(JSON.stringify(rules));
      
      if (options.optimizeRanges) {
        // Randomly adjust range boundaries
        for (const paramName of ['anchorRatio', 'transRange', 'nodeDensity', 'iterations'] as const) {
          for (let j = 0; j < newSettings.ranges[paramName].length; j++) {
            const range = newSettings.ranges[paramName][j];
            
            // Random adjustments within reasonable limits
            if (j > 0) { // Not the first range
              range.start += (Math.random() - 0.5) * 5; // Random adjustment ±2.5
            }
            
            if (j < newSettings.ranges[paramName].length - 1) { // Not the last range
              range.end += (Math.random() - 0.5) * 5;
            }
            
            if (range.peak !== undefined) {
              range.peak = Math.min(Math.max(range.start, range.peak + (Math.random() - 0.5) * 5), range.end);
            }
            
            // Ensure ranges remain valid
            range.start = Math.max(0, range.start);
            range.end = Math.max(range.start + 1, range.end);
            
            // Ensure adjacent ranges connect properly
            if (j > 0) {
              const prevRange = newSettings.ranges[paramName][j - 1];
              prevRange.end = range.start;
            }
          }
        }
      }
      
      if (options.optimizeRules) {
        // Randomly adjust rule weights
        for (let j = 0; j < newRules.length; j++) {
          newRules[j].weight += (Math.random() - 0.5) * 0.2; // Random adjustment ±0.1
          newRules[j].weight = Math.min(Math.max(0.1, newRules[j].weight), 1.0);
        }
      }
      
      // Evaluate the new model
      const performance = evaluateModel(data, newRules, newSettings);
      
      // Keep the best model
      if (performance.mae < bestPerformance.mae) {
        bestRules = newRules;
        bestSettings = newSettings;
        bestPerformance = performance;
      }
    }
  }
  
  return {
    bestParameters: {
      rules: bestRules,
      settings: bestSettings
    },
    performance: {
      mae: bestPerformance.mae,
      rmse: bestPerformance.rmse,
      accuracy: bestPerformance.accuracy
    }
  };
}
 