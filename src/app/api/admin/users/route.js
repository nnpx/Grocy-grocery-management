import { jsonOk, jsonError } from '@/lib/responses';
import { getConnection } from '@/lib/db';
import { requireRole } from '@/lib/auth';

export async function GET(request) {
    try {
        await requireRole(request, 'Admin');

        const db = await getConnection();

        const [users] = await db.query(
            `SELECT 
                user_id AS id, 
                username AS name, 
                email, 
                role, 
                CASE 
                    WHEN is_active = 1 THEN 'Active'
                    ELSE 'Deactivated' 
                END AS status, 
                created_at AS dateAdded 
            FROM users 
            ORDER BY created_at DESC`
        );

        return jsonOk({ users });
    } catch (error) {
        if (error.message.includes('Unauthorized')) {
            return jsonError(error.message, 401);
        }
        if (error.message.includes('Forbidden')) {
            return jsonError(error.message, 403);
        }
        console.error('Error fetching users:', error);
        return jsonError('Internal Server Error: ' + error.message, 500);
    }
}

export async function PUT(request) {
    try {
        await requireRole(request, 'Admin');

        const { id, name, role, status } = await request.json();

        if (!id || !name || !role || !status) {
            return jsonError('ID, name, role, and status are required.', 422);
        }

        const is_active_value = status === 'Active' ? 1 : 0;

        const db = await getConnection();

        // Check if user exists
        const [existingUser] = await db.query('SELECT * FROM users WHERE user_id = ?', [id]);
        if (!existingUser.length) {
            return jsonError('User not found.', 404);
        }

        // Update the user in the database
        await db.query(
            'UPDATE users SET username = ?, role = ?, is_active = ? WHERE user_id = ?',
            [name, role, is_active_value, id]
        );

        return jsonOk({ message: 'User updated successfully' });
    } catch (error) {
        if (error.message.includes('Unauthorized')) {
            return jsonError(error.message, 401);
        }
        if (error.message.includes('Forbidden')) {
            return jsonError(error.message, 403);
        }
        console.error('Failed to update user:', error);
        return jsonError('Failed to update user: ' + error.message, 500);
    }
}