import clientPromise from '../../../lib/mongodb';
import { verifyToken } from '../../../lib/auth';

export default async function handler(req, res) {
  try {
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
    const users = db.collection('users');

    const { name, email } = req.body;

    // Update user
    const result = await users.findOneAndUpdate(
      { _id: require('mongodb').ObjectId(decoded.id) },
      { $set: { name, email } },
      { returnDocument: true }
    );

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: result._id.toString(),
        name: result.name,
        email: result.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
