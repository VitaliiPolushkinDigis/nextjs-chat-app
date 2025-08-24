import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('=== WEBHOOK REQUEST RECEIVED ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Query params:', req.query);
  console.log('Headers:', req.headers);
  
  if (req.method === 'GET') {
    // Webhook verification (Instagram sends this to verify your endpoint)
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    console.log('=== WEBHOOK VERIFICATION ===');
    console.log('Mode:', mode);
    console.log('Token from request:', token);
    console.log('Challenge:', challenge);

    // Your verify token (set this in Instagram app settings)
    const verifyToken = process.env.INSTAGRAM_VERIFY_TOKEN || 'your_verify_token_here';
    console.log('Expected verify token:', verifyToken);
    console.log('Tokens match?', token === verifyToken);
    
    if (mode === 'subscribe' && token === verifyToken) {
      console.log('✅ Webhook verified successfully');
      console.log('Sending challenge response:', challenge);
      res.status(200).send(challenge);
    } else {
      console.log('❌ Webhook verification failed');
      console.log('Mode check:', mode === 'subscribe');
      console.log('Token check:', token === verifyToken);
      res.status(403).send('Forbidden');
    }
  } else if (req.method === 'POST') {
    // Handle incoming webhook data
    const body = req.body;
    console.log('Webhook received:', body);
    
    // Process the webhook data here
    // You can handle messages, comments, etc.
    
    res.status(200).send('OK');
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
