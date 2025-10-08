// @ts-nocheck
import { SQLiteFS } from "@aphro/absurd-sql";
import IndexedDBBackend from "@aphro/absurd-sql/dist/indexeddb-backend";

const dbPromise = (async () => {
  const initSqlJs = await import("@aphro/sql.js").then(
    (importedModule) => importedModule.default,
  );
  const SQL = await initSqlJs({ locateFile: () => "/sql-wasm.wasm" });
  const sqlFS = new SQLiteFS(SQL.FS, new IndexedDBBackend());
  SQL.register_for_idb(sqlFS);

  SQL.FS.mkdir("/sql");
  SQL.FS.mount(sqlFS, {}, "/sql");

  const path = "/sql/db.sqlite";
  if (typeof SharedArrayBuffer === "undefined") {
    const stream = SQL.FS.open(path, "a+");
    await stream.node.contents.readIfFallback();
    SQL.FS.close(stream);
  }

  const db = new SQL.Database(path, { filename: true });
  db.exec(`
    PRAGMA page_size=8192;
    PRAGMA journal_mode=MEMORY;
  `);
  return db;
})();

self.onmessage = async ({ data }) => {
  const db = await dbPromise;
  self.postMessage(db[data.action](...data.args));
};
