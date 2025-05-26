export const parseDataBMI = (data) => {
  const regex = /({[^}]+})/g;
  const matches = data.match(regex);

  let result = null;

  if (matches && matches.length === 2) {
    try {
      const patient = JSON.parse(matches[0]);
      const data_bmi = JSON.parse(matches[1]);

      result = {
        ...patient,
        ...data_bmi,
      };

      console.log("✅ Parsed patient:", patient);
      console.log("✅ Parsed data_bmi:", data_bmi);
    } catch (error) {
      console.error("❌ JSON parsing failed:", error.message);
    }
  } else {
    console.error("❌ Failed to extract two JSON objects from string.");
  }

  return result;
};
