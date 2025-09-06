import clientPromise from '../../../lib/mongodb';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  // Log untuk debugging
  console.log('Register endpoint called with method:', req.method);
  
  // Cek method request
  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  try {
    const { name, email, password } = req.body;
    console.log('Registration attempt for:', email);

    // Validasi input
    if (!name || !email || !password) {
      console.log('Missing required fields');
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (password.length < 6) {
      console.log('Password too short');
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    console.log('Attempting to connect to MongoDB...');
    const client = await clientPromise;
    console.log('Connected to MongoDB successfully');
    
    // Pastikan database ada, jika tidak buat database
    const db = client.db();
    console.log('Using database:', db.databaseName);
    
    const usersCollection = db.collection('users');
    console.log('Using collection: users');

    // Check if user already exists
    console.log('Checking if user already exists...');
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully');

    // Create user
    console.log('Creating user...');
    const result = await usersCollection.insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });
    console.log('User created successfully:', result.insertedId);

    // Return user data without password
    const user = {
      id: result.insertedId,
      name,
      email,
    };

    console.log('Registration successful for:', email);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user,
    });
  } catch (error) {
    console.error('Registration error:', error);
    
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
      message: 'Server error during registration',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? errorDetails : undefined
    });
  }
}
