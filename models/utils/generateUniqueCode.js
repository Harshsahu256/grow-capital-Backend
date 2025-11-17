// utils/generateUniqueCode.js

// Function to generate a random 6-digit code
// const generateUniqueCode = () => {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// };

// module.exports = generateUniqueCode;



const generateUniqueCode = () => {
  // 🔹 First 2 letters (A-Z)
  const letters = String.fromCharCode(
    65 + Math.floor(Math.random() * 26), // First letter
    65 + Math.floor(Math.random() * 26)  // Second letter
  );

  // 🔹 6-digit number
  const numbers = Math.floor(100000 + Math.random() * 900000); // 100000–999999

  return `${letters}${numbers}`;
};

console.log(generateUniqueCode()); // Example: "XZ483927"
module.exports = generateUniqueCode;
