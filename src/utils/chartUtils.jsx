export function fillMissingStates(stateCounts, allStates) {
    return allStates.map(st => ({
      name: st,
      value: stateCounts[st] || 0,
    }));
  }
  
  export function fillMissingSeverities(sevCounts, allSeverities) {
    return allSeverities.map(sv => ({
      name: sv,
      value: sevCounts[sv] || 0,
    }));
  }
  