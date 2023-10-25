import { MAIN_THIBI_DB } from "../constants";
import { MessageType, SqliteClientFunction } from "../types/sqlite.promiser"


async function openDB(sqlite: SqliteClientFunction): Promise<void> {
    console.info("Opening main database");
    await sqlite(MessageType.Open, { filename: MAIN_THIBI_DB, vfs: 'opfs' })
        .then(() => {
            console.info("Database successfully opened and connected");
        })
}

async function initJobsTable(sqlite: SqliteClientFunction): Promise<void> {
    // @ts-ignore: sqlite client currently has no type
    await sqlite('exec', 'CREATE TABLE IF NOT EXISTS jobs (id INTEGER PRIMARY KEY, timestamp TEXT, file_name TEXT, table_identifier TEXT)');
    // @ts-ignore: sqlite client currently has no type
    await sqlite('exec', 'CREATE UNIQUE INDEX IF NOT EXISTS table_id_idx ON jobs(table_identifier)');
}

async function initDB(sqlite: SqliteClientFunction): Promise<void> {
    console.info("Initializing database using `opfs`");
    await openDB(sqlite);
    await initJobsTable(sqlite);
}

export default initDB;