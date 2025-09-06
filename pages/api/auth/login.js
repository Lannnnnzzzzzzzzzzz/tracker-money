import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  // Log untuk debugging
  console.log('Login endpoint called with method:', req.method);
  
  // Cek method request
  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    // Validasi input
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Koneksi ke MongoDB
    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri);
    
    console.log('Attempting to connect to MongoDB...');
    await client.connect();
    console.log('Connected to MongoDB successfully');
    
    const db = client.db();
    const usersCollection = db.collection('users');

    // Find user
    console.log('Finding user...');
    const user = await usersCollection.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      await client.close();
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    console.log('Checking password...');
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Invalid password for:', email);
      await client.close();
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    console.log('Creating JWT token...');
    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Close connection
    await client.close();
    console.log('MongoDB connection closed');

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

    console.log('User logged in successfully:', email);
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: userData,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    
    // Tambahkan detail error untuk debugging
    const errorDetails = {
      message: error.message,
      name: error.name,
      stack: error.stack,
      code: error.code,
    };
    
    console.error('Error details:', errorDetails);
    
    res.status(500).json({ 
      success: false,
      message: 'Server error during login',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? errorDetails : undefined
    });
  }
}
