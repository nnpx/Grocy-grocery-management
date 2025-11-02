import { jsonOk, jsonError } from '@/lib/responses';

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


    // If all validations pass
    console.log(`Placeholder signup for: ${email}`);
    
    // This is a placeholder response. In a real app, you would create the user in the database here.
    return jsonOk({ 
        message: "Signup placeholder OK (no DB yet)",
        user: { username, email } 
    });

  } catch (error) {
    if (error instanceof SyntaxError) { // Catches JSON parsing errors
        return jsonError('Invalid JSON in request body.', 400);
    }
    console.error('Signup API Error:', error);
    return jsonError('An unexpected error occurred.', 500);
  }
}
