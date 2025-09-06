import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  try {
    console.log('Attempting to connect to MongoDB...');
    
    const client = await clientPromise;
    console.log('Connected to MongoDB client');
    
    const db = client.db();
    console.log('Got database instance:', db.databaseName);
    
    // Test koneksi dengan perintah sederhana
    const pingResult = await db.command({ ping: 1 });
    console.log('Ping result:', pingResult);
    
    // Coba akses koleksi
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    res.status(200).json({
      success: true,
      message: 'MongoDB connection successful',
      data: { 
        database: db.databaseName,
        ping: 'successful',
        collections: collections.map(c => c.name),
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('MongoDB test error:', error);
    
    // Coba koneksi alternatif tanpa opsi SSL
    try {
      console.log('Trying alternative connection without SSL options...');
      const { MongoClient } = require('mongodb');
      const altClient = new MongoClient(process.env.MONGODB_URI);
      await altClient.connect();
      const altDb = altClient.db();
      await altDb.command({ ping: 1 });
      await altClient.close();
      
      return res.status(200).json({
        success: true,
        message: 'MongoDB connection successful (alternative method)',
        data: { 
          database: altDb.databaseName,
          ping: 'successful',
          timestamp: new Date().toISOString()
        }
      });
    } catch (altError) {
      console.error('Alternative connection also failed:', altError);
      
      res.status(500).json({
        success: false,
        message: 'MongoDB connection failed',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        timestamp: new Date().toISOString()
      });
    }
  }
}
