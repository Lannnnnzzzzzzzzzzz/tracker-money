import clientPromise from '../../../lib/mongodb';
import { verifyToken } from '../../../lib/auth';

export default async function handler(req, res) {
  try {
    // Verify token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const client = await clientPromise;
    const db = client.db();
    const transactions = db.collection('transactions');

    if (req.method === 'GET') {
      // Get user's transactions only
      const result = await transactions.find({ userId: decoded.id }).toArray();
      res.status(200).json(result);
    } else if (req.method === 'POST') {
      const { type, amount, category, date, note } = req.body;
      const result = await transactions.insertOne({
        userId: decoded.id,
        type,
        amount: parseFloat(amount),
        category,
        date: new Date(date),
        note
      });
      res.status(201).json(result);
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
