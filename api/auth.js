// This is a simple test function to verify Netlify is working correctly
exports.handler = async (event, context) => {
  // Get the 'code' from the URL's query string, e.g., ?code=123
  const { code } = event.queryStringParameters || {};

  // Return a simple JSON response
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*', // Allow your dashboard to call it
    },
    body: JSON.stringify({
      message: '✅ Netlify function is working correctly!',
      yourCode: code || 'No code was provided in the URL.',
      tip: 'If you see this message, your API route is fixed.'
    })
  };
};
