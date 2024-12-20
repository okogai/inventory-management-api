import express from "express";
import mysqlDb from "../mysqlDb";
import {Category, Item} from "../types";
import {ResultSetHeader} from "mysql2";

const categoriesRoute = express.Router();

categoriesRoute.get("/", async (_req, res) => {
    const connection = await mysqlDb.getConnections();
    const [result] = await connection.query("SELECT id, name FROM categories");
    const categories = result as Category[];
    res.send(categories);
});

categoriesRoute.get("/:id", async (req, res) => {
    const id = req.params.id;
    const connection = await mysqlDb.getConnections();
    const [result] = await connection.query("SELECT * FROM categories WHERE id = ?", [id]);
    const categories = result as Category[];

    if (categories.length === 0) {
        res.status(404).send("Category not found");
    } else {
        res.send(categories[0]);
    }
});

categoriesRoute.post("/", async (req, res) => {
    const { name, description } = req.body;
    if (!name) {
        res.status(400).send("Please send category title.");
        return;
    }
    const connection = await mysqlDb.getConnections();
    const [result] = await connection.query("INSERT INTO categories (name, description) VALUES (?, ?)", [name, description]);
    const resultHeader = result as ResultSetHeader;
    const [resultCategory] =  await connection.query("SELECT * FROM categories WHERE id = ?", [resultHeader.insertId]);
    const addedCategory = resultCategory as Category[];

    if (addedCategory.length === 0) {
        res.status(404).send("Category not found");
    } else {
        res.send(addedCategory[0]);
    }
});

categoriesRoute.put("/:id", async (req, res) => {
    const id = req.params.id;
    const { name, description } = req.body;

    if (!name) {
        res.status(400).send("Please send category title.");
        return;
    }

    const connection = await mysqlDb.getConnections();
    const [updateResult] = await connection.query("UPDATE categories SET name = ?, description = ? WHERE id = ?",
        [name, description, id]);
    const resultHeader = updateResult as ResultSetHeader;

    if (resultHeader.affectedRows === 0) {
        res.status(404).send("Category not found.");
    } else {
        const [updatedCategoryResult] = await connection.query("SELECT * FROM categories WHERE id = ?", [id]);
        const updatedCategory = updatedCategoryResult as Category[];
        res.send(updatedCategory[0]);
    }
});

categoriesRoute.delete("/:id", async (req, res) => {
    const id = req.params.id;
    const connection = await mysqlDb.getConnections();
    const [itemsResult] = await connection.query("SELECT * FROM items WHERE category_id = ?", [id]);
    const items = itemsResult as Item[];

    if (items.length > 0) {
        res.status(400).send("Cannot delete category: it is associated with items.");
        return;
    }

    const [deleteResult] = await connection.query("DELETE FROM categories WHERE id = ?", [id]);
    const resultHeader = deleteResult as ResultSetHeader;

    if (resultHeader.affectedRows === 0) {
        res.status(404).send("Category not found.");
    } else {
        res.send("Category deleted successfully.");
    }
});

export default categoriesRoute;