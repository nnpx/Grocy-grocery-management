import { jsonOk, jsonError } from "@/lib/responses";
import { getConnection } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function GET(request) {
  try {
    // ✅ Verify user's token & role
    const user = requireRole(request, "User");
    console.log("⭐ Favorites GET for user:", user.user_id);

    const db = await getConnection();

    // ✅ Get all favorite recipes for this user
    const [favorites] = await db.query(
      `
      SELECT 
        r.recipe_id AS id,
        r.title,
        r.description,
        rc.name AS category,
        rco.name AS country,
        r.image_url AS imageUrl,
        r.cook_time AS cookTime,
        r.created_at AS createdAt,
        u.username AS owner,
        COUNT(DISTINCT f2.favorite_id) AS totalFavorites,
        TRUE AS isFavorite,
        GROUP_CONCAT(DISTINCT i.name SEPARATOR '||') AS ingredients
      FROM favorites f
      JOIN recipes r ON f.recipe_id = r.recipe_id
      JOIN recipe_categories rc ON r.recipe_category_id = rc.recipe_category_id
      JOIN recipe_countries rco ON r.recipe_country_id = rco.recipe_country_id
      JOIN users u ON r.user_id = u.user_id
      LEFT JOIN favorites f2 ON f2.recipe_id = r.recipe_id
      LEFT JOIN recipe_ingredients ri ON ri.recipe_id = r.recipe_id
      LEFT JOIN items i ON ri.item_id = i.item_id
      WHERE f.user_id = ?
      GROUP BY 
        r.recipe_id, r.title, r.description, rc.name, rco.name,
        r.image_url, r.cook_time, r.created_at, u.username
      ORDER BY r.created_at DESC
      `,
      [user.user_id],
    );

    // ✅ Format ingredients as an array
    const recipes = favorites.map((r) => ({
      ...r,
      ingredients: r.ingredients ? r.ingredients.split("||") : [],
      totalFavorites: parseInt(r.totalFavorites, 10) || 0,
      isFavorite: true,
    }));

    console.log("✅ Favorites fetched:", recipes.length);
    return jsonOk({ recipes });
  } catch (error) {
    console.error("Favorites GET error:", error.message);
    if (error.message?.includes("Unauthorized"))
      return jsonError(error.message, 401);
    if (error.message?.includes("Forbidden"))
      return jsonError(error.message, 403);
    return jsonError("Internal Server Error: " + error.message, 500);
  }
}
