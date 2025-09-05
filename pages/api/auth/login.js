import clientPromise from '../../../lib/mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    // Validasi input
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');

    // Find user
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set HTTP-only cookie with token
    res.setHeader(
      'Set-Cookie',
      `token=${token}; HttpOnly; Path=/; Max-Age=${
        7 * 24 * 60 * 60
      }; SameSite=Strict;${process.env.NODE_ENV === 'production' ? ' Secure' : ''}`
    );

    // Return user data without password
    const userData = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    };

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: userData,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
