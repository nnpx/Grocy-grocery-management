import { jsonOk, jsonError } from '@/lib/responses';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // --- Basic Validation (placeholder) ---

    // Email validation
    if (!email || email.length > 50 || !email.includes('@')) {
      return jsonError('Invalid credentials', 401);
    }

    // Password validation
    if (!password || password.length < 8 || password.length > 20) {
        return jsonError('Invalid credentials', 401);
    }
    
    // In a real application, you would:
    // 1. Find the user in the database by email.
    // 2. Compare the hashed password using bcrypt.
    // 3. Generate a real JWT if the passwords match.
    // For now, we'll return a mock token.
    // Replace with real bcrypt + JWT in VS Code.
    
    return jsonOk({
        token: "MOCK_TOKEN_ONLY_FOR_WIRING",
        user: { user_id: 0, username: "demo", role: "User" }
    });

  } catch (error) {
    if (error instanceof SyntaxError) { // Catches JSON parsing errors
        return jsonError('Invalid JSON in request body.', 400);
    }
    console.error('Login API Error:', error);
    return jsonError('An unexpected error occurred.', 500);
  }
}
