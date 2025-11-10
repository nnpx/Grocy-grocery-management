import { jsonOk, jsonError } from "@/lib/responses";
import { getConnection } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function GET(request) {
  try {
    const user = requireRole(request, "User");

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") ?? "All";
    const sort = searchParams.get("sort") ?? "expiryDate";
    const search = searchParams.get("search") ?? "";

    console.log("user:\n", user);
    console.log("Received filters:", { category, sort, search });

    let query = `
      SELECT
        ui.user_item_id AS id,
        ui.quantity,
        DATE_FORMAT(ui.expiry_date, '%Y-%m-%d') AS expiryDate,
        i.name,
        ic.name AS category
      FROM user_items ui
      JOIN items i ON ui.item_id = i.item_id
      JOIN item_categories ic ON i.item_category_id = ic.item_category_id
      WHERE ui.user_id = ?`;

    if (category !== "All") query += ` AND ic.name = ?`;
    if (search) query += ` AND i.name LIKE ?`;

    if (sort === "expiryDate") query += ` ORDER BY ui.expiry_date ASC`;
    else if (sort === "category") query += ` ORDER BY ic.name ASC`;
    else if (sort === "name") query += ` ORDER BY i.name ASC`;

    console.log("Executing query:", query);

    const db = await getConnection();
    const values = [user.user_id];
    if (category !== "All") values.push(category);
    if (search) values.push(`%${search}%`);

    const [items] = await db.query(query, values);

    const [categoryRows] = await db.query(
      "SELECT name FROM item_categories ORDER BY name ASC",
    );
    const categories = categoryRows.map((row) => row.name);

    return jsonOk({ items, categories });
  } catch (error) {
    console.error("Groceries GET error:", error);
    return jsonError("Internal Server Error: " + error.message, 500);
  }
}

export async function POST(request) {
  try {
    const user = requireRole(request, "User");

    const { name, category, quantity, expiryDate } = await request.json();

    if (!name || !category || quantity == null || !expiryDate) {
      return jsonError("Missing required fields", 400);
    }
    if (!Number.isFinite(Number(quantity)) || Number(quantity) <= 0) {
      return jsonError("Quantity must be a positive number", 400);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(expiryDate)) {
      return jsonError("expiryDate must be 'YYYY-MM-DD'", 400);
    }

    const db = await getConnection();

    const [catRows] = await db.query(
      "SELECT item_category_id FROM item_categories WHERE name = ?",
      [category],
    );
    if (catRows.length === 0) {
      return jsonError("Invalid category", 400);
    }
    const categoryId = catRows[0].item_category_id;

    await db.query("CALL add_grocery_item_by_name(?, ?, ?, ?, ?)", [
      user.user_id,
      name,
      categoryId,
      Number(quantity),
      expiryDate,
    ]);

    const [rows] = await db.query(
      `
      SELECT
        ui.user_item_id AS id,
        ui.quantity,
        DATE_FORMAT(ui.expiry_date, '%Y-%m-%d') AS expiryDate,
        i.name,
        ic.name AS category
      FROM user_items ui
      JOIN items i ON ui.item_id = i.item_id
      JOIN item_categories ic ON i.item_category_id = ic.item_category_id
      WHERE ui.user_id = ?
        AND i.name = ?
        AND ic.item_category_id = ?
        AND ui.expiry_date = ?
      ORDER BY ui.user_item_id DESC
      LIMIT 1
      `,
      [user.user_id, name, categoryId, expiryDate],
    );

    const item = rows[0];

    return jsonOk({
      message: "Item added successfully",
      item,
    });
  } catch (error) {
    console.error("Groceries POST error:", error);
    if (error.message?.includes("Unauthorized"))
      return jsonError(error.message, 401);
    if (error.message?.includes("Forbidden"))
      return jsonError(error.message, 403);
    return jsonError("Internal Server Error: " + error.message, 500);
  }
}

export async function PUT(request) {
  try {
    const user = requireRole(request, "User");

    const { id, name, category, quantity, expiryDate } = await request.json();

    if (!id || !name || !category || quantity == null || !expiryDate) {
      return jsonError("Missing required fields", 400);
    }
    if (Number(quantity) <= 0) {
      return jsonError("Quantity must be greater than 0", 400);
    }

    const db = await getConnection();

    const [catRows] = await db.query(
      "SELECT item_category_id FROM item_categories WHERE name = ?",
      [category],
    );
    if (catRows.length === 0) {
      return jsonError("Invalid category", 400);
    }
    const categoryId = catRows[0].item_category_id;

    const [itemRows] = await db.query(
      "SELECT item_id FROM user_items WHERE user_item_id = ? AND user_id = ?",
      [id, user.user_id],
    );
    if (itemRows.length === 0) {
      return jsonError("Item not found or no permission", 404);
    }
    const itemId = itemRows[0].item_id;

    await db.query(
      "UPDATE items SET name = ?, item_category_id = ? WHERE item_id = ?",
      [name, categoryId, itemId],
    );

    const [res] = await db.query(
      "UPDATE user_items SET quantity = ?, expiry_date = ? WHERE user_item_id = ? AND user_id = ?",
      [Number(quantity), expiryDate, id, user.user_id],
    );

    if (res.affectedRows === 0) {
      return jsonError("No changes made or item not found", 404);
    }

    return jsonOk({
      message: "Item updated successfully",
      item: {
        id,
        name,
        category,
        quantity: Number(quantity),
        expiryDate,
      },
    });
  } catch (error) {
    console.error("Groceries PUT error:", error);
    if (error.message?.includes("Unauthorized"))
      return jsonError(error.message, 401);
    if (error.message?.includes("Forbidden"))
      return jsonError(error.message, 403);
    return jsonError("Internal Server Error: " + error.message, 500);
  }
}

export async function DELETE(request) {
  try {
    const user = requireRole(request, "User");

    const { id } = await request.json();

    if (!id) {
      return jsonError("Item ID is required", 400);
    }

    const db = await getConnection();

    const [checkItem] = await db.query(
      "SELECT user_item_id FROM user_items WHERE user_item_id = ? AND user_id = ?",
      [id, user.user_id],
    );

    if (checkItem.length === 0) {
      return jsonError(
        "Item not found or you do not have permission to delete it",
        404,
      );
    }

    const [result] = await db.query(
      "DELETE FROM user_items WHERE user_item_id = ? AND user_id = ?",
      [id, user.user_id],
    );

    if (result.affectedRows === 0) {
      return jsonError("Failed to delete item", 500);
    }

    console.log("Item deleted successfully:", { id, user_id: user.user_id });

    return jsonOk({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Groceries API Error:", error.message);
    return jsonError("Internal Server Error: " + error.message, 500);
  }
}
