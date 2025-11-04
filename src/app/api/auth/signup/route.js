import { jsonOk, jsonError } from '@/lib/responses';
import { getConnection } from '@/lib/db';
import bcrypt from 'bcrypt';

export async function POST(request) {
  try {
    const { username, email, password } = await request.json();

    // --- Validation ---
    // Username validation
    if (!username || username.length < 3 || username.length > 50) {
      return jsonError('Username must be between 3 and 50 characters.', 422);
    }
    if (!/^[a-zA-Z][a-zA-Z0-9_]+$/.test(username)) {
      return jsonError('Username must start with a letter and can only contain letters, numbers, or underscores.', 422);
    }

    // Email validation
    if (!email || email.length > 50) {
      return jsonError('Email must be a maximum of 50 characters.', 422);
    }
    if (!email.includes('@') || !email.includes('.')) {
      return jsonError('Please enter a valid email address.', 422);
    }

    // Password validation
    if (!password || password.length < 8 || password.length > 20) {
      return jsonError('Password must be between 8 and 20 characters.', 422);
    }
    if (!/[a-z]/.test(password)) {
      return jsonError('Password must include at least one lowercase letter.', 422);
    }
    if (!/[A-Z]/.test(password)) {
      return jsonError('Password must include at least one uppercase letter.', 422);
    }
    if (!/[0-9]/.test(password)) {
      return jsonError('Password must include at least one number.', 422);
    }
    if (!/^[a-zA-Z0-9!@#$%^&*]*$/.test(password)) {
      return jsonError('Password contains invalid characters. Can optionally include !@#$%^&*', 422);
    }

    // --- DB connect ---
    const db = await getConnection();

    // --- Uniqueness checks ---
    // DB has UNIQUE(email); username is not unique in schema, but we check for nicer UX.
    const [emailRows] = await db.query('SELECT user_id FROM users WHERE email = ?', [email]);
    if (emailRows.length) return jsonError('Email is already registered.', 409);

    const [userRows] = await db.query('SELECT user_id FROM users WHERE username = ?', [username]);
    if (userRows.length) return jsonError('Username is already taken.', 409);

    // --- Hash password & insert ---
    const hash = await bcrypt.hash(password, 10); // cost factor 10 is fine to start
    const [result] = await db.query(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, hash]
    );

    const user_id = result.insertId;

    // (Optional) Auto-login here by issuing JWT and returning { token, user }.
    // For now we just confirm creation:
    return jsonOk(
      {
        message: 'User registered',
        user: { user_id, username, email, role: 'User' }
      },
      { status: 201 }
    );

  } catch (error) {
    // Handle duplicate race condition just in case (DB-level)
    if (error && error.code === 'ER_DUP_ENTRY') {
      return jsonError('Email is already registered.', 409);
    }
    if (error instanceof SyntaxError) {
      return jsonError('Invalid JSON in request body.', 400);
    }
    console.error('Signup API Error:', error);
    return jsonError('An unexpected error occurred.', 500);
  }
}
