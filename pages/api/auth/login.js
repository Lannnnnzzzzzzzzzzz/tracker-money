import clientPromise from '../../../lib/mongodb';
import { comparePassword, signToken } from '../../../lib/auth';

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const users = db.collection('users');

    const { email, password } = req.body;

    // Find user
    const user = await users.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Create token
    const token = signToken({
      id: user._id.toString(),
      name: user.name,
      email: user.email
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
