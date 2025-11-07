export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { jsonOk, jsonError } from '@/lib/responses';
import { getConnection } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function POST(request) {
    try {
        const user = verifyToken(request);
        const { recipeId, favorite } = await request.json();

        if (!recipeId || typeof recipeId !== 'number') {
            return jsonError('Valid recipeId is required.', 422);
        }
        if (typeof favorite !== 'boolean') {
            return jsonError('Valid favorite flag (true/false) is required.', 422);
        }

        const db = await getConnection();

        const [recipes] = await db.query(
            'SELECT recipe_id FROM recipes WHERE recipe_id = ?',
            [recipeId]
        );
        if (recipes.length === 0) {
            return jsonError('Recipe not found.', 404);
        }

        if (favorite) {
            // Add to favorites if not already
            await db.query(
                `
          INSERT IGNORE INTO favorites (user_id, recipe_id, created_at)
          VALUES (?, ?, NOW())
        `,
                [user.user_id, recipeId]
            );
        } else {
            // Remove from favorites
            await db.query(
                'DELETE FROM favorites WHERE user_id = ? AND recipe_id = ?',
                [user.user_id, recipeId]
            );
        }

        // Return updated count + status from DB
        const [[countRow]] = await db.query(
            'SELECT COUNT(*) AS total FROM favorites WHERE recipe_id = ?',
            [recipeId]
        );

        const [[userFavRow]] = await db.query(
            'SELECT COUNT(*) AS isFav FROM favorites WHERE user_id = ? AND recipe_id = ?',
            [user.user_id, recipeId]
        );

        return jsonOk({
            recipeId,
            isFavorite: !!userFavRow.isFav,
            totalFavorites: Number(countRow.total) || 0,
        });
    } catch (error) {
        console.error('Favorites API Error:', error.message);

        if (error.message.includes('Token') || error.message.includes('Authorization')) {
            return jsonError('Unauthorized: Invalid or missing authentication token', 401);
        }

        return jsonError('Internal Server Error: ' + error.message, 500);
    }
}
