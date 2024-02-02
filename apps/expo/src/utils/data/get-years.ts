interface YearOption {
  label: string;
  value: string;
}

const getYears = (): YearOption[] => {
  const currentYear = new Date().getFullYear();
  const years: YearOption[] = [];
  for (let i = currentYear; i >= 1800; i--) {
    years.push({ label: i.toString(), value: i.toString() });
  }
  return years;
};

export default getYears;
