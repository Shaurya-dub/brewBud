const firebaseHandler = async (event) => {
  const config_object = process.env.FIREBASE_CONFIG;

  try {
    return {
      statusCode: 200,
      body: JSON.stringify(config_object),
    };
  } catch (error) {
    const { status, statusText, headers, data } = error.response;
    return {
      statusCode: status,
      body: JSON.stringify({ status, statusText, headers, data }),
    };
  }
};
module.exports = { firebaseHandler };
