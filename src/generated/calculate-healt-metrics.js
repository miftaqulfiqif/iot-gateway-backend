export function calculateHealthMetrics(data) {
  const { height, age, gender, bmiWeight, impedance } = data;

  const heightM = height / 100;

  const isMale = gender.toLowerCase() === "male";

  const BMI = bmiWeight / (heightM * heightM);

  // Estimasi menggunakan rumus dasar atau pendekatan umum
  const bodyFat = isMale
    ? 1.2 * BMI + 0.23 * age - 16.2
    : 1.2 * BMI + 0.23 * age - 5.4;

  const muscleMass = isMale
    ? bmiWeight * 0.8 - (bodyFat * bmiWeight) / 100
    : bmiWeight * 0.75 - (bodyFat * bmiWeight) / 100;

  const waterPercentage = isMale ? 0.6 : 0.5;
  const water = bmiWeight * waterPercentage;

  const visceralFat = Math.max(1, Math.min(30, bodyFat / 2 - age / 20));

  const boneMass = isMale ? bmiWeight * 0.045 : bmiWeight * 0.035;

  const bmr = isMale
    ? 88.36 + 13.4 * bmiWeight + 4.8 * height - 5.7 * age
    : 447.6 + 9.2 * bmiWeight + 3.1 * height - 4.3 * age;

  const protein = bmiWeight * 0.16; // gram

  const obesity = (bodyFat / 40) * 100; // % estimasi dari max fat 40%
  const bodyAge = age + (BMI - 22) * 0.5;
  const lbm = bmiWeight - (bmiWeight * bodyFat) / 100;

  return {
    weight: bmiWeight,
    age: age,
    bmi: parseFloat(BMI.toFixed(1)),
    weight: parseFloat(bmiWeight.toFixed(1)),
    bmi: parseFloat(BMI.toFixed(1)),
    bodyFat: parseFloat(bodyFat.toFixed(1)),
    muscleMass: parseFloat(muscleMass.toFixed(1)),
    water: parseFloat(water.toFixed(1)),
    visceralFat: parseFloat(visceralFat.toFixed(1)),
    boneMass: parseFloat(boneMass.toFixed(1)),
    metabolism: parseFloat(bmr.toFixed(0)),
    protein: parseFloat(protein.toFixed(1)),
    obesity: parseFloat(obesity.toFixed(1)),
    bodyAge: parseFloat(bodyAge.toFixed(1)),
    lbm: parseFloat(lbm.toFixed(1)),
  };
}
