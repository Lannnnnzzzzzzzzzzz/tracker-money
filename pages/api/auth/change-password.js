import clientPromise from '../../../lib/mongodb';
import { comparePassword, hashPassword, verifyToken } from '../../../lib/auth';

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

    const { currentPassword, newPassword } = req.body;

    // Find user
    const user = await users.findOne({ _id: require('mongodb').ObjectId(decoded.id) });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Verify current password
    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword);

    // Update password
    await users.updateOne(
      { _id: user._id },
      { $set: { password: hashedNewPassword } }
    );

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
