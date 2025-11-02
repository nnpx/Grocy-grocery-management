// src/app/api/auth/login/route.js
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { jsonOk, jsonError } from '@/lib/responses';
import { getConnection } from '@/lib/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // --- Basic validation ---
    if (!email || email.length > 50 || !email.includes('@')) {
      return jsonError('Invalid email or password.', 401);
    }
    if (!password || password.length < 8 || password.length > 20) {
      return jsonError('Invalid email or password.', 401);
    }

    const db = await getConnection();

    // --- 1. Find user by email ---
    const [rows] = await db.query(
      'SELECT user_id, username, email, password_hash, role FROM users WHERE email = ? LIMIT 1',
      [email]
    );

    if (!rows.length) {
      return jsonError('Invalid email or password.', 401);
    }

    const user = rows[0];

    // --- 2. Compare password ---
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return jsonError('Invalid email or password.', 401);
    }

    // --- 3. Create JWT ---
    const token = jwt.sign(
      {
        user_id: user.user_id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // --- 4. Respond with token + user info ---
    return jsonOk({
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    if (error instanceof SyntaxError) {
      return jsonError('Invalid JSON in request body.', 400);
    }
    console.error('Login API Error:', error);
    return jsonError('An unexpected error occurred.', 500);
  }
}
