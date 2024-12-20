import mysqlDb from "../mysqlDb";
import express from "express";
import {Category, Item} from "../types";
import {imagesUpload} from "../multer";
import {ResultSetHeader} from "mysql2";

const itemsRoute = express.Router();

itemsRoute.get("/", async (_req, res) => {
    const connection = await mysqlDb.getConnections();
    const [result] = await connection.query("SELECT id, name, category_id, location_id FROM items");
    const items = result as Item[];
    res.send(items);
});

itemsRoute.get("/:id", async (req, res) => {
    const id = req.params.id;
    const connection = await mysqlDb.getConnections();
    const [result] = await connection.query("SELECT * FROM items WHERE id = ?", [id]);
    const item = result as Item[];

    if (item.length === 0) {
        res.status(404).send("Item not found");
    } else {
        res.send(item[0]);
    }
});

itemsRoute.post("/", imagesUpload.single('image'), async (req, res) => {
    const {name, category_id, location_id, description} = req.body;
    if (!name || !category_id || !location_id) {
        res.status(400).send("Please send name and description");
        return;
    }
    const connection = await mysqlDb.getConnections();
    const [categoryResult] = await connection.query("SELECT * FROM categories WHERE id = ?", [category_id]);
    const searchedCategoryResult = categoryResult as Category[];
    if (searchedCategoryResult.length === 0) {
        res.status(400).send("Invalid Category id.");
        return;
    }

    const [locationResult] = await connection.query("SELECT * FROM locations WHERE id = ?", [location_id]);
    const searchedLocationResult = locationResult as Location[];
    if (searchedLocationResult.length === 0) {
        res.status(400).send("Invalid Location id.");
        return;
    }

    const item = {
        name: name,
        category_id: category_id,
        location_id: location_id,
        description: description,
        image: req.file ? `images/${req.file.filename}` : null
    }

    const [result] = await connection.query("INSERT INTO items (name, category_id, location_id, description, image) VALUES (?, ?, ?, ?, ?)",
        [item.name, item.category_id, item.location_id, item.description, item.image]);
    const resultHeader = result as ResultSetHeader;
    const [resultItem] =  await connection.query("SELECT * FROM items WHERE id = ?", [resultHeader.insertId]);
    const addedItem = resultItem as Item[];

    if (addedItem.length === 0) {
        res.status(404).send("Item not found");
    } else {
        res.send(addedItem[0]);
    }
});

itemsRoute.put("/:id", imagesUpload.single('image'), async (req, res) => {
    const id = req.params.id;
    const {name, category_id, location_id, description} = req.body;
    if (!name || !category_id || !location_id) {
        res.status(400).send("Please send name, category_id, location_id, and description.");
        return;
    }
    const connection = await mysqlDb.getConnections();
    const [categoryResult] = await connection.query("SELECT * FROM categories WHERE id = ?", [category_id]);
    const searchedCategoryResult = categoryResult as Category[];
    if (searchedCategoryResult.length === 0) {
        res.status(400).send("Invalid Category id.");
        return;
    }

    const [locationResult] = await connection.query("SELECT * FROM locations WHERE id = ?", [location_id]);
    const searchedLocationResult = locationResult as Location[];
    if (searchedLocationResult.length === 0) {
        res.status(400).send("Invalid Location id.");
        return;
    }

    const item = {
        name: name,
        category_id: category_id,
        location_id: location_id,
        description: description,
        image: req.file ? `images/${req.file.filename}` : null
    }

    const [updateResult] = await connection.query("UPDATE items WH SET name = ?, category_id = ?, location_id = ?, description = ?, image = ? WHERE id = ?",
        [item.name, item.category_id, item.location_id, item.description, item.image, id]);
    const resultHeader = updateResult as ResultSetHeader;

    if (resultHeader.affectedRows === 0) {
        res.status(404).send("Item not found.");
    } else {
        const [updatedItemResult] = await connection.query("SELECT * FROM items WHERE id = ?", [id]);
        const updatedItem = updatedItemResult as Item[];
        res.send(updatedItem[0]);
    }
});

export default itemsRoute;