import express from 'express';
import cors from 'cors';
import mysqlDb from "./mysqlDb";
import categoriesRoute from "./routes/categoriesRoute";
import locationsRoute from "./routes/locationsRoute";
import itemsRoute from "./routes/itemsRoute";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/categories', categoriesRoute);
app.use('/locations', locationsRoute);
app.use('/items', itemsRoute);

const run = async () => {
    await mysqlDb.init();
    app.listen(port, () => {
        console.log(`Server started on http://localhost:${port}`);
    });
};

run().catch((err) => {console.error(err)});
