import clientPromise from "../../../lib/mongodb";
import { hashPassword, signToken } from "../../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await hashPassword(password);

    const result = await users.insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    const token = signToken({
      id: result.insertedId,
      name,
      email,
    });

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: { id: result.insertedId, name, email },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
