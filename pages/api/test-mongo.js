import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  try {
    console.log('Attempting to connect to MongoDB...');
    
    const client = await clientPromise;
    console.log('Connected to MongoDB client');
    
    const db = client.db();
    console.log('Got database instance');
    
    // Test koneksi dengan perintah sederhana
    const pingResult = await db.command({ ping: 1 });
    console.log('Ping result:', pingResult);
    
    res.status(200).json({
      success: true,
      message: 'MongoDB connection successful',
      data: { 
        database: db.databaseName,
        ping: 'successful',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('MongoDB test error:', error);
    res.status(500).json({
      success: false,
      message: 'MongoDB connection failed',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
  }
}
