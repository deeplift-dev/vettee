/**
 * Calculates the current age based on the year of birth provided.
 * @param {number} yearOfBirth - The year of birth.
 * @returns {number} The calculated age.
 */
const calculateAgeFromYearOfBirth = (yearOfBirth: number): number => {
  const currentYear = new Date().getFullYear();
  return currentYear - yearOfBirth;
};

export { calculateAgeFromYearOfBirth };
