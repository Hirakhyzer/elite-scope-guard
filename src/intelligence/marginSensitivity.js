export function marginSensitivity(price, cost, overruns = [0, .05, .1, .2]) {
  return overruns.map((overrun) => {
    const stressedCost = cost * (1 + overrun);
    const margin = price ? (price - stressedCost) / price * 100 : 0;
    return { overrun, stressedCost, margin, protected: margin >= 28 };
  });
}
