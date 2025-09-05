import clientPromise from '../../../lib/mongodb';
import { hashPassword, signToken } from '../../../lib/auth';

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const users = db.collection('users');

    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const result = await users.insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date()
    });

    // Create token
    const token = signToken({
      id: result.insertedId,
      name,
      email
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: result.insertedId,
        name,
        email
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
