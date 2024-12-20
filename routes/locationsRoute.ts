import express from "express";
import mysqlDb from "../mysqlDb";
import {ResultSetHeader} from "mysql2";
import {Item, Location} from "../types";

const locationsRoute = express.Router();

locationsRoute.get("/", async (_req, res) => {
    const connection = await mysqlDb.getConnections();
    const [result] = await connection.query("SELECT id, name FROM locations");
    const locations = result as Location[];
    res.send(locations);
});

locationsRoute.get("/:id", async (req, res) => {
    const id = req.params.id;
    const connection = await mysqlDb.getConnections();
    const [result] = await connection.query("SELECT * FROM locations WHERE id = ?", [id]);
    const locations = result as Location[];

    if (locations.length === 0) {
        res.status(404).send("Location not found");
    } else {
        res.send(locations[0]);
    }
});

locationsRoute.post("/", async (req, res) => {
    const { name, description } = req.body;
    if (!name) {
        res.status(400).send("Please send location title");
        return;
    }
    const connection = await mysqlDb.getConnections();
    const [result] = await connection.query("INSERT INTO locations (name, description) VALUES (?, ?)", [name, description]);
    const resultHeader = result as ResultSetHeader;
    const [resultLocation] =  await connection.query("SELECT * FROM locations WHERE id = ?", [resultHeader.insertId]);
    const addedLocation = resultLocation as Location[];

    if (addedLocation.length === 0) {
        res.status(404).send("Location not found");
    } else {
        res.send(addedLocation[0]);
    }
});

locationsRoute.put("/:id", async (req, res) => {
    const id = req.params.id;
    const { name, description } = req.body;

    if (!name) {
        res.status(400).send("Please send location title.");
        return;
    }

    const connection = await mysqlDb.getConnections();
    const [updateResult] = await connection.query("UPDATE locations SET name = ?, description = ? WHERE id = ?",
        [name, description, id]);
    const resultHeader = updateResult as ResultSetHeader;

    if (resultHeader.affectedRows === 0) {
        res.status(404).send("Location not found.");
    } else {
        const [updatedLocationResult] = await connection.query("SELECT * FROM locations WHERE id = ?", [id]);
        const updatedLocation = updatedLocationResult as Location[];
        res.send(updatedLocation[0]);
    }
});

locationsRoute.delete("/:id", async (req, res) => {
    const id = req.params.id;
    const connection = await mysqlDb.getConnections();
    const [itemsResult] = await connection.query("SELECT * FROM items WHERE location_id = ?", [id]);
    const items = itemsResult as Item[];

    if (items.length > 0) {
        res.status(400).send("Cannot delete location: it is associated with items.");
        return;
    }

    const [deleteResult] = await connection.query("DELETE FROM locations WHERE id = ?", [id]);
    const resultHeader = deleteResult as ResultSetHeader;

    if (resultHeader.affectedRows === 0) {
        res.status(404).send("Location not found.");
    } else {
        res.send("Location deleted successfully.");
    }
});

export default locationsRoute;