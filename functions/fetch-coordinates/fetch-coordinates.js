// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const axios = require("axios");
const handler = async (event) => {
  // const { lat, long } = event.queryStringParameters;
  // const API_SECRET = "674b218a61a2496bcad8f5d789a636c1";
  // const url = `http://api.weatherstack.com/current?access_key=${API_SECRET}&query=${lat},${long}&forcast_days=4`;
  const { postal_code } = event.queryStringParameters;
  const api_key = process.env.API_KEY;
  const url = `https://api.geocod.io/v1.6/geocode?postal_code=${postal_code}&api_key=${api_key}`;

  try {
    const { data } = await axios.get(url);
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    const { status, statusText, headers, data } = error.response;
    return {
      statusCode: status,
      body: JSON.stringify({ status, statusText, headers, data }),
    };
  }
};

module.exports = { handler };
