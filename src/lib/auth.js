import jwt from 'jsonwebtoken';

// This function will be used to verify JWT in protected routes
export function verifyToken(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    // Throw a specific error for better debugging
    throw new Error('Authorization header missing');
  }

  // Bearer token format: "Bearer <token>"
  const parts = authHeader.split(' ');
  const token = (parts.length === 2 && parts[0].toLowerCase() === 'bearer') ? parts[1] : null;

  if (!token) {
    throw new Error('Invalid or malformed Bearer token');
  }

  try {
    // Verify token and extract user information (payload)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded; // Returns { user_id, username, role }
  } catch (error) {
    // Re-throw the actual JWT error (e.g., TokenExpiredError, JsonWebTokenError)
    throw new Error('Token verification failed: ' + error.message);
  }
}


export function requireRole(request, requiredRole) {
  try {
    const user = verifyToken(request); // Throws on token failure

    console.log('User in requireRole:\n', user);

    // Check if the user's role matches the required role
    if (user.role !== requiredRole) {
      // Throw an error that the API route can catch
      throw new Error('Forbidden: You do not have the required role');
    }

    return user; // If role is matched, return the user
  } catch (error) {
    // Catch any error thrown by verifyToken or the role check
    // In a real app, you might distinguish between Auth errors and Forbidden errors
    if (error.message.includes('Forbidden')) {
      // Re-throw, or return an error response immediately if you prefer
      throw error;
    }
    if (error.message.includes('Token') || error.message.includes('Authorization')) {
      // Token missing/invalid -> Unauthorized
      throw new Error('Unauthorized: Invalid or missing authentication token');
    }
    throw error; // Let the caller handle unexpected errors
  }
}