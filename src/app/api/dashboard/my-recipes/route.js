export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { jsonOk, jsonError } from '@/lib/responses';
import { getConnection } from '@/lib/db';
import { requireRole } from '@/lib/auth';

export async function GET(request) {
    try {
        const user = requireRole(request, 'User');

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
            COALESCE(fav_count.totalFavorites, 0) AS totalFavorites, 
            SUM(CASE WHEN f.user_id = ? THEN 1 ELSE 0 END) > 0 AS isFavorite,
            GROUP_CONCAT(DISTINCT i.name SEPARATOR '||') AS ingredientList,
            r.instructions AS instructionList
            FROM recipes r
            JOIN users u ON r.user_id = u.user_id
            JOIN recipe_categories rc ON r.recipe_category_id = rc.recipe_category_id
            JOIN recipe_countries rco ON r.recipe_country_id = rco.recipe_country_id
            LEFT JOIN favorites f ON r.recipe_id = f.recipe_id -- Retained for isFavorite calculation
            
            LEFT JOIN (
                SELECT recipe_id, COUNT(favorite_id) AS totalFavorites
                FROM favorites
                GROUP BY recipe_id
            ) AS fav_count ON r.recipe_id = fav_count.recipe_id
            
            LEFT JOIN recipe_ingredients ri ON r.recipe_id = ri.recipe_id
            LEFT JOIN items i ON ri.item_id = i.item_id
            
            WHERE r.user_id = ? 
            
            GROUP BY
            r.recipe_id,
            r.title,
            r.description,
            rc.name,
            rco.name,
            r.image_url,
            r.cook_time,
            r.created_at,
            u.username,
            fav_count.totalFavorites
            ORDER BY r.created_at DESC
            `,
            [user.user_id, user.user_id]
        );

        const recipes = rows.map((row) => {
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

            return {
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
        });

        const [allCategoryRows] = await db.query(
            `SELECT name FROM recipe_categories ORDER BY name`
        );

        const [allCountryRows] = await db.query(
            `SELECT name FROM recipe_countries ORDER BY name`
        );

        const categories = allCategoryRows.map((c) => c.name);
        const countries = allCountryRows.map((c) => c.name);

        return jsonOk({
            recipes,
            categories,
            countries,
        });

    } catch (error) {
        console.error('Community Recipes API Error:', error.message);

        if (error.message.includes('Unauthorized')) {
            return jsonError(error.message, 401);
        }
        if (error.message.includes('Forbidden')) {
            return jsonError(error.message, 403);
        }

        return jsonError('Internal Server Error: ' + error.message, 500);
    }
}

export async function PUT(request) {
    try {
        const user = requireRole(request, 'User');
        const body = await request.json();

        console.log('My Recipes PUT body:', body);

        const {
            id,
            title,
            description,
            category,
            country,
            imageUrl,
            cookTime,
            ingredients,
            instructions,
        } = body;

        if (!id) return jsonError('Recipe ID is required.', 422);
        if (!title || !description || !category || !country || !imageUrl || !cookTime) {
            return jsonError('All fields of recipe detail are required.', 422);
        }

        const db = await getConnection();

        // Ensure this recipe exists & belongs to the current user
        const [ownerRows] = await db.query(
            'SELECT user_id FROM recipes WHERE recipe_id = ?',
            [id]
        );

        if (!ownerRows.length) {
            return jsonError('Recipe not found.', 404);
        }

        if (ownerRows[0].user_id !== user.user_id) {
            return jsonError('Forbidden: You can only edit your own recipes.', 403);
        }

        // Map category name -> recipe_category_id
        const [catRows] = await db.query(
            'SELECT recipe_category_id FROM recipe_categories WHERE name = ?',
            [category]
        );
        if (!catRows.length) {
            return jsonError('Invalid category provided.', 422);
        }
        const recipe_category_id = catRows[0].recipe_category_id;

        // Map country name -> recipe_country_id
        const [countryRows] = await db.query(
            'SELECT recipe_country_id FROM recipe_countries WHERE name = ?',
            [country]
        );
        if (!countryRows.length) {
            return jsonError('Invalid country provided.', 422);
        }
        const recipe_country_id = countryRows[0].recipe_country_id;

        console.log('Mapped IDs:', { recipe_category_id, recipe_country_id });

        // Update main recipe fields
        await db.query(
            `
          UPDATE recipes
          SET 
            title = ?,
            description = ?,
            recipe_category_id = ?,
            recipe_country_id = ?,
            cook_time = ?,
            image_url = ?
          WHERE recipe_id = ?
          `,
            [title, description, recipe_category_id, recipe_country_id, cookTime, imageUrl, id]
        );

        if (Array.isArray(ingredients)) {
            if (ingredients.length > 0) {
                const lowerCaseIngredients = ingredients.map(name => name.trim().toLowerCase());

                const [validItems] = await db.query(
                    'SELECT item_id, name FROM items WHERE name IN (?)',
                    [lowerCaseIngredients]
                );

                const nameToId = new Map(
                    validItems.map((item) => [item.name, item.item_id])
                );

                const invalid = ingredients.filter((name) => !nameToId.has(name));
                if (invalid.length > 0) {
                    return jsonError(
                        `Invalid item(s): ${invalid.join(', ')}`,
                        422
                    );
                }

                const itemIds = ingredients.map((name) => nameToId.get(name));

                // Replace existing ingredients
                await db.query('DELETE FROM recipe_ingredients WHERE recipe_id = ?', [id]);
                await Promise.all(
                    itemIds.map((itemId) =>
                        db.query(
                            'INSERT INTO recipe_ingredients (recipe_id, item_id) VALUES (?, ?)',
                            [id, itemId]
                        )
                    )
                );
            } else {
                return jsonError('Ingredients are required.', 422);
            }
        }

        if (Array.isArray(instructions)) {
            await db.query(
                'UPDATE recipes SET instructions = ? WHERE recipe_id = ?',
                [JSON.stringify(instructions), id]
            );
        }

        return jsonOk({ message: 'Recipe updated successfully' });
    } catch (error) {
        console.error('My Recipes PUT Error:', error.message);

        if (error.message.includes('Unauthorized')) {
            return jsonError(error.message, 401);
        }
        if (error.message.includes('Forbidden')) {
            return jsonError(error.message, 403);
        }

        return jsonError('Internal Server Error: ' + error.message, 500);
    }
}

export async function POST(request) {
    try {
        const user = requireRole(request, 'User');
        const {
            title,
            description,
            category,
            country,
            imageUrl,
            cookTime,
            ingredients,
            instructions
        } = await request.json();

        if (!title || !description || !category || !country || !imageUrl || !cookTime) {
            return jsonError('All fields of recipe detail are required.', 422);
        }

        const db = await getConnection();

        // Get category and country IDs
        const [catRows] = await db.query(
            'SELECT recipe_category_id FROM recipe_categories WHERE name = ?',
            [category]
        );
        if (!catRows.length) {
            return jsonError('Invalid category provided.', 422);
        }

        const [countryRows] = await db.query(
            'SELECT recipe_country_id FROM recipe_countries WHERE name = ?',
            [country]
        );
        if (!countryRows.length) {
            return jsonError('Invalid country provided.', 422);
        }

        const recipe_category_id = catRows[0].recipe_category_id;
        const recipe_country_id = countryRows[0].recipe_country_id;

        const now = new Date();
        const nowTst = now.toLocaleString('en-CA', {
            timeZone: 'Asia/Bangkok',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).replace(/,/, '');
        console.log('Generated TST string:', nowTst);

        // Create new recipe
        const [insertResult] = await db.query(
            `
      INSERT INTO recipes 
        (user_id, title, description, recipe_category_id, recipe_country_id, cook_time, image_url, instructions, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
            [
                user.user_id,
                title,
                description,
                recipe_category_id,
                recipe_country_id,
                cookTime,
                imageUrl,
                JSON.stringify(instructions || []),
                nowTst
            ]
        );

        const recipe_id = insertResult.insertId;

        // Validate and insert ingredients
        if (Array.isArray(ingredients) && ingredients.length > 0) {
            const lowerCaseIngredients = ingredients.map(name => name.trim().toLowerCase());

            const [validItems] = await db.query(
                'SELECT item_id, name FROM items WHERE name IN (?)',
                [lowerCaseIngredients]
            );

            const nameToId = new Map(validItems.map(item => [item.name, item.item_id]));
            const invalid = ingredients.filter(name => !nameToId.has(name));

            if (invalid.length > 0) {
                // Delete the half-created recipe to keep DB clean
                await db.query('DELETE FROM recipes WHERE recipe_id = ?', [recipe_id]);
                return jsonError(`Oops! We don't recognize ${invalid.join(', ')}. To include it in your recipe, just add this item to your own 'My Groceries' list first!`, 422);
            }

            const itemIds = ingredients.map(name => nameToId.get(name));
            const insertPromises = itemIds.map(itemId =>
                db.query(
                    'INSERT INTO recipe_ingredients (recipe_id, item_id) VALUES (?, ?)',
                    [recipe_id, itemId]
                )
            );
            await Promise.all(insertPromises);
        }

        return jsonOk({ message: 'Recipe created successfully', recipe_id });
    } catch (error) {
        console.error('My Recipes POST Error:', error.message);

        if (error.message.includes('Unauthorized')) return jsonError(error.message, 401);
        if (error.message.includes('Forbidden')) return jsonError(error.message, 403);

        return jsonError('Internal Server Error: ' + error.message, 500);
    }
}


export async function DELETE(request) {
    try {
        const user = requireRole(request, 'User');

        const { id } = await request.json();

        if (!id) {
            return jsonError('Recipe ID is required.', 422);
        }

        const db = await getConnection();

        // Check if the recipe belongs to the user
        const [ownerRows] = await db.query(
            'SELECT user_id FROM recipes WHERE recipe_id = ?',
            [id]
        );

        if (!ownerRows.length) {
            return jsonError('Recipe not found.', 404);
        }

        if (ownerRows[0].user_id !== user.user_id) {
            return jsonError('Forbidden: You can only delete your own recipes.', 403);
        }

        // Delete associated ingredients in recipe_ingredients table
        // await db.query('DELETE FROM recipe_ingredients WHERE recipe_id = ?', [id]);

        // Delete the recipe itself
        await db.query('DELETE FROM recipes WHERE recipe_id = ?', [id]);

        return jsonOk({ message: 'Recipe deleted successfully.' });
    } catch (error) {
        console.error('Delete Recipe API Error:', error.message);

        if (error.message.includes('Unauthorized')) return jsonError(error.message, 401);
        if (error.message.includes('Forbidden')) return jsonError(error.message, 403);

        return jsonError('Internal Server Error: ' + error.message, 500);
    }
}
