import clientPromise from '../../../lib/mongodb';
import { OpenAI } from 'openai';
import { verifyToken } from '../../../lib/auth';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE || 'https://openrouter.ai/api/v1',
});

export default async function handler(req, res) {
  try {
    // Verify token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { command } = req.body;
    const userId = decoded.id;

    // Process command with OpenAI
    const prompt = `
      Anda adalah asisten keuangan. Analisis perintah pengguna dan ekstrak informasi transaksi.
      
      Perintah pengguna: "${command}"
      
      Ekstrak informasi berikut:
      1. type: "income" jika ini pemasukan, "expense" jika pengeluaran
      2. amount: jumlah uang dalam angka (tanpa titik atau koma)
      3. category: kategori transaksi (pilih dari: Makanan & Minuman, Transportasi, Belanja, Hiburan, Kesehatan, Pendidikan, Tagihan, Lainnya)
      4. note: catatan singkat tentang transaksi
      
      Jika tidak ada kategori yang jelas, gunakan "Lainnya".
      Jika tidak ada catatan yang jelas, buat catatan singkat yang sesuai.
      
      Respon harus dalam format JSON saja seperti ini:
      {
        "type": "income/expense",
        "amount": 30000,
        "category": "Kategori",
        "note": "Catatan"
      }
    `;

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
    });

    const text = completion.choices[0].message.content;

    // Parse JSON from OpenAI response
    let transactionData;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        transactionData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No valid JSON found in response');
      }
    } catch (parseError) {
      return res.status(400).json({ error: 'Gagal memproses perintah. Silakan coba lagi dengan perintah yang lebih jelas.' });
    }

    // Validate transaction data
    if (!transactionData.type || !transactionData.amount || !transactionData.category) {
      return res.status(400).json({ error: 'Data transaksi tidak lengkap. Pastikan perintah Anda jelas.' });
    }

    // Connect to MongoDB and save transaction
    const client = await clientPromise;
    const db = client.db();
    const transactions = db.collection('transactions');

    const result = await transactions.insertOne({
      userId, // Add userId for multi-tenant
      type: transactionData.type,
      amount: parseFloat(transactionData.amount),
      category: transactionData.category,
      date: new Date(),
      note: transactionData.note || ''
    });

    res.status(201).json({ 
      success: true, 
      transaction: {
        _id: result.insertedId,
        ...transactionData
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
