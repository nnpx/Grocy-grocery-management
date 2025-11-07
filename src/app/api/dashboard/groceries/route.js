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
    console.log("Fetched items:", items);

    // ✅ fetch categories from DB
    const [categoryRows] = await db.query(
      "SELECT name FROM item_categories ORDER BY name ASC",
    );
    const categories = categoryRows.map((row) => row.name); // e.g. ["Bakery", "Dairy", "Meat", "Produce", "Snacks"]

    return jsonOk({ items, categories });
  } catch (error) {
    console.error("Groceries GET error:", error);
    return jsonError("Internal Server Error: " + error.message, 500);
  }
}

export async function POST(request) {
  try {
    // 1) Auth
    const user = requireRole(request, "User");

    // 2) Read + validate body
    const { name, category, quantity, expiryDate } = await request.json();

    if (!name || !category || quantity == null || !expiryDate) {
      return jsonError("Missing required fields", 400);
    }
    if (!Number.isFinite(Number(quantity)) || Number(quantity) <= 0) {
      return jsonError("Quantity must be a positive number", 400);
    }
    // Very simple date guard (yyyy-mm-dd)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(expiryDate)) {
      return jsonError("expiryDate must be 'YYYY-MM-DD'", 400);
    }

    const db = await getConnection();

    // 3) Resolve category -> item_category_id
    const [catRows] = await db.query(
      "SELECT item_category_id FROM item_categories WHERE name = ?",
      [category],
    );
    if (catRows.length === 0) {
      return jsonError("Invalid category", 400);
    }
    const categoryId = catRows[0].item_category_id;

    // 4) Resolve (or create) item -> item_id
    //    We assume (name, item_category_id) identifies an item.
    let itemId;
    const [itemRows] = await db.query(
      "SELECT item_id FROM items WHERE name = ? AND item_category_id = ?",
      [name, categoryId],
    );
    if (itemRows.length > 0) {
      itemId = itemRows[0].item_id;
    } else {
      const [insItem] = await db.query(
        "INSERT INTO items (name, item_category_id) VALUES (?, ?)",
        [name, categoryId],
      );
      itemId = insItem.insertId;
    }

    // 5) Insert into user_items using item_id (not name)
    //    MySQL will accept 'YYYY-MM-DD' for a DATE column
    const [insUserItem] = await db.query(
      "INSERT INTO user_items (user_id, item_id, quantity, expiry_date) VALUES (?, ?, ?, ?)",
      [user.user_id, itemId, Number(quantity), expiryDate],
    );

    // 6) Return minimal info needed to update UI
    return jsonOk({
      message: "Item added successfully",
      userItemId: insUserItem.insertId,
      item: {
        id: insUserItem.insertId, // for your UI list
        name,
        category,
        quantity: Number(quantity),
        expiryDate, // 'YYYY-MM-DD'
      },
    });
  } catch (error) {
    console.error("Groceries POST error:", error);
    if (error.message?.includes("Unauthorized")) {
      return jsonError(error.message, 401);
    }
    if (error.message?.includes("Forbidden")) {
      return jsonError(error.message, 403);
    }
    return jsonError("Internal Server Error: " + error.message, 500);
  }
}

export async function PUT(request) {
  try {
    // Verify the user's JWT token and role
    const user = requireRole(request, "User");

    // Parse the incoming request body
    const { id, name, category, quantity, expiryDate } = await request.json();

    if (!id || !name || !category || quantity == null || !expiryDate) {
      return jsonError("Missing required fields", 400);
    }

    if (Number(quantity) <= 0) {
      return jsonError("Quantity must be greater than 0", 400);
    }

    const db = await getConnection();

    // Get category ID
    const [catRows] = await db.query(
      "SELECT item_category_id FROM item_categories WHERE name = ?",
      [category],
    );
    if (catRows.length === 0) {
      return jsonError("Invalid category", 400);
    }
    const categoryId = catRows[0].item_category_id;

    // Find the item_id from this user_item_id
    const [itemRows] = await db.query(
      "SELECT item_id FROM user_items WHERE user_item_id = ? AND user_id = ?",
      [id, user.user_id],
    );
    if (itemRows.length === 0) {
      return jsonError("Item not found or no permission", 404);
    }
    const itemId = itemRows[0].item_id;

    // 1️⃣ Update the item’s name/category in items table
    await db.query(
      "UPDATE items SET name = ?, item_category_id = ? WHERE item_id = ?",
      [name, categoryId, itemId],
    );

    // 2️⃣ Update the user-specific fields
    const [res] = await db.query(
      "UPDATE user_items SET quantity = ?, expiry_date = ? WHERE user_item_id = ? AND user_id = ?",
      [Number(quantity), expiryDate, id, user.user_id],
    );

    if (res.affectedRows === 0) {
      return jsonError("No changes made or item not found", 404);
    }

    console.log("🟩 Updated grocery item:", {
      user_item_id: id,
      item_id: itemId,
      name,
      category,
      quantity,
      expiryDate,
    });

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
    // Verify the user's JWT token and role
    const user = requireRole(request, "User");

    // Get the request body for deleting a grocery item
    const { id } = await request.json();

    if (!id) {
      return jsonError("Item ID is required", 400);
    }

    const db = await getConnection();

    // Check if the item exists for the user before deleting
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

    // Delete the item from the `user_items` table
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
