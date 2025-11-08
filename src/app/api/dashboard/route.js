import { jsonOk, jsonError } from '@/lib/responses';
import { getConnection } from '@/lib/db';
import { requireRole } from '@/lib/auth';

export async function GET(request) {
  try {
    const user = requireRole(request, 'User');

    console.log('user: \n', user);

    const db = await getConnection();

    const [name] = await db.query('SELECT username FROM users WHERE user_id = ?', [user.user_id]);
    const userName = name[0]?.username

    const [groceries] = await db.query('SELECT COUNT(*) as total FROM user_items WHERE user_id = ?', [user.user_id]);
    const totalGroceries = groceries[0].total;

    const [expiringItems] = await db.query(
      `
      SELECT
          ui.item_id AS id,
          ui.quantity,
          DATE_FORMAT(ui.expiry_date, '%Y-%m-%d') AS expiryDate,
          i.name,          -- Alias name for clarity
          ic.name AS category-- Alias name for clarity
      FROM
          user_items ui
      JOIN
          items i ON ui.item_id = i.item_id
      JOIN
          item_categories ic ON i.item_category_id = ic.item_category_id
      WHERE
          ui.user_id = ?
          AND ui.expiry_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
      ORDER BY
          ui.expiry_date ASC
    `,
      [user.user_id]
    );

    const [favoriteRecipes] = await db.query(
      'SELECT COUNT(*) as total FROM favorites WHERE user_id = ?',
      [user.user_id]
    );

    const suggestedRecipesSQL = `
      SELECT
          r.recipe_id AS id,
          r.title,
          r.description,
          rc.name AS category,
          rco.name AS country,
          r.cook_time AS cookTime,
          r.image_url AS imageUrl,
          r.created_at AS createdAt,
          u.username AS owner,
          COUNT(DISTINCT fav.favorite_id) AS totalFavorites,
          COUNT(CASE WHEN fav.user_id = ? THEN 1 ELSE NULL END) > 0 AS isFavorite,
          GROUP_CONCAT(DISTINCT item.name SEPARATOR '||') AS ingredientList
      FROM
          recipes r
      JOIN recipe_categories rc ON r.recipe_category_id = rc.recipe_category_id
      JOIN recipe_countries rco ON r.recipe_country_id = rco.recipe_country_id
      JOIN recipe_ingredients ri_filter ON r.recipe_id = ri_filter.recipe_id
      JOIN user_items ui_filter ON ri_filter.item_id = ui_filter.item_id AND ui_filter.user_id = ?
      JOIN recipe_ingredients ri_all ON r.recipe_id = ri_all.recipe_id
      JOIN items item ON ri_all.item_id = item.item_id
      JOIN users u ON r.user_id = u.user_id
      LEFT JOIN favorites fav ON r.recipe_id = fav.recipe_id
      GROUP BY
          r.recipe_id, r.title, r.description, rc.name, rco.name, r.cook_time, r.image_url, r.created_at, r.user_id
      ORDER BY
          r.title;
    `;

    const [suggestedRecipes] = await db.query(suggestedRecipesSQL, [user.user_id, user.user_id, user.user_id]);

    const processedSuggestedRecipes = suggestedRecipes.map(recipe => ({
      ...recipe,
      // Convert the concatenated string 'item1||item2' into a JavaScript array ['item1', 'item2']
      ingredients: recipe.ingredientList ? recipe.ingredientList.split('||') : [],
      // Convert the MySQL output (1 or 0) into proper boolean values
      isOwner: Boolean(recipe.isOwner),
      isFavorite: Boolean(recipe.isFavorite),
      // Ensure totalFavorites is an integer
      totalFavorites: parseInt(recipe.totalFavorites, 10),
    }));

    return jsonOk({
      userName,
      totalGroceries,
      expiringItems,
      favoriteRecipes: favoriteRecipes[0].total,
      suggestedRecipes: processedSuggestedRecipes
    });

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