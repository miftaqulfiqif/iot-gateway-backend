export const generateAge = (patient_date_of_birth) => {
  const today = new Date();
  const birthDate = new Date(patient_date_of_birth);

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  // Jika tanggal hari ini lebih kecil dari tanggal lahir, kurangi 1 bulan
  if (days < 0) {
    months--;
  }

  // Jika bulan negatif, kurangi 1 tahun dan tambahkan 12 bulan
  if (months < 0) {
    years--;
    months += 12;
  }

  // Total umur dalam bulan
  const totalMonths = years * 12 + months;

  return {
    years,
    months,
    total_months: totalMonths,
  };
};
