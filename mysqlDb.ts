import mysql, {Connection} from 'mysql2/promise';
import config from "./config";

let connection: Connection;

const mysqlDb = {
    async init () {
        connection = await mysql.createConnection(config.dataBase);
    },
    getConnections () {
        return connection;
    }
};

export default mysqlDb;