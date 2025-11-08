import { jsonOk, jsonError } from '@/lib/responses';
import { getConnection } from '@/lib/db';
import { verifyToken } from '@/lib/auth'; // Helper to verify token

export async function GET(request) {
    try {
        const user = verifyToken(request);

        const db = await getConnection();

        const [userRows] = await db.query(
            'SELECT username, email FROM users WHERE user_id = ?',
            [user.user_id]
        );

        if (!userRows.length) {
            return jsonError('User not found.', 404);
        }

        // Return user info (name, email)
        const userInfo = userRows[0];
        return jsonOk({
            username: userInfo.username,
            email: userInfo.email
        });

    } catch (error) {
        console.error('User Info API Error:', error.message);
        return jsonError('Internal Server Error: ' + error.message, 500);
    }
}
