import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Test koneksi dengan perintah sederhana
    await db.command({ ping: 1 });
    
    res.status(200).json({
      success: true,
      message: 'MongoDB connection successful',
      data: { 
        database: db.databaseName,
        ping: 'successful'
      }
    });
  } catch (error) {
    console.error('MongoDB test error:', error);
    res.status(500).json({
      success: false,
      message: 'MongoDB connection failed',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
