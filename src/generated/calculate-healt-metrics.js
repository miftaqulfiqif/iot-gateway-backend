export function calculateHealthMetrics(data) {
  const { weight, age, gender, bmiWeight, impedance } = data;

  // Asumsi tinggi badan dibutuhkan → misal default 170 cm
  const heightCm = 170;
  const heightM = heightCm / 100;

  const isMale = gender.toLowerCase() === "male";

  const BMI = weight / (heightM * heightM);

  // Estimasi menggunakan rumus dasar atau pendekatan umum
  const bodyFat = isMale
    ? 1.2 * BMI + 0.23 * age - 16.2
    : 1.2 * BMI + 0.23 * age - 5.4;

  const muscleMass = isMale
    ? weight * 0.8 - (bodyFat * weight) / 100
    : weight * 0.75 - (bodyFat * weight) / 100;

  const waterPercentage = isMale ? 0.6 : 0.5;
  const water = weight * waterPercentage;

  const visceralFat = Math.max(1, Math.min(30, bodyFat / 2 - age / 20));

  const boneMass = isMale ? weight * 0.045 : weight * 0.035;

  const bmr = isMale
    ? 88.36 + 13.4 * weight + 4.8 * heightCm - 5.7 * age
    : 447.6 + 9.2 * weight + 3.1 * heightCm - 4.3 * age;

  const protein = weight * 0.16; // gram

  const obesity = (bodyFat / 40) * 100; // % estimasi dari max fat 40%
  const bodyAge = age + (BMI - 22) * 0.5;
  const lbm = weight - (weight * bodyFat) / 100;

  return {
    BMI: BMI.toFixed(1),
    bodyFat: bodyFat.toFixed(1),
    muscleMass: muscleMass.toFixed(1),
    water: water.toFixed(1),
    visceralFat: visceralFat.toFixed(1),
    boneMass: boneMass.toFixed(1),
    metabolism: bmr.toFixed(0),
    protein: protein.toFixed(1),
    obesity: obesity.toFixed(1),
    bodyAge: bodyAge.toFixed(1),
    lbm: lbm.toFixed(1),
  };
}
