export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    const { code } = req.query;
    
    if (!code) {
        return res.status(400).json({ error: 'No code provided' });
    }
    
    const CLIENT_ID = '1494268332336222378';
    const CLIENT_SECRET = 'VLYIl_i-AD5C7FBdKIQM64tNUGrPV49N';
    // IMPORTANT: Use the EXACT same URL as in Discord
    const REDIRECT_URI = 'https://esdashboard-3s89i57ab-nexustechnologies.vercel.app';
    
    try {
        // Exchange code for token
        const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: REDIRECT_URI
            })
        });
        
        const tokenData = await tokenResponse.json();
        
        if (!tokenData.access_token) {
            return res.status(400).json({ error: 'Failed to get access token' });
        }
        
        // Get user info
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
