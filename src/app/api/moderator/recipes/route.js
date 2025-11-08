import { jsonOk, jsonError } from '@/lib/responses';
import { getConnection } from '@/lib/db';
import { verifyToken, requireRole } from '@/lib/auth'; // import verifyToken and requireRole

export async function GET(request) {
    try {
        await requireRole(request, 'Moderator');

        const db = await getConnection();

        const [recipes] = await db.query(
            `SELECT 
            u.username AS author_name,
            rc.name AS category,
            r.cook_time,
            rco.name AS country,
            r.created_at,
            r.description,
            r.recipe_id AS id,
            r.image_url,
            r.title AS name,
            GROUP_CONCAT(DISTINCT item.name SEPARATOR '||') AS ingredientList,
            r.instructions AS instructionList
        FROM
            recipes r
        JOIN recipe_categories rc ON r.recipe_category_id = rc.recipe_category_id
        JOIN recipe_countries rco ON r.recipe_country_id = rco.recipe_country_id
        JOIN users u ON r.user_id = u.user_id
        JOIN recipe_ingredients ri_all ON r.recipe_id = ri_all.recipe_id
        JOIN items item ON ri_all.item_id = item.item_id
        GROUP BY r.recipe_id
        ORDER BY r.created_at DESC`
        );

        const processedRecipes = recipes.map(recipe => {
            const { ingredientList, instructionList, ...rest } = recipe;

            let instructionsArray = [];
            try {
                // Parse the instructionList string back into a JavaScript array.
                instructionsArray = instructionList ? JSON.parse(instructionList) : [];
            } catch (e) {
                console.error("Error parsing instruction list for recipe ID:", recipe.id, e);
                instructionsArray = [];
            }

            return {
                ...rest,
                ingredients: ingredientList ? ingredientList.split('||') : [],
                instructions: instructionsArray,
            };
        });

        return jsonOk({ recipes: processedRecipes });
    } catch (error) {
        console.error('Moderator recipe API Error:', error.message);

        if (error.message.includes('Unauthorized')) {
            return jsonError(error.message, 401); // 401 Unauthorized (Token problem)
        }
        if (error.message.includes('Forbidden')) {
            return jsonError(error.message, 403); // 403 Forbidden (Role problem)
        }

        // Fallback for unexpected database or internal errors
        console.error('Error fetching recipes:', error);
        return jsonError('Internal Server Error: ' + error.message, 500);
    }
}


export async function PUT(request) {
    try {
        await requireRole(request, 'Moderator');

        const {
            id: recipe_id,
            name: title,
            description,
            category,
            country,
            cook_time,
            image_url,
            ingredients,
            instructions
        } = await request.json();

        console.log('Updated recipe data:', { title, description, category, country, cook_time, image_url, ingredients, instructions });

        if (!title || !description || !category || !country || !cook_time || !image_url) {
            return jsonError('All fields of recipe detail are required.', 422);
        }

        const db = await getConnection();

        const [categoryRows] = await db.query('SELECT recipe_category_id FROM recipe_categories WHERE name = ?', [category]);
        const [countryRows] = await db.query('SELECT recipe_country_id FROM recipe_countries WHERE name = ?', [country]);

        if (!categoryRows.length) {
            return jsonError('Invalid category provided.', 422);
        }
        if (!countryRows.length) {
            return jsonError('Invalid country provided.', 422);
        }

        const recipe_category_id = categoryRows[0].recipe_category_id;
        const recipe_country_id = countryRows[0].recipe_country_id;

        // Update the recipe fields
        const updateFields = [];
        const updateValues = [];

        if (title) {
            updateFields.push('title');
            updateValues.push(title);
        }
        if (description) {
            updateFields.push('description');
            updateValues.push(description);
        }
        if (recipe_category_id) {
            updateFields.push('recipe_category_id');
            updateValues.push(recipe_category_id);
        }
        if (recipe_country_id) {
            updateFields.push('recipe_country_id');
            updateValues.push(recipe_country_id);
        }
        if (cook_time) {
            updateFields.push('cook_time');
            updateValues.push(cook_time);
        }
        if (image_url) {
            updateFields.push('image_url');
            updateValues.push(image_url);
        }

        const updateSql = `UPDATE recipes SET ${updateFields.map(field => `${field} = ?`).join(', ')} WHERE recipe_id = ?`;
        await db.query(updateSql, [...updateValues, recipe_id]);

        // Update the ingredients
        if (ingredients && ingredients.length > 0) {
            const lowerCaseIngredients = ingredients.map(name => name.trim().toLowerCase());

            const [validItems] = await db.query(
                'SELECT item_id, name FROM items WHERE name IN (?)',
                [lowerCaseIngredients]
            );

            const validItemIdsMap = new Map();
            validItems.forEach(item => validItemIdsMap.set(item.name, item.item_id));

            // Check for invalid items (those not found in the `items` table)
            const invalidItems = ingredients.filter(item => !validItemIdsMap.has(item));

            // If there are any invalid items, return an error
            if (invalidItems.length > 0) {
                console.log('Invalid items:', invalidItems);
                return jsonError(`Invalid item(s): ${invalidItems.join(', ')}`, 422);
            }

            const itemIds = ingredients.map(item => validItemIdsMap.get(item));

            // First, delete existing ingredients for this recipe
            await db.query('DELETE FROM recipe_ingredients WHERE recipe_id = ?', [recipe_id]);

            // Then insert the valid ingredients (now using item IDs)
            const ingredientPromises = itemIds.map(itemId =>
                db.query('INSERT INTO recipe_ingredients (recipe_id, item_id) VALUES (?, ?)', [recipe_id, itemId])
            );
            await Promise.all(ingredientPromises);
        }

        // Update the instructions
        if (instructions && instructions.length > 0) {
            await db.query('UPDATE recipes SET instructions = ? WHERE recipe_id = ?', [JSON.stringify(instructions), recipe_id]);
        }

        return jsonOk({ message: 'Recipe updated successfully' });
    } catch (error) {
        console.error('Dashboard API Error:', error.message);

        if (error.message.includes('Unauthorized')) {
            return jsonError(error.message, 401); // 401 Unauthorized (Token problem)
        }
        if (error.message.includes('Forbidden')) {
            return jsonError(error.message, 403); // 403 Forbidden (Role problem)
        }

        return jsonError('Internal Server Error: ' + error.message, 500);
    }
}