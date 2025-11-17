export default async function handler(req, res) {
  // Enable CORS for all origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { action, query } = req.body;
    
    // Your Zapier webhook URL - we'll add this in Vercel environment variables
    const ZAPIER_URL = process.env.ZAPIER_WEBHOOK_URL;
    
    if (!ZAPIER_URL) {
      return res.status(500).json({ error: 'Zapier URL not configured' });
    }
    
    // Call Zapier
    const zapierResponse = await fetch(ZAPIER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, query })
    });
    
    const data = await zapierResponse.json();
    
    // Return the data to your form
    return res.status(200).json(data);
    
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
