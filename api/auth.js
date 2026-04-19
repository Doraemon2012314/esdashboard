exports.handler = async (event, context) => {
    // Enable CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
    };
    
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }
    
    const { code } = event.queryStringParameters || {};
    
    if (!code) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'No code provided' })
        };
    }
    
    const CLIENT_ID = '1494268332336222378';
    const CLIENT_SECRET = 'VLYIl_i-AD5C7FBdKIQM64tNUGrPV49N';
    const REDIRECT_URI = 'https://esmoddashboard.netlify.app/';
    
    try {
        const params = new URLSearchParams({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: REDIRECT_URI
        });
        
        const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params
        });
        
        const tokenData = await tokenResponse.json();
        
        if (!tokenData.access_token) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Failed to get access token', discord_error: tokenData })
            };
        }
        
        const userResponse = await fetch('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` }
        });
        
        const userData = await userResponse.json();
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ user: userData })
        };
        
    } catch (error) {
        console.error('OAuth error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error', message: error.message })
        };
    }
};
