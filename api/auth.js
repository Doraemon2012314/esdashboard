export default async function handler(req, res) {
    const { code } = req.query;
    
    if (!code) {
        return res.status(400).json({ error: 'No code provided' });
    }
    
    const CLIENT_ID = '1494268332336222378';
    const CLIENT_SECRET = 'VLYIl_i-AD5C7FBdKIQM64tNUGrPV49N';
    // MUST MATCH DISCORD EXACTLY
    const REDIRECT_URI = 'https://esdashboard-f70c3p6d1-nexustechnologies.vercel.app';
    
    try {
        const params = new URLSearchParams({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: REDIRECT_URI
        });
        
        console.log('Sending request to Discord with:', params.toString());
        
        const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        });
        
        const tokenData = await tokenResponse.json();
        
        console.log('Discord response:', tokenData);
        
        if (!tokenData.access_token) {
            return res.status(400).json({ error: 'Failed to get access token', discord_error: tokenData });
        }
        
        const userResponse = await fetch('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` }
        });
        
        const userData = await userResponse.json();
        
        return res.status(200).json({ user: userData });
        
    } catch (error) {
        console.error('OAuth error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
