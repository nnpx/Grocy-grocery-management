import { jsonOk, jsonError } from '@/lib/responses';
import { getConnection } from '@/lib/db';
import { requireRole } from '@/lib/auth';

export async function GET(request, context) {
    try {
        const user = requireRole(request, 'User');

        const params = await context.params;
        const recipeId = Number(params.id);

        if (!recipeId || Number.isNaN(recipeId)) {
            return jsonError('Invalid recipe ID.', 422);
        }

        const db = await getConnection();

        const [rows] = await db.query(
            `
      SELECT
        r.recipe_id AS id,
        r.title,
        r.description,
        rc.name AS category,
        rco.name AS country,
        r.image_url,
        r.cook_time,
        r.created_at,
        u.username AS owner,
        COUNT(DISTINCT f.favorite_id) AS totalFavorites,
        SUM(CASE WHEN f.user_id = ? THEN 1 ELSE 0 END) > 0 AS isFavorite,
        GROUP_CONCAT(DISTINCT i.name SEPARATOR '||') AS ingredientList,
        r.instructions AS instructionList
      FROM recipes r
      JOIN users u ON r.user_id = u.user_id
      JOIN recipe_categories rc ON r.recipe_category_id = rc.recipe_category_id
      JOIN recipe_countries rco ON r.recipe_country_id = rco.recipe_country_id
      LEFT JOIN favorites f ON r.recipe_id = f.recipe_id
      LEFT JOIN recipe_ingredients ri ON r.recipe_id = ri.recipe_id
      LEFT JOIN items i ON ri.item_id = i.item_id
      WHERE r.recipe_id = ?
      GROUP BY
        r.recipe_id,
        r.title,
        r.description,
        rc.name,
        rco.name,
        r.image_url,
        r.cook_time,
        r.created_at,
        u.username
      LIMIT 1
      `,
            [user.user_id, recipeId]
        );

        if (!rows.length) {
            return jsonError('Recipe not found.', 404);
        }

        const row = rows[0];

        const {
            ingredientList,
            instructionList,
            image_url,
            cook_time,
            created_at,
            isFavorite,
            totalFavorites,
            ...rest
        } = row;

        let instructions = [];
        if (instructionList) {
            try {
                instructions = JSON.parse(instructionList);
            } catch {
                instructions = [];
            }
        }

        const recipe = {
            id: rest.id,
            title: rest.title,
            description: rest.description || '',
            category: rest.category,
            country: rest.country,
            imageUrl: image_url,
            totalFavorites: Number(totalFavorites) || 0,
            isFavorite: Boolean(Number(isFavorite)),
            ingredients: ingredientList ? ingredientList.split('||') : [],
            instructions,
            owner: rest.owner,
            cookTime: cook_time,
            createdAt: new Date(created_at).toISOString(),
        };

        return jsonOk({ recipe });
    } catch (error) {
        console.error('Recipe detail API Error:', error.message);

        if (error.message.includes('Unauthorized')) {
            return jsonError(error.message, 401);
        }
        if (error.message.includes('Forbidden')) {
            return jsonError(error.message, 403);
        }

        return jsonError('Internal Server Error: ' + error.message, 500);
    }
}
