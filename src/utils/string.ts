export const convertNumber = (number?: number) => {
  if (number) {
    let formattedNumber = number
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return formattedNumber;
  }
  return "...";
};

export const slowGenerate = (text: string) => {
  let result = "";
  setInterval(() => {
    result += text[result.length];
  }, 10);
  return result;
};
