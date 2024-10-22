// Function to format numbers like TikTok (e.g., 1.5k for 1500, 1M for 1 million)
export const formatNumber = (num: number) => {
  if (num >= 1000 && num < 1000000) {
    return Math.floor(num / 100) / 10 + "K"; // Rounds down to one decimal place
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M"; // Formats numbers in millions
  } else {
    return num.toString(); // For numbers less than 1000
  }
};
