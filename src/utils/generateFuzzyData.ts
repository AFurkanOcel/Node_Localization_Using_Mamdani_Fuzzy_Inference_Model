//  Utility to generate synthetic fuzzy data
export function generateFuzzyData(count: number) {
  const data = [];
  
  for (let i = 0; i < count; i++) {
    // Generate random input values
    const anchorRatio = Math.random() * 50; // 0-50%
    const transRange = Math.random() * 100; // 0-100m
    const nodeDensity = Math.random() * 50; // 0-50/km²
    const iterations = Math.random() * 100; // 0-100
    
    // Calculate ALE based on a simplified model
    // Low anchor ratio and high iterations produce better results
    let ale = 1.8 - 0.02 * anchorRatio - 0.003 * transRange - 0.01 * nodeDensity + 0.015 * iterations;
    
    // Add some noise
    ale += (Math.random() - 0.5) * 0.2;
    
    // Ensure ALE is within reasonable bounds
    ale = Math.max(0.15, Math.min(2.0, ale));
    
    data.push({
      anchor_ratio: Math.round(anchorRatio * 10) / 10,
      trans_range: Math.round(transRange),
      node_density: Math.round(nodeDensity * 10) / 10,
      iterations: Math.round(iterations),
      ale: Math.round(ale * 1000) / 1000
    });
  }
  
  return data;
}
 