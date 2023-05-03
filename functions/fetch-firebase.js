const handler = async (event) => {
  //   const api_key = process.env.FIREBASE_KEY;
  //   const auth_domain = process.env.AUTH_DOMAIN;
  const res_object = JSON.parse(process.env.FIREBASE_CONFIG);
  try {
    return {
      statusCode: 200,
      body: JSON.stringify(res_object),
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
