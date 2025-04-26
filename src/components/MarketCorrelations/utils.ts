
export const getCorrelationColor = (value: number) => {
  const absValue = Math.abs(value);
  
  if (value > 0) {
    return `rgba(0, 128, 0, ${absValue})`;
  } else {
    return `rgba(220, 53, 69, ${absValue})`;
  }
};

export const getCorrelationDescription = (value: number) => {
  const absValue = Math.abs(value);
  let strength = "No";
  let direction = "correlation";
  
  if (absValue > 0.7) strength = "Strong";
  else if (absValue > 0.4) strength = "Moderate";
  else if (absValue > 0.1) strength = "Weak";
  
  if (value > 0) direction = "positive correlation";
  else if (value < 0) direction = "negative correlation";
  
  return `${strength} ${direction}`;
};
