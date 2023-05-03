import { Loader } from "@googlemaps/js-api-loader";

const handler = async (event) => {
  const api_key = process.env.MAPS_KEY;
 const loader = new Loader({
   apiKey: api_key,
   version: "weekly",
   libraries: ["places", "maps"],
 });
 const initLoader = await loader.load()
  try {
    return {
      statusCode: 200,
      body: JSON.stringify(initLoader),
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
