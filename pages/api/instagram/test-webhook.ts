import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('=== TEST WEBHOOK ENDPOINT ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  
  if (req.method === 'GET') {
    res.status(200).json({
      message: 'Webhook test endpoint is working!',
      timestamp: new Date().toISOString(),
      verifyToken: process.env.INSTAGRAM_VERIFY_TOKEN || 'not_set',
      environment: process.env.NODE_ENV
    });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

