const axios = require('axios');

async function getExchangeRate(fromCurrency, toCurrency) {
  if (fromCurrency === toCurrency) return 1;
  
  try {
    // Using Frankfurter free API
    const response = await axios.get(`https://api.frankfurter.app/latest?from=${fromCurrency}&to=${toCurrency}`);
    return response.data.rates[toCurrency];
  } catch (error) {
    console.error('Error fetching exchange rate:', error.message);
    // Fallback: If API fails, return 1 (Not ideal for production, but prevents crashes)
    return 1;
  }
}

module.exports = { getExchangeRate };
