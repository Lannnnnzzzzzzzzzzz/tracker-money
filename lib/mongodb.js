import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;

// Opsi khusus untuk MongoDB Atlas dengan SSL
const options = {
  // Untuk MongoDB Atlas, kita coba beberapa opsi SSL
  ssl: true,
  sslValidate: false, // Nonaktifkan validasi SSL untuk mengatasi error
  tls: true,
  tlsAllowInvalidCertificates: true, // Izinkan sertifikat tidak valid
  tlsAllowInvalidHostnames: true, // Izinkan hostname tidak valid
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
};

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect()
      .catch(err => {
        console.error('MongoDB connection error in development:', err);
        throw err;
      });
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode
  client = new MongoClient(uri, options);
  clientPromise = client.connect()
    .catch(err => {
      console.error('MongoDB connection error in production:', err);
      throw err;
    });
}

export default clientPromise;
