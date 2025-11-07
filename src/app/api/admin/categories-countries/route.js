export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { jsonOk, jsonError } from '@/lib/responses';
import { getConnection } from '@/lib/db';
import { requireRole } from '@/lib/auth';

export async function GET(request) {
    try {
        await requireRole(request, 'Admin');

        const db = await getConnection();

        // Categories with recipe count + earliest usage date
        const [categories] = await db.query(
            `
      SELECT 
        rc.recipe_category_id AS id,
        rc.name AS name,
        COUNT(r.recipe_id) AS recipeCount
      FROM recipe_categories rc
      LEFT JOIN recipes r 
        ON r.recipe_category_id = rc.recipe_category_id
      GROUP BY rc.recipe_category_id, rc.name
      ORDER BY rc.name;
      `
        );

        // Countries with recipe count + earliest usage date
        const [countries] = await db.query(
            `
      SELECT 
        rco.recipe_country_id AS id,
        rco.name AS name,
        COUNT(r.recipe_id) AS recipeCount
      FROM recipe_countries rco
      LEFT JOIN recipes r 
        ON r.recipe_country_id = rco.recipe_country_id
      GROUP BY rco.recipe_country_id, rco.name
      ORDER BY rco.name;
      `
        );

        // Normalize nulls (no recipe yet) -> empty string to match UI formatting expectation
        const norm = (rows) =>
            rows.map((row) => ({
                ...row,
                recipeCount: Number(row.recipeCount) || 0,
            }));

        return jsonOk({
            categories: norm(categories),
            countries: norm(countries),
        });
    } catch (error) {
        // Consistent auth error mapping with your helpers
        if (error.message.includes('Unauthorized')) {
            return jsonError(error.message, 401);
        }
        if (error.message.includes('Forbidden')) {
            return jsonError(error.message, 403);
        }
        console.error('Admin categories-countries GET error:', error);
        return jsonError('Internal Server Error: ' + error.message, 500);
    }
}


export async function POST(request) {
    try {
        await requireRole(request, 'Admin');

        const { type, name } = await request.json(); // type: 'category' | 'country', name: name of category or country
        console.log('POST body:', { type, name });

        // Validate input
        if (!name || name.trim() === '') {
            return jsonError('Name is required.', 422);
        }

        const db = await getConnection();

        if (type === 'category') {
            // Check if category exists
            const [existingCategory] = await db.query('SELECT * FROM recipe_categories WHERE name = ?', [name]);
            if (existingCategory.length > 0) {
                return jsonError('Category already exists.', 422);
            }

            // Insert new category
            const [result] = await db.query('INSERT INTO recipe_categories (name) VALUES (?)', [name]);
            return jsonOk({ message: 'Category added successfully', id: result.insertId });

        } else if (type === 'country') {
            // Check if country exists
            const [existingCountry] = await db.query('SELECT * FROM recipe_countries WHERE name = ?', [name]);
            if (existingCountry.length > 0) {
                return jsonError('Country already exists.', 422);
            }

            // Insert new country
            const [result] = await db.query('INSERT INTO recipe_countries (name) VALUES (?)', [name]);
            return jsonOk({ message: 'Country added successfully', id: result.insertId });
        } else {
            return jsonError('Invalid type, must be "category" or "country".', 422);
        }
    } catch (error) {
        // Consistent auth error mapping with your helpers
        if (error.message.includes('Unauthorized')) {
            return jsonError(error.message, 401);
        }
        if (error.message.includes('Forbidden')) {
            return jsonError(error.message, 403);
        }
        console.error('Admin categories-countries GET error:', error);
        return jsonError('Internal Server Error: ' + error.message, 500);
    }
}


export async function DELETE(request) {
    try {
        await requireRole(request, 'Admin');

        const { type, id } = await request.json(); // type: 'category' or 'country', id: the ID to delete

        if (!id) {
            return jsonError('ID is required.', 422);
        }

        const db = await getConnection();

        if (type === 'category') {
            // Check if the category exists
            const [existingCategory] = await db.query('SELECT * FROM recipe_categories WHERE recipe_category_id = ?', [id]);
            if (!existingCategory.length) {
                return jsonError('Category not found.', 404);
            }

            // Check if the category is in use (i.e., has any recipes)
            const [recipeCount] = await db.query('SELECT COUNT(*) AS count FROM recipes WHERE recipe_category_id = ?', [id]);
            if (recipeCount[0].count > 0) {
                return jsonError('Cannot delete category because it is associated with recipes.', 422);
            }

            // Delete the category
            await db.query('DELETE FROM recipe_categories WHERE recipe_category_id = ?', [id]);
            return jsonOk({ message: 'Category deleted successfully' });

        } else if (type === 'country') {
            // Check if the country exists
            const [existingCountry] = await db.query('SELECT * FROM recipe_countries WHERE recipe_country_id = ?', [id]);
            if (!existingCountry.length) {
                return jsonError('Country not found.', 404);
            }

            // Check if the country is in use (i.e., has any recipes)
            const [countryRecipeCount] = await db.query('SELECT COUNT(*) AS count FROM recipes WHERE recipe_country_id = ?', [id]);
            if (countryRecipeCount[0].count > 0) {
                return jsonError('Cannot delete country because it is associated with recipes.', 422);
            }

            // Delete the country
            await db.query('DELETE FROM recipe_countries WHERE recipe_country_id = ?', [id]);
            return jsonOk({ message: 'Country deleted successfully' });
        } else {
            return jsonError('Invalid type, must be "category" or "country".', 422);
        }

    } catch (error) {
        // Consistent auth error mapping with your helpers
        if (error.message.includes('Unauthorized')) {
            return jsonError(error.message, 401);
        }
        if (error.message.includes('Forbidden')) {
            return jsonError(error.message, 403);
        }
        console.error('Admin categories-countries GET error:', error);
        return jsonError('Internal Server Error: ' + error.message, 500);
    }
}


export async function PUT(request) {
    try {
        await requireRole(request, 'Admin');

        const { type, id, name } = await request.json(); // type: 'category' or 'country', id: the ID to edit, name: the new name

        // Validate input
        if (!id || !name || name.trim() === '') {
            return jsonError('ID and name are required.', 422);
        }

        const db = await getConnection();

        if (type === 'category') {
            // Check if category exists
            const [existingCategory] = await db.query('SELECT * FROM recipe_categories WHERE recipe_category_id = ?', [id]);
            if (!existingCategory.length) {
                return jsonError('Category not found.', 404);
            }

            // Update category name
            await db.query('UPDATE recipe_categories SET name = ? WHERE recipe_category_id = ?', [name, id]);
            return jsonOk({ message: 'Category updated successfully' });
        } else if (type === 'country') {
            // Check if country exists
            const [existingCountry] = await db.query('SELECT * FROM recipe_countries WHERE recipe_country_id = ?', [id]);
            if (!existingCountry.length) {
                return jsonError('Country not found.', 404);
            }

            // Update country name
            await db.query('UPDATE recipe_countries SET name = ? WHERE recipe_country_id = ?', [name, id]);
            return jsonOk({ message: 'Country updated successfully' });
        } else {
            return jsonError('Invalid type, must be "category" or "country".', 422);
        }
    } catch (error) {
        // Consistent auth error mapping with your helpers
        if (error.message.includes('Unauthorized')) {
            return jsonError(error.message, 401);
        }
        if (error.message.includes('Forbidden')) {
            return jsonError(error.message, 403);
        }
        console.error('Admin categories-countries GET error:', error);
        return jsonError('Internal Server Error: ' + error.message, 500);
    }
}